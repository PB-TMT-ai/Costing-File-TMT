# Agent Operating Instructions

This project uses the WAT framework (Workflows, Agents, Tools).

## Key Principles

1. **Check workflows/ first** — before doing anything, read the relevant workflow SOP
2. **Check tools/ before building** — only create new scripts when nothing exists for the task
3. **Deterministic execution** — offload all data processing, file I/O, and calculations to tools/
4. **Keep workflows current** — update SOPs when you discover better methods or constraints
5. **Credentials live in .env** — never hardcode secrets
6. **No Excel formulas** — all output cells must be pre-computed values (openpyxl formulas cause errors)
7. **Always push to main** — all work happens on the `main` branch, output auto-pushes after each run

## Directory Structure

- `workflows/` — Markdown SOPs defining objectives, inputs, tools, outputs, edge cases
- `tools/` — Python scripts for execution (API calls, transformations, file ops)
  - `update_costing_file.py` — Main update tool: sets prices, computes margins, saves output, updates change log
  - `extract_all_pdfs.py` — Batch extraction: auto-discovers BigMint PDFs, extracts all 11 data points, outputs JSON
  - `format_output.py` — Professional Excel formatting (auto-called by update tool)
  - `clean_pptx.py` — Post-processor: strips orphaned Content_Types from PPTX (auto-called by graph script)
  - `create_material_change_graph.js` — Generates branded PPT with monthly price/margin charts (Node.js)
- `.claude/skills/` — Claude Code skills (slash commands for common tasks)
- `data/` — Input costing files, templates, and BigMint PDFs (may also exist in root directory)
- `output/` — Date-wise folders (`output/YYYY-MM-DD/YYYYMMDD_Costing TMT.xlsx`) and cumulative `change_log.xlsx`

## Daily Costing Update (Primary Workflow)

The main task is updating the costing Excel with fresh prices from a BigMint Daily Report PDF.
Use `/update-costing` or follow `workflows/update_costing_from_pdf.md`.

**File chaining**: Each day's update uses the most recent output Excel as the base (not a fresh upload). Falls back to `data/` template only if no previous output exists.

**Computed values**: All formula cells (costs, margins, NCR cross-refs) are computed in Python and written as plain numbers. A safety check verifies zero formulas remain after save.

**Clean xlsx**: External links, comments, and VML drawings are stripped from the output xlsx to prevent "found a problem with content" errors in Excel.

**Margins**: The tool auto-computes Nett Margin (Billet) and Margin (TMT) for both Raipur and NCR, logged in the change log.

**Formatting**: Professional Excel formatting is auto-applied (colour-coded sections, number formats, frozen panes).

**Auto-push**: Output files are auto-committed and pushed to `main` after every run. No manual merge needed.

**Output naming**: `YYYYMMDD_Costing TMT.xlsx` — only Raipur and NCR tabs are kept.

**Material graphs**: After every costing update, regenerate `output/material_change_graphs.pptx` by running `node tools/create_material_change_graph.js`. This produces branded charts showing monthly absolute prices/margins with delta annotations. See `workflows/generate_material_graphs.md`.

## Batch Processing (Historical PDFs)

For processing multiple PDFs at once, use `tools/extract_all_pdfs.py` to auto-discover and extract prices from all BigMint PDFs, then run `tools/update_costing_file.py` for each date in chronological order.

**PDF locations**: BigMint PDFs may live in `data/` or the root directory, with varying naming conventions (e.g., `BigMint_Daily_Report_as_on_...` or `1737343182595_iffsptpf8_BigMint_...`).

**Change log rebuild**: When processing historical PDFs, delete `output/change_log.xlsx` first and reprocess all dates in chronological order to ensure columns are in date order.

**Skip push during batch**: Set `SKIP_PUSH=1` environment variable to skip the auto-push retry loop during batch runs (saves ~30s per invocation).

## When Things Fail

1. Read the full error message and trace
2. Fix the script and retest
3. Document what you learned in the workflow
4. If the fix involves paid API calls, check with the user before running

## Tool Conventions

- All tools accept CLI arguments via `argparse`
- Tools read credentials from environment variables (loaded from `.env`)
- Tools write output to `output/` by default
- Tools exit with code 0 on success, non-zero on failure
- Tools log to stderr, write results to stdout or files
- Output Excel files must contain zero formulas (all values pre-computed)
