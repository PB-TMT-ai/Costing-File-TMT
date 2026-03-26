# Workflow: Update Costing File from BigMint Daily Report

## Objective
Extract steel market prices from the BigMint Daily Report PDF and update the costing Excel file for both Raipur and NCR markets. Auto-computes margins and applies professional formatting.

## Required Inputs
- **PDF**: BigMint Daily Steel Report (e.g., `data/BigMint_Daily_Report_as_on_<date>.pdf`)
- **Base Excel**: Most recent output from `output/YYYY-MM-DD/`, or template from `data/` if no previous output exists

## File Chaining Rule
Each daily update chains from the previous day's output:
1. Check `output/` for date folders (sorted descending by name)
2. Use the `.xlsx` from the latest folder as the base
3. If no output folders exist, fall back to the `.xlsx` template in `data/`

## Data Points to Extract

### Raipur Tab (8 data points)

| # | Excel Cell | Item | PDF Section | Notes |
|---|-----------|------|-------------|-------|
| 1 | E7 | Pallet DRI | Scrap & Metallic > Sponge (India) > Pellet Sponge (P-DRI) > Central India > Raipur | Price column |
| 2 | E8 | Pig Iron | Pig Iron (India) > DAP-Raipur > Steel Grade | Price column |
| 3 | E9 | Scrap | Melting Scrap (India) > DAP-Raipur > HMS(80:20) | Price column |
| 4 | E10 | Silico Manganese | Silico Manganese (India) > Ex-Raipur > 25-150mm HC 60-14 | **Divide by 1000** (ton → kg) |
| 5 | E11 | Iron Ore DRI | Scrap & Metallic > Sponge (India) > Sponge Iron (C-DRI) > Central India > Raipur | Price column |
| 6 | C15 | Date | Cover page | Report date (e.g., 26 Mar 2026) |
| 7 | I16 | Market price Billet | Steel > Ingot/Billet > Billet > Central India > Raipur | Price column |
| 8 | F34 | Market price TMT | Rebar (India) > Ex-Raipur > 12-25mm IF route > Fe 500 IS 1786 | Price column |

### NCR Tab (3 data points)

| # | Excel Cell | Item | PDF Section | Adjustment |
|---|-----------|------|-------------|------------|
| 1 | D9 | Scrap | Melting Scrap (India) > DAP-Mandi > HMS(80:20) | Value minus 500 (computed) |
| 2 | H16 | Market price Billet | Ingot/Billet > Billet > North India > Mandi Gobindgarh | Value minus 500 (computed) |
| 3 | F34 | Market price TMT | Rebar (India) > Ex-Delhi/NCR > 12-25mm IF route > Fe 500 IS 1786 | Direct value |

### Auto-Computed (logged in change log, not manually entered)
- **Nett Margin Billet** = Market price Billet − Billet Cost (for both Raipur and NCR)
- **Margin TMT** = Market price TMT − Total Cost (for both Raipur and NCR)

## Steps

1. **Find base Excel** — use the most recent output (see File Chaining Rule above)
2. **Open PDF** and locate each section listed above
3. **Extract prices** — note the Price column value for each data point
4. **Run the update tool**:
   ```bash
   python tools/update_costing_file.py "<base_excel_path>" \
     --pallet-dri <value> \
     --pig-iron <value> \
     --scrap-raipur <value> \
     --silico-mn <value_in_kg> \
     --iron-ore-dri <value> \
     --report-date YYYY-MM-DD \
     --billet-raipur <value> \
     --tmt-raipur <value> \
     --scrap-mandi <value_before_adj> \
     --billet-mandi <value_before_adj> \
     --tmt-ncr <value>
   ```
   The tool will automatically:
   - Compute all values in Python (zero Excel formulas — prevents errors)
   - Verify no formulas leaked into the output (safety check)
   - Save to `output/YYYY-MM-DD/YYYYMMDD_Costing TMT.xlsx`
   - Remove extra tabs (keeps only Raipur and NCR)
   - Compute Nett Margin Billet and Margin TMT for both markets
   - Append to `output/change_log.xlsx` (prices + margins)
   - Apply professional formatting (colour-coded sections, number formats, frozen panes)
   - Auto-commit and push to `main` on GitHub
5. **Verify output** — the tool auto-verifies, but you can also run `/verify-costing`

**Or simply run** `/update-costing` to automate steps 1–6 end-to-end.

## Output Structure
```
output/
├── change_log.xlsx                    # Cumulative history: prices + margins (Raipur & NCR)
├── 2026-03-23/
│   └── 20260323_Costing TMT.xlsx      # Formatted, 2 tabs only, zero formulas
├── 2026-03-26/
│   └── 20260326_Costing TMT.xlsx
└── ...
```

## Change Log Columns (per date)
| Row | Raipur | NCR |
|-----|--------|-----|
| Pallet DRI | value | - (auto-calc) |
| Pig Iron | value | - (auto-calc) |
| Scrap | value | value (after -500) |
| Silico Manganese | value (kg) | - (auto-calc) |
| Iron Ore DRI | value | - (auto-calc) |
| Date | report date | report date |
| Market price Billet | value | value (after -500) |
| **Nett Margin Billet** | computed | computed |
| Market price TMT | value | value |
| **Margin TMT** | computed | computed |

## Tools Used
| Tool | Purpose |
|------|---------|
| `tools/update_costing_file.py` | Updates cells, computes margins, saves to date folder, appends change log, applies formatting |
| `tools/format_output.py` | Professional formatting (auto-called by update tool, also usable standalone) |

## Edge Cases
- **Silico Manganese**: PDF reports in INR/ton — must divide by 1000 for the kg value in Excel
- **NCR Scrap & Billet**: −500 adjustment is computed in Python and written as a plain number (no formulas)
- **NCR other inputs**: DRI, Pig Iron, Silico Mn are computed from Raipur values (+3100 or same) and written directly — no cross-sheet formulas
- **No Excel formulas**: All cells are pre-computed values. The tool verifies this after save and fails if any formula leaks through
- **Auto-push**: Output files are auto-committed and pushed to `main` after every run
- **Date format**: Must be passed as YYYY-MM-DD string to the tool
- **PDF table structure**: Prices are in the "Price" column. Ignore "Change", "W-O-W", "1M", "3M" columns
- **Same-date re-run**: Change log columns are overwritten (supports corrections without duplication)
- **File chaining**: Always use the latest output as base, not the original template

## Lessons Learned
- The BigMint PDF has a consistent structure across daily reports — page numbers may shift but section headers remain stable
- Sponge (India) table has two sub-columns: Sponge Iron (C-DRI) and Pellet Sponge (P-DRI) — read carefully
- Melting Scrap section (DAP-Raipur, DAP-Mandi) is separate from Re-Rolling Scrap (Ex-Alang) — use the correct section
- Margins are auto-computed by replicating the Excel formula chain in Python — they stay in sync with workbook constants
- All output cells must be plain numbers, never formulas — openpyxl formulas have no cached values and cause errors in Excel Online/GitHub preview
- Output files are auto-pushed to `main` — no manual merge needed
- Output file naming: `YYYYMMDD_Costing TMT.xlsx` — only Raipur and NCR tabs are kept
