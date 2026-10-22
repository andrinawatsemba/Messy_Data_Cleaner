---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. File Ingestion, Scan Engine & Live Diagnostics Panel**
  Becomes usable: A running web app where you can drop an Excel file onto the retro mint-tile surface and immediately see live diagnostic cards (total rows, columns, and missing cell counts) computed by the Python backend. Dropping an invalid file triggers a friendly inline alert.
  Why now: Bootstraps the full stack end to end (React + Vite + Tailwind on the frontend, FastAPI + pandas + openpyxl on the backend), verifies client-server communication via `/api/scan`, and establishes the visual layout.
  PRD ref: `prd.md > Features and Behavior (1. Excel File Ingestion & Validation, 2. Workbook Breakdown & Diagnostic Summary)`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components (Header, DropZone, DiagnosticsPanel, API Router, Spreadsheet Cleaning Engine)`, `spec.md > Stack`, `spec.md > Look and Feel`
  Build: Scaffold `backend/` (FastAPI app, CORS middleware, pandas/openpyxl scan endpoint) and `frontend/` (Vite React app, Tailwind mint-tile background, Header with mascot, DropZone with file validation, DiagnosticsPanel cards). Wire the `POST /api/scan` call.
  Verify (mechanical): Run backend tests and curl `POST /api/scan` with a valid `.xlsx` file to confirm 200 OK with correct row/column/null stats. Send invalid file and confirm validation catches it. Run `npm run build` in frontend to confirm clean compilation.
  Learner check: Open `http://localhost:5173` in your browser, drop a sample Excel file into the dropzone, and confirm the diagnostic cards populate with row, column, and missing values counts.
  Commit: `Add file upload, scanning engine, and live diagnostics panel`

- [x] **2. Interactive Cleaning Prompts & Mascot Processing State**
  Becomes usable: After diagnostics appear, the user can toggle structured cleaning actions (removing empty rows, trimming whitespace, standardizing headers) and type optional notes into a custom instruction prompt. Clicking "Clean Data" triggers the animated cartoon mascot processing state.
  Why now: Puts the user in the evaluator seat with concrete cleaning decisions and gives immediate reassuring feedback during processing before running transformations.
  PRD ref: `prd.md > Features and Behavior (3. Interactive Cleaning Prompts & Custom Instructions, 4. Mascot Processing State)`
  Spec ref: `spec.md > Components (CleaningControls, MascotLoader)`, `spec.md > Look and Feel`
  Build: Create `CleaningControls.jsx` (checkbox options with non-destructive defaults + custom instruction input) and `MascotLoader.jsx` (cleaning mascot graphic with animated pulse and progress copy). Wire state transitions in `App.jsx`.
  Verify (mechanical): Test that clicking toggles updates React state, prompt text is captured, and clicking "Clean Data" displays the mascot loader while disabling duplicate submissions.
  Learner check: Select different cleaning options, type a custom instruction, click "Clean Data", and verify the cartoon mascot appears with the cleaning status message.
  Commit: `Add interactive cleaning controls and mascot processing state`

- [ ] **3. Core Cleaning Engine & "What Changed / What Didn't" Audit Log**
  Becomes usable: Clicking "Clean Data" runs the backend cleaning pipeline using pandas (and Google Gemini API for custom prompts), and displays the split "What Changed" and "What Didn't Change" audit log cards alongside post-cleaning dimensions.
  Why now: Implements the project's unique kernel—building trust by showing an explicit, itemized accounting of every modification made and every potential issue intentionally preserved.
  PRD ref: `prd.md > Features and Behavior (5. "What Changed & What Didn't" Audit Log & Overview)`, `prd.md > The Unique Kernel`
  Spec ref: `spec.md > Components (cleaner.py, gemini_helper.py, AuditLogResults)`, `spec.md > Data Model (Clean Endpoint)`
  Build: Implement `POST /api/clean` in `backend/cleaner.py` (executing blank row removal, whitespace stripping, header standardizing, and tracking changes). Implement `gemini_helper.py` for Gemini prompt interpretation with graceful fallback. Build `AuditLogResults.jsx` to render the audit lists.
  Verify (mechanical): Send a messy spreadsheet to `POST /api/clean`; verify response contains `what_changed` array with specific actions and `what_didnt_change` array preserving data integrity.
  Learner check: Run cleaning on a messy file and review the audit log cards to verify that every change and preserved field is clearly reported.
  Commit: `Implement core cleaning engine and trust audit log`

- [ ] **4. Clean Spreadsheet Export & Complete Journey Loop**
  Becomes usable: A prominent "Download Cleaned File" button delivers the tidied Excel workbook directly to the user's browser, and a "Clean Another File" button resets the app for the next file.
  Why now: Completes the full end-to-end journey from arrival to verified clean download, ready for the demo video and Render deployment.
  PRD ref: `prd.md > Features and Behavior (6. Clean File Export)`, `prd.md > States and Boundaries (Completed State)`
  Spec ref: `spec.md > Components (AuditLogResults download handler)`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Wire binary Excel export in `backend/cleaner.py`, connect file download trigger in `AuditLogResults.jsx`, implement state reset handler, and verify production build.
  Verify (mechanical): Trigger download; inspect downloaded `.xlsx` using openpyxl to confirm valid format, clean headers, and data integrity. Verify reset returns to upload stage.
  Learner check: Click "Download Cleaned File", open the file in Excel to verify it's clean and uncorrupted, and click "Clean Another File" to confirm the app resets smoothly.
  Commit: `Add clean spreadsheet export and complete core journey loop`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 (File scan, diagnostics & interactive controls ready)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 4 (Full loop from upload to audit log and download)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions

- Enhanced visual warmth, mascot character sizing, and added a minimum 1.8s duration to the cleaning mascot animation — learner feedback noted layout felt too minimalist/monochrome, mascot was small, and cleaning animation finished too quickly to see.
