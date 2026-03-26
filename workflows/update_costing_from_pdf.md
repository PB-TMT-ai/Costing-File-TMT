# Workflow: Update Costing File from BigMint Daily Report

## Objective
Extract steel market prices from the BigMint Daily Report PDF and update the blue-highlighted cells in the costing Excel file for both Raipur and NCR markets.

## Required Inputs
- **PDF**: BigMint Daily Steel Report (e.g., `data/BigMint_Daily_Report_as_on_<date>.pdf`)
- **Excel**: Costing file v3 (e.g., `data/<date>_BILLET AND TMT COSTING DETAILS_v3.xlsx`)

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
| 1 | D9 | Scrap | Melting Scrap (India) > DAP-Mandi > HMS(80:20) | Formula: `=<value>-500` |
| 2 | H16 | Market price Billet | Ingot/Billet > Billet > North India > Mandi Gobindgarh | Formula: `=<value>-500` |
| 3 | F34 | Market price TMT | Rebar (India) > Ex-Delhi/NCR > 12-25mm IF route > Fe 500 IS 1786 | Direct value |

## Steps

1. **Open PDF** and locate each section listed above
2. **Extract prices** — note the Price column value for each data point
3. **Run the update tool**:
   ```bash
   python tools/update_costing_file.py "data/<excel_file>.xlsx" \
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
4. **Verify output** — open `output/YYYY-MM-DD/<file>.xlsx` and check values
5. **Check change log** — open `output/change_log.xlsx` and verify the new date column was appended with correct Raipur and NCR values

## Output Structure
```
output/
├── change_log.xlsx              # Cumulative price history (all dates)
├── 2026-03-26/                  # Date-wise folder
│   └── <costing_file>.xlsx      # Updated costing file for this date
├── 2026-03-27/
│   └── <costing_file>.xlsx
└── ...
```

## Tools Used
| Tool | Purpose |
|------|---------|
| `tools/update_costing_file.py` | Updates Excel cells, saves to date folder, appends to change log |

## Edge Cases
- **Silico Manganese**: PDF reports in INR/ton — must divide by 1000 for the kg value in Excel
- **NCR Scrap & Billet**: Always apply −500 adjustment via formula (not hardcoded)
- **NCR other inputs**: DRI, Pig Iron, Silico Mn are auto-calculated from Raipur via cross-sheet formulas — do NOT update those cells directly
- **Date format**: Must be passed as YYYY-MM-DD string to the tool
- **PDF table structure**: Prices are in the "Price" column. Ignore "Change", "W-O-W", "1M", "3M" columns
- **Same-date re-run**: If the tool is run again for the same date, the change log columns are overwritten (supports corrections without duplication)

## Lessons Learned
- The BigMint PDF has a consistent structure across daily reports — page numbers may shift but section headers remain stable
- Sponge (India) table has two sub-columns: Sponge Iron (C-DRI) and Pellet Sponge (P-DRI) — read carefully
- Melting Scrap section (DAP-Raipur, DAP-Mandi) is separate from Re-Rolling Scrap (Ex-Alang) — use the correct section
