---
name: verify-costing
description: Verify the updated costing Excel file and change log have correct values. Run after /update-costing to confirm accuracy.
allowed-tools: Bash, Read, Glob
argument-hint: [YYYY-MM-DD]
context: fork
---

# Verify Costing File Output

You are verifying that an updated costing file and change log are correct.

## Step 1: Determine Date

- If `$ARGUMENTS` is provided, use that as the date (YYYY-MM-DD format)
- Otherwise, find the most recent date folder in `output/` (latest by folder name sort)

## Step 2: Read the Output Excel

Open `output/<date>/YYYYMMDD_Costing TMT.xlsx` using openpyxl and check:

### Sheets
- Only 2 sheets should exist: `Raipur` and `NCR`
- No extra tabs (Sheet1, DGP, etc.)

### Zero Formulas Check (CRITICAL)
Scan every cell in both sheets. If ANY cell value is a string starting with `=`, this is a **FAIL**. All cells must be pre-computed numbers or text labels.

### Clean xlsx Check
Inspect the xlsx zip contents. These should NOT exist:
- `xl/externalLinks/` (broken external workbook references)
- `xl/comments/` (author comments from template)
- `xl/drawings/commentsDrawing*.vml` (VML comment drawings)
If any are found, this is a **FAIL** — the cleaning step was skipped.

### Raipur Tab — Values
| Cell | Item | Expected Type |
|------|------|--------------|
| E7 | Pallet DRI | Number > 0 |
| E8 | Pig Iron | Number > 0 |
| E9 | Scrap | Number > 0 |
| E10 | Silico Manganese | Number > 0, typically 50-150 (INR/kg) |
| E11 | Iron Ore DRI | Number > 0 |
| C15 | Date | Date value matching the folder date |
| I15 | Billet Cost | Number > 0 (computed, not formula) |
| I16 | Market price Billet | Number > 0 |
| I17 | Nett Margin | Number (can be negative) — must equal I16 - I15 |
| F33 | Total Cost | Number > 0 (computed) |
| F34 | Market price TMT | Number > 0 |
| F35 | TMT Margin | Number (can be negative) — must equal F34 - F33 |

### NCR Tab — Values
| Cell | Item | Expected Type |
|------|------|--------------|
| D7 | Pallet DRI rate | Number = Raipur E7 + 3100 (computed, not formula) |
| D8 | Pig Iron rate | Number = Raipur E8 + 3100 (computed) |
| D9 | Scrap rate | Number (PDF value minus 500, computed) |
| D10 | Silico Mn rate | Number = Raipur E10 (computed) |
| D11 | Iron Ore DRI rate | Number = Raipur E11 + 3100 (computed) |
| H15 | Billet Cost | Number > 0 (computed) |
| H16 | Market price Billet | Number (PDF value minus 500, computed) |
| H17 | Nett Margin | Number — must equal H16 - H15 |
| F33 | Total Cost | Number > 0 (computed) |
| F34 | Market price TMT | Number > 0 |
| F35 | TMT Margin | Number — must equal F34 - F33 |

## Step 3: Cross-verify with Change Log

Open `output/change_log.xlsx` and check:
1. A column pair exists for the target date
2. Raipur values match the Excel cells
3. NCR values match (Scrap and Billet are after -500 adjustment, TMT = F34)
4. NCR auto-calculated items show "-"
5. Nett Margin Billet row has numeric values for both markets
6. Margin TMT row has numeric values for both markets

## Step 4: Sanity Checks

- No input cell value is zero (except where 0 is valid, like Iron Ore DRI consumption in NCR)
- Silico Manganese is in kg range (< 200), not ton range (> 10000)
- Market price TMT > Market price Billet (TMT is a finished product, always higher)
- Date in C15 matches the folder date
- NCR D7 = Raipur E7 + 3100 (verify the computed value)
- Margin values are plausible (typically -2000 to +5000 range)

## Step 5: Report

Print a verification report:

```
=== Costing File Verification: <DATE> ===

File: output/<date>/YYYYMMDD_Costing TMT.xlsx
Sheets: [PASS/FAIL] Raipur, NCR only

Formulas: [PASS/FAIL] 0 formulas found (all values computed)

Raipur Tab:
  [PASS/FAIL] E7  Pallet DRI:        <value>
  [PASS/FAIL] E8  Pig Iron:          <value>
  [PASS/FAIL] E9  Scrap:             <value>
  [PASS/FAIL] E10 Silico Manganese:  <value>
  [PASS/FAIL] E11 Iron Ore DRI:      <value>
  [PASS/FAIL] C15 Date:              <value>
  [PASS/FAIL] I15 Billet Cost:       <value> (computed)
  [PASS/FAIL] I16 Market Billet:     <value>
  [PASS/FAIL] I17 Nett Margin:       <value>
  [PASS/FAIL] F33 Total Cost:        <value> (computed)
  [PASS/FAIL] F34 Market TMT:        <value>
  [PASS/FAIL] F35 TMT Margin:        <value>

NCR Tab:
  [PASS/FAIL] D9  Scrap:             <value> (after -500)
  [PASS/FAIL] H15 Billet Cost:       <value> (computed)
  [PASS/FAIL] H16 Market Billet:     <value> (after -500)
  [PASS/FAIL] H17 Nett Margin:       <value>
  [PASS/FAIL] F34 Market TMT:        <value>
  [PASS/FAIL] F35 TMT Margin:        <value>
  [PASS/FAIL] NCR rates derived correctly from Raipur

Change Log:
  [PASS/FAIL] Date column exists
  [PASS/FAIL] Input values match
  [PASS/FAIL] Nett Margin Billet:   Raipur=<value>, NCR=<value>
  [PASS/FAIL] Margin TMT:           Raipur=<value>, NCR=<value>

Sanity Checks:
  [PASS/FAIL] TMT > Billet (both markets)
  [PASS/FAIL] Silico Mn in kg range
  [PASS/FAIL] Margins are reasonable

Overall: PASS / FAIL (<N> issues)
```
