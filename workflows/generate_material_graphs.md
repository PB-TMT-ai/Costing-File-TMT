# Workflow: Generate Material Change Graphs PPT

## Objective
Generate a branded PowerPoint with monthly raw material price and margin charts from the costing change log. This should be run **after every costing file update** to keep the PPT in sync.

## When to Run
- After every `/update-costing` run
- After batch processing historical PDFs
- After any change to `output/change_log.xlsx`

## Command
```bash
node tools/create_material_change_graph.js
```

Input: `output/change_log.xlsx` (default)
Output: `output/material_change_graphs.pptx` (overwrites existing)

## Slide Structure (5 slides)

| Slide | Title | Chart Type | Data |
|-------|-------|-----------|------|
| 1 | Title | — | Period info, data point count |
| 2 | Scrap (Raipur & NCR) | Grouped bar | Absolute scrap prices, dual market |
| 3 | Raw Materials — Raipur | Combo (bars + line) | P-DRI, Pig Iron, Iron Ore DRI (bars, INR/MT left axis) + Silico Mn (line, INR/kg right axis) |
| 4 | Nett Margin Billet (Raipur & NCR) | Grouped bar | Absolute billet margins, dual market |
| 5 | Margin TMT (Raipur & NCR) | Grouped bar | Absolute TMT margins, dual market |

## Key Rules

### 1. Monthly Data Points Only
- If multiple dates exist within the same month (e.g., Jan 15 and Jan 30), only the **last date** of the month is plotted
- X-axis labels show month abbreviation: "Jan'25", "Feb'25", etc.
- This is automatically handled by `filterLastPerMonth()` in the script

### 2. Absolute Values (Not Changes)
- All charts display **absolute prices/margins** (not month-on-month deltas)
- The Y-axis shows the actual value (e.g., 34,000 INR/MT)

### 3. Delta Colour Boxes
- Month-on-month changes are shown as small **coloured text boxes** above (positive) or below (negative) each bar
- Box colour matches the series colour:
  - Raipur = JSW Blue (`#213366`)
  - NCR = Grey (`#7F7F7F`)
- Format: "+500" or "-200" in white text on coloured background
- First data point has no delta box (no prior month to compare)

### 4. Combined Raw Materials Chart (Dual Y-Axis)
- **Left Y-axis (INR/MT)**: Pallet DRI (blue bars), Pig Iron (red bars), Iron Ore DRI (grey bars)
- **Right Y-axis (INR/kg)**: Silico Manganese (orange line with markers)
- Uses pptxgenjs combo chart API with `secondaryValAxis: true`
- Legend at bottom shows all 4 series

### 5. Margin Charts
- Both Raipur and NCR shown together on the same chart (grouped bars)
- Values are **absolute margins** (can be negative)
- Delta boxes show period-on-period change in margin

## Integration with Costing Updates

After running `tools/update_costing_file.py`, always regenerate the PPT:
```bash
node tools/create_material_change_graph.js
git add output/material_change_graphs.pptx
git commit -m "Update material change graphs"
git push origin main
```

## Dependencies
- Node.js with `pptxgenjs` and `xlsx` packages (installed via `npm install`)
- JSW logo at `.claude/skills/jsw-one-pptx/assets/JSW_Logo_Clean.png`

## Styling (JSW One Brand)
- Blue: `#213366`, Red: `#EA2127`, Grey: `#7F7F7F`
- Font: Calibri
- Layout: Widescreen 16:9
- Blue/Red divider bar on each slide
- Logo in top right corner
