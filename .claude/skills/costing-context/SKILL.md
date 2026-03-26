---
name: costing-context
description: Background context about the TMT costing file structure, data point mappings, and update rules. Auto-loaded when working on costing tasks.
user-invocable: false
---

# TMT Costing File — Reference Context

## Data Point Mapping (11 points)

### Raipur Tab (8 points updated directly)

| Excel Cell | Item | PDF Source | Notes |
|-----------|------|-----------|-------|
| Raipur!E7 | Pallet DRI | Scrap & Metallic > Sponge (India) > Pellet Sponge (P-DRI) > Central India > Raipur | Price column |
| Raipur!E8 | Pig Iron | Pig Iron (India) > DAP-Raipur > Steel Grade | Price column |
| Raipur!E9 | Scrap | Melting Scrap (India) > DAP-Raipur > HMS(80:20) | Price column |
| Raipur!E10 | Silico Manganese | Silico Manganese (India) > Ex-Raipur > 25-150mm HC 60-14 | **Divide by 1000** (ton to kg) |
| Raipur!E11 | Iron Ore DRI | Scrap & Metallic > Sponge (India) > Sponge Iron (C-DRI) > Central India > Raipur | Price column |
| Raipur!C15 | Date | PDF cover page | Format: YYYY-MM-DD |
| Raipur!I16 | Market price Billet | Steel > Ingot/Billet > Billet > Central India > Raipur | Price column |
| Raipur!F34 | Market price TMT | Rebar (India) > Ex-Raipur > 12-25mm IF Route > Fe 500 IS 1786 | Basic price (not GST inclusive) |

### NCR Tab (3 points updated directly, rest auto-calculated)

| Excel Cell | Item | PDF Source | Adjustment |
|-----------|------|-----------|------------|
| NCR!D9 | Scrap | Melting Scrap (India) > DAP-Mandi > HMS(80:20) | Formula: `=<pdf_value>-500` |
| NCR!H16 | Market price Billet | Ingot/Billet > Billet > North India > Mandi Gobindgarh | Formula: `=<pdf_value>-500` |
| NCR!F34 | Market price TMT | Rebar (India) > Ex-Delhi/NCR > 12-25mm IF Route > Fe 500 IS 1786 | Direct value |

### NCR Auto-Calculated Cells (DO NOT update these directly)
- NCR!D7 (Pallet DRI) = `=Raipur!E7+3100`
- NCR!D8 (Pig Iron) = `=Raipur!E8+3100`
- NCR!D10 (Silico Mn) = `=Raipur!E10`
- NCR!D11 (Iron Ore DRI) = `=Raipur!E11+3100`

## Excel Structure

### Raipur Tab (columns B-I, rows 7-35)
- Rows 7-11: Raw material inputs (Pallet DRI, Pig Iron, Scrap, Silico Mn, Iron Ore DRI)
- Row 12-14: Operating costs (Power, Stores, Manpower)
- Row 15: Billet Cost total (formula: SUM of rows 7-14)
- Row 16: Market price of Billet (blue-highlighted input)
- Row 17: Nett Margin (formula: I16 - I15)
- Rows 19-32: Rolling Mill Cost breakdown
- Row 33: Total cost (formula)
- Row 34: Market price for TMT (blue-highlighted input)
- Row 35: Margin for mfr (formula: F34 - F33)

### NCR Tab (columns A-H, rows 7-35)
- Same structure as Raipur but with cross-sheet formula dependencies
- Column offsets differ: NCR uses columns A-H vs Raipur's B-I

## File Chaining Rule

Each daily update uses the **most recent output** as the base Excel file:
1. Check `output/` for date folders (sorted descending by name)
2. Use the `.xlsx` from the latest folder
3. If no output exists, fall back to the template in `data/`

## Margins (auto-computed for change log)
The tool computes Nett Margin Billet and Margin TMT for both markets by replicating the Excel formula chain:
- **Nett Margin Billet** = Market price Billet - Billet Cost (SUM of raw materials + operating costs)
- **Margin TMT** = Market price TMT - Total Cost (Billet Cost + Rolling Mill Cost + Interest/Depreciation)
These are logged in the change log alongside the input prices.

## Output Convention
- Updated Excel: `output/YYYY-MM-DD/<filename>.xlsx`
- Change log: `output/change_log.xlsx` (cumulative, appends new date columns with margins)

## Tool Command
```bash
python tools/update_costing_file.py <base_excel> \
  --pallet-dri <value> --pig-iron <value> --scrap-raipur <value> \
  --silico-mn <value_in_kg> --iron-ore-dri <value> \
  --report-date YYYY-MM-DD --billet-raipur <value> --tmt-raipur <value> \
  --scrap-mandi <raw_value> --billet-mandi <raw_value> --tmt-ncr <value>
```
