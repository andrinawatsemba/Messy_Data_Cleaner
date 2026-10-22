---
doc: prd
status: approved
---

# Messy Data Cleaner — Product Requirements

A friendly web app that scans messy Excel files, asks before making changes, and hands back a tidier spreadsheet with an itemized change log so data workers can evaluate without fear or wasted hours.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`

## The Core Journey

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`

1. **Arrival & Welcome**: The user visits the app and sees a welcoming title ("Welcome to Messy Data Cleaner"), a reassuring tagline, the friendly cartoon cleaning mascot, and an obvious drag-and-drop file upload target.
2. **File Drop & Scan**: The user drops an Excel spreadsheet (`.xlsx` or `.xls`) into the upload target. The app immediately validates and scans the workbook.
3. **Breakdown & Inspection**: The app presents an instant breakdown of the uploaded workbook: total rows, total columns, and missing values detected across sheets/columns.
4. **Cleaning Choices & Prompts**: Beneath the breakdown, the app presents concrete, clickable cleaning actions tailored to the issues detected (e.g., removing blank rows, handling missing values, stripping trailing whitespace, fixing header casing) alongside an optional text box for specific instructions.
5. **Processing with Mascot**: The user clicks "Clean Data". While the cleaning engine runs, the subtle cartoon mascot appears in an active "cleaning up" state so the user knows work is in progress.
6. **Results & Verification**: The screen updates with:
   - A high-level overview of the cleaned dataset (re-computed dimensions and stats).
   - An itemized **What Changed & What Didn't** change log detailing every modification made and every potential issue intentionally left untouched.
7. **Download**: The user clicks the prominent "Download Cleaned File" button to download their tidier Excel/CSV spreadsheet.

## Screens and Layout

The entire proof-of-concept lives on a single, focused web page with progressive state reveals:

- **Header**: App title ("Welcome to Messy Data Cleaner"), friendly subtitle/tagline, and the cartoon mascot mark.
- **Upload Stage (Initial State)**: A prominent drag-and-drop zone with a file picker button labeled "Drop your Excel file here or browse".
- **Inspection Stage (Revealed after upload)**: 
  - Summary metrics cards: Row count, Column count, Total missing values count.
  - Interactive Cleaning Actions list: Checkboxes / clickable toggles for suggested cleaning steps (e.g., "Drop empty rows", "Trim whitespace", "Standardize column headers").
  - Optional Instruction Box: A text area ("Have custom cleaning instructions? Type them here or leave blank for smart defaults").
  - Primary Action Button: "Clean Data".
- **Processing Overlay / State**: Subtle cartoon mascot animation/graphic accompanied by a friendly status message ("Tidying up your spreadsheet...").
- **Results Stage (Revealed after cleaning)**:
  - Dataset Overview: Before-and-after summary card.
  - Change Log Card: Clear two-column or split listing of "What Changed" vs "What Didn't Change".
  - Action Bar: Primary "Download Cleaned File" button, with a secondary "Clean Another File" button to reset the loop.

## Look and Feel

Source: `scope.md > Inspiration & Identity` and learner visual references

- **Aesthetic Direction**: Friendly, illustrated, vintage-clean utility. Not a corporate sterile enterprise dashboard; definitely not a chatbot or dark-mode developer terminal.
- **Visual References**:
  - *The Problem*: Metaphor of the overflowing, paper-stuffed filing cabinet—chaotic, overwhelming, and unorganized.
  - *The Solution*: Stylized cleaning supplies palette—soft grid tile background (muted sage/mint green), cheerful accents (powder blue, warm sunny yellow, rose/coral pink), clean rounded container cards.
- **Typography**: Clean, highly readable modern sans-serif (such as Inter or Plus Jakarta Sans) paired with a friendly, slightly rounded header font.
- **Mascot Role**: Subtle, delightful illustration of the cleaning mascot that anchors the page header and comes alive during the processing state.

## Features and Behavior

### 1. Excel File Ingestion & Validation
Source: `scope.md > The POC Boundary`

- Supports `.xlsx` and `.xls` workbook uploads.
- Instant feedback upon file selection: immediately begins parsing without requiring a manual "Upload" confirmation.
- Rejection of invalid formats or corrupt files with a friendly, polite message.

#### Acceptance Criteria
- [ ] Dropping an `.xlsx` or `.xls` file immediately triggers file scanning and transitions to the breakdown view within 2 seconds.
- [ ] Attempting to upload a non-Excel file (e.g., `.png`, `.pdf`, `.exe`) rejects the file and displays: *"Please upload an Excel file, this format is not supported."*
- [ ] Uploading a completely empty Excel workbook displays a polite notice informing the user that no data was found in the sheet.

### 2. Workbook Breakdown & Diagnostic Summary
Source: `scope.md > The POC Boundary`

- Displays essential diagnostic metrics in clear cards:
  - Total number of rows
  - Total number of columns
  - Number and percentage of cells with missing/null values
  - Preview of identified column names

#### Acceptance Criteria
- [ ] Accurate row, column, and null-cell counts appear immediately after file parsing.
- [ ] Metrics are displayed clearly without raw technical error traces or unformatted code objects.

### 3. Interactive Cleaning Prompts & Custom Instructions
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`

- Dynamically proposes clickable cleaning choices based on issues found in the file:
  - *Blank Rows / Columns*: Option to remove rows or columns that contain no data.
  - *Missing Values*: Option to fill missing numeric values or leave them blank.
  - *Column Header Standardization*: Option to trim whitespace, lowercase/snake_case headers, and remove unusual symbols.
  - *Whitespace Trimming*: Option to remove accidental leading/trailing spaces from text cells.
- Provides a free-form text input area for optional user instructions (e.g., "delete rows where column status is draft").
- If no choices are changed and the text box is left blank, the app applies sensible, non-destructive default organization.

#### Acceptance Criteria
- [ ] User can click to enable or disable suggested cleaning options.
- [ ] User can enter optional plain-text instructions into the prompt box.
- [ ] Clicking "Clean Data" triggers the cleaning action with both selected options and custom instructions considered.

### 4. Mascot Processing State
Source: `scope.md > The POC Boundary`, `scope.md > Inspiration & Identity`

- While the data is being transformed, the interface replaces the action button with the cartoon cleaning mascot and a reassuring progress indicator.

#### Acceptance Criteria
- [ ] Cartoon cleaning character appears immediately when cleaning starts.
- [ ] Interface prevents duplicate submissions while processing is active.

### 5. "What Changed & What Didn't" Audit Log & Overview
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`

- The hallmark trust feature: provides an explicit, readable audit log.
- "What Changed" section lists exact modifications (e.g., "Removed 14 completely blank rows", "Trimmed trailing spaces from 120 text cells in 'Customer Name'", "Standardized 8 column headers").
- "What Didn't Change" section highlights data integrity safeguards (e.g., "Preserved all 45 rows with partial missing values in 'Notes'", "Did not alter date formats").
- Summary overview displays post-cleaning dataset metrics.

#### Acceptance Criteria
- [ ] The change log accurately records each cleaning action performed.
- [ ] The log explicitly confirms what data was preserved and left unchanged.
- [ ] The overview displays new row and column counts reflecting the cleaned dataset.

### 6. Clean File Export
Source: `scope.md > The POC Boundary`

- One-click download button delivering the cleaned workbook directly to the user's browser.

#### Acceptance Criteria
- [ ] Clicking "Download Cleaned File" instantly downloads the tidied spreadsheet file in Excel (`.xlsx`) or `.csv` format.
- [ ] Downloaded file opens cleanly in Excel without corruption or syntax errors.

## States and Boundaries

- **First Use / Initial State**: Clean landing screen with welcome message, mascot, and file dropzone. No stale data or blank tables visible.
- **Scanning State**: Subtle loading indicator on dropzone while parsing the workbook structure.
- **Invalid File State**: Clear, polite warning banner: *"Please upload an Excel file, this format is not supported."* Dropzone resets ready for another file.
- **Empty Sheet State**: Polite message explaining that the workbook contains no readable data rows or columns.
- **Inspection & Choice State**: Data metrics visible, interactive action options toggled to sensible defaults, custom instruction box ready.
- **Cleaning State**: Mascot actively displayed; input controls disabled to prevent race conditions.
- **Completed State**: Results overview, audit log, and download button fully visible.
- **Persistence Boundary**: Ephemeral session. Files and logs are processed in-memory for the current session and are not stored permanently on a server database.

## Product Decisions

- **Clickable Cleaning Choices over Raw AI Chat**: Selected interactive options (toggles/checkboxes) for common cleaning tasks plus a text box, rather than a free-floating conversational chatbot, ensuring speed and structure.
- **Excel-First Format**: Restricted strictly to `.xlsx` / `.xls` files for the proof of concept to match the real-world internship workflow and keep the build tightly bounded.
- **Visual Personality Inspired by Cleaning Metaphors**: Embraced the friendly cleaning supplies aesthetic (from uploaded references) rather than generic gray SaaS dashboards, creating immediate emotional appeal.
- **Audit Log as Core Differentiator**: Prioritized the "What Changed and What Didn't" log over visual charts or deep insight reports, building the essential trust layer first.

## What We're Building

1. Single-page web application with clean, retro-tiled cleaning aesthetic.
2. Drag-and-drop file uploader supporting `.xlsx` and `.xls`.
3. Instant file parsing with row, column, and missing-value counts.
4. Interactive cleaning options toggles + optional prompt text input.
5. In-process cartoon mascot screen indicator.
6. Rule-based and instruction-aware spreadsheet cleaning engine.
7. Explicit "What Changed & What Didn't" audit log.
8. One-click cleaned spreadsheet download button.
9. Polite validation and error handling for non-Excel and empty files.

## Deferred From the POC

- **Visual Charts & Insight Reports**: Deferred to keep the PoC strictly under 2–4 hours focused on cleaning trust.
- **In-Browser Cell Editing**: Full spreadsheet grid editor deferred; user reviews the log and downloads the file to work in Excel.
- **Multi-File Formats (CSV, JSON, Google Sheets)**: Deferred until Excel cleaning is proven.
- **User Accounts & Cloud Storage**: No logins or saved cloud history; PoC is local and ephemeral.
- **Full Animated Story Mascot**: Rich character animation sequences (e.g., sweeping broom physics) deferred; PoC uses subtle character illustrations.
- **Flag-and-Decide Screen for Outliers & Ambiguous Dates**: Detecting statistical outliers and ambiguous date formats (e.g., 01/02/2024 as Jan 2nd vs Feb 1st) and surfacing them for human review before applying any fix adds a new interactive stage to the core loop. Deferred — the PoC auto-skips these values and notes them in the "What Didn't Change" log rather than guessing. The full review-then-fix flow is the right next feature after the core cleaning loop is proven.

## Possible Later Enhancements

- Automatic chart recommendations based on clean column data types.
- Side-by-side data diff table previewing before-and-after rows.
- Direct Google Sheets connector or Excel add-in.

## Non-Goals

- Will not function as a general-purpose chat assistant.
- Will not attempt to replace Excel, Tableau, or Power BI for complex dashboarding.
- Will not invent synthetic data or silently guess missing values without user consent.

## Open Questions

- *None blocking spec approval*. Default export format preference (Excel `.xlsx` vs `.csv`) will be finalized in `4-spec` based on implementation simplicity.
