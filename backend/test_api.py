import io
from fastapi.testclient import TestClient
from main import app
from cleaner import scan_excel

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_scan_valid_excel():
    with open("test_data/sample_messy.xlsx", "rb") as f:
        file_bytes = f.read()

    data = scan_excel(file_bytes)
    print("DEBUG DATA:", data)
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

if __name__ == "__main__":
    test_health()
    test_scan_valid_excel()
    test_scan_invalid_file_format()
    test_scan_empty_file()
    print("All Slice 1 mechanical verification tests passed successfully!")
