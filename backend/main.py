import os
import json
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from cleaner import scan_excel, clean_excel
from gemini_helper import process_custom_instruction

load_dotenv()

app = FastAPI(title="Messy Data Cleaner API", version="1.0.0")

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": "Messy Data Cleaner API"}

@app.post("/api/scan")
async def scan_file(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not (filename.endswith(".xlsx") or filename.endswith(".xls")):
        raise HTTPException(
            status_code=400,
            detail="Please upload an Excel file (.xlsx or .xls), this format is not supported."
        )

    try:
        content = await file.read()
        if len(content) == 0:
            return {
                "status": "empty",
                "filename": filename,
                "message": "The uploaded workbook appears to be empty."
            }

        diagnostics = scan_excel(content)
        diagnostics["filename"] = filename
        return diagnostics
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to scan Excel file: {str(e)}")

@app.post("/api/clean")
async def clean_file(
    file: UploadFile = File(...),
    options: str = Form("{}"),
    custom_instruction: str = Form("")
):
    filename = file.filename or ""
    if not (filename.endswith(".xlsx") or filename.endswith(".xls")):
        raise HTTPException(
            status_code=400,
            detail="Please upload an Excel file (.xlsx or .xls), this format is not supported."
        )

    try:
        content = await file.read()
        options_dict = json.loads(options) if options else {}
        
        # Clean using pandas engine
        result = clean_excel(content, options_dict, custom_instruction)
        
        # If custom instruction provided, run smart AI summary
        if custom_instruction.strip():
            ai_res = process_custom_instruction(
                instruction=custom_instruction.strip(),
                columns=[],
                sample_data=[]
            )
            if ai_res:
                result["what_changed"].append(f"AI Applied custom instruction: {ai_res['action']}")
                result["what_didnt_change"].append(f"Safety check: {ai_res['preserved']}")

        result["filename"] = f"cleaned_{filename}"
        return result
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to clean Excel file: {str(e)}")

# Production static file serving if frontend/dist exists
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if frontend_dist.is_dir():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
