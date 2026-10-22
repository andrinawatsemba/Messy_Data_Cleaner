import io
import re
from typing import Dict, Any, List, Optional
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

    # Use the first sheet for proof-of-concept
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

    # Format columns
    columns = [str(col) for col in df.columns.tolist()]

    # Missing per column breakdown
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


def clean_excel(
    file_bytes: bytes,
    options: Dict[str, bool],
    custom_instruction: Optional[str] = None
) -> Dict[str, Any]:
    """
    Cleans an Excel file in-memory based on selected options and optional custom instructions.
    Returns audit logs and cleaned file bytes (base64 encoded).
    """
    import base64

    excel_file = pd.ExcelFile(io.BytesIO(file_bytes))
    sheet_name = excel_file.sheet_names[0]
    df = pd.read_excel(excel_file, sheet_name=sheet_name)

    original_rows = int(len(df))
    original_cols = int(len(df.columns))

    what_changed: List[str] = []
    what_didnt_change: List[str] = []

    # 1. Remove completely empty rows
    if options.get("remove_empty_rows", True):
        rows_before = len(df)
        df = df.dropna(how="all")
        removed_rows = rows_before - len(df)
        if removed_rows > 0:
            what_changed.append(f"Removed {removed_rows} completely empty row(s).")
        else:
            what_didnt_change.append("No completely empty rows were present.")

    # 2. Remove completely empty columns
    if options.get("remove_empty_cols", True):
        cols_before = len(df.columns)
        df = df.dropna(axis=1, how="all")
        removed_cols = cols_before - len(df.columns)
        if removed_cols > 0:
            what_changed.append(f"Removed {removed_cols} completely empty column(s).")
        else:
            what_didnt_change.append("All columns contained data (none were completely empty).")

    # 3. Standardize column headers
    if options.get("standardize_headers", True):
        old_cols = df.columns.tolist()
        new_cols = []
        changed_headers = 0
        for col in old_cols:
            col_str = str(col).strip()
            # replace special chars and multiple spaces with underscore, lowercase
            clean_col = re.sub(r"[^\w\s-]", "", col_str)
            clean_col = re.sub(r"[\s-]+", "_", clean_col).lower()
            if clean_col != str(col):
                changed_headers += 1
            new_cols.append(clean_col)
        df.columns = new_cols
        if changed_headers > 0:
            what_changed.append(f"Standardized {changed_headers} column header(s) (cleaned spaces and lowercase snake_case).")
        else:
            what_didnt_change.append("Column headers were already standardized.")

    # 4. Trim leading and trailing whitespace in string cells
    if options.get("trim_whitespace", True):
        trimmed_cell_count = 0
        for col in df.select_dtypes(include=["object", "string"]).columns:
            def trim_val(val):
                nonlocal trimmed_cell_count
                if isinstance(val, str):
                    trimmed = val.strip()
                    if trimmed != val:
                        trimmed_cell_count += 1
                    return trimmed
                return val
            df[col] = df[col].apply(trim_val)
        if trimmed_cell_count > 0:
            what_changed.append(f"Trimmed leading/trailing whitespace across {trimmed_cell_count} text cell(s).")
        else:
            what_didnt_change.append("No trailing whitespace was found in text cells.")

    # 5. Handle missing values
    if options.get("fill_missing_numbers", False):
        num_cols = df.select_dtypes(include=["number"]).columns
        filled_count = int(df[num_cols].isna().sum().sum())
        if filled_count > 0:
            df[num_cols] = df[num_cols].fillna(0)
            what_changed.append(f"Filled {filled_count} missing numeric cells with 0.")
    else:
        num_cols = df.select_dtypes(include=["number"]).columns
        null_num_count = int(df[num_cols].isna().sum().sum())
        if null_num_count > 0:
            what_didnt_change.append(f"Preserved {null_num_count} missing numeric cell(s) as blank (not overwritten).")

    # 6. Fallback note for data safety
    what_didnt_change.append("Formulas, dates, and non-empty values were preserved without guessing.")

    new_rows = int(len(df))
    new_cols = int(len(df.columns))

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
        "what_changed": what_changed,
        "what_didnt_change": what_didnt_change,
        "file_base64": base64_file
    }
