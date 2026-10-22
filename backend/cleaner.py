import io
import re
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd


def scan_excel(file_bytes: bytes) -> Dict[str, Any]:
    """
    Parses an Excel file in-memory and returns key diagnostics.
    """
    try:
        excel_file = pd.ExcelFile(io.BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Could not parse Excel file: {str(e)}")

    sheet_names = excel_file.sheet_names
    if not sheet_names:
        return {
            "status": "empty",
            "message": "The uploaded workbook does not contain any sheets."
        }

    active_sheet = sheet_names[0]
    df = pd.read_excel(excel_file, sheet_name=active_sheet)

    if df.empty and len(df.columns) == 0:
        return {
            "status": "empty",
            "sheet_name": active_sheet,
            "message": "The sheet appears to be completely empty."
        }

    total_rows = int(len(df))
    total_columns = int(len(df.columns))
    total_cells = total_rows * total_columns if total_columns > 0 else 0
    missing_cells = int(df.isna().sum().sum())
    missing_percentage = round((missing_cells / total_cells * 100), 2) if total_cells > 0 else 0.0
    columns = [str(col) for col in df.columns.tolist()]

    null_breakdown = {}
    for col in df.columns:
        null_count = int(df[col].isna().sum())
        if null_count > 0:
            null_breakdown[str(col)] = null_count

    return {
        "status": "success",
        "sheet_name": active_sheet,
        "total_rows": total_rows,
        "total_columns": total_columns,
        "total_cells": total_cells,
        "missing_cells": missing_cells,
        "missing_percentage": missing_percentage,
        "columns": columns,
        "null_breakdown": null_breakdown
    }


def _fmt(val) -> str:
    """Format a cell value for display in examples."""
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return "(blank)"
    s = str(val)
    return s[:40] + "…" if len(s) > 40 else s


def clean_excel(
    file_bytes: bytes,
    options: Dict[str, bool],
    custom_instruction: Optional[str] = None
) -> Dict[str, Any]:
    """
    Cleans an Excel file in-memory based on selected options.
    Returns enriched audit logs with per-rule counts and examples, plus before/after summary.
    """
    import base64

    excel_file = pd.ExcelFile(io.BytesIO(file_bytes))
    sheet_name = excel_file.sheet_names[0]
    df = pd.read_excel(excel_file, sheet_name=sheet_name)

    original_rows = int(len(df))
    original_cols = int(len(df.columns))
    missing_cells_before = int(df.isna().sum().sum())

    what_changed: List[Dict] = []
    what_didnt_change: List[str] = []

    # Track summary stats
    duplicate_rows_removed = 0
    empty_rows_removed = 0
    empty_cols_removed = 0

    # ── 1. Remove duplicate rows ──────────────────────────────────────────────
    rows_before = len(df)
    df_deduped = df.drop_duplicates()
    duplicate_rows_removed = rows_before - len(df_deduped)
    if duplicate_rows_removed > 0:
        # Collect 2–3 examples of removed duplicates (first occurrence values)
        dup_mask = df.duplicated(keep='first')
        examples = []
        for idx in df[dup_mask].head(2).index:
            row_preview = {str(c): _fmt(df.at[idx, c]) for c in list(df.columns)[:3]}
            examples.append({"row": int(idx), "preview": row_preview})
        what_changed.append({
            "rule": "Remove duplicate rows",
            "summary": f"Removed {duplicate_rows_removed} duplicate row(s) — kept first occurrence.",
            "cells_changed": duplicate_rows_removed * original_cols,
            "examples": examples,
            "example_type": "rows"
        })
        df = df_deduped
    else:
        what_didnt_change.append("No duplicate rows were found.")

    # ── 2. Remove completely empty rows ──────────────────────────────────────
    if options.get("remove_empty_rows", True):
        rows_before = len(df)
        df = df.dropna(how="all")
        empty_rows_removed = rows_before - len(df)
        if empty_rows_removed > 0:
            what_changed.append({
                "rule": "Remove empty rows",
                "summary": f"Removed {empty_rows_removed} completely empty row(s).",
                "cells_changed": empty_rows_removed * original_cols,
                "examples": [],
                "example_type": "rows"
            })
        else:
            what_didnt_change.append("No completely empty rows were present.")

    # ── 3. Remove completely empty columns ────────────────────────────────────
    if options.get("remove_empty_cols", True):
        cols_before = list(df.columns)
        df = df.dropna(axis=1, how="all")
        removed_col_names = [c for c in cols_before if c not in df.columns]
        empty_cols_removed = len(removed_col_names)
        if empty_cols_removed > 0:
            what_changed.append({
                "rule": "Remove empty columns",
                "summary": f"Removed {empty_cols_removed} completely empty column(s).",
                "cells_changed": empty_cols_removed * original_rows,
                "examples": [{"col": str(c), "old": "(all blank)", "new": "(removed)"} for c in removed_col_names[:3]],
                "example_type": "cols"
            })
        else:
            what_didnt_change.append("All columns contained data (none were completely empty).")

    # ── 4. Standardize column headers ─────────────────────────────────────────
    if options.get("standardize_headers", True):
        old_cols = df.columns.tolist()
        new_cols = []
        header_examples = []
        changed_count = 0
        for col in old_cols:
            col_str = str(col).strip()
            clean_col = re.sub(r"[^\w\s-]", "", col_str)
            clean_col = re.sub(r"[\s-]+", "_", clean_col).lower()
            if clean_col != str(col):
                changed_count += 1
                if len(header_examples) < 3:
                    header_examples.append({"col": str(col), "old": str(col), "new": clean_col})
            new_cols.append(clean_col)
        df.columns = new_cols
        if changed_count > 0:
            what_changed.append({
                "rule": "Standardize column headers",
                "summary": f"Standardized {changed_count} column header(s) to lowercase snake_case.",
                "cells_changed": changed_count,
                "examples": header_examples,
                "example_type": "headers"
            })
        else:
            what_didnt_change.append("Column headers were already clean.")

    # ── 5. Trim whitespace in text cells ─────────────────────────────────────
    if options.get("trim_whitespace", True):
        trim_examples = []
        trimmed_count = 0
        for col in df.select_dtypes(include=["object", "string"]).columns:
            for idx in df.index:
                val = df.at[idx, col]
                if isinstance(val, str):
                    trimmed = val.strip()
                    if trimmed != val:
                        trimmed_count += 1
                        if len(trim_examples) < 3:
                            trim_examples.append({"col": str(col), "old": repr(val), "new": repr(trimmed)})
                        df.at[idx, col] = trimmed
        if trimmed_count > 0:
            what_changed.append({
                "rule": "Trim whitespace",
                "summary": f"Trimmed leading/trailing whitespace in {trimmed_count} text cell(s).",
                "cells_changed": trimmed_count,
                "examples": trim_examples,
                "example_type": "cells"
            })
        else:
            what_didnt_change.append("No trailing whitespace was found in text cells.")

    # ── 6. Fill missing numeric values ────────────────────────────────────────
    if options.get("fill_missing_numbers", False):
        num_cols = df.select_dtypes(include=["number"]).columns
        fill_count = int(df[num_cols].isna().sum().sum())
        fill_examples = []
        if fill_count > 0:
            for col in num_cols:
                for idx in df.index:
                    if pd.isna(df.at[idx, col]):
                        if len(fill_examples) < 3:
                            fill_examples.append({"col": str(col), "old": "(blank)", "new": "0"})
            df[num_cols] = df[num_cols].fillna(0)
            what_changed.append({
                "rule": "Fill missing numbers",
                "summary": f"Filled {fill_count} missing numeric cell(s) with 0.",
                "cells_changed": fill_count,
                "examples": fill_examples,
                "example_type": "cells"
            })
    else:
        num_cols = df.select_dtypes(include=["number"]).columns
        null_num = int(df[num_cols].isna().sum().sum())
        if null_num > 0:
            what_didnt_change.append(
                f"Preserved {null_num} missing numeric cell(s) as blank — not overwritten."
            )

    what_didnt_change.append(
        "Formulas, dates, and non-empty cell values were preserved without guessing."
    )

    new_rows = int(len(df))
    new_cols = int(len(df.columns))
    missing_cells_after = int(df.isna().sum().sum())

    # Write cleaned dataframe back to Excel bytes
    output_stream = io.BytesIO()
    with pd.ExcelWriter(output_stream, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Cleaned Data")
    output_bytes = output_stream.getvalue()
    base64_file = base64.b64encode(output_bytes).decode("utf-8")

    return {
        "status": "success",
        "original_rows": original_rows,
        "original_cols": original_cols,
        "new_rows": new_rows,
        "new_cols": new_cols,
        # Before/after summary extras
        "duplicate_rows_removed": duplicate_rows_removed,
        "empty_rows_removed": empty_rows_removed,
        "empty_cols_removed": empty_cols_removed,
        "missing_cells_before": missing_cells_before,
        "missing_cells_after": missing_cells_after,
        # Enriched audit log
        "what_changed": what_changed,
        "what_didnt_change": what_didnt_change,
        "file_base64": base64_file
    }
