# HTML Visual Components — Hi-Res Graphics for PPTX

**Use this file when you want to embed visually rich graphics in a PPTX deck. These are HTML/CSS components rendered to hi-res PNG via Playwright, then placed on slides as images.**

---

## 1. When to Use HTML Visuals vs Native pptxgenjs

**Use HTML visuals when:**
- KPI cards with color-coded borders, icons, or conditional formatting
- Bar/line charts with precise data labels, annotations, and negative-value handling
- Waterfall/bridge charts (pptxgenjs has no native waterfall)
- Heatmaps or matrix visuals (plant × state CM/MT grids)
- Comparison visuals with color-coded cells (positive green, negative red)
- Any visual where CSS typography, shadows, gradients, or rounded corners matter
- Dashboard-style layouts combining multiple chart types in one image

**Use native pptxgenjs when:**
- Simple tables (pptxgenjs tables are fine and editable)
- Basic bar charts with <6 data points (pptxgenjs is adequate)
- Text-heavy slides (bullets, cards with plain text)
- Content that the audience might want to edit in PowerPoint
- Speed over polish (HTML pipeline adds ~3-5 seconds per visual)

**Rule of thumb:** If the visual has conditional formatting, mixed positive/negative values, annotations, or multi-component layout — use HTML. If it's a simple table or basic chart — use pptxgenjs.

---

## 2. Pipeline — How It Works

```
Step 1: Write HTML/CSS for the visual (in /home/claude/visual_[name].html)
Step 2: Render to PNG:
        node scripts/html_to_image.js /home/claude/visual_[name].html /home/claude/visual_[name].png 900 2
Step 3: Embed in PPTX:
        slide.addImage({
          path: '/home/claude/visual_[name].png',
          x: GRID.L, y: GRID.TOP,
          w: GRID.W, h: [calculated from aspect ratio]
        });
```

**Width mapping (viewport px to PPTX inches):**
- 900px viewport → 12.33" PPTX width (GRID.W) — full content area
- 600px viewport → ~8.2" — two-thirds width (for two-column layouts)
- 430px viewport → ~5.9" — half width (for side-by-side)

**Height calculation:** After rendering, compute the PPTX height from the image aspect ratio:
```javascript
const img = require('image-size')('/home/claude/visual_[name].png');
const pptxW = GRID.W; // 12.33"
const pptxH = pptxW * (img.height / img.width);
```
Or estimate from the viewport: if HTML is 900×400px, PPTX height ≈ 12.33 × (400/900) ≈ 5.48".

---

## 3. Design Rules for HTML Visuals

### 3.1 Color palette (must match JSW One PPTX)

```css
:root {
  --jsw-blue: #213366;       /* Primary — bars, headers, KPI values */
  --jsw-grey: #7F7F7F;       /* Secondary — labels, axis, sublabels */
  --jsw-light-grey: #B0B0B0; /* Tertiary — secondary bars */
  --jsw-bg: #FFFFFF;          /* Background — always white */
  --jsw-border: #E2E8F0;     /* Borders — light grey */
  --jsw-surface: #F7FAFC;    /* Surface — light fill for cards */
  --jsw-positive: #38A169;   /* Green — positive signals only */
  --jsw-negative: #E53E3E;   /* Red — alerts/negative values only */
  --jsw-warning: #D69E2E;    /* Amber — warnings */
}
```

**Rules:**
- NO red in charts for regular data. Red only for negative values or alerts
- Blue (#213366) is the dominant color. Grey (#7F7F7F, #B0B0B0) for secondary elements
- Green only for explicitly positive signals (beat target, positive inflection)
- White background always — never colored backgrounds

### 3.2 Typography

```css
body {
  font-family: Calibri, 'Segoe UI', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

**Font sizes (at 900px viewport, renders to ~12.33" at 2x DPR):**
- KPI values: 28-36px (renders to ~20-24pt equivalent on slide)
- Chart titles: 14-16px
- Data labels: 10-12px
- Axis labels: 10px
- Footnotes: 9px

**NEVER use Google Fonts (no network access in render environment).** Stick to Calibri → Segoe UI → Arial fallback chain.

### 3.3 Layout sizing

```css
body {
  width: 900px;      /* Matches PPTX content area width */
  padding: 16px 24px;
  margin: 0;
  background: white;
}
```

- Content width: 900px (full slide) or 430px (half slide)
- No external dependencies — all styling inline or in `<style>` block
- No JavaScript required (pure CSS rendering) — except for Chart.js if needed

---

## 4. Component Templates

### 4.1 KPI Row (4 cards)

Use for: exec summary, monthly snapshot, section openers.

```html
<div style="display:flex;gap:12px;">
  <div class="kpi">
    <div class="val">[VALUE]</div>
    <div class="label">[LABEL]</div>
    <div class="sub">[COMPARATOR]</div>
  </div>
  <!-- repeat for each KPI -->
</div>
```

CSS for `.kpi`:
```css
.kpi {
  flex:1; border:1px solid #E2E8F0; border-top:3px solid #213366;
  border-radius:8px; padding:14px; text-align:center; background:#fff;
}
.kpi .val { font-size:28px; font-weight:800; color:#213366; }
.kpi .label { font-size:11px; color:#7F7F7F; margin-top:4px; }
.kpi .sub { font-size:10px; color:#B0B0B0; margin-top:2px; }
/* Variants */
.kpi.alert { border-top-color:#E53E3E; }
.kpi.alert .val { color:#E53E3E; }
.kpi.good { border-top-color:#38A169; }
.kpi.good .val { color:#38A169; }
```

### 4.2 Bar Chart (with positive/negative handling)

Use for: CM1/MT trend, volume trend, any metric with MoM data.

Key CSS pattern for bars with data labels:
```css
.bar-group { display:flex; align-items:flex-end; gap:8px; height:200px; }
.bar-wrapper { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%; }
.bar { width:100%; border-radius:4px 4px 0 0; min-height:3px; }
.bar.positive { background:#213366; }
.bar.negative { background:#E53E3E; }
.bar-label { font-size:10px; font-weight:700; color:#213366; }
.bar-label.negative { color:#E53E3E; }
```

**Height calculation:** Normalize bar heights as percentage of max absolute value:
```
bar height % = |value| / max(|all values|) × 100
```
For negative values: use min-height:3px and red color. Don't flip bars downward — too complex in pure CSS. Instead use short red bar with negative label above.

### 4.3 Waterfall / Bridge Chart

Use for: EBITDA bridge, volume bridge, P&L walk.

Build as a series of floating bars using CSS:
```css
.waterfall { display:flex; align-items:flex-end; gap:4px; height:250px; position:relative; }
.wf-bar { flex:1; position:relative; }
.wf-fill { position:absolute; width:100%; border-radius:3px; }
.wf-fill.positive { background:#213366; }
.wf-fill.negative { background:#E53E3E; }
.wf-fill.total { background:#213366; opacity:0.3; }
.wf-label { font-size:10px; text-align:center; font-weight:700; }
.wf-connector { position:absolute; border-top:1px dashed #B0B0B0; }
```

Each bar is positioned with `bottom` and `height` calculated from cumulative values. The connector lines link bar tops.

### 4.4 Heatmap Table (Plant × State CM/MT)

Use for: route economics, margin heatmaps.

```css
.heatmap td {
  font-size:10px; padding:4px 6px; text-align:center; border:1px solid #E2E8F0;
}
.heatmap .high { background:#C6F6D5; color:#22543D; }  /* CM/MT > 2000 */
.heatmap .mid { background:#FEFCBF; color:#744210; }   /* CM/MT 500-2000 */
.heatmap .low { background:#FED7D7; color:#9B2C2C; }   /* CM/MT < 500 */
.heatmap .neg { background:#E53E3E; color:#FFF; font-weight:700; } /* Negative */
```

Color thresholds for PB CM/MT:
- Dark green: >INR 2,000/MT (healthy)
- Light yellow: INR 500-2,000/MT (acceptable)
- Light red: INR 0-500/MT (thin)
- Solid red: <INR 0 (loss-making route — governance flag)

### 4.5 Annotated Trend Line

Use for: DSI trend, NWC trend, any metric where the inflection point matters.

Build with inline SVG inside HTML for precise control:
```html
<svg viewBox="0 0 900 200">
  <polyline points="..." fill="none" stroke="#213366" stroke-width="2"/>
  <!-- Annotation callout -->
  <circle cx="[x]" cy="[y]" r="5" fill="#E53E3E"/>
  <text x="[x+10]" y="[y-10]" font-size="11" fill="#E53E3E">Peak: 37 days</text>
</svg>
```

### 4.6 Gauge / Progress Indicator

Use for: AOP achievement %, MOU achievement.

```css
.gauge { width:120px; height:120px; border-radius:50%; 
  background: conic-gradient(#213366 0% [pct]%, #E2E8F0 [pct]% 100%);
  display:flex; align-items:center; justify-content:center; }
.gauge-inner { width:80px; height:80px; border-radius:50%; background:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:24px; font-weight:800; color:#213366; }
```

---

## 5. Integration with PPTX Script

### 5.1 Full workflow example

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

// Step 1: Generate HTML
const html = `<!DOCTYPE html>
<html><head><style>
  body { font-family:Calibri,sans-serif; width:900px; padding:16px 24px; margin:0; background:#fff; }
  /* ... component CSS ... */
</style></head><body>
  <!-- KPI row + chart -->
</body></html>`;

fs.writeFileSync('/home/claude/visual_kpi.html', html);

// Step 2: Render to PNG
execSync('node scripts/html_to_image.js /home/claude/visual_kpi.html /home/claude/visual_kpi.png 900 2');

// Step 3: Get image dimensions for aspect ratio
const sizeOf = require('image-size');
const dims = sizeOf('/home/claude/visual_kpi.png');
const imgW = GRID.W; // 12.33"
const imgH = imgW * (dims.height / dims.width);

// Step 4: Add to slide
slide.addImage({
  path: '/home/claude/visual_kpi.png',
  x: GRID.L, y: GRID.TOP,
  w: imgW, h: imgH
});
```

### 5.2 Fallback if Playwright fails

If `playwright` is unavailable or crashes, fall back to `wkhtmltoimage`:
```javascript
try {
  execSync('node scripts/html_to_image.js input.html output.png 900 2');
} catch (e) {
  execSync('wkhtmltoimage --width 900 --quality 95 input.html output.png');
}
```

wkhtmltoimage produces lower quality (no 2x DPR, weaker CSS) but is a viable fallback.

### 5.3 When to use full-width vs half-width

- **Full-width (900px):** KPI rows, trend charts, waterfall bridges, heatmaps — these take the full GRID.W
- **Half-width (430px):** In two-column layouts, render at 430px. Place two images side by side:
  ```javascript
  slide.addImage({ path: 'left.png', x: GRID.L, y: GRID.TOP, w: 5.96, h: calcH });
  slide.addImage({ path: 'right.png', x: GRID.L + 6.37, y: GRID.TOP, w: 5.96, h: calcH });
  ```

---

## 6. Performance Notes

- Each render takes ~2-3 seconds (Playwright launch + render + screenshot)
- For decks with 5+ HTML visuals, total render time adds ~15 seconds. Acceptable.
- PNG file sizes: typically 40-150 KB at 2x DPR (much smaller than a PPTX chart object)
- Images are NOT editable in PowerPoint — this is the trade-off for visual quality
- If editability is required, use native pptxgenjs instead

---

## 7. Do NOT Use HTML Visuals For

- Slides where the audience explicitly needs to edit numbers in PowerPoint
- Simple 3-column tables with no conditional formatting
- Text-only content (bullets, narrative)
- Slides with >50 data cells (the image will be too dense to read — use a native table)
- Content that changes between dry-run and final version (regenerating PNGs is slower than editing text)
