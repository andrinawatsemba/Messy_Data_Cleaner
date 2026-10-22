---
doc: scope
status: approved
---

# Messy Data Helper

An app that takes a messy Excel file, shows what’s going on, asks before it changes things, then hands back a tidier file plus a log of what changed and what didn’t.

## The Unique Kernel
Trust. Without questions before changes and a clear log of what was (and wasn’t) changed, people would not trust it enough to use. The human stays the evaluator so meaning isn’t lost and insights aren’t invented.

## Who It's For
Someone like the learner during their internship: they receive a messy Excel file, spend hours or days cleaning it in Excel, then produce insights for a supervisor. They want a first pass so they are not starting from a blank, terrifying spreadsheet — and they still need to catch mistakes that could distort decisions.

Later they hope other people in data-for-decisions work would use it; that is not the first user to design for.

## The Core Loop
Give the app a messy Excel file. See a clear breakdown of what’s going on (rows, columns, missing values). Answer prompts about what to change or not, with a place to type extra instructions. If they give no extra instructions, the app does a basic organization and overview. Download the same data as a tidier CSV or Excel file, with a log of what changed and what did not.

They come back because the next file is also messy, and they still don’t want to start from scratch.

## Inspiration & Identity
Not a chatbot. Not a generic AI-looking site. Not Excel, Tableau, or Power BI. Visually appealing but clean. A cartoon character as the “owner” of the app who takes the work and cleans it — for this proof of concept, only a subtle appearance when the explore/process/clean action is running, until feedback comes back. Broader character motion (broom, sweeping files) is a later flourish.

## Why This Matters to the Learner
Internship messy Excel took hours or days before they could even generate insights. They want to fear messy data less, keep a human check so bad cleaning doesn’t cost money, and eventually make something other people might use as a data/digital product. This hackathon is the working first slice, not the business.

## What "Working" Looks Like
On a screen, in about a minute: drop in a messy Excel file → see the breakdown and the app’s questions → optionally type instructions (or skip) → get a basic organized file and overview → see a log of what changed and what didn’t → download. The “oh, that’s cool” beat is the log plus the questions — enough trust to take the file — not a full insight report.

## The POC Boundary
- One file type: Excel
- Breakdown: rows, columns, missing values
- Prompts/questions on what to change or not, plus a placeholder for extra instructions
- If no extra instructions: basic organization and overview
- Downloadable tidier CSV or Excel of the same data
- Log/report of what was changed and what was not
- Subtle cartoon character only while processing, until results appear

## Later
- Insight report, charts, and “visuals of the data”
- In-app end-to-end path (edit inside the app, full report output)
- Any data type beyond Excel
- Richer cartoon (broom, sweeping files, stronger mascot presence)
- Something other people pay for as a digital product

## Explicitly Cut
- Chatbot / non-interactive generic AI look — they don’t want that feel
- Excel / Tableau / Power BI interface clone — wrong identity
- Full commercial product and market research on whether this already exists — out of scope for a 2–4 hour proof of concept
