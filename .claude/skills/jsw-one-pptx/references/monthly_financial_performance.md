# Monthly Financial & Profitability Report — Deck Construction Guide

**Read this file when the user asks for a monthly financial performance, profitability report, or monthly P&L review deck.**

---

## Context

- **Audience:** CEO, CFO, BU heads, Finance team (senior leadership, 6-10 people)
- **Cadence:** Monthly, presented at T+5 to T+10 after month close
- **Flow:** Key insights → Executive summary → Topline analysis → Financial profitability → JODL profitability → Balance sheet / Cash flow / Other metrics
- **Density:** Very high. This is the most data-dense recurring deck. Tables dominate. Commentary boxes are brief and specific.
- **Title style:** Topic titles throughout. Insight titles only for Key Insights (slide 2) and Executive Summary (slide 3).
- **Typical slide count:** 45-50 slides (including title, section dividers, thank you, assumptions)
- **Currency:** All figures in INR Cr unless explicitly stated otherwise. Per-ton figures in INR/MT.
- **Entity scope:** JOPL + JODL consolidated (primary), JOFL included where specified, entity-wise breakouts in dedicated slides.

---

## Data to request from user

Before building, ask for:
1. **Month and FY** (e.g., "Feb'26" or "February FY26")
2. **P&L data file** — monthly actuals by entity (JOPL, JODL, JOFL) and BU (MFG, Construction, PB/TMT, Homes)
3. **Volume and GMV data** — monthly actuals by BU, sub-segment, credit type
4. **AOP targets** — monthly BOD targets for all line items
5. **Previous month's deck** — if refreshing, upload last month's version
6. **Balance sheet and cash flow data** — as-on-date figures
7. **Working capital and receivable ageing data**
8. **T1S profitability data** — state-wise margin breakdown
9. **Order-level GM cohort data** — if available
10. **Any specific commentary** — one-off events, new customer highlights, risk items

---

## Monthly trend table standard (17-column format)

Most slides in this deck use a **17-column monthly trend table**. This is the standard format:

```
| Metric label | Apr'XX | May'XX | Jun'XX | Jul'XX | Aug'XX | Sep'XX | Oct'XX | Nov'XX | Dec'XX | Jan'YY | Feb'YY | MoM % | Feb Ach% | YTD FY'XX | YTD Ach% | YTD YoY % |
```

**Column widths for 17-col table (must sum ≤ 12.33"):**
```javascript
const COLS_17 = [1.70, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.50, 0.55, 0.70, 0.55, 0.65];
// Total: 10.20" — leaves room for the metric label column
// Adjust label col: 2.13" to fill GRID.W
const COLS_17_FULL = [2.13, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.50, 0.55, 0.70, 0.55, 0.65];
// Total: 12.33"
```

**Font size for 17-col tables: 11pt** (this is the dense-table exception per Section 2.2). Row height: 0.22" for data rows, 0.25" for header row.

**Header formatting:** Blue fill (213366), white text, bold, center-aligned. First column (metric label) left-aligned.

**Data formatting rules:**
- Percentage columns (MoM %, Ach%, YoY %): Show with % sign, center-aligned
- Negative MoM/YoY: grey font (7F7F7F) — do NOT use red
- Positive MoM/YoY: blue font (213366) — only when explicitly highlighting, else black
- Total/summary rows: bold, light grey fill (F2F2F2)
- Sub-segment rows: indent with 2 spaces in the label

---

## P&L table standard (11-column format)

Financial profitability slides use an **11-column P&L table**:

```
| Particulars | Prev Yr Actual | Current Yr Actual | YoY | Prev Month Actual | Current Month Actual | MoM | Ach(%) | YTD BOD Target | YTD Actual | YTD Ach(%) |
```

**Column widths for 11-col P&L table:**
```javascript
const COLS_PL = [2.50, 0.85, 0.85, 0.65, 0.85, 0.85, 0.65, 0.65, 0.95, 0.85, 0.68];
// Total: 10.33" — label col can be widened to fill GRID.W
const COLS_PL_FULL = [2.50, 0.90, 0.90, 0.68, 0.90, 0.90, 0.68, 0.68, 0.98, 0.90, 0.71];
// Total: 10.73" — remaining 1.60" absorb into label col: 4.10"
```

Adjust as needed. Key: first column (Particulars) needs enough width for indented line items. All number columns center-aligned.

**Row count is high (28-32 rows).** Row height: 0.15" to fit ~30 rows in 4.5" of vertical space. Font: 11pt.

**Special formatting:**
- Line items below EBITDA: use grey font (7F7F7F) to visually de-emphasize
- Negative EBITDA: bold, no special fill (this deck does not use colored fills for negative values)
- "Employee Benefits Expenses (Direct) *" footnote: gold/yellow text (FDC000) in footer — replicate using footnote text at 10pt

---

## RGM (Revenue Gross Margin) waterfall view — pptxgenjs construction

Several slides show "RGM View" waterfalls that were OLE-embedded Google Sheets charts in the original. Rebuild these using **stacked shapes** in pptxgenjs.

**RGM waterfall layout:**
The RGM view shows a vertical cascade: NMV → Trade margin → Net revenue → COGS → Gross margin → Variable costs → CM1 → Fixed costs → Op EBITDA, with per-ton values and % of NMV.

**Construction approach — use a table with color-coded cells instead of a true waterfall chart:**

```javascript
// RGM waterfall as a styled table (more reliable than shape-based waterfall)
function addRGMTable(slide, x, y, w, data, title) {
  // Title above
  slide.addText(title, {
    x: x, y: y, w: w, h: 0.24,
    fontSize: 10, fontFace: 'Calibri', color: '2F5496',
    bold: true, align: 'left', valign: 'middle'
  });
  
  const rows = [
    // [Line item, INR/MT, % of NMV]
    ['NMV', data.nmv_per_ton, '100.0%'],
    ['(-) Trade Margin', data.trade_margin, data.trade_margin_pct],
    ['Net Revenue', data.net_revenue, data.net_revenue_pct],
    ['(-) COGS', data.cogs, data.cogs_pct],
    ['Gross Margin', data.gm, data.gm_pct],
    ['(-) Variable Cost', data.var_cost, data.var_cost_pct],
    ['CM1', data.cm1, data.cm1_pct],
    ['(-) Fixed Cost', data.fixed_cost, data.fixed_cost_pct],
    ['Op. EBITDA', data.ebitda, data.ebitda_pct],
  ];
  
  const tableRows = rows.map((r, i) => {
    const isTotal = [2, 4, 6, 8].includes(i); // Net Rev, GM, CM1, EBITDA
    const isSub = [1, 3, 5, 7].includes(i);   // Deductions
    return [
      { text: r[0], options: { bold: isTotal, color: isSub ? '7F7F7F' : '000000', fontSize: 9, align: 'left' } },
      { text: String(r[1]), options: { bold: isTotal, fontSize: 9, align: 'right' } },
      { text: r[2], options: { bold: isTotal, fontSize: 9, align: 'right', color: '7F7F7F' } },
    ];
  });
  
  slide.addTable(
    [
      [
        { text: '', options: { fill: '213366', color: 'FFFFFF', bold: true, fontSize: 9 } },
        { text: 'INR/MT', options: { fill: '213366', color: 'FFFFFF', bold: true, fontSize: 9, align: 'right' } },
        { text: '% NMV', options: { fill: '213366', color: 'FFFFFF', bold: true, fontSize: 9, align: 'right' } },
      ],
      ...tableRows
    ],
    { x: x, y: y + 0.28, w: w, colW: [w * 0.50, w * 0.28, w * 0.22], rowH: 0.19, border: { color: 'CCCCCC', pt: 0.5 } }
  );
}
```

**For 3-period RGM comparison (Jan'26 | Feb'26 | YTD FY'26):**
Place 3 RGM tables side by side:
- Left panel: Previous month (x: 0.50, w: 3.60)
- Center panel: Current month (x: 4.20, w: 1.85)
- Right panel: YTD (x: 6.15, w: 1.85)
- Commentary box on far right (x: 8.10, w: 4.73)

This matches the original deck layout with narrower center/right panels showing only the per-ton and % columns (no line item labels needed — they align with the left panel).

---

## EBITDA bridge — pptxgenjs construction

Slide 18 in the reference deck shows waterfall/bridge charts for Operating EBITDA. The original uses ~60 manually placed shapes. Rebuild using a **shape-based waterfall function:**

```javascript
function addEBITDABridge(slide, x, y, w, h, data, title) {
  // data = [{ label, value, isTotal }]
  // isTotal: true for starting/ending bars (blue fill), false for delta bars
  
  slide.addText(title, {
    x: x, y: y - 0.25, w: w, h: 0.20,
    fontSize: 9, fontFace: 'Calibri', color: '17489E',
    bold: true, align: 'left', valign: 'middle'
  });
  
  const barCount = data.length;
  const barW = (w - (barCount - 1) * 0.08) / barCount; // bar width with gaps
  const gap = 0.08;
  
  // Find scale
  const allVals = data.map(d => Math.abs(d.value));
  const maxVal = Math.max(...allVals);
  const chartH = h * 0.55; // vertical space for bars
  const baselineY = y + h * 0.65; // baseline position
  
  let runningTotal = 0;
  
  data.forEach((d, i) => {
    const barX = x + i * (barW + gap);
    
    if (d.isTotal) {
      // Total bar: from baseline to value height
      const barH = (Math.abs(d.value) / maxVal) * chartH;
      const barY = baselineY - barH;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: barX, y: barY, w: barW, h: barH,
        fill: { color: '213366' }, line: { width: 0, color: 'FFFFFF' }
      });
      runningTotal = d.value;
    } else {
      // Delta bar: floating from running total
      const prevTotal = runningTotal;
      runningTotal += d.value;
      const barH = (Math.abs(d.value) / maxVal) * chartH;
      const barY = d.value >= 0
        ? baselineY - (runningTotal / maxVal) * chartH
        : baselineY - (prevTotal / maxVal) * chartH;
      
      const fillColor = d.value >= 0 ? '213366' : '7F7F7F'; // blue positive, grey negative
      slide.addShape(pres.shapes.RECTANGLE, {
        x: barX, y: barY, w: barW, h: barH,
        fill: { color: fillColor }, line: { width: 0, color: 'FFFFFF' }
      });
    }
    
    // Value label above bar
    const prefix = (!d.isTotal && d.value >= 0) ? '+' : '';
    const valColor = d.isTotal ? '243B6E' : (d.value >= 0 ? '213366' : 'D91920');
    slide.addText(prefix + d.value.toFixed(1), {
      x: barX - 0.05, y: y + 0.02, w: barW + 0.10, h: 0.22,
      fontSize: 10, fontFace: 'Calibri', color: valColor,
      bold: true, align: 'center', valign: 'middle'
    });
    
    // Label below baseline
    slide.addText(d.label, {
      x: barX - 0.05, y: baselineY + 0.05, w: barW + 0.10, h: 0.40,
      fontSize: 9, fontFace: 'Calibri', color: '374151',
      align: 'center', valign: 'top', wrap: true
    });
  });
  
  // Baseline connector
  slide.addShape(pres.shapes.LINE, {
    x: x, y: baselineY, w: w, h: 0,
    line: { color: 'CCCCCC', width: 0.5 }
  });
}
```

**Legend for bridge charts:**
```javascript
// Add below the bridge area
// Blue square = Total, Blue square = Impact (+), Grey square = Impact (-)
```

The original slide has 4 bridge charts on one slide (2×2 grid):
- Top-left: MoM bridge (Jan'26 → Feb'26)
- Top-right: AOP achievement bridge (AOP Feb'26 → Actual Feb'26)
- Bottom-left: YoY bridge (YTD Feb'25 → YTD Feb'26)
- Bottom-right: AOP YTD bridge (AOP YTD → Actual YTD)

Each bridge has 8 bars: Starting EBITDA → MFG CM1 → Const CM1 → PB CM1 → Homes CM1 → Employee Cost → Branding Cost → Other Costs → Ending EBITDA.

---

## Slide-by-slide construction spec

### SECTION 0: FRONT MATTER (Slides 1–3)

---

#### Slide 1: Title slide

- **Layout:** Title (Layout A)
- **Title:** "Financial & Profitability report"
- **Subtitle:** "[Mon]'[YY]" (e.g., "Feb'26")
- **Logo:** Title slide position (x: 10.30, y: 2.10, w: 2.40, h: 0.79)
- **Divider:** y: 2.95
- **Page number:** 1

**Note:** The original has a JSW ONE image centered on the slide. If the user provides a hero image, place it at (x: 3.00, y: 1.20, w: 3.50, h: 1.40) above the title. If not, use standard Layout A.

---

#### Slide 2: Key insights ([Month]'[YY])

- **Layout:** Content (Layout C)
- **Title:** "Key insights ([Mon]'[YY])"
- **Content:** Single large text box filling the content area

**Text box spec:**
- Position: x: 0.50, y: 0.95, w: 12.33, h: 5.50
- Font: 12pt body. Section headers (e.g., "MFG- Ent:", "Construction:") in bold.
- Alignment: left, top
- Line spacing: 1.15

**Content structure — organized by BU:**
Each BU gets a bold header followed by 2-4 bullet observations. The observations are data-specific, not generic. Every bullet must contain at least one number.

```
MFG- Ent:
• [Observation with data point]
• [Observation with data point]

MFG- SMB:
• [Observation with data point]

Construction:
• [Observation with data point]

Private Brands:
• [Observation with data point]

Homes:
• [Observation with data point]

Credit / Working Capital:
• [Observation with data point]
```

**Data source:** User-provided commentary or extracted from P&L and volume data.

---

#### Slide 3: Executive summary

- **Layout:** Content (Layout C)
- **Title:** "Executive summary"
- **Content:** 4-quadrant layout with blue section banner + 4 rounded-rectangle boxes

**Banner bar:**
- Full-width blue rectangle: x: 0.50, y: 0.87, w: 12.33, h: 0.31
- Fill: 213366, text: "[Mon]'[YY] Key performance highlights" in 12pt bold white
- This sits between the slide heading and the content quadrants

**Quadrant layout (2×2):**

| Quadrant | Label | Position | Size |
|----------|-------|----------|------|
| Top-left | Topline | x: 0.50, y: 1.35 | w: 5.90, h: 1.73 |
| Top-right | Profitability | x: 6.70, y: 1.34 | w: 5.90, h: 1.78 |
| Bottom-left | Business highlights | x: 0.50, y: 3.34 | w: 5.90, h: 1.50 |
| Bottom-right | Other key updates | x: 6.70, y: 3.35 | w: 5.90, h: 1.50 |

**Each quadrant:**
1. Rounded rectangle border (no fill or light F2F2F2 fill, border CCCCCC, 0.5pt)
2. Section label positioned slightly above the box: blue text (18489D), 10.5pt bold, centered horizontally on the box
3. Content text inside the box: 12pt body, left-aligned, top-aligned, with 0.10" internal margin

**Quadrant content mapping:**

| Quadrant | What to include | Format |
|----------|----------------|--------|
| Topline | GMV, Revenue, Volume (Steel + Cement) — each line: metric name, value, then (AOP: X%, YTD AOP: Y%, MoM: Z%, YTD YoY: W%) | Bullet list, 12pt. If tight, 11pt. |
| Profitability | Gross Margin, CM1, Op EBITDA — same format as topline | Bullet list |
| Business highlights | BU-wise GMV achievement MoM, total volume, credit GMV | Short bullets with numbers |
| Other key updates | Employee count, cash balance, customer count, new initiatives | Short bullets |

**Footnotes:**
- Position: x: 0.50, y: 4.95, w: 12.33, h: 0.60
- Font: 7.5pt, color: 000000
- Content: Asterisks and definitions (e.g., "*Operating EBITDA excludes ESOP", "1P Credit – LC, BG, Trade AR", "3P Credit – CF, Factoring, SBC")

---

### SECTION 1: TOPLINE ANALYSIS (Slides 4–14)

---

#### Slide 4: Section divider — "1. Topline analysis"

- **Layout:** Section Divider (Layout D)
- **Title:** "1. Topline analysis"
- **Font:** 28pt bold, color: 2F5496
- **Position:** Centered vertically on slide (y: 2.29)
- **Page number:** 4

---

#### Slide 5: GMV — target vs achievement

- **Layout:** Content (Layout C)
- **Title:** "GMV — target vs achievement"
- **Subtitle text:** "All figures in INR Cr" at (x: 0.50, y: 0.69, w: 2.50, h: 0.27) in 10pt grey

**Content: Two side-by-side chart areas**

**Left area — "Month on month GMV" (x: 0.50, y: 1.03, w: 8.00)**
In the original, this is a linked Google Sheets chart showing monthly GMV bars. Rebuild as a **stacked/grouped column chart:**

```javascript
// Monthly GMV chart — grouped columns (AOP target vs Actual)
const monthlyGMVData = [
  { name: 'Actual', labels: months, values: actualGMV },    // blue
  { name: 'AOP Target', labels: months, values: targetGMV }, // grey
];

slide.addChart(pres.charts.BAR, monthlyGMVData, {
  x: 0.50, y: 1.03, w: 8.00, h: 4.24,
  barDir: 'col',
  chartColors: ['213366', '7F7F7F'],
  catAxisLabelFontSize: 9, catAxisLabelColor: '7F7F7F',
  valAxisHidden: true, valGridLine: { style: 'none' },
  showValue: true, dataLabelPosition: 'outEnd',
  dataLabelFontSize: 9, dataLabelFontBold: true, dataLabelColor: '000000',
  showLegend: true, legendPos: 'b', legendFontSize: 9,
  showTitle: false
});
```

**Right area — "YTD GMV" (x: 8.60, y: 1.03, w: 3.73)**
Single bar or pair showing YTD actual vs YTD AOP:

```javascript
slide.addChart(pres.charts.BAR, ytdData, {
  x: 8.60, y: 1.03, w: 3.73, h: 4.24,
  barDir: 'col',
  chartColors: ['213366', '7F7F7F'],
  // ... same styling
});
```

**Achievement badges** (oval shapes overlaid on chart):
- "Ach%" badge: oval at (x: 8.33, y: 5.31), 0.80 × 0.30, 8pt bold text
- "YoY Growth" badge: oval at (x: 9.18, y: 5.30), 0.80 × 0.30, 8pt bold text
- These show the YTD achievement % and YoY growth % as callouts

**Alternative approach if chart rendering is inconsistent:**
Use a table with conditional bar visualization (colored cell fills proportional to value). This is more reliable for dense monthly data.

---

#### Slide 6: BU — target vs achievement trends

- **Layout:** Content (Layout C)
- **Title:** "BU — target vs achievement trends"
- **Content:** 3 stacked tables + 1 commentary box

**Table 1 — Volume by BU (top):**
- Position: x: 0.50, y: 0.72, w: 12.33
- Format: 17-column monthly trend
- Rows (6): Manufacturing, Const-Steel, Private Brands, Homes, Cement, **Total**
- Columns: See monthly trend table standard
- Row height: 0.21"

**Table 2 — Volume by entity (middle):**
- Position: x: 0.50, y: 2.04, w: 12.33
- Rows (7): Total Steel, JOPL, JODL OE, JIT + Non JSW, T1S Total, PB, Cement
- This table shows entity-level breakout. Total row: bold + F2F2F2 fill.

**Table 3 — GMV by BU (below):**
- Position: x: 0.50, y: 3.52, w: 12.33
- Rows (7): Manufacturing, Const-Steel, Private Brands, Homes, Cement, Total, Credit GMV
- Same 17-column format but with INR Cr values

**Commentary box (bottom):**
- Position: x: 0.50, y: 5.03, w: 12.33, h: 0.60
- Style: Rounded rectangle with F2F2F2 fill, border CCCCCC
- Font: 10pt bold, black
- Content: Specific MoM commentary — e.g., "Manufacturing: GMV increased by 67 Cr MoM, 78 Cr due to rate increase and -10 Cr due to lower volume."

**Formatting notes:**
- All 3 tables use 11pt font (dense table exception)
- Highlight cells for sub-segments using colored rounded-rectangle overlays where the original uses colored backgrounds (e.g., "Enterprise" vs "SMB" grouping)
- MoM % column: ▲ blue if positive, ▼ grey if negative (value + arrow colored)

---

#### Slide 7: BU — rate (excluding GST) trends

- **Layout:** Content (Layout C)
- **Title:** "BU — rate (excluding GST) trends"
- **Content:** 2 tables + 1 commentary box

**Table 1 — Rate by BU (top):**
- Position: x: 0.50, y: 0.83, w: 12.33
- 17-column format (but columns adjusted for rate data):
  ```
  | Rate (excl GST) | Apr'XX | ... | Feb'YY | YTD Feb'YY | MoM % | YTD Feb prev yr | YTD YoY (± MT) | AOP FY'XX |
  ```
- Rows (6): Manufacturing, Const-Steel, Private Brands, Total Steel, Cement, Blended
- Row height: 0.25"
- Values: Integer format (e.g., "59,849" not "59849.00")

**Table 2 — Rate by product type (below):**
- Position: x: 0.50, y: 2.44, w: 12.33
- 14-column format (drops AOP-related columns)
- Rows (14): Total Steel, HR, CR, HRPO, Galvanised, Galvalume, Color Coated, WR, TMT Rebar, TMT (PB), Structurals, SS Tubes, Others, Blended
- This is the detailed product-level rate table

**Commentary box:**
- Position: x: 0.50, y: 4.99, w: 12.33, h: 0.55
- Same styling as Slide 6 commentary

**Rate-specific formatting:**
- All rate values in INR/MT (integer, comma-separated)
- MoM % positive: show blue font
- YoY delta shown as absolute ±INR/MT, not percentage

---

#### Slide 8: Manufacturing — top line performance (1/3: Volume + GMV)

- **Layout:** Content (Layout C)
- **Title:** "Manufacturing — top line performance"
- **Content:** 1 large table (15 rows × 17 cols) + commentary box

**Table — Volume by sub-segment:**
- Position: x: 0.50, y: 0.74, w: 12.33
- 17-column monthly trend format
- Rows (15):
  ```
  Manufacturing (total)
    1. MFG-ENT
       JOPL
       JODL OE
       JIT + Non JSW
       T1S
    2. MFG-SMB
       FOS (Field operated sales)
       T1S - Retail
       IS (Inbound sales)
    3. Non Invoicing
  Total Steel (repeated from BU view for context)
  ```
- Indentation: Parent rows flush left, sub-segments indented with spaces
- Highlight overlays: Use rounded-rectangle shapes at (x: 5.97, y: 1.74, w: 1.62, h: 0.20) in light blue fill to highlight the Enterprise vs SMB grouping boundary — match original

**Commentary box:**
- Position: x: 0.50, y: 3.84, w: 12.33, h: 1.69
- Font: 10pt bold, black
- Content: Detailed BU commentary organized as:
  - MFG-ENT: [specific customer/volume movements]
  - MFG-SMB: [specific movements]
  - Key wins: [new customer onboarding, specific account growth]

---

#### Slide 9: Manufacturing — top line performance (2/3: Entity mix + Credit)

- **Layout:** Content (Layout C)
- **Title:** "Manufacturing — top line performance"
- **Content:** 2 tables + commentary box

**Table 1 — Volume by entity and mix (top):**
- Position: x: 0.50, y: 0.72, w: 12.33
- 15-column format (drops Ach% and YTD Ach% from standard 17-col):
  ```
  | Volume ('000 MT) | Apr'XX | ... | Feb'YY | MoM % | YTD FY'XX | YTD mix |
  ```
- Rows (12): Manufacturing total, MFG-ENT (JOPL, JODL OE, JIT+Non JSW, T1S), MFG-SMB (FOS, T1S-Retail, IS), Non Invoicing
- **YTD mix column:** Shows each sub-segment's percentage of total MFG volume. Format: "X.X%"

**Table 2 — Credit GMV by entity (bottom):**
- Position: x: 0.50, y: 3.09, w: 12.33
- 15-column format:
  ```
  | Credit GMV INR Cr | Apr'XX | ... | Feb'YY | MoM % | YTD FY'XX | YTD Ach% |
  ```
- Rows (10): MFG (Credit) total, MFG-ENT, Trade AR, LC, CF, SBC, MFG-SMB, Trade AR, LC, CF
- This shows credit instrument breakout

**Commentary box:**
- Position: x: 0.50, y: 5.11, w: 12.33, h: 0.52
- Content: Credit-specific insight — e.g., "MFG-ENT: 75 Cr (~60%) Trade AR sales through IFC with ~14 days average credit period."

**Highlight overlays:** Same as Slide 8 — colored rounded rectangles to demarcate Enterprise vs SMB sections

---

#### Slide 10: Manufacturing — top line performance (3/3: Product mix)

- **Layout:** Content (Layout C)
- **Title:** "Manufacturing — top line performance"
- **Content:** 1 large table (13 rows × 15 cols) + commentary box

**Table — Volume by product type:**
- Position: x: 0.50, y: 0.74, w: 12.33
- 15-column format (same as Slide 9)
- Rows (13):
  ```
  Manufacturing (total)
    HR
    CR
    HRPO
    Galvanised
    Galvalume
    Color Coated
    WR
    TMT Rebar
    Structurals
    SS Tubes
    Others
  Coated Steel subtotal (highlighted)
  ```
- **Highlight row:** "Coated Steel" subtotal with a rounded-rectangle overlay to draw attention

**Commentary box:**
- Position: x: 0.50, y: 4.55, w: 12.33, h: 0.96
- Content: Product mix insight — e.g., "MoM Coated Steel volumes grew by ~14% (~7K MT), driven by Enterprise (5K MT) and SMB (2K MT)"

---

#### Slide 11: Construction — top line performance (1/2: Volume + Credit)

- **Layout:** Content (Layout C)
- **Title:** "Construction — top line performance"
- **Content:** 2 tables + commentary box

**Table 1 — Volume by entity (top):**
- Position: x: 0.50, y: 0.74, w: 12.33
- 17-column monthly trend
- Rows (7):
  ```
  Construction (Steel) total
    JOPL
    JODL OE
    JIT + Non JSW
    Non-Invoicing
    T1S
  ```

**Table 2 — Credit GMV (middle):**
- Position: x: 0.50, y: 2.73, w: 12.33
- 15-column format
- Rows (6):
  ```
  Construction (Credit) total
    CF + CF Shared
    Trade AR
    LC
    SBC
  ```

**Commentary box:**
- Position: x: 0.50, y: 4.30, w: 12.33, h: 1.26
- Content: Customer churn/acquisition data — e.g., "77 customers (~4K MT in Jan'26) did not transact in Feb'26, whereas 20 new customers onboarded"

**Highlight overlays:** Entity grouping boundary markers

---

#### Slide 12: Construction — top line performance (2/2: Zone + Product)

- **Layout:** Content (Layout C)
- **Title:** "Construction — top line performance"
- **Content:** 2 tables + commentary box

**Table 1 — Volume by zone (top):**
- Position: x: 0.50, y: 0.74, w: 12.33
- 14-column format (no Ach%/YTD Ach%)
- Rows (6):
  ```
  Const. (Steel) total
    West
    South
    North
    East
  ```

**Table 2 — Volume by product type (middle):**
- Position: x: 0.50, y: 2.30, w: 12.33
- 14-column format
- Rows (9):
  ```
  Const. (Steel) total
    TMT
    HR
    CR
    WR
    Structurals
    Galvanised
    Others
  ```

**Commentary box:**
- Position: x: 0.50, y: 4.70, w: 12.33, h: 0.80
- Content: Zone-specific commentary — e.g., "South Zone sales declined by ~2.7K MT due to lower purchase by [Customer]"

**Zone highlight overlay:** Rounded rectangle at (x: 7.15, y: 1.46) to call out zone performance — match original

---

#### Slide 13: Private Brands — top line performance

- **Layout:** Content (Layout C)
- **Title:** "Private Brands — top line performance"
- **Content:** 2 tables + commentary box

**Table 1 — Volume by channel (top):**
- Position: x: 0.50, y: 0.76, w: 12.33
- 14-column format
- Rows (4):
  ```
  PB. (Steel) total
    Retail
    Projects
    Institutional
  ```

**Table 2 — Volume by zone (below):**
- Position: x: 0.50, y: 2.01, w: 12.33
- 14-column format
- Rows (6):
  ```
  PB. (Steel) total
    West
    South
    North
    East
    Central
  ```

**Commentary box:**
- Position: x: 0.50, y: 3.54, w: 12.33, h: 0.80
- Content: PB-specific — e.g., dealer additions, regional performance drivers

---

#### Slide 14: # of transacted customers

- **Layout:** Content (Layout C)
- **Title:** "# of transacted customers"
- **Content:** Stacked column chart (top) + detail table (bottom)

**Chart — Monthly transacted customer count:**
- Position: x: 0.50, y: 1.03, w: 12.33, h: 1.38
- Type: Stacked column (COLUMN_STACKED)
- Series: Manufacturing, Construction, PB, Homes (stacked)
- Colors: 213366 (MFG), 7F7F7F (Const), B0B0B0 (PB), CCCCCC (Homes)
- X-axis: months (Apr'XX through Feb'YY)
- Data labels: total on top of each stack, white inside segments if readable

```javascript
slide.addChart(pres.charts.BAR, customerData, {
  x: 0.50, y: 1.03, w: 12.33, h: 1.38,
  barDir: 'col',
  barGrouping: 'stacked',
  chartColors: ['213366', '7F7F7F', 'B0B0B0', 'CCCCCC'],
  valAxisHidden: true, valGridLine: { style: 'none' },
  catAxisLabelFontSize: 9, catAxisLabelColor: '7F7F7F',
  showValue: false, // Too cramped for data labels in stacked bars at this height
  showLegend: true, legendPos: 'b', legendFontSize: 9,
  showTitle: false
});
```

**Sub-heading:**
- "# of Monthly Transacted Customer" at (x: 3.27, y: 0.69, w: 3.46, h: 0.34) in 14pt bold blue (0039AC)

**Table — Customer count by BU and sub-segment:**
- Position: x: 0.50, y: 2.60, w: 12.33
- 13-column format (Apr–Feb + YTD FY'XX):
  ```
  | Customer Count# | Apr'XX | ... | Feb'YY | YTD FY'XX |
  ```
- Rows (11):
  ```
  Manufacturing
    MFG-ENT
    MFG-SMB
  Construction
    Projects
    Retail
  Private Brands
    Retail
    Projects
    Institutional
  Total unique
  ```
- Row height: 0.25"
- YTD column: Unique customer count (not sum of monthly — this is a distinct count)

---

## Common mistakes in monthly financial decks (avoid these)

1. **Missing AOP comparison on topline slides.** Every volume and GMV table MUST show Ach% vs AOP. A number without AOP context is meaningless to the CFO.
2. **Inconsistent month range across tables.** All 17-column tables must show the same months (Apr through current). Do not truncate some tables to save space.
3. **Commentary box with generic text.** "Manufacturing performed well" is useless. "MFG GMV +67 Cr MoM: +78 Cr from rate increase, -10 Cr from lower volume" is useful.
4. **Mixing volume units.** Use '000 MT consistently. If one table says "251" (meaning 251K MT), all tables must use the same scale. Never mix MT and KMT.
5. **Rate table without GST clarification.** Always label "Rate (excl GST)" not just "Rate".
6. **Credit GMV shown without credit type breakout.** The CFO needs to see Trade AR vs LC vs CF vs SBC separately.
7. **Customer count shown as monthly total only.** Always include YTD unique count — monthly counts overstate due to repeat customers.
8. **P&L tables with misaligned indentation.** Sub-line-items must be visually indented (2 spaces in label text). Parent rows must be bold.
9. **EBITDA bridge with wrong sign convention.** Cost increases are NEGATIVE impact on EBITDA. Revenue/margin increases are POSITIVE. Do not reverse.
10. **RGM waterfall without % of NMV column.** Absolute per-ton figures need context. Always show the % of NMV alongside.
11. **Missing footnotes for ESOP exclusion.** Every P&L slide must note "*Operating EBITDA excludes ESOP" — this is a recurring audit point.
12. **Using ₹ or Rs. instead of INR.** Always "INR X Cr" or "INR X Lac". Never ₹, Rs., Rs.Mn.

---

## Quality checklist — Section 1 (Topline Analysis)

- [ ] Every table shows full Apr-to-current-month range (no truncation)
- [ ] ▲ blue / ▼ grey applied to MoM %, Ach%, YoY % columns (value AND arrow colored)
- [ ] Total/summary rows are bold with F2F2F2 fill
- [ ] Sub-segment rows indented with 2 spaces in label
- [ ] 17-column tables use 11pt font and 0.22" row height
- [ ] Column widths validated: sum ≤ GRID.W (12.33")
- [ ] Commentary boxes present on every data slide with specific, numbered observations
- [ ] Rate tables labeled "excl GST"
- [ ] Credit GMV broken out by instrument type (Trade AR, LC, CF, SBC)
- [ ] Customer chart uses stacked columns with correct BU color mapping
- [ ] Footnote "All figures in INR Cr" present where applicable
- [ ] No overlapping elements (cursorY tracking used)
- [ ] Section divider present before first topline slide

---

### SECTION 2: FINANCIAL PROFITABILITY (Slides 15–31)

---

#### Slide 15: Section divider — "2. Financial profitability"

- **Layout:** Section Divider (Layout D)
- **Title:** "2. Financial profitability"
- **Font:** 28pt bold, color: 2F5496
- **Position:** Centered vertically (y: 2.29)
- **Page number:** 15

---

#### Slide 16: P&L — Consolidated (JOPL+JODL)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated (JOPL+JODL)"
- **Content:** Summary headline + full P&L table + footnote

**Summary headline (above table):**
- Position: x: 0.50, y: 0.64, w: 12.33, h: 0.44
- Font: 10pt bold, black
- Content: 2-line summary — e.g.:
  ```
  Contribution Margin1 : INR 33.5 Cr (MoM +17%) at 1.9%, YTD CM1 % of NMV : AOP 1.8% vs Actual 1.5%.
  Operating EBITDA : INR +7.1 Cr (MoM : INR +3.0 Cr) at 0.4%, YTD Operating EBITDA : INR -69.2 Cr
  ```

**P&L table:**
- Position: x: 0.50, y: 1.04, w: 12.33
- Format: 11-column P&L standard (see P&L table standard section above)
- Column headers:
  ```
  | All figures in INR Cr | Prev Yr Actual | Current Yr Actual | YoY | Prev Month Actual | Current Month Actual | MoM | Ach(%) | YTD BOD Target | YTD Actual | YTD Ach(%) |
  ```
- Rows (~30):
  ```
  GMV
  NMV
  (-) Trade Margin
  Net Revenue from Operations
  (-) Cost of Goods Sold (COGS)
  Gross Margin
    Gross Margin %
  (-) Commission Expense
  (-) Credit Cost (net)
  (-) Logistics & Delivery Cost
  (-) Other Variable Costs
  Contribution Margin 1
    CM1 %
  (-) Employee Benefits (Direct) *
  Contribution Margin 2
    CM2 %
  (-) Employee Benefits (Indirect)
  (-) Branding & Marketing
  (-) Technology Cost
  (-) Other Admin Costs
  Total Fixed Costs
  Operating EBITDA
    Operating EBITDA %
  (-) ESOP Cost
  EBITDA (incl ESOP)
  (-) Depreciation
  (-) Finance Cost
  (-) Interest on LC/BG
  PBT
  ```
- Row height: 0.15" (to fit ~30 rows in 4.40" table height)
- Font: 11pt for all cells

**Formatting rules for P&L table:**
- **Header row:** Blue fill (213366), white bold text, center-aligned
- **First column (Particulars):** Left-aligned, 11pt. Parent items flush left, sub-items indented 2 spaces, deductions prefixed with "(-)"
- **Percentage rows (GM %, CM1 %, EBITDA %):** Grey font (7F7F7F), italic
- **Total rows (Gross Margin, CM1, CM2, Op EBITDA, PBT):** Bold, F2F2F2 fill
- **Negative values:** Show with minus sign, no parentheses. Do NOT use red — use standard black.
- **YoY and MoM columns:** Show as percentage (e.g., "65%", "2%"). Positive = no special color, negative = grey font.
- **Ach(%) column:** Show as percentage. ≥90% = blue font, <90% = grey font.
- **Alternating row fills:** Do NOT use for P&L tables (too many rows, gets visually noisy). White fill throughout, rely on bold/indent hierarchy.

**Footnote:**
- Position: x: 0.50, y: 5.38, w: 12.33, h: 0.27
- Font: 10pt, color: FDC000 (gold)
- Content: "Employee Benefits Expenses (Direct) * : is included under Employee Benefits Expenses"

---

#### Slide 17: P&L — Consolidated (JOPL+JODL) — per/ton

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated (JOPL+JODL) — per/ton"
- **Content:** 3-period RGM view (left + center + right panels) + commentary sidebar

**Layout: 4-panel horizontal split**

| Panel | Content | x | y | w | h |
|-------|---------|---|---|---|---|
| Left | Previous month RGM | 0.50 | 0.90 | 3.60 | Full depth |
| Center | Current month RGM | 4.20 | 0.90 | 1.85 | Full depth |
| Right | YTD FY RGM | 6.10 | 0.90 | 1.85 | Full depth |
| Far right | Commentary box | 8.05 | 0.83 | 4.78 | 4.54 |

**Column headers above panels:**
- "RGM View: [Prev Month]" at (x: 0.50, y: 0.66) — 10pt bold, color: 2F5496
- "RGM View: [Current Month]" at (x: 4.20, y: 0.66) — same styling
- "RGM View: YTD FY'[XX]" at (x: 6.10, y: 0.66) — same styling

**Left panel — Full RGM waterfall table (previous month):**
Use the `addRGMTable()` function from the standards section. This panel shows all 3 columns: Line item | INR/MT | % NMV.

The RGM waterfall is split into 2-3 vertical blocks:
- Block 1 (top): NMV → Trade Margin → Net Revenue → COGS → Gross Margin → Commission → Credit Cost → Logistics → Var Costs → CM1
- Block 2 (bottom): CM1 → Employee (Direct) → CM2 → Employee (Indirect) → Branding → Tech → Admin → Fixed Costs → Op EBITDA

Use a thin section rule between Block 1 and Block 2.

**Center and Right panels — Compact RGM (current month and YTD):**
These show only 2 columns: INR/MT | % NMV (no line item labels — they align visually with the left panel).

```javascript
// Compact RGM table for center/right panels
function addCompactRGM(slide, x, y, w, data) {
  const rows = data.map((r, i) => {
    const isTotal = r.isTotal;
    return [
      { text: String(r.perTon), options: { bold: isTotal, fontSize: 9, align: 'right' } },
      { text: r.pctNMV, options: { bold: isTotal, fontSize: 9, align: 'right', color: '7F7F7F' } },
    ];
  });
  slide.addTable(rows, {
    x: x, y: y, w: w,
    colW: [w * 0.55, w * 0.45],
    rowH: 0.19,
    border: { color: 'CCCCCC', pt: 0.5 }
  });
}
```

**Commentary sidebar (far right):**
- Rounded rectangle: fill F2F2F2, border CCCCCC
- Font: 10pt bold, black
- Content: Key RGM observations — e.g., trade AR impact, credit cost movements, specific customer margin stories

**Vertical separator:**
A thin vertical blue rectangle between left panel and center panel at (x: 4.15, y: 0.65, w: 0.02, h: 4.97) — visual separator matching the original deck.

**Highlight overlay:**
A rounded rectangle at approximately (x: 1.80, y: 1.51, w: 3.94, h: 0.20) to highlight the CM1 row across panels — match original.

---

#### Slide 18: Operating EBITDA bridge (JODL+JOPL)

- **Layout:** Content (Layout C)
- **Title:** "Operating EBITDA bridge (JODL+JOPL)"
- **Content:** 4 bridge charts in a 2×2 grid + legend

**Grid layout:**

| Bridge | Title | x | y | w | h |
|--------|-------|---|---|---|---|
| Top-left | MoM: [Prev Month] vs [Current Month] | 0.50 | 0.72 | 4.56 | 1.55 |
| Top-right | Achievement: AOP [Month] vs Actual [Month] | 5.50 | 0.72 | 4.56 | 1.55 |
| Bottom-left | YoY: YTD [Prev FY] vs YTD [Current FY] | 0.50 | 3.09 | 4.56 | 1.55 |
| Bottom-right | Achievement: AOP YTD vs Actual YTD | 5.50 | 3.07 | 4.56 | 1.55 |

**Each bridge title:**
- Rounded rectangle: fill F2F2F2 or light blue, 9pt bold text, color: 17489E
- Position: immediately above the bridge chart area

**Bridge bar data (8 bars each):**
```javascript
const bridgeData = [
  { label: '[Start] Op. EBITDA', value: startValue, isTotal: true },
  { label: 'MFG CM1', value: mfgDelta, isTotal: false },
  { label: 'Const CM1', value: constDelta, isTotal: false },
  { label: 'PB CM1', value: pbDelta, isTotal: false },
  { label: 'Homes CM1', value: homesDelta, isTotal: false },
  { label: 'Employee Cost', value: empDelta, isTotal: false },
  { label: 'Branding Cost', value: brandDelta, isTotal: false },
  { label: 'Other Costs', value: otherDelta, isTotal: false },
  { label: '[End] Op. EBITDA', value: endValue, isTotal: true },
];
```

Use the `addEBITDABridge()` function from the standards section for each of the 4 bridges.

**Color rules for bridge values:**
- Total bars (start/end): Blue fill (213366), value label in dark blue (243B6E)
- Positive delta: Blue fill (213366), value label with "+" prefix
- Negative delta: Grey fill (7F7F7F), value label in red (D91920) for cost items, grey for revenue misses
- **Note on sign convention:** The original deck uses D91920 (red) for some negative deltas in bridge labels. This is an exception to the "no red" rule — only in EBITDA bridges, only for value labels, and only when the delta is unfavorable.

**Baseline connector:** Thin grey line (CCCCCC, 0.5pt) across the bottom of each bridge

**Legend (bottom of slide):**
- Position: x: 0.50, y: 5.34
- 3 legend items: Blue square = "Total", Blue square = "Impact (+)", Grey square = "Impact (-)"
- Font: 8pt

**Bar labels below baseline:**
- Font: 10pt, color: 374151, center-aligned, wrap enabled
- These labels can be 2 lines (e.g., "PB\nCM1") — set h: 0.52 for label text boxes

---

#### Slide 19: P&L — Consolidated: Profitability & cost trend

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated (JOPL+JODL) : Profitability & cost trend (excl. interest on FD, ESOP cost)"
- **Content:** Summary headline + multi-line chart

**Summary headline:**
- Position: x: 0.50, y: 0.71, w: 12.33, h: 0.66
- Font: 11pt bold, black
- Content: 3 lines:
  ```
  Gross Margin % to NMV : X.XX% (MoM +X.XX%).
  Fixed Cost % to NMV: X.XX% (MoM : +X.XX%).
  Operating EBITDA % to NMV : +X.XX% (MoM : +X.XX%)
  ```

**Sub-heading:**
- "Profitability / Cost % to NMV" at (x: 3.72, y: 1.34) — bold, black

**Chart — Multi-line trend:**
- Position: x: 0.50, y: 1.78, w: 12.33, h: 3.54
- Type: Line chart with multiple series
- Series:
  1. GM % to NMV (blue, solid line)
  2. CM1 % to NMV (grey, solid line)
  3. Fixed Cost % to NMV (light grey, dashed line)
  4. Op EBITDA % to NMV (blue, bold line)
- X-axis: months (Apr'XX through current month)
- Y-axis: percentage (show axis, format as X.X%)

```javascript
slide.addChart(pres.charts.LINE, profitTrendData, {
  x: 0.50, y: 1.78, w: 12.33, h: 3.54,
  chartColors: ['213366', '7F7F7F', 'B0B0B0', '213366'],
  lineDataSymbol: 'circle',
  lineDataSymbolSize: 6,
  showValue: true,
  dataLabelPosition: 't',
  dataLabelFontSize: 9,
  dataLabelColor: '000000',
  catAxisLabelFontSize: 9,
  catAxisLabelColor: '7F7F7F',
  valAxisLabelFontSize: 9,
  valAxisLabelColor: '7F7F7F',
  valGridLine: { color: 'F2F2F2', width: 0.5 },
  showLegend: true, legendPos: 'b', legendFontSize: 9,
  showTitle: false
});
```

**Alternative if line chart is too cluttered:**
Use a combination chart or split into 2 smaller charts (top: margin lines, bottom: cost lines).

---

#### Slide 20: P&L — Consolidated (JOPL+JODL+JOFL)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated (JOPL+JODL+JOFL)"
- **Content:** Summary headline + full P&L table

**Identical structure to Slide 16** but with JOFL included in consolidation.

**Key differences from Slide 16:**
- Table includes JOFL revenue and costs
- CM1 and EBITDA numbers will differ from JOPL+JODL-only view
- Summary headline references the 3-entity consolidation
- Same 11-column format, same ~30 rows, same formatting rules

**Footnote:** Same gold footnote about Employee Benefits Expenses

---

#### Slide 21: P&L — Entity-wise (JOPL, JODL, JOFL)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Entity-wise (JOPL, JODL, JOFL)"
- **Content:** Summary headline + entity-wise P&L table

**Summary headline:**
- Position: x: 0.50, y: 0.64, w: 12.33, h: 0.44
- Font: 10pt bold, black
- Content: Entity-specific highlights — e.g., "JODL : CM1 %: 3.3% up by 0.2% MoM. JODL Revenue: YTD YoY growth by 46%"

**Table — 13-column entity-wise format:**
```
| All figures in INR Cr | Jan'XX JOPL | Jan JODL | Jan JOFL | Jan Elimination | Jan Consol | Feb JOPL | Feb JODL | Feb JOFL | Feb Elimination | Feb Consol | MoM | YoY |
```

**Column widths for 13-col entity table:**
```javascript
const COLS_ENTITY = [2.00, 0.80, 0.80, 0.70, 0.80, 0.80, 0.80, 0.80, 0.70, 0.80, 0.80, 0.60, 0.60];
// Total: 11.00" — adjust label col to fill: 3.33"
```

- Rows (~32): Same P&L line items as Slide 16
- Row height: 0.14" (very compact)
- Font: 11pt
- **Double header row:** Row 1 shows month grouping (Jan'XX spanning 5 cols, Feb'XX spanning 5 cols, MoM, YoY). Row 2 shows entity names.

**Header merge approach in pptxgenjs:**
Cannot merge cells in pptxgenjs tables. Instead, use a separate text box for the month grouping row above the table, then the table starts with entity names as header.

```javascript
// Month grouping labels above table
slide.addText("[Prev Month]'[YY]", {
  x: 2.50, y: 0.90, w: 4.00, h: 0.20,
  fontSize: 10, fontFace: 'Calibri', color: '213366', bold: true, align: 'center'
});
slide.addText("[Current Month]'[YY]", {
  x: 6.50, y: 0.90, w: 4.00, h: 0.20,
  fontSize: 10, fontFace: 'Calibri', color: '213366', bold: true, align: 'center'
});
```

---

#### Slide 22: P&L — Consolidated BU wise (Manufacturing)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated BU wise (Manufacturing)"
- **Content:** Full P&L table for Manufacturing BU

**Table:**
- Position: x: 0.50, y: 0.73, w: 12.33
- Format: 12-column BU P&L:
  ```
  | All figures in INR Cr | Prev Yr Actual | Current Yr Actual | YoY | Prev Month Actual | Current Month Actual | MoM | Ach(%) | YTD BOD Target | YTD Actual | YTD Ach(%) | YTD YoY(%) |
  ```
- Rows (~29): Same P&L line items as consolidated
- Row height: 0.16"
- Font: 11pt

**Column widths for 12-col BU P&L:**
```javascript
const COLS_BU_PL = [2.30, 0.75, 0.75, 0.60, 0.75, 0.75, 0.60, 0.60, 0.85, 0.75, 0.65, 0.65];
// Total: 10.00" — widen label to fill: 4.63"
```

**Note:** This template is reused for Slides 24, 26, 28 (Construction, PB/TMT, Homes). Only the data and title change.

**Footnote:** Gold text (FDC000) at y: 5.34 — "Employee Benefits Expenses (Direct) * : is included under Employee Benefits Expenses"

---

#### Slide 23: P&L — Per/ton (Manufacturing)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Per/ton (Manufacturing)"
- **Content:** 3-period RGM view + commentary sidebar

**Identical layout to Slide 17** (consolidated per/ton) but with Manufacturing-only data.

**Key differences:**
- RGM data shows MFG-specific NMV, margins, costs per ton
- Commentary sidebar content is MFG-specific — e.g., "MFG ENT: ~61% of total Trade AR sold at 0% interest with ~14 days average credit"
- 3 vertical blocks in the left panel may be taller since MFG has more line items (Enterprise vs SMB splits in variable costs)

**Additional highlight overlays:**
- Rounded rectangle at (x: 0.50, y: 5.35, w: 5.63, h: 0.20) highlighting the EBITDA row
- Rounded rectangle at (x: 1.76, y: 1.39, w: 3.94, h: 0.16) highlighting the CM1 row

---

#### Slide 24: P&L — Consolidated BU wise (Construction)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated BU wise (Construction)"
- **Content:** Summary headline + full P&L table + footnote

**Summary headline:**
- Font: 10pt bold, black
- Content: Construction-specific — e.g., "CM1: INR 1.4 Cr (MoM +20%) at 1.7%, YTD CM1 %: Achieve 70% of target. Operating EBITDA: INR -1.8 Cr"

**Table:** Same 12-column BU P&L format as Slide 22, with Construction data.

**Note:** Construction typically shows negative EBITDA. Do NOT highlight negative values in red. Use standard black font. The negative sign suffices.

**Footnote:** Same gold Employee Benefits footnote.

---

#### Slide 25: P&L — Per/ton (Construction)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Per/ton (Construction)"
- **Content:** 3-period RGM view + commentary sidebar

**Same layout as Slide 23** (MFG per/ton) but with Construction data.

**Key differences:**
- Only 2 vertical RGM blocks (Construction has fewer sub-line-items)
- Left panel: (x: 0.50, y: 0.94, w: 3.60)
- Center: (x: 4.20, y: 0.94, w: 1.80)
- Right: (x: 6.10, y: 0.94, w: 1.77)
- Commentary sidebar: Construction-specific — e.g., Trade AR customers, credit days, margin impact

**Vertical separator:** Thinner panel at (x: 4.15) matching original.

---

#### Slide 26: P&L — Consolidated BU wise (JSW One TMT)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated BU wise (JSW One TMT)"
- **Content:** Full P&L table

**Table:** Same 12-column BU P&L format as Slide 22, with Private Brands/TMT data.

**No summary headline** on this slide (original deck omits it for PB). Jump straight to table at y: 0.73.

**Footnote:** Same gold Employee Benefits footnote.

---

#### Slide 27: P&L — Per/ton (JSW One TMT)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Per/ton (JSW One TMT)"
- **Content:** 3-period RGM view (NO commentary sidebar)

**Layout difference from MFG and Construction per/ton:**
- Only 3 panels, NO commentary sidebar (original deck omits it for PB/TMT)
- Left panel wider: (x: 0.50, y: 1.09, w: 3.95)
- Center: (x: 4.60, y: 1.09, w: 1.94)
- Right: (x: 6.85, y: 1.09, w: 1.94)
- Total content width: ~8.24" (uses only left ~65% of slide)

**Column headers:**
- "RGM View: [Prev Month]" at (x: 0.50, y: 0.71)
- "RGM View: [Current Month]" at (x: 4.60, y: 0.71)
- "RGM View: YTD FY'[XX]" at (x: 6.85, y: 0.71)

---

#### Slide 28: P&L — Consolidated BU wise (Homes)

- **Layout:** Content (Layout C)
- **Title:** "P&L — Consolidated BU wise (Homes)"
- **Content:** Full P&L table

**Table:** Same 12-column BU P&L format as Slide 22, with Homes data.

**Homes-specific rows:**
```
GMV
GMV from Material Sales    ← unique to Homes
NMV
(-) Trade Margin
Net Revenue
...
```
The "GMV from Material Sales" is a Homes-specific sub-line below GMV that tracks physical product revenue vs service/design revenue.

**Table may be shorter** (28 rows vs 29-30 for other BUs, since Homes has fewer cost sub-categories).

**Footnote:** Same gold Employee Benefits footnote.

---

#### Slide 29: Detailed expense breakdown (1/2)

- **Layout:** Content (Layout C)
- **Title:** "Detailed expense breakdown (1/2)"
- **Content:** Headline + entity-wise expense table

**Headline:**
- Position: x: 0.50, y: 0.66, w: 12.33, h: 0.30
- Font: 12pt bold, black
- Content: "Total Manpower cost : FTM INR X.X Cr. (+X% MoM, excluding cost of hiring)"

**Table — 14-column entity-wise expense:**
```
| All figures in INR Cr | Jan JOPL | Jan JODL | Jan JOFL | Jan Consol | Feb JOPL | Feb JODL | Feb JOFL | Feb Consol | YTD JOPL | YTD JODL | YTD JOFL | YTD Consol | MoM Feb-Jan |
```

**Column widths for 14-col expense table:**
```javascript
const COLS_EXP = [2.20, 0.65, 0.65, 0.60, 0.70, 0.65, 0.65, 0.60, 0.70, 0.70, 0.70, 0.60, 0.70, 0.70];
// Total: 11.00" — widen label to fill: 3.53"
```

- Rows (~29):
  ```
  Employee headcount
    JOPL count
    JODL count
    JOFL count
  CTC per head (INR Lac)
  Employee Benefits Expense
    Salaries & Wages
    PF + Gratuity
    ESOP cost
    Other employee costs
  Recruitment cost
  Staff welfare
  Travel & Conveyance
  ... (detailed expense line items)
  ```
- Row height: 0.15"
- Font: 11pt

**Vertical separators:**
Rounded rectangle dividers between entity groups:
- Between Jan Consol and Feb JOPL: (x: 4.39, y: 1.06, w: 0.06, h: 4.36) — thin blue accent
- Between Feb Consol and YTD JOPL: (x: 6.46, y: 1.05, w: 0.06, h: 4.36)

---

#### Slide 30: Detailed expense breakdown (2/2)

- **Layout:** Content (Layout C)
- **Title:** "Detailed expense breakdown (2/2)"
- **Content:** Continuation expense table

**Table:** Same 14-column format as Slide 29, continuing with:
```
Other Admin. Costs
  Rent & Utilities
  Legal & Professional
  Insurance
  Communication
  Repairs & Maintenance
  Printing & Stationery
  Membership & Subscription
  Miscellaneous
Branding & Marketing
  Digital Marketing
  Events & Sponsorship
  Content & Design
  Agency fees
Technology Cost
  Cloud infrastructure
  Software licenses
  Development services
Total Overheads
```

**3 vertical separators:** Same positions as Slide 29, plus a third between YTD Consol and MoM column.

---

#### Slide 31: P&L — Cost under EBITDA

- **Layout:** Content (Layout C)
- **Title:** "P&L — Cost under EBITDA"
- **Content:** Headline + table + trend chart + legend

**Headline:**
- Position: x: 0.50, y: 0.67, w: 5.18, h: 0.30
- Font: 12pt bold, color: C00000 (dark red — exception: used only for this cost alert headline)
- Content: "Cost under EBITDA up by -X% MoM (Increase in interest LC cost ~X%)"

**Table — Below-EBITDA cost items:**
- Position: x: 0.50, y: 0.92, w: 12.33
- 5-column format:
  ```
  | All figures in INR Cr | Jan'XX | Feb'XX | MoM | YTD FY'XX |
  ```
- Rows (~18):
  ```
  Interest on Deutsche Bank OD
  Interest on ICICI Bank OD
  Interest on HDFC Bank OD
  Interest on working capital
  LC discounting charges
  BG charges
  Interest on Trade AR (IFC)
  Interest on Trade AR (internal)
  Total Financial & Interest Cost
  Depreciation — JOPL
  Depreciation — JODL
  Depreciation — JOFL
  Total Depreciation
  Total Cost Under EBITDA
  ```
- Column widths: [3.50, 2.00, 2.00, 1.50, 3.33] = 12.33"
- Font: 12pt (only 5 columns, so 12pt is fine)

**Sub-heading for chart:**
- "<Trend — Cost Under EBITDA>" at (x: 3.72, y: 3.53) — bold

**Trend chart (below table):**
- Position: x: 0.50, y: 4.12, w: 12.33, h: 1.34
- Type: Combo chart — bar (Financial & Interest Cost) + bar (Depreciation) + line (Cost Under EBITDA % to NMV)
- Colors: Blue (213366) for Financial cost, Grey (7F7F7F) for Depreciation, Blue line for % to NMV
- X-axis: months
- Left Y-axis: INR Cr (hidden)
- Right Y-axis: % (shown)

```javascript
// If combo chart is complex, use stacked bar + overlaid line
slide.addChart(pres.charts.BAR, costBarData, {
  x: 0.50, y: 4.12, w: 12.33, h: 1.34,
  barDir: 'col', barGrouping: 'stacked',
  chartColors: ['213366', '7F7F7F'],
  valAxisHidden: true, valGridLine: { style: 'none' },
  showValue: false, showLegend: false, showTitle: false
});
// Add % line as separate text annotations if combo not supported
```

**Legend (right side):**
- Blue square + "Financial & Interest Cost"
- Grey square + "Depreciation"
- Blue line + "Cost Under EBITDA % to NMV"
- Position: x: 7.87, y: 3.47, font: 10pt

---

### SECTION 3: JODL PROFITABILITY (Slides 32–36)

---

#### Slide 32: Section divider — "3. JODL Profitability"

- **Layout:** Section Divider (Layout D)
- **Title:** "3. JODL Profitability"
- **Font:** 28pt bold, color: 2F5496
- **Page number:** 32

---

#### Slide 33: JODL Profitability — Buy & Sale: CM1 by credit type

- **Layout:** Content (Layout C)
- **Title:** "JODL Profitability — Buy & Sale (Other than T1S, PB) : Contribution Margin1 by credit"
- **Content:** Headline + 2 tables + footnote + commentary box

**Headline:**
- Position: x: 0.50, y: 0.64, w: 12.33, h: 0.30
- Font: 12pt bold, black
- Content: "[Prev Month] total CM1 at X.XX% vs Y.YY% in the previous month"

**Table 1 — CM1 by credit type (Cash, Trade AR, Factoring):**
- Position: x: 0.50, y: 0.91, w: 12.33
- 13-column format:
  ```
  |                    | Cash & Carry (4 cols) | Trade AR (4 cols) | Factoring (4 cols) |
  | All figures INR Cr | Prev Mon | Curr Mon | MoM | YTD | Prev Mon | Curr Mon | MoM | YTD | Prev Mon | Curr Mon | MoM | YTD |
  ```
- Rows (9):
  ```
  Revenue from Sales
  (-) Trade Discount
  Net Revenue
  (-) COGS
  Gross Margin
  (-) Credit Cost
  (-) Commission
  (-) Logistics
  Contribution Margin 1
  ```
- Row height: 0.20"
- Font: 11pt

**Table 2 — CM1 by credit type (LC, CF, Total):**
- Position: x: 0.50, y: 2.74, w: 12.33
- Same 13-column format, same rows
- Credit types: L/C | CF(*) | Total

**Highlight overlays:** Rounded rectangles around the CM1 row in each credit type sub-table, matching original positioning.

**Footnote:**
- Position: x: 0.50, y: 4.44, w: 12.33
- Font: 9pt, black
- Content: "(Note): Above calculation does not include MoU Rebate, Cutoff/Unbilled provision and CF does not include income from Tata Capital fintech fee"

**Commentary box:**
- Position: x: 0.50, y: 4.73, w: 12.33, h: 0.80
- Font: 10pt
- Content: Margin movement analysis — e.g., "Overall margin improved by INR X Cr, driven by higher sales contribution of INR Y Cr and margin improvement of INR Z Cr."

---

#### Slide 34: JODL Profitability — T1S: Actual margin

- **Layout:** Content (Layout C)
- **Title:** "JODL Profitability — T1S (Other than Buy & Sale, & Construction) : Actual margin"
- **Content:** Headline + state-wise margin table + footnotes

**Headline:**
- Position: x: 0.50, y: 0.66, w: 12.33, h: 0.50
- Font: 12pt bold, black
- Content: 2 lines:
  ```
  Sales: INR X Cr (MoM +INR Y Cr), Margin 2 at profit of INR Z Cr & YTD FY'XX is Profit of INR W Cr.
  Inventory: X MT (+Y MT MoM). Average Inventory days is Z on basis current sales velocity.
  ```

**Table — State-wise T1S profitability:**
- Position: x: 0.50, y: 1.13, w: 12.33
- 16-column format (state-wise with 2-period comparison):
  ```
  |                    | Maharashtra (2) | Telangana (2) | Tamil Nadu (2) | Karnataka (2) | Gujarat (2) | NCR (2) | T1S Total (2) | (1 extra) |
  | All figures INR Cr | Prev | Curr     | Prev | Curr    | Prev | Curr    | Prev | Curr   | Prev | Curr | Prev | Curr | Prev | Curr | YTD    |
  ```
- Rows (~22):
  ```
  Profitability
    Revenue from Sales
    (-) Purchase Cost
    Gross Margin
    GM %
    (-) Revaluation Gain/Loss
    Adjusted GM
    (-) Freight
    (-) Unloading
    (-) Handling
    Margin 1
    M1 %
    (-) Godown Rent
    (-) Manpower
    (-) Other Warehouse costs
    Margin 2
    M2 %
  Inventory
    Opening Stock (MT)
    Purchases (MT)
    Sales (MT)
    Closing Stock (MT)
  ```
- Row height: 0.16"
- Font: 10pt (16 columns + complex layout requires smallest permitted size for tables)

**Footnotes:**
- Position: x: 0.50, y: 4.87, w: 12.33, h: 0.72
- Font: 8pt, black
- Content: Multiple asterisked notes about calculation methodology

---

#### Slide 35: JODL Profitability — Order-level GM cohorts

- **Layout:** Content (Layout C)
- **Title:** "JODL Profitability in Order ID level — Gross margin cohorts (Associated commissions not incl. in buy sell)"
- **Content:** Headline + GM cohort table

**Headline:**
- Position: x: 0.50, y: 0.65, w: 12.33, h: 0.25
- Font: 9pt, black
- Content: "Buy & Sale Steel: X orders; Y at breakeven, Z at ~0.5% margin."

**Table — GM cohort analysis:**
- Position: x: 0.50, y: 0.94, w: 12.33
- 10-column format:
  ```
  | Particulars | < -3.0% | -3.0% to -1.0% | -1.0% to -0.1% | Break even | 0.1% to 1.0% | 1.0% to 3.0% | 3.0% to 5.0% | > 5.0% | Total |
  ```
- Row groups (3 blocks, ~29 rows total):
  ```
  Buy Sell:
    Transactions (#)
    Revenue (INR Cr)
    GM (INR Cr)
    GM %
    
  T1S:
    Transactions (#)
    Revenue (INR Cr)
    GM (INR Cr)
    GM %
    
  Total:
    Transactions (#)
    Revenue (INR Cr)
    GM (INR Cr)
    GM %
  ```
- Font: 11pt
- Column widths: [1.80, 1.00, 1.10, 1.10, 1.00, 1.10, 1.10, 1.00, 1.00, 1.13]

**Highlight overlays:**
- Rounded rectangle around the "0.1% to 1.0%" column cluster (the bulk of transactions) — position: (x: 4.28, y: 1.26, w: 1.87, h: 1.06)
- Rounded rectangle around negative GM rows — position: (x: 1.57, y: 2.38, w: 2.66, h: 0.96)

---

#### Slide 36: JODL Profitability — Jan vs Feb detail comparison

- **Layout:** Content (Layout C)
- **Title:** "JODL Profitability in Order ID level — Gross margin cohorts"
- **Content:** Side-by-side Jan vs Feb comparison (4 tables in 2×2 grid)

**Layout: Left-right split**

| Panel | Content | x | w |
|-------|---------|---|---|
| Left | Feb'XX (current month) | 0.50 | 4.80 |
| Right | Jan'XX (previous month) | 5.40 | 4.80 |

**Panel headers:**
- Left: "[Current Month] (INR Cr.)" at (x: 0.50, y: 0.64) — 11pt bold, color: 2F5496
- Right: "[Prev Month] (INR Cr.)" at (x: 5.40, y: 0.64) — same styling

**Each panel has 2 tables stacked vertically:**

**Table A — Profitability by segment (top of each panel):**
- Position: Left at (x: 0.50, y: 0.86, w: 4.80), Right at (x: 5.40, y: 0.86, w: 4.80)
- 6-column format:
  ```
  | Particulars | JODL OE | JIT + Non JSW | T1S | PB | Total |
  ```
- Rows (~13):
  ```
  Total Sales
  (-) Credit Margin
  Net Sales
  (-) COGS
  Gross Margin
  GM %
  (-) Commission
  (-) Logistics
  (-) Variable costs
  CM1
  CM1 %
  Credit Sales %
  ```

**Table B — Credit breakout (bottom of each panel):**
- Position: Left at (x: 0.50, y: 3.32, w: 4.80), Right at (x: 5.40, y: 3.32, w: 4.80)
- Same 6 columns
- Rows (~13):
  ```
  Credit Sales
    Trade AR
    LC
    CF
    SBC
  Cash & Carry
  Average Credit Days
  Trade AR Days
  Credit Cost
  Credit Cost %
  ```

---

### SECTION 4: BALANCE SHEET / CASH FLOW / OTHER KEY METRICS (Slides 37–45)

---

#### Slide 37: Section divider — "4. Balance Sheet / Cash Flow / Other key metrics"

- **Layout:** Section Divider (Layout D)
- **Title:** "4. Balance Sheet / Cash Flow / Other key metrics"
- **Font:** 28pt bold, color: 2F5496
- **Page number:** 37

---

#### Slide 38: Balance sheet as on [Date]

- **Layout:** Content (Layout C)
- **Title:** "Balance sheet as on [Mon] [DD], [YYYY]"
- **Content:** Side-by-side Liabilities & Assets table + footnotes

**Subtitle:** "INR Cr" at (x: 9.61, y: 0.73) — 7.9pt grey

**Table — Balance sheet (dual-sided):**
- Position: x: 0.50, y: 0.80, w: 12.33
- 14-column format (Liabilities 6 cols + Assets 8 cols on same table):
  ```
  | Liabilities | JOPL | JODL | JOFL | Elimination | Consol Current | Consol Prev | Assets | JOPL | JODL | JOFL | Elimination | Consol Current | Consol Prev |
  ```
- Rows (~20):
  ```
  Net worth
    Share Capital
    Reserves & Surplus
  Non-current Liabilities
    Long-term Borrowings
    Deferred Tax
  Current Liabilities
    Short-term Borrowings
    Trade Payables
    Other Current Liabilities
  Total Liabilities
  --- (right side) ---
  Non Current Assets
    Fixed Assets
    Intangible Assets
    Investments
  Current Assets
    Inventory
    Trade Receivables
    Cash & Bank
    Other Current Assets
  Total Assets
  ```
- Row height: 0.18"
- Font: 11pt (14 columns)

**Column widths for BS table:**
```javascript
const COLS_BS = [1.30, 0.70, 0.65, 0.65, 0.70, 0.85, 0.85, 1.20, 0.70, 0.65, 0.65, 0.70, 0.85, 0.85];
// Total: 11.30" — adjust to 12.33"
```

**Footnotes:**
- Position: x: 0.50, y: 4.48, w: 12.33, h: 1.05
- Font: 8.2pt, black
- Content: Multiple notes on classification methodology

**Logo exception:** An additional small logo may appear at (x: 8.70, y: 0.14) — this is a Google Sheets artifact. In pptxgenjs, use the standard content-slide logo position only.

---

#### Slide 39: Working capital (1/2): JODL+JOPL

- **Layout:** Content (Layout C)
- **Title:** "Working capital: JODL+JOPL as on [Mon] [DD], [YYYY]"
- **Content:** 2 tables (absolute values + days)

**Table 1 — Working capital in INR Cr (top):**
- Position: x: 0.50, y: 0.88, w: 12.33
- 5-column format:
  ```
  | Working Capital (JOPL+JODL) INR Cr. | FY25 A | Jan'XX | Feb'XX | MoM Change |
  ```
- Rows (7):
  ```
  Receivables
  Inventory
  Advances
  Total Current Assets
  Trade Payables
  Other Current Liabilities
  Net Working Capital
  ```
- Column widths: [4.00, 2.00, 2.00, 2.00, 2.33]
- Font: 12pt (only 5 columns)

**Table 2 — Working capital in days (below):**
- Position: x: 0.50, y: 3.26, w: 12.33
- Same 5-column format but with "Days" values
- Same rows but showing DSO, DIO, Advance days, DPO, NWC days

**MoM Change column formatting:**
- Positive change (more days/higher WC = unfavorable): grey font
- Negative change (fewer days = favorable): blue font
- Positive INR change in receivables/inventory: grey font (unfavorable — cash tied up)
- Negative INR change in payables: grey font (unfavorable — paying faster)

---

#### Slide 40: Working capital (2/2): Aging detail

- **Layout:** Content (Layout C)
- **Title:** "Working capital — JODL+JOPL as on [Mon] [DD], [YYYY]"
- **Content:** 4 tables in a complex layout

**Table 1 — Inventory & receivable aging (top-left):**
- Position: x: 0.50, y: 0.74, w: 7.00
- 8-column format:
  ```
  | Particulars (in INR Cr) | Not Due | 0-7 days | 8-30 days | 31-60 days | 61-90 days | Above 90 days | Total |
  ```
- Rows (~12): Inventory (by location/vendor), Trade Receivables (by type)
- Font: 11pt

**Table 2 — Key metrics (top-right):**
- Position: x: 7.50, y: 0.75, w: 4.83
- 3-column format:
  ```
  | Particulars | Unit | Amount |
  ```
- Rows (7): JODL Sales (12M avg), Daily run rate, DSO, DIO, DPO, NWC days, Cash conversion cycle

**Table 3 — AR aging detail (bottom-left):**
- Position: x: 0.50, y: 3.11, w: 12.33
- 3-column format:
  ```
  | AR Ageing (Days) | Amount | Remarks |
  ```
- Rows (7): Not Due (JODL), 0-7 days, 8-30 days, 31-60 days, 61-90 days, Above 90 days, Total
- Remarks column: Nodal vs Non-nodal breakout

**Table 4 — Bank borrowings (bottom-right):**
- Position: x: 7.50, y: 2.45, w: 4.83
- 2-column format:
  ```
  | Bank Borrowings | Amount |
  ```
- Rows (4): DB, ICICI, HDFC, Total

---

#### Slide 41: Cash flow statement

- **Layout:** Content (Layout C)
- **Title:** "Cash flow statement — As on [DD] [Mon]'[YY]"
- **Content:** Cash flow waterfall chart

**Subtitle:** "All figures in INR Cr" at (x: 8.34, y: 0.77) — 9pt bold

The original uses an OLE-embedded Google Sheets chart. Rebuild as a **waterfall chart** using the EBITDA bridge function adapted for cash flow:

**Cash flow waterfall:**
- Position: x: 3.50, y: 0.75, w: 5.50, h: 4.74
- Bars:
  ```
  Opening Cash Balance (total bar)
  + Operating Cash Flow (delta)
  + Investing Cash Flow (delta, usually negative)
  + Financing Cash Flow (delta)
  + Other items (delta)
  = Closing Cash Balance (total bar)
  ```

```javascript
const cashFlowData = [
  { label: 'Opening\nCash Balance', value: openingCash, isTotal: true },
  { label: 'Operating\nCash Flow', value: operatingCF, isTotal: false },
  { label: 'Investing\nCash Flow', value: investingCF, isTotal: false },
  { label: 'Financing\nCash Flow', value: financingCF, isTotal: false },
  { label: 'Other\nItems', value: otherCF, isTotal: false },
  { label: 'Closing\nCash Balance', value: closingCash, isTotal: true },
];
addEBITDABridge(slide, 3.50, 1.00, 5.50, 4.50, cashFlowData, '');
```

**Alternative:** If detailed cash flow statement is needed (not just the waterfall), use a table format similar to the P&L table showing line items of operating, investing, and financing activities.

---

#### Slide 42: Borrowing / Cash & Bank / Fund utilization (Consol)

- **Layout:** Content (Layout C)
- **Title:** "Borrowing / Cash & Bank / Fund utilization (Consol)"
- **Content:** Monthly trend table + ratios table

**Subtitle:** "All figures in INR Cr" at (x: 8.39, y: 0.68) — 10pt

**Table 1 — Monthly borrowing trend (top):**
- Position: x: 0.50, y: 0.80, w: 12.33
- 12-column format (Apr through current month):
  ```
  | Particulars | Apr'XX | May'XX | ... | Feb'YY |
  ```
- Rows (~15):
  ```
  (a) Finance cost (ex. LC discounting)
  (b) LC discounting
  Total Interest Cost
  Bank OD — Deutsche Bank
  Bank OD — ICICI
  Bank OD — HDFC
  Total Bank Borrowing
  Cash & Bank — JOPL
  Cash & Bank — JODL
  Cash & Bank — JOFL
  Total Cash & Bank
  Net Cash (Cash - Borrowing)
  Fund Utilization %
  ```
- Font: 11pt (12 columns)
- Column widths: [2.80, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79, 0.79] = 11.49" → widen label

**Sub-heading for ratios:** "<Net Worth Current Ratio / Debt Equity Ratio>" — 12pt bold

**Table 2 — Financial ratios (bottom):**
- Position: x: 0.50, y: 4.34, w: 12.33
- 5-column format:
  ```
  | Particulars | Feb'XX (A) JOPL | JODL | JOFL | Consol |
  ```
- Rows (4): Current Ratio, Debt/Equity Ratio, Interest Coverage, DSCR
- Font: 12pt

---

#### Slide 43: Receivable — JODL by credit type

- **Layout:** Content (Layout C)
- **Title:** "Receivable — JODL by credit type as on"
- **Content:** Banner + aging table

**Banner:**
- Position: x: 0.50, y: 0.73, w: 6.62, h: 0.34
- Blue fill or bold text: "Total Outstanding AR as on [DD] [Mon]'[YY] for JODL"

**Table — AR by credit type and aging:**
- Position: x: 0.50, y: 1.22, w: 12.33
- 8-column format:
  ```
  | All figures in INR Cr | No Due | 1-7 days | 8-30 days | 31-60 days | 61-90 days | More than 90 days | Total |
  ```
- Rows (8):
  ```
  Cash & Carry
  CF
  Trade AR
  LC
  SBC
  Factoring
  Other
  Total
  ```
- Font: 12pt (8 columns, plenty of space)
- Total row: bold, F2F2F2 fill

**Conditional formatting:**
- "More than 90 days" column: if value > 10% of total, highlight cell with light grey fill
- Total column: bold

---

#### Slide 44: Trade payable — breakup

- **Layout:** Content (Layout C)
- **Title:** "Trade payable — breakup as on [DD] [Mon]'[YY]"
- **Content:** 2 tables (JODL payables + JOPL payables)

**Table 1 — JODL accounts payable (top):**
- Sub-heading: "Accounts payable JODL" — 9pt bold, in a rounded rectangle at (x: 0.50, y: 0.63, w: 3.57, h: 0.41)
- Position: x: 0.50, y: 0.96, w: 12.33
- 8-column format:
  ```
  | Particulars | Customer segment | Not Due | 0-7 | 7-30 | 30-60 | More than 90 | Grand Total |
  ```
- Rows (~16): Major vendors/mills (JSW Steel VJNR, JSW Coated, JSW Dolvi, external vendors)
- Font: 11pt

**Table 2 — JOPL accounts payable (bottom):**
- Sub-heading: "Accounts payable JOPL" — 10pt bold, in a rounded rectangle at (x: 0.50, y: 3.85, w: 3.57, h: 0.34)
- Position: x: 0.50, y: 4.12, w: 12.33
- 8-column format:
  ```
  | Expense Type | Vendor segment | Not Due | 0-7 | 7-30 | 30-60 | More than 60 | Grand Total |
  ```
- Rows (~8): Tech, HR/Admin, Marketing, Operations, Other
- Font: 11pt

---

#### Slide 45: Inventory (in MT & in INR Cr) — aging

- **Layout:** Content (Layout C)
- **Title:** "Inventory (in MT & in INR Cr) — aging as on [DD] [Mon]'[YY] *"
- **Content:** 2 tables side by side + footnote

**Column headers:**
- "As on [Current Month] (Volume MT)" at (x: 0.50, y: 0.67) — 11pt bold, color: 2F5496
- "As on [Prev Month] (Volume MT)" at (x: 8.20, y: 0.67) — 11pt bold, color: 2F5496

**Table 1 — Current month inventory aging (main):**
- Position: x: 0.50, y: 0.94, w: 7.80
- 8-column format:
  ```
  | Location | Vendor | 0 to 7 | 8 to 30 | 31 to 60 | 61 to 90 | Above 90 | Grand Total |
  ```
- Rows (~15): Warehouse locations × vendors
- Font: 11pt

**Table 2 — Previous month >90 days comparison (right):**
- Position: x: 8.30, y: 0.93, w: 4.03
- 2-column format:
  ```
  | Above 90 | >90 Inv. Movement |
  ```
- Same rows as Table 1, showing only the >90 day aging and MoM movement
- This allows quick identification of aging inventory trends

**Footnote:**
- Position: x: 0.50, y: 5.24, w: 12.33
- Font: 10pt, black
- Content: "(*)including SIT inventory"

**Highlight overlay:** Rounded rectangle at approximately (x: 8.71, y: 1.45, w: 0.55, h: 0.50) to call out specific high-aging vendors

---

### SECTION 5: BACK MATTER (Slides 46–47)

---

#### Slide 46: Thank you

- **Layout:** Section Divider (Layout D) — repurposed
- **Title:** "Thank you"
- **Font:** 28pt bold, color: 2F5496
- **Position:** Centered vertically (y: 2.57)
- **Page number:** 46
- **No additional content.** Clean close.

---

#### Slide 47: Assumptions

- **Layout:** Content (Layout C)
- **Title:** "Assumptions"
- **Content:** Full-page text box with accounting assumptions and definitions

**Text box:**
- Position: x: 0.50, y: 0.78, w: 12.33, h: 4.83
- Font: 12pt bold, black
- Alignment: left, top
- Content structure: Bulleted list of accounting and business assumptions:
  ```
  Revenue from Commission:
      - JOPL : Commission from JSW Group on plant supply and commission earned from Homes and PUF
      - JODL : Commission from JSW Group on plant supply and DGF
  
  NMV calculation:
      - GMV minus trade discounts, rebates, and GST
  
  COGS definition:
      - Purchase price + freight-in + handling charges (for JODL buy-sell)
      - Transfer price from JSW Steel (for JOPL)
  
  Credit cost allocation:
      - Interest on Trade AR: allocated per order based on credit days × daily rate
      - LC/BG charges: allocated to orders using LC/BG facility
      - CF cost: factoring charges allocated per invoice
  
  Employee cost classification:
      - Direct: sales team, warehouse staff, delivery fleet
      - Indirect: corporate functions (finance, HR, tech, legal, admin)
  
  T1S inventory valuation:
      - Weighted average cost method
      - Revaluation gain/loss booked monthly based on JSW Steel price list changes
  ```

---

## Common mistakes in monthly financial decks (avoid these) — continued

13. **Entity-wise P&L without elimination column.** When showing JOPL + JODL + JOFL, always include the "Elimination" column to avoid double-counting inter-company transactions.
14. **RGM waterfall without separating variable and fixed costs.** The cascade MUST go NMV → GM → CM1 → CM2 → EBITDA. Skipping CM1/CM2 layers hides margin structure.
15. **EBITDA bridge with bars in wrong order.** Always: Revenue/margin items first (MFG CM1, Const CM1, PB CM1, Homes CM1), then cost items (Employee, Branding, Other). Revenue first, costs second.
16. **Working capital shown without aging breakout.** The CFO needs to see NOT just total receivables but the aging buckets (0-7, 8-30, 31-60, 61-90, >90). A single "Total AR" number hides overdue risk.
17. **T1S state-wise table without inventory section.** T1S profitability is incomplete without showing inventory levels by state. Always include opening stock, purchases, sales, closing stock below the margin section.
18. **GM cohort table without highlighting the bulk bucket.** Most transactions cluster in the 0.1%–1.0% margin range. Use a rounded-rectangle overlay to visually call out this column.
19. **Cash flow as just a table.** A waterfall chart communicates cash flow movement 10x faster than a table of numbers. Always attempt a waterfall chart even if the table is also shown.
20. **Balance sheet without both current and previous month Consol columns.** The audience needs MoM movement. Showing only current month BS is incomplete.

---

## Quality checklist — Section 2 (Financial Profitability)

- [ ] P&L tables have consistent 11-column format across consolidated and BU-wise slides
- [ ] All P&L slides include the gold footnote about Employee Benefits Expenses
- [ ] Percentage rows (GM %, CM1 %, EBITDA %) in grey italic font
- [ ] Total rows bold with F2F2F2 fill
- [ ] RGM waterfall shows both INR/MT and % NMV columns
- [ ] RGM 3-period view has left (full), center (compact), right (compact) + commentary sidebar
- [ ] EBITDA bridge uses correct sign convention (cost increase = negative, margin increase = positive)
- [ ] EBITDA bridge legend present (Total, Impact+, Impact-)
- [ ] No red in charts or tables EXCEPT EBITDA bridge delta labels (D91920 exception) and cost alert headlines (C00000)
- [ ] Entity-wise P&L includes Elimination column
- [ ] Expense breakdown has vertical separators between entity groups

## Quality checklist — Section 3 (JODL Profitability)

- [ ] Buy & Sale CM1 table shows all 5 credit types (Cash, Trade AR, Factoring, LC, CF)
- [ ] T1S state-wise table includes both profitability AND inventory sections
- [ ] GM cohort table has highlight overlay on the bulk-transaction bucket
- [ ] Jan vs Feb comparison has consistent column structure across both panels
- [ ] Footnotes about MoU Rebate exclusion present on CM1 slides

## Quality checklist — Section 4 (BS / Cash Flow / Other)

- [ ] Balance sheet shows both current and previous month consolidated columns
- [ ] Working capital shows both absolute (INR Cr) and days views
- [ ] AR aging table shows all buckets (Not Due through >90 days)
- [ ] Trade payable split into JODL and JOPL separate tables
- [ ] Inventory aging shows both current month and previous month >90 day movement
- [ ] Cash flow waterfall chart present (not just a table)
- [ ] Borrowing trend table shows full Apr-to-current-month range
- [ ] Financial ratios (Current Ratio, D/E) present for all entities

## Quality checklist — Full deck

- [ ] Section dividers present for all 4 sections
- [ ] All 47 slides have page numbers
- [ ] All slides have JSW One logo in correct position
- [ ] All slides have brand divider line at correct y-position
- [ ] No ₹ or Rs. used anywhere — only "INR X Cr" or "INR X Lac"
- [ ] No overlapping elements on any slide
- [ ] cursorY tracking used on every content slide
- [ ] Column widths validated on every table: sum ≤ GRID.W (12.33")
- [ ] Commentary boxes use 10pt bold, NOT 12pt (to fit in constrained space)
- [ ] Assumptions slide present as last content slide
- [ ] "Thank you" slide present before assumptions
