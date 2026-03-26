## 5. Component Patterns

### 5.1 Tables

**Header row — alignment matches content below:**
```javascript
// For a text column (left-aligned):
{ text: 'Business unit', options: {
  fill: { color: '213366' }, color: 'FFFFFF', bold: true,
  fontSize: 12, fontFace: 'Calibri', align: 'left', valign: 'middle'
}}

// For a number column (center-aligned):
{ text: 'FY27 target (KMT)', options: {
  fill: { color: '213366' }, color: 'FFFFFF', bold: true,
  fontSize: 12, fontFace: 'Calibri', align: 'center', valign: 'middle'
}}
```

**Data rows — text left, numbers center:**
```javascript
// Text cell
{ fill: { color: 'FFFFFF' }, color: '000000', fontSize: BODY_SIZE, fontFace: 'Calibri', align: 'left', valign: 'middle' }
// Number cell
{ fill: { color: 'FFFFFF' }, color: '000000', fontSize: BODY_SIZE, fontFace: 'Calibri', align: 'center', valign: 'middle' }
```

**Full helper — pass column types array ('text' or 'num'):**
```javascript
function addStyledTable(slide, headers, rows, colTypes, opts = {}) {
  const tableData = [];

  // Header row — aligned per column type
  tableData.push(headers.map((h, j) => ({
    text: h,
    options: {
      fill: { color: '213366' }, color: 'FFFFFF', bold: true,
      fontSize: 12, fontFace: 'Calibri',
      align: colTypes[j] === 'num' ? 'center' : 'left',
      valign: 'middle'
    }
  })));

  // Data rows
  rows.forEach((row, i) => {
    const isTotal = row._isTotal;
    tableData.push(row.cells.map((cell, j) => ({
      text: String(cell),
      options: {
        fill: { color: isTotal ? 'FFFFFF' : (i % 2 === 0 ? 'FFFFFF' : 'F2F2F2') },
        color: '000000',
        bold: !!isTotal,
        fontSize: BODY_SIZE,
        fontFace: 'Calibri',
        align: colTypes[j] === 'num' ? 'center' : 'left',
        valign: 'middle'
      }
    })));
  });

  slide.addTable(tableData, {
    x: opts.x || CONTENT.x, y: opts.y || CONTENT.y, w: opts.w || CONTENT.w,
    border: { pt: 0.5, color: 'CCCCCC' },
    rowH: opts.rowH || 0.38, colW: opts.colW || undefined
  });
}
```

**Simpler helper (auto-detect: first column text, rest numbers):**
```javascript
function addSimpleTable(slide, headers, rows, opts = {}) {
  const tableData = [];
  tableData.push(headers.map((h, j) => ({
    text: h,
    options: {
      fill: { color: '213366' }, color: 'FFFFFF', bold: true,
      fontSize: 12, fontFace: 'Calibri',
      align: j === 0 ? 'left' : 'center', valign: 'middle'
    }
  })));
  rows.forEach((row, i) => {
    const isTotal = i === rows.length - 1 && opts.lastRowBold;
    tableData.push(row.map((cell, j) => ({
      text: String(cell),
      options: {
        fill: { color: isTotal ? 'FFFFFF' : (i % 2 === 0 ? 'FFFFFF' : 'F2F2F2') },
        color: '000000', bold: !!isTotal,
        fontSize: BODY_SIZE, fontFace: 'Calibri',
        align: j === 0 ? 'left' : 'center', valign: 'middle'
      }
    })));
  });
  slide.addTable(tableData, {
    x: opts.x || CONTENT.x, y: opts.y || CONTENT.y, w: opts.w || CONTENT.w,
    border: { pt: 0.5, color: 'CCCCCC' },
    rowH: opts.rowH || 0.38, colW: opts.colW || undefined
  });
}
```

**Table column width validation — MANDATORY before every `addTable` call:**

The sum of all `colW` values MUST be ≤ `GRID.W` (12.33"). If `colW` is not specified, pptxgenjs auto-distributes columns within the table's `w` parameter, which is safe. But when specifying explicit `colW`, always validate:

```javascript
// BEFORE every addTable with explicit colW:
const colW = [3.50, 2.40, 2.40, 2.00, 2.03];  // example
const totalW = colW.reduce((a, b) => a + b, 0);
if (totalW > GRID.W) {
  throw new Error(`Table colW sum (${totalW}) exceeds GRID.W (${GRID.W}). Reduce column widths.`);
}
```

**If content doesn't fit in 12.33":**
1. First try: reduce body font from 12pt to 11pt for that table only (never below 11pt for table cells).
2. If still too wide: abbreviate column headers (e.g., "Revenue growth YoY" → "Rev. growth YoY").
3. If still too wide: split the table across two slides (e.g., left columns on slide N, right columns on slide N+1 with row labels repeated).
4. NEVER let columns overflow the slide edge. This creates invisible clipped content.

### 5.2 Charts (Bar / Column)

**Data labels: INSIDE bars near top, white bold text.**

```javascript
function addStyledBarChart(slide, chartData, opts = {}) {
  slide.addChart(pres.charts.BAR, chartData, {
    x: opts.x || CONTENT.x,
    y: opts.y || CONTENT.y,
    w: opts.w || CONTENT.w,
    h: opts.h || 5.50,
    barDir: opts.barDir || 'col',

    // Colors — ONLY blue and grey
    chartColors: opts.chartColors || ['213366', '7F7F7F'],

    // Clean background
    chartArea: { fill: { color: 'FFFFFF' } },

    // Category axis
    catAxisHidden: false,
    catAxisLabelColor: '7F7F7F',
    catAxisLabelFontSize: 11,
    catAxisLabelFontFace: 'Calibri',
    catGridLine: { style: 'none' },

    // Value axis — HIDDEN
    valAxisHidden: true,
    valGridLine: { style: 'none' },

    // Data labels — INSIDE bars, white bold
    showValue: true,
    dataLabelPosition: 'inEnd',       // Inside bar near top
    dataLabelColor: 'FFFFFF',          // White text
    dataLabelFontSize: 11,
    dataLabelFontFace: 'Calibri',
    dataLabelFontBold: true,

    // Legend
    showLegend: chartData.length > 1,
    legendPos: 'b',
    legendFontSize: 11,
    legendFontFace: 'Calibri',
    legendColor: '7F7F7F',

    showTitle: false
  });
}
```

**Chart rules:**
- Value axis: ALWAYS hidden.
- Data labels: `inEnd` (inside bar, near top). White bold. Never outside.
- Colors: Blue `213366` primary, Grey `7F7F7F` secondary. Third: `B0B0B0`.
- No red in charts ever (unless user explicitly overrides).

### 5.3 Line Charts

Same color/axis rules. Data labels in black (since line charts have no bar fill):
```javascript
showValue: true,
dataLabelColor: '000000',
dataLabelFontBold: true,
```

### 5.4 KPI Callout Cards

**Standard KPI card height: 1.05" (with sublabel) or 0.85" (without sublabel).** These are fixed-layout cards — value, label, and optional sublabel always stack the same way. Do NOT make KPI cards taller than needed.

```javascript
function addKPICard(slide, x, y, w, h, value, label, sublabel) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: h,
    fill: { color: 'FFFFFF' },
    line: { color: 'CCCCCC', width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: 0.04,
    fill: { color: '213366' }
  });
  slide.addText(String(value), {
    x: x, y: y + 0.12, w: w, h: 0.45,
    fontSize: 28, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
  slide.addText(label, {
    x: x, y: y + 0.55, w: w, h: 0.25,
    fontSize: BODY_SIZE, fontFace: 'Calibri', color: '7F7F7F',
    align: 'center', valign: 'top', margin: 0
  });
  if (sublabel) {
    slide.addText(sublabel, {
      x: x, y: y + 0.78, w: w, h: 0.20,
      fontSize: 11, fontFace: 'Calibri', color: '7F7F7F',
      align: 'center', valign: 'top', margin: 0
    });
  }
}
```

### 5.5 Content Heading Box

```javascript
function addContentHeading(slide, x, y, w, text) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: 0.35,
    fill: { color: '213366' }
  });
  slide.addText(text, {
    x: x + 0.10, y: y, w: w - 0.20, h: 0.35,
    fontSize: 12, fontFace: 'Calibri', color: 'FFFFFF',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
}
```

### 5.6 Bullet Points

```javascript
slide.addText([
  { text: 'First point here', options: { bullet: true, breakLine: true } },
  { text: 'Second point here', options: { bullet: true, breakLine: true } },
  { text: 'Third point here', options: { bullet: true } }
], {
  x: CONTENT.x, y: CONTENT.y, w: CONTENT.w, h: 3,
  fontSize: BODY_SIZE, fontFace: 'Calibri', color: '000000',
  align: 'justify', valign: 'top',
  paraSpaceAfter: 6,
  bullet: { color: '213366' }
});
```

### 5.7 RAG Status Indicators (Colorblind-Safe)

- On track: blue filled circle (`213366`)
- At risk: grey filled circle (`7F7F7F`)
- Off track: white circle with grey border

### 5.8 Visual Elements Library — Shapes, Arrows, and Indicators

**Slides should not be walls of text and tables. Use visual elements to add clarity, emphasis, and flow.** The following shapes are available and encouraged — all using the approved colour palette only.

#### Trend and comparison indicators

**Color coding rule: When showing increase/decrease values (growth rates, variances, deltas), the value text itself must be color-coded, not just the arrow.**
- **Increase/positive:** Blue font (`213366`) + ▲ arrow in blue
- **Decrease/negative:** Grey font (`7F7F7F`) + ▼ arrow in grey
- **Flat/neutral:** Grey font (`7F7F7F`) + ► arrow in grey

This applies everywhere: inside table cells, next to KPI cards, in inline text, in chart annotations.

```javascript
// UP arrow (positive trend) — blue
function addUpArrow(slide, x, y, size) {
  slide.addText('▲', {
    x: x, y: y, w: size, h: size,
    fontSize: 14, fontFace: 'Calibri', color: '213366',
    align: 'center', valign: 'middle', margin: 0
  });
}

// DOWN arrow (negative trend) — grey
function addDownArrow(slide, x, y, size) {
  slide.addText('▼', {
    x: x, y: y, w: size, h: size,
    fontSize: 14, fontFace: 'Calibri', color: '7F7F7F',
    align: 'center', valign: 'middle', margin: 0
  });
}

// FLAT arrow (no change) — grey
function addFlatArrow(slide, x, y, size) {
  slide.addText('►', {
    x: x, y: y, w: size, h: size,
    fontSize: 14, fontFace: 'Calibri', color: '7F7F7F',
    align: 'center', valign: 'middle', margin: 0
  });
}

// For inline use in table cells or text:
// ▲ +35% in blue:  { text: '▲ +35%', options: { color: '213366', bold: true } }
// ▼ -12% in grey:  { text: '▼ -12%', options: { color: '7F7F7F', bold: true } }
```

#### Plus/minus/equals for variance callouts
```javascript
// Variance badge — shows +/- delta next to a metric
function addVarianceBadge(slide, x, y, w, value, isPositive) {
  const prefix = isPositive ? '+' : '';
  const color = isPositive ? '213366' : '7F7F7F';
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: 0.30,
    fill: { color: color }
  });
  slide.addText(prefix + value, {
    x: x, y: y, w: w, h: 0.30,
    fontSize: 12, fontFace: 'Calibri', color: 'FFFFFF',
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
}
```

#### Flow arrows between elements
```javascript
// Horizontal arrow connecting two elements
function addFlowArrow(slide, x, y, w) {
  slide.addShape(pres.shapes.LINE, {
    x: x, y: y, w: w, h: 0,
    line: { color: '213366', width: 1.5, endArrowType: 'triangle' }
  });
}

// Right-pointing arrow shape (filled, for process flows)
function addArrowShape(slide, x, y, w, h) {
  slide.addShape(pres.shapes.RIGHT_ARROW, {
    x: x, y: y, w: w, h: h,
    fill: { color: '213366' }
  });
}
```

#### Divider line between sections on a single slide
```javascript
// Thin horizontal rule to separate content sections
function addSectionRule(slide, x, y, w) {
  slide.addShape(pres.shapes.LINE, {
    x: x, y: y, w: w, h: 0,
    line: { color: 'CCCCCC', width: 0.75 }
  });
}
```

#### Numbered step indicators (process flows, timelines)
```javascript
// Numbered circle badge (like agenda items but inline)
function addStepBadge(slide, x, y, num) {
  slide.addShape(pres.shapes.OVAL, {
    x: x, y: y, w: 0.35, h: 0.35,
    fill: { color: '213366' }
  });
  slide.addText(String(num), {
    x: x, y: y, w: 0.35, h: 0.35,
    fontSize: 12, fontFace: 'Calibri', color: 'FFFFFF',
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
}
```

#### Callout box (highlight a key insight)
```javascript
// Blue-left-border callout box for key message emphasis
function addCalloutBox(slide, x, y, w, h, text) {
  // Left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 0.06, h: h,
    fill: { color: '213366' }
  });
  // Background
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.06, y: y, w: w - 0.06, h: h,
    fill: { color: 'F2F2F2' }
  });
  // Text
  slide.addText(text, {
    x: x + 0.20, y: y, w: w - 0.35, h: h,
    fontSize: 14, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
}
```

**When to use each element:**

| Element | Use case |
|---------|----------|
| ▲ ▼ ► arrows | Next to metrics showing MoM/QoQ trend (in tables, next to KPIs) |
| Variance badges (+/-) | Highlighting delta vs AOP or previous period |
| Flow arrows | Process slides (lead funnel, supply chain, customer journey) |
| Step badges (1, 2, 3) | Action item slides, process flows, timelines |
| Section rules | Separating "data" from "takeaway" areas on a dense slide |
| Callout boxes | Hero insight on exec summary, key message the CEO must see |
| RIGHT_ARROW shape | Connecting process stages (e.g., Lead → Design → Build → Deliver) |

**Colour rule still applies:** All shapes use `213366` (blue) or `7F7F7F` (grey) only. Never red, never off-palette.

### 5.9 Text Size Flexibility — When to Go Bigger

**The 12pt body minimum is a floor, not a ceiling.** Certain slide contexts call for larger text to create visual hierarchy and emphasis. Use bigger sizes when the content demands it.

**Permitted upscaling:**

| Context | Font size | When to use |
|---------|-----------|-------------|
| Hero stat / callout number | 36-48pt bold | Exec summary big number that anchors the slide (e.g., "INR 1,644 Cr GMV") |
| Hero stat label | 14-16pt | Label below the hero stat explaining what it is |
| Key message / "so what" | 16-18pt bold | One-liner takeaway meant to be read from across the room (e.g., board meeting slide) |
| Callout box text | 14pt bold | Highlighted insight inside a callout box (Section 5.8) |
| Process step labels | 14pt | Text inside flow diagrams, step descriptions |
| Card titles | 12-14pt bold | Card heading when only 2-3 cards on a slide and space allows |
| Section divider subtitle | 14pt | Subtitle on Layout D slides |
| Agenda items | 14pt | Already standard (Layout B) |

**Rules for upscaling:**
1. **Only upscale when there is spare vertical space.** If a slide has a hero stat + 2 bullets, the hero stat can be 36-48pt. If the slide is already dense with a table + chart + takeaway, stick to 12pt.
2. **Never upscale body bullets or table cells.** These stay at 12pt regardless. Upscaling applies only to callouts, hero stats, key messages, and process labels.
3. **Never mix multiple large sizes on one slide.** One hero element (36-48pt) per slide maximum. Everything else stays at 12-14pt.
4. **Callout boxes (Section 5.8) default to 14pt bold.** This is intentionally bigger than body text to create visual contrast.
5. **KPI callout numbers remain at 28-36pt** (Section 5.4). These already have their own sizing system.

**Example — exec summary with hero stat:**
```javascript
// Hero stat — large, anchors the slide
slide.addText('INR 1,644 Cr', {
  x: GRID.L, y: GRID.TOP, w: GRID.W, h: 0.80,
  fontSize: 44, fontFace: 'Calibri', color: '213366',
  bold: true, align: 'center', valign: 'middle', margin: 0
});
slide.addText('Platform GMV — Q3 FY26 (12% above AOP)', {
  x: GRID.L, y: GRID.TOP + 0.80, w: GRID.W, h: 0.35,
  fontSize: 16, fontFace: 'Calibri', color: '7F7F7F',
  align: 'center', valign: 'top', margin: 0
});
// Then normal 12pt content below
```

---

