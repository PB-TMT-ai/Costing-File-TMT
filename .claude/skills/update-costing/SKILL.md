---
name: update-costing
description: Extract prices from BigMint PDF and update the costing Excel file for Raipur and NCR markets. Use when a new BigMint Daily Report PDF is available in data/.
allowed-tools: Bash, Read, Glob, Grep
argument-hint: [pdf_filename]
---

# Update Costing File from BigMint PDF

You are updating the TMT costing Excel file with fresh market prices extracted from a BigMint Daily Steel Report PDF.

## Step 1: Locate Files

### PDF
- If `$ARGUMENTS` is provided, use `data/$ARGUMENTS` as the PDF
- Otherwise, find the latest `BigMint*.pdf` in `data/` (most recently modified)

### Base Excel (source file to update)
The Excel file chains from the previous day's output. Find the base file using this priority:
1. **Most recent output**: Look in `output/` for date-wise folders (sorted descending), use the `.xlsx` file from the latest folder
2. **Fallback**: If no output folders exist, use the `.xlsx` file in `data/`

Print which files you are using before proceeding.

## Step 2: Extract Date from PDF

Read the PDF cover page (page 1) to get the report date. Look for a line like "26 Mar 2026" near the top.

## Step 3: Extract 11 Prices from PDF

Use pymupdf (`import fitz`) to extract text from the PDF. Search for these exact sections and extract the **Price** value (first large number after the location name). Ignore "Change", "W-O-W", "1M", "3M" columns.

### Raipur Tab (8 values)

| # | Item | PDF Section Path | How to Find |
|---|------|-----------------|-------------|
| 1 | Pallet DRI | Scrap & Metallic > Sponge (India) > Pellet Sponge (P-DRI) > Central India > Raipur | In the Sponge (India) table, find "Central India / Raipur" row. The P-DRI price is in the RIGHT half of the table (columns after "Pellet Sponge (P-DRI)" header). |
| 2 | Pig Iron | Pig Iron (India) > DAP-Raipur > Steel Grade | Find "DAP-Raipur" with "Steel Grade" in the Pig Iron section. Take the Price value. |
| 3 | Scrap | Melting Scrap (India) > DAP-Raipur > HMS(80:20) | Find "DAP-Raipur" then "HMS(80:20)" in the Melting Scrap section. Take the Price. |
| 4 | Silico Manganese | Silico Manganese (India) > Ex-Raipur > 25-150mm HC 60-14 | Find "Ex-Raipur" with "25-150 mm, HC 60-14" in the Silico Manganese section. **IMPORTANT: Divide the value by 1000** (PDF is INR/ton, Excel needs INR/kg). |
| 5 | Iron Ore DRI | Scrap & Metallic > Sponge (India) > Sponge Iron (C-DRI) > Central India > Raipur | Same Sponge (India) table as #1, but use the LEFT half (C-DRI columns). Find "Central India / Raipur" row. |
| 6 | Date | Cover page | Report date from Step 2, formatted as YYYY-MM-DD |
| 7 | Market price Billet | Steel > Ingot/Billet > Billet > Central India > Raipur | In the Ingot/Billet table, find "Central India / Raipur" row. Take the BILLET price (right side of table, not INGOT). |
| 8 | Market price TMT | Rebar (India) > Ex-Raipur > 12-25mm IF Route > Fe 500 IS 1786 | Find "Ex-Raipur" with "12-25mm, IF Route, Fe 500, IS 1786" in the Rebar section. Take the Price (basic price, not GST inclusive). |

### NCR Tab (3 values)

| # | Item | PDF Section Path | How to Find | Adjustment |
|---|------|-----------------|-------------|------------|
| 1 | Scrap | Melting Scrap (India) > DAP-Mandi > HMS(80:20) | Find "DAP-Mandi" then "HMS(80:20)" in the Melting Scrap section. | Pass raw PDF value to tool (tool subtracts 500 and writes computed value) |
| 2 | Market price Billet | Ingot/Billet > Billet > North India > Mandi Gobindgarh | In the Ingot/Billet table, find "North India / Mandi Gobindgarh" row. Take the BILLET price. | Pass raw PDF value to tool (tool subtracts 500 and writes computed value) |
| 3 | Market price TMT | Rebar (India) > Ex-Delhi/NCR > 12-25mm IF Route > Fe 500 IS 1786 | Find "Ex-Delhi/NCR" with "12-25mm, IF Route, Fe 500, IS 1786". Take the basic Price. | Direct value, no adjustment |

## Step 4: Show Values for Confirmation

Display a summary table to the user before applying:

```
Extracted values from BigMint report dated <DATE>:

RAIPUR:
  Pallet DRI (E7):        <value>
  Pig Iron (E8):           <value>
  Scrap (E9):              <value>
  Silico Manganese (E10):  <value> (PDF: <raw>/ton)
  Iron Ore DRI (E11):      <value>
  Market price Billet (I16): <value>
  Market price TMT (F34):   <value>

NCR:
  Scrap (D9):              <raw_value> - 500 = <adjusted>
  Market price Billet (H16): <raw_value> - 500 = <adjusted>
  Market price TMT (F34):   <value>

Base Excel: <path>
Output will be saved to: output/<date>/
```

Wait for user confirmation before proceeding.

## Step 5: Run the Update Tool

```bash
python tools/update_costing_file.py "<base_excel_path>" \
  --pallet-dri <value> \
  --pig-iron <value> \
  --scrap-raipur <value> \
  --silico-mn <value_in_kg> \
  --iron-ore-dri <value> \
  --report-date <YYYY-MM-DD> \
  --billet-raipur <value> \
  --tmt-raipur <value> \
  --scrap-mandi <raw_value> \
  --billet-mandi <raw_value> \
  --tmt-ncr <value>
```

## Step 6: Verify Output

The tool automatically:
- Computes all values in Python (zero Excel formulas)
- Cleans the xlsx (strips external links, comments, VML drawings)
- Verifies no formulas leaked (safety check — fails if any found)
- Saves formatted output to `output/YYYY-MM-DD/YYYYMMDD_Costing TMT.xlsx`
- Removes extra tabs (keeps only Raipur and NCR)
- Computes margins and updates `output/change_log.xlsx`
- Auto-commits and pushes to `main` on GitHub

After the tool runs, confirm the output shows:
- "Cleaned: removed external links and comments from xlsx"
- "Verified: 0 formulas in output"
- "Pushed to main successfully"
- Correct margin values for both Raipur and NCR

Print a summary of the computed margins and confirm the push succeeded.
