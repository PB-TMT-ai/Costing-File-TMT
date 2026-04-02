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

The script automatically runs `tools/clean_pptx.py` as a post-processor to fix pptxgenjs orphaned XML references. No manual step needed.

## Slide Structure (5 slides)

| Slide | Title | Chart Type | Data |
|-------|-------|-----------|------|
| 1 | Title | — | Period info, monthly data point count |
| 2 | Scrap (Raipur & NCR) | Grouped bar | Absolute scrap prices, dual market |
| 3 | Raw Materials — Raipur | Multi-line | P-DRI, Pig Iron, Iron Ore DRI (INR/MT) + Silico Mn (scaled ×400, legend shows INR/kg) |
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

### 3. Delta Annotations in X-Axis Labels
- Month-on-month changes are shown **embedded in the X-axis category labels** below each bar group
- Format: `Jan'25\nR:+500 | N:-200` (Raipur and NCR deltas on second line)
- First data point has no delta (no prior month to compare)
- This approach avoids overlay text boxes that can cause PowerPoint repair errors

### 4. Combined Raw Materials Chart (Single Axis, Silico Mn Scaled)
- **All 4 materials as line charts** on a single Y-axis (INR/MT)
- P-DRI (blue), Pig Iron (red), Iron Ore DRI (grey), Silico Manganese (orange)
- **Silico Mn is scaled ×400** to align visually with INR/MT values (65 INR/kg × 400 = 26,000)
- Legend shows "Silico Manganese (INR/kg)" — the scaling is transparent to the viewer
- Line chart with markers for all 4 series; legend at bottom
- Note: pptxgenjs combo chart (bars + line with dual Y-axis) has XML bugs causing PowerPoint repair errors, so all-lines with scaling is used instead

### 5. Margin Charts
- Both Raipur and NCR shown together on the same chart (grouped bars)
- Values are **absolute margins** (can be negative)
- X-axis labels include delta annotations for both markets

## Integration with Costing Updates

After running `tools/update_costing_file.py`, always regenerate the PPT:
```bash
node tools/create_material_change_graph.js
git add output/material_change_graphs.pptx
git commit -m "Update material change graphs"
git push origin main
```

## Post-Processing (Automatic)
The script calls `tools/clean_pptx.py` after generation to:
- Strip orphaned `[Content_Types].xml` entries (pptxgenjs registers slideMaster2-5 but doesn't create them)
- This prevents the "found a problem with content" repair prompt in PowerPoint

## Dependencies
- Node.js with `pptxgenjs` and `xlsx` packages (installed via `npm install`)
- Python 3 (for `tools/clean_pptx.py` post-processor)
- JSW logo at `.claude/skills/jsw-one-pptx/assets/JSW_Logo_Clean.png`

## Styling (JSW One Brand)
- Blue: `#213366`, Red: `#EA2127`, Grey: `#7F7F7F`
- Font: Calibri
- Layout: Widescreen 16:9
- Blue/Red divider bar on each slide
- Logo in top right corner

## Lessons Learned
- pptxgenjs combo chart API (BAR + LINE with secondaryValAxis) generates malformed XML with missing `<c:valAx>` definitions — avoid it
- pptxgenjs registers orphaned Content_Types for non-existent slideMasters — must post-process with `clean_pptx.py`
- Overlay text boxes (delta colour boxes positioned over chart area) cause PowerPoint repair errors — use X-axis labels instead
- Silico Mn (65-81 INR/kg) is invisible when plotted alongside INR/MT values (22k-38k) — scale ×400 to align visually
