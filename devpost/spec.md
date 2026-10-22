---
doc: spec
status: approved
---

# Messy Data Cleaner — Technical Spec

## How This Works, In Plain Language

The application is built in two cooperative halves: a **React frontend** that provides a friendly, single-page visual interface and a **Python FastAPI backend** that does the heavy spreadsheet lifting.

1. **The Browser (React)**: When you visit the app, you see a clean retro-mint tiled surface with a friendly cartoon cleaning mascot and a file dropzone. When you drop an Excel file, React immediately sends it to the Python server via an HTTP POST request.
2. **The Server (FastAPI + pandas/openpyxl)**: Python receives the file in memory, inspects the sheets, rows, columns, and missing values, and returns a quick diagnostic summary as JSON back to React.
3. **The Human Check (React)**: React displays these metrics and provides clickable toggles for cleaning actions (e.g., remove empty rows, trim whitespace, standardize headers) plus an optional text box for custom instructions.
4. **The Cleaning Engine (FastAPI + Gemini API)**: When you click "Clean Data", React shows an active mascot cleaning animation and sends your choices to the backend. FastAPI uses **pandas** to execute the chosen cleaning rules. If you entered a custom instruction (e.g., *"delete rows where status is draft"*), it uses the **Google Gemini API** (free tier) to translate your instruction into safe pandas operations.
5. **The Trust Hand-Off**: FastAPI generates a detailed "What Changed & What Didn't" audit log along with the tidied Excel file. React displays the audit log and gives you a one-click button to download your cleaned spreadsheet.

Nothing is stored in a permanent database; all transformations happen cleanly in memory during your active session.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

1. **Visit Page**: Browser loads the React application at `http://localhost:5173` (or live URL). React renders the initial layout: header with cartoon mascot, tagline, and dropzone.
2. **File Dropped**: User drops `my_data.xlsx`. React's `DropZone` component validates the extension (`.xlsx` or `.xls`).
   - If invalid format: React displays a polite notice (*"Please upload an Excel file, this format is not supported."*) without making a network call.
   - If valid: React sends `POST /api/scan` with `multipart/form-data`.
3. **Diagnostics Returned**: FastAPI reads the file using `pandas.ExcelFile` and `openpyxl`. It calculates row count, column count, and null counts, returning JSON `{ total_rows: 1420, total_columns: 14, missing_cells: 84, columns: [...] }`. React transitions to the **Inspection Stage**.
4. **Cleaning Choices Selected**: User toggles cleaning options and optionally enters custom instructions. User clicks "Clean Data".
5. **Cleaning Triggered**: React sets `isCleaning = true`, displaying the animated cartoon mascot processing state, and sends `POST /api/clean` with the original file, selected option flags, and custom instructions.
6. **Processing & Gemini Execution**:
   - FastAPI applies deterministic pandas cleaning for selected toggles.
   - If `custom_instruction` is present and `GEMINI_API_KEY` is configured, FastAPI queries Google Gemini (`gemini-1.5-flash` or `gemini-2.5-flash`) to generate safe pandas transformation code and explanatory audit text. If Gemini is unavailable or key is absent, it skips the custom step and notes this in the log.
   - FastAPI compiles the "What Changed" and "What Didn't Change" audit items.
7. **Results & Export**: FastAPI returns the audit JSON and the cleaned file (as a direct download attachment or base64 stream). React stops the mascot animation, presents the audit log cards, and enables the "Download Cleaned File" button.

## Stack

- **Frontend**: **React 18+** with **Vite**
  - *Rationale*: Learner already has experience with React and Node.js. Vite provides lightning-fast local development and instant hot module reloading.
  - *Doc link*: [Vite Documentation](https://vitejs.dev/) | [React Documentation](https://react.dev/)
- **Styling**: **Tailwind CSS** (or clean modular CSS)
  - *Rationale*: Rapidly builds the custom retro mint-tile background, pastel cleaning palette, and rounded cards defined in `prd.md > Look and Feel` without fighting third-party UI framework opinionated styles.
  - *Doc link*: [Tailwind CSS Documentation](https://tailwindcss.com/)
- **Backend API**: **Python 3.10+** with **FastAPI** & **Uvicorn**
  - *Rationale*: Leverages learner's Python experience. FastAPI provides automated API documentation (`/docs`), fast asynchronous handling, and native multipart file upload support.
  - *Doc link*: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **Data Manipulation**: **pandas** (>= 2.0) and **openpyxl** (>= 3.1)
  - *Rationale*: Industry-standard Python libraries for reading, cleaning, calculating metrics, and writing Excel files.
  - *Doc link*: [pandas Documentation](https://pandas.pydata.org/) | [openpyxl Documentation](https://openpyxl.readthedocs.io/)
- **AI Engine (Optional / Custom Instructions)**: **Google Gemini API** (`google-genai` or `google-generativeai` SDK)
  - *Rationale*: Free-tier access via Google AI Studio (`gemini-1.5-flash`). Translates free-text cleaning instructions into structured transformations and audit explanations.
  - *Doc link*: [Google AI Studio / Gemini API Docs](https://ai.google.dev/)
- **Hosting / Deployment Target**: **Render** (Free Web Service)
  - *Rationale*: Builds the React frontend and serves both API and static UI from a single unified service, completely eliminating CORS issues on production.
  - *Doc link*: [Render Documentation](https://render.com/docs)

## Where It Runs and How Someone Tries It

### Local Development Environment
- Requires: Python 3.10+, Node.js 18+ & npm.
- API Key (optional): `GEMINI_API_KEY` set in `.env` (fallback works gracefully if omitted).

### Exact Start Commands
1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in a browser.

### Hackathon Demo Recording
- To record the required submission demo: launch both local servers, open `http://localhost:5173`, upload a sample messy Excel file, inspect diagnostics, select cleaning options, watch the mascot processing state, review the audit log, and download the cleaned workbook.

### Optional Production Deployment (Render)
- A single `render.yaml` or Render Web Service configured to run:
  - Build Command: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
  - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
  - FastAPI serves static files from `../frontend/dist`.

## Look and Feel

Carried forward from `prd.md > Look and Feel` and learner visual references.

- **Background**: Soft retro tile grid pattern (`#eef3f0` background with `#d8e3dc` grid lines).
- **Cards & Surfaces**: Clean paper white (`#ffffff`) cards with soft rounded corners (`rounded-2xl`), subtle sage borders (`#d4e0d9`), and gentle elevation shadows.
- **Accent Palette**:
  - Fresh Spruce Green (`#2e7d58`) for primary buttons and success badges.
  - Spray Bottle Blue (`#3b82a6`) for diagnostic indicators and file badges.
  - Sponge Yellow (`#f59e0b`) for warnings and interactive toggles.
  - Caddy Coral / Rose (`#d9466f`) for error banners and accent tags.
- **Mascot Styling**: Illustrated friendly cartoon cleaning character displayed in the header and animated (gentle bobbing or pulse) during the processing state.
- **Typography**: Clean, friendly modern sans-serif (`Inter` or system fonts) with rounded weights for headers.

## Components

### Header Component (`Header.jsx`)
- Displays the app title, tagline, and cartoon mascot illustration.
- Implements `prd.md > Screens and Layout (Header)`.

### File Upload DropZone (`DropZone.jsx`)
- Handles drag-and-drop and standard file picker.
- Validates file extensions (`.xlsx`, `.xls`). Rejects unsupported formats with immediate friendly alert: *"Please upload an Excel file, this format is not supported."*
- Implements `prd.md > Features and Behavior (1. Excel File Ingestion & Validation)`.

### Diagnostics Panel (`DiagnosticsPanel.jsx`)
- Displays diagnostic cards: Total Rows, Total Columns, Missing Values Count/Percentage.
- Displays sheet name and identified column names.
- Implements `prd.md > Features and Behavior (2. Workbook Breakdown & Diagnostic Summary)`.

### Cleaning Controls & Prompt Box (`CleaningControls.jsx`)
- Checkbox toggles for standard cleaning actions:
  - Remove empty rows & empty columns.
  - Trim trailing & leading whitespace in text cells.
  - Standardize column headers (snake_case, lower-case, remove special characters).
  - Fill or highlight missing values.
- Text input area for optional plain-English instructions.
- "Clean Data" primary action button.
- Implements `prd.md > Features and Behavior (3. Interactive Cleaning Prompts & Custom Instructions)`.

### Mascot Processing Indicator (`MascotLoader.jsx`)
- Displayed when `isCleaning === true`.
- Renders the cartoon mascot at work with friendly copy: *"Tidying up your rows and sweeping nulls..."*.
- Implements `prd.md > Features and Behavior (4. Mascot Processing State)`.

### Audit Log & Results View (`AuditLogResults.jsx`)
- Shows before-and-after dataset dimensions.
- Renders two distinct lists: **What Changed** vs **What Didn't Change**.
- "Download Cleaned File" button triggering the browser download.
- "Clean Another File" button to reset state.
- Implements `prd.md > Features and Behavior (5. "What Changed & What Didn't" Audit Log & Overview, 6. Clean File Export)`.

### Backend: API Router (`main.py`)
- Sets up FastAPI app, CORS middleware (for local Vite dev), and endpoint routes.
- Serves static assets if deployed in production.

### Backend: Spreadsheet Cleaning Engine (`cleaner.py`)
- Reads raw bytes into a pandas DataFrame using `openpyxl`.
- Applies selected deterministic cleaning functions.
- If custom prompt provided, calls `gemini_helper.py` to interpret prompt and apply modifications.
- Records every action into `what_changed` and `what_didnt_change` arrays.
- Exports cleaned DataFrame back to an Excel buffer (`BytesIO`).

### Backend: Gemini AI Helper (`gemini_helper.py`)
- Calls Google Gemini API (`gemini-1.5-flash`) using a strict system prompt.
- Translates user text instruction into safe, sandboxed pandas transformations or filter criteria.
- Returns plain-English explanations of what was done for inclusion in the audit log.
- Gracefully handles missing API keys and errors.

## Data Model

### State Shape (Frontend `App.jsx`)
All state lives in the browser during the session:
- `file`: Current `File` object (or `null`).
- `stage`: Current screen stage (`"upload"` | `"diagnostics"` | `"cleaning"` | `"results"` | `"error"`).
- `diagnostics`: `{ total_rows: number, total_columns: number, missing_cells: number, columns: string[] }`.
- `cleaningOptions`: `{ remove_empty_rows: boolean, trim_whitespace: boolean, standardize_headers: boolean, handle_missing: boolean }`.
- `customInstruction`: string.
- `results`: `{ what_changed: string[], what_didnt_change: string[], new_rows: number, new_columns: number, download_url: string }`.
- `errorMessage`: string (or `null`).

### Backend Request & Response Contracts

#### 1. Scan Endpoint
- **URL**: `POST /api/scan`
- **Request**: `multipart/form-data` with `file: UploadFile`
- **Response**:
  ```json
  {
    "status": "success",
    "filename": "sales_q3.xlsx",
    "total_rows": 1250,
    "total_columns": 12,
    "missing_cells": 46,
    "missing_percentage": 0.31,
    "columns": ["Customer ID", "Order Date", "Amount ", " Status"]
  }
  ```

#### 2. Clean Endpoint
- **URL**: `POST /api/clean`
- **Request**: `multipart/form-data` containing:
  - `file`: Original Excel file
  - `options`: JSON string of selected boolean flags
  - `custom_instruction`: Optional string
- **Response**:
  ```json
  {
    "status": "success",
    "filename": "cleaned_sales_q3.xlsx",
    "original_rows": 1250,
    "original_columns": 12,
    "new_rows": 1238,
    "new_columns": 12,
    "what_changed": [
      "Removed 12 completely empty rows",
      "Trimmed trailing whitespace in 140 text cells across columns: Amount, Status",
      "Standardized 4 column headers to clean format"
    ],
    "what_didnt_change": [
      "Preserved 34 rows with partial missing values in 'Customer ID'",
      "Left numeric formats and dates untouched"
    ],
    "file_base64": "<base64_encoded_excel_bytes>"
  }
  ```

## File Structure

```
DEV-Project/
├── backend/
│   ├── main.py              # FastAPI app, CORS, and endpoint definitions
│   ├── cleaner.py           # Core pandas Excel parsing & cleaning pipeline
│   ├── gemini_helper.py     # Gemini API integration for custom prompts
│   ├── requirements.txt     # fastapi, uvicorn, pandas, openpyxl, google-genai, python-multipart
│   └── .env.example         # Template for optional GEMINI_API_KEY
├── frontend/
│   ├── index.html           # HTML entry point with tile background styles
│   ├── package.json         # React 18, Vite, Tailwind CSS, Lucide icons
│   ├── vite.config.js       # Vite configuration with API proxy to port 8000
│   ├── tailwind.config.js   # Custom retro-tile colors & font setup
│   └── src/
│       ├── main.jsx         # React root mount
│       ├── App.jsx          # Main page coordinator & stage state
│       ├── components/
│       │   ├── Header.jsx           # Welcome title, mascot icon, tagline
│       │   ├── DropZone.jsx         # Drag-and-drop file uploader & validator
│       │   ├── DiagnosticsPanel.jsx # Row, column, null-value cards
│       │   ├── CleaningControls.jsx # Checkbox options & custom instruction input
│       │   ├── MascotLoader.jsx     # Active mascot cleaning animation
│       │   ├── AuditLogResults.jsx  # What Changed / Didn't Change & download
│       │   └── ErrorAlert.jsx       # Polite error notification banner
│       └── assets/
│           └── mascot.svg   # Cheerful cleaning mascot illustration
├── devpost/                 # Hackathon planning workspace
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   └── spec.html
└── README.md                # Quickstart and demo run instructions
```

## External Services and Dependencies

1. **Google Gemini API**:
   - *Role*: Interprets optional custom instructions into pandas cleaning actions.
   - *Model*: `gemini-1.5-flash` (or `gemini-2.5-flash`).
   - *Authentication*: Via `GEMINI_API_KEY` environment variable.
   - *Cost*: Free tier ($0) via Google AI Studio.
   - *Doc link*: https://ai.google.dev/docs
2. **PyPI Packages**:
   - `fastapi` & `uvicorn` (ASGI web server)
   - `pandas` & `openpyxl` (Excel processing)
   - `python-multipart` (streaming file upload parsing)
   - `google-genai` (official Google Gemini SDK)

## Important Failure Modes

- **Unsupported File Format (e.g. PDF, Image)**:
  - *Trigger*: User drops non-Excel file into dropzone.
  - *Fallback*: Handled client-side before network request. DropZone displays: *"Please upload an Excel file (.xlsx or .xls), this format is not supported."*
- **Completely Empty Excel Workbook**:
  - *Trigger*: Uploaded file has 0 data rows or 0 columns.
  - *Fallback*: FastAPI detects `df.empty` and returns `{ status: "empty", message: "This workbook appears to be empty." }`. React shows polite notice inviting another file.
- **Missing or Rate-Limited Gemini API Key**:
  - *Trigger*: No `GEMINI_API_KEY` provided, or API quota reached.
  - *Fallback*: Backend falls back 100% to deterministic pandas cleaning, adding a note in the audit log: *"Custom instruction skipped (Gemini API unavailable); standard cleaning applied successfully."* The application never crashes.

## What Was Simplified and Why

- **In-Memory File Processing instead of Cloud Storage / Database**:
  - *Why*: Files are processed in RAM during the request and returned immediately. Eliminates AWS S3 buckets, local file cleanup cron jobs, and database setup, keeping the PoC completely self-contained.
- **Single-Page Progressive State instead of Multi-Route Router**:
  - *Why*: Using React `stage` state (`upload` -> `diagnostics` -> `cleaning` -> `results`) in `App.jsx` instead of `react-router-dom` avoids routing overhead and guarantees a seamless 1-minute demo flow.
- **Render Combined Service instead of Split Hosting**:
  - *Why*: Building the React app into `dist` and serving it from FastAPI eliminates CORS issues in production and fits comfortably onto Render's free tier.

## Decisions and Open Issues

### Learner Decisions
- **Stack**: Chosen React (Vite) + FastAPI (Python), utilizing learner's prior React and Python web experience.
- **Deployment**: Aiming for live URL deployment on Render in addition to local demo recording.
- **Custom Prompts**: Powered by Google Gemini API free tier for custom plain-text instructions, with automatic rule-based fallback.

### Useful Unknown Clarified
- **Python + React Integration**: Clarified that Python (FastAPI) and React communicate via standard HTTP requests (`fetch` sending `multipart/form-data` and receiving JSON). They act as client and server rather than needing embedded language runtimes.

### Open Issues
- None blocking build. Minor CSS animation details for the mascot can be tuned directly during `5-build`.
