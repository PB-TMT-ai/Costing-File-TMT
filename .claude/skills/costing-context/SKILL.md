---
name: costing-context
description: Background context about the TMT costing file structure, data point mappings, and update rules. Auto-loaded when working on costing tasks.
user-invocable: false
---

# TMT Costing File — Reference Context

## Critical Rules

1. **Zero formulas** — All output Excel cells must be pre-computed numbers. Never write formula strings (`=...`). The tool verifies this after save.
2. **All work on main** — No feature branches. Output auto-pushes to `main` after every run.
3. **File chaining** — Always use the most recent output as base, not the original template.

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

### NCR Tab (3 points from PDF, rest computed from Raipur)

| Excel Cell | Item | PDF Source | Adjustment |
|-----------|------|-----------|------------|
| NCR!D9 | Scrap | Melting Scrap (India) > DAP-Mandi > HMS(80:20) | PDF value minus 500 (computed, NOT a formula) |
| NCR!H16 | Market price Billet | Ingot/Billet > Billet > North India > Mandi Gobindgarh | PDF value minus 500 (computed, NOT a formula) |
| NCR!F34 | Market price TMT | Rebar (India) > Ex-Delhi/NCR > 12-25mm IF Route > Fe 500 IS 1786 | Direct value |

### NCR Derived Cells (computed by tool, not entered manually)
- NCR!D7 (Pallet DRI) = Raipur E7 + 3100 (written as computed number)
- NCR!D8 (Pig Iron) = Raipur E8 + 3100 (written as computed number)
- NCR!D10 (Silico Mn) = Raipur E10 (written as computed number)
- NCR!D11 (Iron Ore DRI) = Raipur E11 + 3100 (written as computed number)

## Excel Structure

### Raipur Tab (columns B-I, rows 7-35)
- Rows 7-11: Raw material inputs (Pallet DRI, Pig Iron, Scrap, Silico Mn, Iron Ore DRI)
- Row 12-14: Operating costs (Power, Stores, Manpower)
- Row 15: Billet Cost total (computed: SUM of rows 7-14)
- Row 16: Market price of Billet (input)
- Row 17: Nett Margin (computed: I16 - I15)
- Rows 19-32: Rolling Mill Cost breakdown (all computed)
- Row 33: Total cost (computed)
- Row 34: Market price for TMT (input)
- Row 35: Margin for mfr (computed: F34 - F33)

### NCR Tab (columns A-H, rows 7-35)
- Same structure as Raipur but column offsets differ (A-H vs B-I)
- All dependent values computed from Raipur inputs by the tool

## File Chaining Rule

Each daily update uses the **most recent output** as the base Excel file:
1. Check `output/` for date folders (sorted descending by name)
2. Use the `.xlsx` from the latest folder
3. If no output exists, fall back to the template in `data/`

## Margins (auto-computed, logged in change log)
- **Nett Margin Billet** = Market price Billet - Billet Cost
- **Margin TMT** = Market price TMT - Total Cost (Billet Cost + Rolling Mill Cost + Interest/Depreciation)
Computed for both Raipur and NCR, logged alongside input prices.

## Output Convention
- Updated Excel: `output/YYYY-MM-DD/YYYYMMDD_Costing TMT.xlsx` (2 tabs only, zero formulas)
- Change log: `output/change_log.xlsx` (cumulative, appends new date columns with margins)
- Auto-pushed to `main` after every run

## Tool Command
```bash
python tools/update_costing_file.py <base_excel> \
  --pallet-dri <value> --pig-iron <value> --scrap-raipur <value> \
  --silico-mn <value_in_kg> --iron-ore-dri <value> \
  --report-date YYYY-MM-DD --billet-raipur <value> --tmt-raipur <value> \
  --scrap-mandi <raw_value> --billet-mandi <raw_value> --tmt-ncr <value>
```
