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

Open `output/<date>/*.xlsx` using openpyxl and read these cells:

### Raipur Tab
| Cell | Item | Expected Type |
|------|------|--------------|
| E7 | Pallet DRI | Number > 0 |
| E8 | Pig Iron | Number > 0 |
| E9 | Scrap | Number > 0 |
| E10 | Silico Manganese | Number > 0, typically 50-150 (INR/kg) |
| E11 | Iron Ore DRI | Number > 0 |
| C15 | Date | Date value matching the folder date |
| I16 | Market price Billet | Number > 0 |
| F34 | Market price TMT | Number > 0 |

Also check that formulas are preserved:
- F7 should be `=E7*C7/100`
- F8 should be `=E8*C8/100`
- F9 should be `=E9*C9/100`
- I15 should be `=SUM(I7:I14)`
- I17 should be `=I16-I15`
- F33 should be `=F28+I15+F32`
- F35 should be `=F34-F33`

### NCR Tab
| Cell | Item | Expected Pattern |
|------|------|-----------------|
| D9 | Scrap | Formula `=<number>-500` |
| H16 | Market price Billet | Formula `=<number>-500` |
| F34 | Market price TMT | Number > 0 |

Also check cross-sheet formulas are intact:
- D7 should be `=Raipur!E7+3100`
- D8 should be `=Raipur!E8+3100`
- D10 should be `=Raipur!E10`
- D11 should be `=Raipur!E11+3100`

## Step 3: Cross-verify with Change Log

Open `output/change_log.xlsx` and check:
1. A column pair exists for the target date
2. Raipur values match the Excel cells
3. NCR values match (Scrap = D9 raw - 500, Billet = H16 raw - 500, TMT = F34)
4. NCR auto-calculated items show "-"
5. Nett Margin Billet row has computed values for both markets
6. Margin TMT row has computed values for both markets
7. Margin cells have green tint (positive) or red tint (negative)

## Step 4: Sanity Checks

Run these validation rules:
- No cell value is negative
- No cell value is zero (except where 0 is valid, like Iron Ore DRI consumption in NCR)
- Silico Manganese is in kg range (< 200), not ton range (> 10000)
- Market price TMT > Market price Billet (TMT is a finished product, always higher)
- Date in C15 matches the folder date
- NCR formulas contain "-500" adjustment

## Step 5: Report

Print a verification report:

```
=== Costing File Verification: <DATE> ===

Raipur Tab:
  [PASS/FAIL] E7  Pallet DRI:        <value>
  [PASS/FAIL] E8  Pig Iron:          <value>
  [PASS/FAIL] E9  Scrap:             <value>
  [PASS/FAIL] E10 Silico Manganese:  <value>
  [PASS/FAIL] E11 Iron Ore DRI:      <value>
  [PASS/FAIL] C15 Date:              <value>
  [PASS/FAIL] I16 Market Billet:     <value>
  [PASS/FAIL] F34 Market TMT:        <value>
  [PASS/FAIL] Formulas intact

NCR Tab:
  [PASS/FAIL] D9  Scrap:             <formula> = <effective>
  [PASS/FAIL] H16 Market Billet:     <formula> = <effective>
  [PASS/FAIL] F34 Market TMT:        <value>
  [PASS/FAIL] Cross-sheet formulas intact

Change Log:
  [PASS/FAIL] Date column exists
  [PASS/FAIL] Input values match
  [PASS/FAIL] Nett Margin Billet:   Raipur=<value>, NCR=<value>
  [PASS/FAIL] Margin TMT:           Raipur=<value>, NCR=<value>

Formatting:
  [PASS/FAIL] Colour-coded sections applied
  [PASS/FAIL] Frozen panes set
  [PASS/FAIL] Number formats (#,##0)

Sanity Checks:
  [PASS/FAIL] No negative values
  [PASS/FAIL] TMT > Billet
  [PASS/FAIL] Silico Mn in kg range
  [PASS/FAIL] Margins are reasonable

Overall: PASS / FAIL (<N> issues)
```
