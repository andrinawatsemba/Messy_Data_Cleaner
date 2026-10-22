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

    # Test via API endpoint
    response = client.post(
        "/api/scan",
        files={"file": ("sample_messy.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert json_data["total_rows"] == 5
    assert json_data["total_columns"] == 5
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

def test_clean_endpoint_and_audit_log():
    with open("test_data/sample_messy.xlsx", "rb") as f:
        file_bytes = f.read()

    options = {
        "remove_empty_rows": True,
        "remove_empty_cols": True,
        "trim_whitespace": True,
        "standardize_headers": True,
        "fill_missing_numbers": False
    }

    response = client.post(
        "/api/clean",
        data={"options": '{"remove_empty_rows": true, "remove_empty_cols": true, "trim_whitespace": true, "standardize_headers": true, "fill_missing_numbers": false}'},
        files={"file": ("sample_messy.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["original_rows"] == 5
    assert data["original_cols"] == 5
    # The completely empty column should be removed
    assert data["new_cols"] == 4
    # Check that audit logs were populated
    assert len(data["what_changed"]) > 0
    assert len(data["what_didnt_change"]) > 0
    assert any("empty column" in item.lower() for item in data["what_changed"])
    assert any("whitespace" in item.lower() for item in data["what_changed"])
    assert any("column header" in item.lower() for item in data["what_changed"])
    assert any("preserved" in item.lower() for item in data["what_didnt_change"])

    # Verify that the generated base64 Excel file is valid and readable
    raw_excel = base64.b64decode(data["file_base64"])
    cleaned_df = pd.read_excel(io.BytesIO(raw_excel))
    assert len(cleaned_df.columns) == 4
    # Check that whitespace was trimmed in Customer Name
    first_name = cleaned_df["customer_name"].iloc[0]
    assert first_name == "Alice Johnson"  # No leading or trailing spaces

if __name__ == "__main__":
    test_health()
    test_scan_valid_excel()
    test_scan_invalid_file_format()
    test_scan_empty_file()
    test_clean_endpoint_and_audit_log()
    print("All backend tests (scan + clean + audit log + export) passed successfully!")
