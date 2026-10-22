import io
import base64
import pandas as pd
from fastapi.testclient import TestClient
from main import app
from cleaner import scan_excel, clean_excel

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_scan_valid_excel():
    with open("test_data/sample_messy.xlsx", "rb") as f:
        file_bytes = f.read()
    data = scan_excel(file_bytes)
    assert data["status"] == "success"
    assert data["total_rows"] == 5
    assert data["total_columns"] == 5
    assert data["missing_cells"] == 11
    assert len(data["columns"]) == 5

    response = client.post(
        "/api/scan",
        files={"file": ("sample_messy.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert json_data["total_rows"] == 5
    assert json_data["filename"] == "sample_messy.xlsx"

def test_scan_invalid_file_format():
    response = client.post(
        "/api/scan",
        files={"file": ("notes.txt", b"some text content", "text/plain")}
    )
    assert response.status_code == 400
    assert "Please upload an Excel file" in response.json()["detail"]

def test_scan_empty_file():
    response = client.post(
        "/api/scan",
        files={"file": ("empty.xlsx", b"", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "empty"

def test_clean_enriched_audit_log_and_summary():
    with open("test_data/sample_messy.xlsx", "rb") as f:
        file_bytes = f.read()

    response = client.post(
        "/api/clean",
        data={"options": '{"remove_empty_rows": true, "remove_empty_cols": true, "trim_whitespace": true, "standardize_headers": true, "fill_missing_numbers": false}'},
        files={"file": ("sample_messy.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

    # Before/after summary fields
    assert "duplicate_rows_removed" in data
    assert "empty_rows_removed" in data
    assert "empty_cols_removed" in data
    assert "missing_cells_before" in data
    assert "missing_cells_after" in data

    # Empty column (EMPTY_COL) should have been removed
    assert data["new_cols"] == 4
    assert data["empty_cols_removed"] == 1

    # Enriched what_changed: each item must be a dict with rule, summary, cells_changed, examples
    assert len(data["what_changed"]) > 0
    for entry in data["what_changed"]:
        assert isinstance(entry, dict)
        assert "rule" in entry
        assert "summary" in entry
        assert "cells_changed" in entry
        assert "examples" in entry

    # Check that whitespace trim rule is present and has examples
    trim_rules = [e for e in data["what_changed"] if "whitespace" in e["rule"].lower() or "trim" in e["rule"].lower()]
    assert len(trim_rules) > 0
    assert trim_rules[0]["cells_changed"] > 0

    # Verify downloaded file is valid Excel
    raw_excel = base64.b64decode(data["file_base64"])
    cleaned_df = pd.read_excel(io.BytesIO(raw_excel))
    assert len(cleaned_df.columns) == 4
    first_name = cleaned_df["customer_name"].iloc[0]
    assert first_name == "Alice Johnson"

if __name__ == "__main__":
    test_health()
    test_scan_valid_excel()
    test_scan_invalid_file_format()
    test_scan_empty_file()
    test_clean_enriched_audit_log_and_summary()
    print("All tests passed — enriched audit log + before/after summary verified!")
