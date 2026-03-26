---
name: jsw-one-pptx
description: "Master template for JSW One branded PowerPoint decks. Trigger WHENEVER user asks to create, format, or refresh any JSW One presentation — board decks, AOP, strategy, competitive intel, investor-facing, weekly/monthly reviews, S&OP, or any .pptx. Also triggers when user uploads a .pptx for formatting fix or branding cleanup, or uploads a previous deck plus new data for a refresh. Contains JSW One business context (entity structure, BUs, metrics, terminology) for use outside the main project. Use with base pptx skill (/mnt/skills/public/pptx/SKILL.md). Overrides all default design suggestions."
---

# JSW One PowerPoint Master Template

> **IMPORTANT**: Always read `/mnt/skills/public/pptx/SKILL.md` and `/mnt/skills/public/pptx/pptxgenjs.md` FIRST for pptxgenjs mechanics, QA process, and image conversion. Then apply THIS skill's branding rules, which override the base skill's color palette, font choices, and design suggestions entirely.

---

## 0. Workflow Routing — Detect What the User Needs

**Before asking pre-flight questions, determine which workflow applies:**

| User uploads / asks | Workflow | Section |
|---------------------|----------|---------|
| "Create a deck about [topic]" (no file uploaded) | **New deck creation** | Sections 1–11 |
| Uploads a .pptx + "fix formatting / apply branding / clean up" | **Formatting fix** | Section 12 |
| Uploads a .pptx + data file (xlsx/csv) + "refresh / update / same format new data" | **Deck refresh** (includes formatting fix automatically) | Section 13 (+ Section 12 applied) |
| Uploads a .pptx + "update this slide with [specific change]" (no data file) | **Surgical edit** | Section 12 (Option A) |

**Auto-detection signals:**
- Two files uploaded (one .pptx, one .xlsx/.csv) → almost certainly a **deck refresh** (Section 14, formatting fix applied automatically)
- One .pptx uploaded + "fix" / "format" / "rebrand" language → **formatting fix** (Section 13)
- No file uploaded + "create" / "make" / "build" language → **new deck** (Sections 1–11)
- One .pptx uploaded + "same structure" / "weekly" / "monthly" + data file → **deck refresh** (Section 14)

Route to the correct workflow, then follow its pre-flight questions. Do NOT ask new-deck pre-flight questions (Section 1) for a formatting fix or deck refresh.

**Analytical reference files — load BEFORE building any data-driven deck:**

| Condition | Load this reference file | Command |
|-----------|------------------------|---------|
| **Every new deck build** — component code needed | `references/component_code.md` | `view references/component_code.md` |
| Deck involves financial data, volume data, P&L, or performance metrics | `references/analytical_engine.md` | `view references/analytical_engine.md` |
| Deck covers specific BUs (PB, Homes, Manufacturing, Construction, Credit) | `references/insight_patterns_by_bu.md` | `view references/insight_patterns_by_bu.md` |
| Content quality matters (non-trivial deck, not a quick refresh) | `references/slide_thinking_principles.md` | `view references/slide_thinking_principles.md` |
| Monthly S&OP review | `references/monthly_sop_review.md` | `view references/monthly_sop_review.md` |
| Monthly financial / profitability report | `references/monthly_financial_performance.md` | `view references/monthly_financial_performance.md` |
| Monthly PB BizFin review / PB finance review | `references/monthly_pb_bizfin_review.md` | `view references/monthly_pb_bizfin_review.md` |
| Monthly Homes CEO update / Homes business review | `references/monthly_homes_ceo_update.md` | `view references/monthly_homes_ceo_update.md` |
| Slide requires hi-res visual (KPI cards, waterfall, heatmap, annotated chart) | `references/html_visual_components.md` | `view references/html_visual_components.md` |
| External audience or terminology context needed | `references/business_context.md` | `view references/business_context.md` |
| Formatting fix or deck refresh workflow | `references/formatting_and_refresh_workflows.md` | `view references/formatting_and_refresh_workflows.md` |

**Load order:** Analytical engine FIRST (it governs data pre-processing), then the BU-specific or deck-type reference. These files are NOT loaded for formatting-fix-only workflows (Section 13) or surgical edits.

**Web search rule:** Web search is ONLY used for competition analysis decks (Section 9.1) to check recent news on competitors. For all internal decks (board, S&OP, weekly review, AOP, BU reviews), do NOT run web searches. All data for internal decks comes from user-provided files and conversations only.

---

## 1. Pre-Flight: Questions to Ask EVERY TIME Before Building a New Deck

**MANDATORY — do not skip. Ask these BEFORE writing any code.**

### Phase 1: Understand scope (use `ask_user_input` widget)

**Question 1:** "What type of deck is this?"
Options: `Board deck` | `AOP / Budget deck` | `Strategy / Competitive intel` | `Investor-facing` | `Internal review (weekly/S&OP)` | `Other`

**Question 2:** "How should content be presented?"
Options: `Chart-heavy (visual/analytical)` | `Table-heavy (data-dense)` | `Text-heavy (narrative)` | `Balanced mix`

**Question 3:** "Approximate number of slides?"
Options: `5-10 (focused)` | `10-20 (standard)` | `20-30 (comprehensive)` | `30+ (detailed with annexures)`

### Phase 2: Understand narrative intent (ask conversationally)

**CRITICAL — every deck needs a driving message.** Do not start building until you understand what the user wants the audience to walk away thinking.

Ask these:
- "What is the one key message or narrative you want this deck to drive?" (e.g., "We are on track for FY27 AOP", "Private Brands needs more investment", "Working capital efficiency is our moat")
- "Where should the focus be — any BUs, metrics, or topics to emphasise vs. de-emphasise?"
- What business units or topics to cover?
- Any specific data files to pull from?
- Who is the audience? (CEO, Board, CFO, external investors, internal team)
- Time period? (monthly, quarterly, annual, FY-specific)

### Phase 3: Propose agenda and get alignment BEFORE building

**Do NOT start building slides until the user approves the agenda.**

After gathering Phase 1 + Phase 2 inputs, propose a structured agenda:

```
PROPOSED AGENDA — [Deck Title]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Narrative: [One-line summary of the driving message]
Audience: [Who] | Period: [When] | Slides: ~[N]

Section 1: [Title] — [1 line on what this section covers] (X slides)
Section 2: [Title] — [1 line] (X slides)
Section 3: [Title] — [1 line] (X slides)
...
Annexures: [What goes here] (X slides)

Total: ~[N] slides

Want to add, remove, or reorder any sections before I start?
```

**Wait for explicit approval.** If the user says "looks good" or "go ahead", proceed. If they want changes, revise the agenda and re-confirm. Only after agenda is locked, move to slide creation.

**Only after agenda is approved, proceed with deck creation.**

---

## 2. Design System — Absolute Rules

### 2.1 Colors (MANDATORY — no other colors permitted anywhere)

| Role | Name | RGB | Hex (no #) | Usage |
|------|------|-----|------------|-------|
| Primary | JSW Blue | 33, 51, 102 | `213366` | Slide headings, table header fill, content heading fill, chart primary, divider blue segment |
| Accent | JSW Red | 234, 33, 39 | `EA2127` | Divider red segment ONLY. Never in charts. Never in text. |
| Neutral | JSW Grey | 127, 127, 127 | `7F7F7F` | Subtitles, footnotes, page numbers, chart secondary series |
| Text | Black | 0, 0, 0 | `000000` | Body text, table cell text |
| Background | White | 255, 255, 255 | `FFFFFF` | Slide backgrounds, table cell fill |
| Alt Row | Light Grey | 242, 242, 242 | `F2F2F2` | Alternating table row fill |
| Border | Border Grey | 204, 204, 204 | `CCCCCC` | Table cell borders, KPI card borders |
| Header Text | White | 255, 255, 255 | `FFFFFF` | Text on blue-filled headers/boxes, chart data labels on blue bars |

**STRICT COLOR RULES:**
- Charts: ONLY `213366` (blue) and `7F7F7F` (grey). NEVER red in charts unless user explicitly asks.
- All visuals must be colorblind-friendly. Blue + grey palette satisfies this requirement.
- No gradients. No additional colors. No brand colors from other entities.
- If a third chart series is needed, use `B0B0B0` (lighter grey).

### 2.2 Typography (MANDATORY — Calibri only, no exceptions)

| Element | Font | Weight | Size (pt) | Color |
|---------|------|--------|-----------|-------|
| Slide heading (all slides) | Calibri | **Bold** | 20 | `213366` (blue) |
| Title slide heading | Calibri | **Bold** | 28 | `213366` (blue) |
| Section divider heading | Calibri | **Bold** | 24 | `213366` (blue) |
| Content heading (on blue fill) | Calibri | Bold | 12 or 14 | `FFFFFF` |
| Content heading (on white) | Calibri | Bold | 12 or 14 | `213366` |
| Body text | Calibri | Regular | **12** | `000000` |
| Table header text | Calibri | Bold | 12 | `FFFFFF` (on `213366` blue fill) |
| Table body text | Calibri | Regular | **12** | `000000` |
| Chart data labels (inside blue bars) | Calibri | Bold | 11 | `FFFFFF` (white) |
| Chart data labels (inside grey bars) | Calibri | Bold | 11 | `FFFFFF` (white) |
| Footnotes / source | Calibri | Regular | 10 | `7F7F7F` |
| Page number | Calibri | Regular | 10 | `7F7F7F` |
| KPI callout number | Calibri | Bold | 28-36 | `213366` |
| KPI callout label | Calibri | Regular | 11 | `7F7F7F` |

**STRICT TYPOGRAPHY RULES:**
- Calibri ONLY. No substitutions. No secondary font.
- **Standard body text size is 12pt.** Use 12pt for ALL body text, table cells, bullet points, takeaway text, and card descriptions across every slide. This is not optional.
- **10pt is ONLY permitted for:** footnotes, source lines, and page numbers. Nothing else.
- **11pt is ONLY permitted for:** chart data labels and KPI callout labels. If a table is extremely data-dense (10+ columns) and content overflows at 12pt, table cell text may be reduced to 11pt as a last resort. Never go below 11pt for table cells.
- Bold ONLY for: slide headings, content headings, table headers, chart data labels, KPI numbers, total/summary rows. Body text and bullets are NEVER bold.
- **All slide headings are BOLD by default.**

### 2.3 Writing Style — Anti-AI Rules

**Content generated for slides MUST read as if written by a human professional, not an AI. The following patterns are telltale AI markers and are strictly forbidden:**

**NEVER use:**
- Em dashes ( — ) or en dashes ( - ) as sentence connectors. Use a comma, full stop, or restructure the sentence. A simple hyphen (-) is acceptable only in compound words (e.g., "year-on-year") or number ranges (e.g., "FY25-FY27").
- Semicolons (;) to join clauses. Use two separate sentences or a comma.
- "Leverage", "utilise", "drive synergies", "unlock value", "holistic", "robust", "seamless", "paradigm", "ecosystem" (when used as empty filler). These are acceptable only when they are the precise technical term.
- "It is worth noting that...", "It should be highlighted that...", "Importantly, ...", "Notably, ..."
- Overly parallel bullet structures (e.g., every bullet starting with a gerund: "Driving...", "Enabling...", "Strengthening..."). Vary sentence structure naturally.
- Colon-heavy constructions like "Key takeaway: the metric improved." Write naturally: "The metric improved by 15% QoQ."

**ALWAYS prefer:**
- Short, direct sentences. If a bullet needs more than 2 lines, it should probably be two bullets.
- Specifics over generalities. "Volume grew 35% to 1,680 KMT" not "Volume showed strong growth."
- Active voice. "Enterprise missed target by 12%" not "Target was missed by Enterprise by 12%."
- Numbers and data points in every bullet where applicable. Avoid purely qualitative statements on data slides.
- Language a finance professional would use in a meeting. Read each bullet aloud. If it sounds like a ChatGPT summary, rewrite it.

### 2.3 Capitalization Rules

**Sentence case everywhere — including all headings.**
- Capitalize ONLY the first letter of the first word.
- Proper nouns (JSW One, EBITDA, FY27, JODL, etc.) retain their capitalization.
- Do NOT use Title Case for headings.
- Examples:
  - ✅ "FY27 AOP — volume targets by business unit"
  - ❌ "FY27 AOP — Volume Targets by Business Unit"
  - ✅ "Competitive benchmarking — capital efficiency vs peers"
  - ❌ "Competitive Benchmarking — Capital Efficiency Vs Peers"
  - ✅ "Platform performance overview"
  - ❌ "Platform Performance Overview"

### 2.4 Text Alignment Rules

**Text boxes (body text, bullets, paragraphs):**
- Vertical alignment: **top** (`valign: 'top'`)
- Horizontal alignment: **justified** (`align: 'justify'`) by default
- Exception: Only use center/left/right if user explicitly requests it

**Tables:**
- Numbers: **center-aligned** (`align: 'center'`)
- Text content: **left-aligned** (`align: 'left'`)
- Table headers: align to match the column content below (text headers = left, number headers = center)

### 2.5 Slide Dimensions

```javascript
pres.layout = 'LAYOUT_WIDE';  // 13.33" × 7.5"
```

All coordinates in this skill assume LAYOUT_WIDE. Do NOT use any other layout.

### 2.6 Master Alignment Grid

**All content elements on a slide must snap to a consistent alignment grid. This prevents misaligned left edges, ragged right edges, and visually jarring slides.**

```
LAYOUT_WIDE: 13.33" × 7.5"

LEFT EDGE (L):  0.50"   ← Slide heading, tables, charts, content headings, text boxes, cards all start here
RIGHT EDGE (R): 12.83"  ← All content elements end here (L + content width 12.33")
CONTENT WIDTH:  12.33"  ← R minus L
CONTENT TOP:    0.95"   ← Below divider line
CONTENT BOTTOM: 6.80"   ← Above footer zone
FOOTER ZONE:    7.05"   ← Page numbers and source text
```

**Grid rules:**
1. **Slide heading** starts at x: 0.50 (same as content). Not 0.25 or any other value.
2. **Tables** start at x: 0.50 with width 12.33 (ending at 12.83).
3. **Charts** start at x: 0.50 with width 12.33.
4. **Content heading boxes** (blue fill) start at x: 0.50 with width matching content below them.
5. **KPI cards** row starts at x: 0.50 and the last card ends at or near 12.83.
6. **Text boxes** (bullets, paragraphs) start at x: 0.50 with width 12.33.
7. **Takeaway boxes** start at x: 0.50 with width 12.33.
8. **Two-column layout** splits at midpoint: left column x: 0.50 w: 5.90, right column x: 6.70 w: 5.90 (gap: 0.30). Both columns end at 12.60.

**The ONLY exceptions:**
- Page number: x: 0.30 (left of the grid, in footer zone)
- Logo: right-aligned at x: 10.80 (above the grid in header zone)
- Title slide title/subtitle: x: 0.60 (slightly indented, only on title slide)
- Section divider title: x: 0.80 (centred vertically, not a content slide)
- Agenda number badges: x: 0.80 (visual indent from grid edge)

**Constant to use everywhere:**
```javascript
const GRID = {
  L: 0.50,       // Left edge
  R: 12.83,      // Right edge
  W: 12.33,      // Content width (R - L)
  TOP: 0.95,     // Content top (below divider)
  BOTTOM: 6.80,  // Content bottom (above footer)
  H: 5.85,       // Usable content height (BOTTOM - TOP)
  FOOTER_Y: 7.05 // Footer y position
};
```

### 2.7 No-Overlap Rule and Element Stacking

**MANDATORY: No content element may overlap any other content element. This is the #1 visual quality issue. Apply these rules rigorously.**

**Height-tracking approach — use a cursor variable:**
Every content slide should track vertical position using a `cursorY` variable. Each element is placed at `cursorY`, and after placement, `cursorY` advances by the element's height + a gap.

```javascript
let cursorY = GRID.TOP;  // Start below divider
const GAP = 0.15;        // Minimum gap between elements

// Place content heading
addContentHeading(slide, GRID.L, cursorY, GRID.W, 'Section title');
cursorY += 0.35 + GAP;   // heading height (0.35) + gap

// Place table
const tableH = (rows.length + 1) * rowH;  // header + data rows
slide.addTable(tableData, { x: GRID.L, y: cursorY, w: GRID.W, rowH: rowH });
cursorY += tableH + GAP;

// Place takeaway — ONLY if there's room
if (cursorY + 0.60 < GRID.BOTTOM) {
  addContentHeading(slide, GRID.L, cursorY, GRID.W, 'Key takeaway');
  cursorY += 0.35 + 0.05;
  slide.addText(takeawayText, { x: GRID.L, y: cursorY, w: GRID.W, h: GRID.BOTTOM - cursorY });
} else {
  // No room — skip takeaway or move to next slide
}
```

**Rules:**
1. Every element placed on a slide must use `cursorY` (or equivalent dynamic calculation), not a hardcoded y-position.
2. The gap between elements is 0.15" minimum.
3. If `cursorY + elementHeight > GRID.BOTTOM`, the element does NOT fit. Options: reduce previous element heights, move to next slide, or skip.
4. NEVER ignore the calculation and place an element at a fixed y hoping it won't overlap.

**Mixed content slides (table + text) — the most common overlap scenario:**
- Calculate table height first: `(headerRows + dataRows) * rowH`
- Then check remaining space: `GRID.BOTTOM - (tableY + tableH) - GAP`
- If remaining space < 0.50", do NOT add text below the table. Either:
  - Reduce table row height (min 0.30")
  - Reduce table font to 11pt
  - Move text to next slide
  - Use a two-column layout instead (table left, text right)

### 2.7.1 Header Block Alignment

**Content heading boxes must match the width of the content directly below them.**

- If a table spans GRID.W (12.33"), the heading box above it must also be GRID.W.
- If content is two-column (left: 5.90", right: 5.90"), each column gets its own heading box at that column's width, NOT a single full-width heading.
- If a heading box is followed by a full-width element below AND a two-column element further below, the heading aligns to whatever it directly labels.

```javascript
// CORRECT: heading matches content width
addContentHeading(slide, GRID.L, cursorY, GRID.W, 'Full-width section');
// ... full-width table below

// CORRECT: two-column headings match column widths
addContentHeading(slide, GRID.L, cursorY, 5.90, 'Left section');
addContentHeading(slide, 6.70, cursorY, 5.90, 'Right section');

// WRONG: full-width heading over two-column content
addContentHeading(slide, GRID.L, cursorY, GRID.W, 'This heading is too wide');
// ... two-column content below (looks misaligned)
```

### 2.8 Mandatory Structural Elements — Agenda and Section Dividers

**MANDATORY: These are non-negotiable structural requirements for every JSW One deck.**

| Deck size | Agenda slide (Layout B) | Section dividers (Layout D) |
|-----------|------------------------|----------------------------|
| 1-4 slides | Not required | Not required |
| 5-9 slides | **MANDATORY** as Slide 2 | Optional |
| 10+ slides | **MANDATORY** as Slide 2 | **MANDATORY** between every major agenda section |

**Rules:**
1. The Agenda slide is always Slide 2 (immediately after the Title slide).
2. Every section listed on the Agenda slide must have a corresponding Section Divider (Layout D) preceding its content slides, if the deck has 10+ slides.
3. Section dividers count toward the total slide count but do NOT contain data. They are navigation aids.
4. Weekly reviews (<12 slides) are the ONLY exemption from section dividers, but still require an Agenda slide if 5+ slides.
5. Competition analysis decks, board decks, S&OP reviews, BU reviews, AOP decks — all require both Agenda and Section Dividers when they exceed the thresholds above.

---

## 3. Logo, Divider & Page Numbers — Core Brand Elements

### 3.1 Logo Loading

**MANDATORY: The JSW One logo MUST appear on every slide. Do NOT proceed with deck generation if the logo file is missing.**

**Step 0: Verify logo exists BEFORE writing any code.**

Check for the logo in uploads:
```bash
ls /mnt/user-data/uploads/ | grep -i "jsw.*logo\|logo.*jsw"
```

If no logo file is found, **STOP and ask the user to upload it:**

> "I need the JSW One logo file to proceed. Please upload the logo PNG in this chat. Every slide requires the logo per brand standards, so I cannot generate the deck without it."

**Do NOT proceed without the logo. Do NOT generate slides with missing logo placeholders. Wait for the upload.**

**Step 1: Clean the logo (run once before deck generation):**

The source PNG may have a black background — preprocess to make it transparent before embedding.

```python
# Run this Python block BEFORE the Node.js deck script
from PIL import Image
import numpy as np

img = Image.open("/mnt/user-data/uploads/JSW_Logo_Final.png").convert("RGBA")
data = np.array(img)
# Black pixels (R<30, G<30, B<30) -> transparent
mask = (data[:,:,0] < 30) & (data[:,:,1] < 30) & (data[:,:,2] < 30)
data[mask, 3] = 0
Image.fromarray(data).save("/home/claude/JSW_Logo_Clean.png")
```

**Step 2: Load in Node.js:**
```javascript
const fs = require('fs');

// Logo loading — fail loudly if missing
let LOGO_B64;
try {
  LOGO_B64 = "image/png;base64," + fs.readFileSync('/home/claude/JSW_Logo_Clean.png').toString('base64');
} catch (e) {
  try {
    LOGO_B64 = "image/png;base64," + fs.readFileSync('/mnt/user-data/uploads/JSW_Logo_Final.png').toString('base64');
  } catch (e2) {
    const uploads = fs.readdirSync('/mnt/user-data/uploads/');
    const logoFile = uploads.find(f => /jsw.*logo/i.test(f) || /logo.*jsw/i.test(f));
    if (logoFile) {
      const ext = logoFile.split('.').pop().toLowerCase();
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
      LOGO_B64 = mime + ";base64," + fs.readFileSync('/mnt/user-data/uploads/' + logoFile).toString('base64');
    } else {
      throw new Error('LOGO NOT FOUND — cannot proceed. Ask user to upload JSW_Logo_Final.png');
    }
  }
}
```

### 3.2 Logo Placement — Correct Aspect Ratio

**Logo native aspect ratio is 3.035:1 (w:h). All placements MUST preserve this ratio.**

| Slide Type | Position | x | y | w | h |
|------------|----------|---|---|---|---|
| Title slide | Top-right, above divider | 10.30 | 2.10 | 2.40 | 0.79 |
| Content slide (all) | Top-right, above divider | 10.80 | 0.02 | 2.10 | 0.69 |
| Section divider | Right, near title | 10.30 | 2.55 | 2.40 | 0.79 |
| Index / agenda slide | Top-right, above divider | 10.80 | 0.02 | 2.10 | 0.69 |
| Annexure slide | Top-right, above divider | 10.80 | 0.02 | 2.10 | 0.69 |

### 3.3 Divider Line

Two-segment horizontal bar: blue left (~65%), red right (~35%), with a slight overlap creating a seamless butt joint. **Consistent thickness on ALL slides: 0.05".**

**CRITICAL: Both segments must have `line: { width: 0, color: 'FFFFFF' }` to prevent border artifacts. Do NOT use triangles, pin joints, or any complex shapes for the divider. Two overlapping rectangles only.**

```javascript
function addDivider(slide, y) {
  const H = 0.05;
  // Blue bar — left 66%
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: y, w: 8.80, h: H,
    fill: { color: '213366' }, line: { width: 0, color: 'FFFFFF' }
  });
  // Red bar — right 36% (overlaps blue slightly for seamless join)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.40, y: y, w: 4.93, h: H,
    fill: { color: 'EA2127' }, line: { width: 0, color: 'FFFFFF' }
  });
}
```

| Slide Type | Divider y position |
|------------|--------------------|
| Title slide | 2.95 |
| Content slide | 0.75 |
| Section divider | 3.35 |
| Index / agenda | 0.75 |

### 3.4 Page Numbers

**Page numbers appear on EVERY slide, left bottom corner.**

```javascript
function addPageNumber(slide, pageNum) {
  slide.addText(String(pageNum), {
    x: 0.30, y: 7.05, w: 0.50, h: 0.35,
    fontSize: 10, fontFace: 'Calibri', color: '7F7F7F',
    align: 'left', valign: 'middle', margin: 0
  });
}
```

### 3.5 Footer Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Page#]                               [Source / asterisks — right]  │
│  x:0.30                                                x:6.50-12.80 │
└──────────────────────────────────────────────────────────────────────┘
```

- **Left bottom (x: 0.30):** Page number ONLY. Nothing else.
- **Right bottom (x: 6.50 to 12.80):** Source citations, asterisks, footnotes. Right-aligned.
- **No content in the center bottom area.**

```javascript
function addFooter(slide, pageNum, sourceText) {
  addPageNumber(slide, pageNum);
  if (sourceText) {
    slide.addText(sourceText, {
      x: 6.50, y: 7.05, w: 6.30, h: 0.35,
      fontSize: 10, fontFace: 'Calibri', color: '7F7F7F',
      italic: true, align: 'right', valign: 'middle', margin: 0
    });
  }
}
```

---

## 4. Slide Layouts

### 4.1 Layout A — Title Slide

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                                                                      │
│  [Deck title — 28pt, blue, bold, left]                    [JSW Logo] │
│  ════════════════════════════════╤═══════════════════════════════     │ ← y=2.95
│  [Subtitle — 12pt grey]                                              │
│  [Date — 11pt grey]                                                  │
│                                                                      │
│                                                                      │
│  [pg#]                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

```javascript
function addTitleSlide(pres, title, subtitle, dateText, pageNum) {
  let slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  slide.addText(title, {
    x: 0.60, y: 1.90, w: 9.40, h: 1.00,
    fontSize: 28, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 2.95);

  if (LOGO_B64) slide.addImage({ data: LOGO_B64, x: 10.30, y: 2.10, w: 2.40, h: 0.79 });

  if (subtitle) slide.addText(subtitle, {
    x: 0.64, y: 3.12, w: 9.40, h: 0.45,
    fontSize: 12, fontFace: 'Calibri', color: '7F7F7F',
    align: 'left', valign: 'top', margin: 0
  });

  if (dateText) slide.addText(dateText, {
    x: 0.64, y: 3.52, w: 9.40, h: 0.35,
    fontSize: 12, fontFace: 'Calibri', color: '7F7F7F',
    align: 'left', valign: 'top', margin: 0
  });

  addPageNumber(slide, pageNum);
  return slide;
}
```

### 4.2 Layout B — Index / Agenda Slide

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Slide heading — 20pt, blue, bold]                       [JSW Logo] │
│  ════════════════════════════════╤═══════════════════════════════     │ ← y=0.75
│                                                                      │
│  ┌─ AGENDA ITEMS ──────────────────────────────────────────────┐     │
│  │  01  Section title one                                      │     │
│  │  02  Section title two                                      │     │
│  │  03  Section title three                                    │     │
│  │  04  Section title four                                     │     │
│  │  ...                                                        │     │
│  └─────────────────────────────────────────────────────────────┘     │
│  [pg#]                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

Each agenda item is a row with a blue number badge + section title. Blue horizontal rule under each item.

```javascript
function addIndexSlide(pres, sections, pageNum) {
  let slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  slide.addText('Agenda', {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  if (LOGO_B64) slide.addImage({ data: LOGO_B64, x: 10.80, y: 0.02, w: 2.10, h: 0.69 });

  const startY = 1.10;
  const rowH = 0.65;

  sections.forEach((section, i) => {
    const y = startY + i * rowH;
    const num = String(i + 1).padStart(2, '0');

    // Number badge (blue filled rectangle)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.80, y: y + 0.08, w: 0.50, h: 0.40,
      fill: { color: '213366' }
    });
    slide.addText(num, {
      x: 0.80, y: y + 0.08, w: 0.50, h: 0.40,
      fontSize: 14, fontFace: 'Calibri', color: 'FFFFFF',
      bold: true, align: 'center', valign: 'middle', margin: 0
    });

    // Section title
    slide.addText(section, {
      x: 1.50, y: y + 0.08, w: 10.00, h: 0.40,
      fontSize: 14, fontFace: 'Calibri', color: '000000',
      align: 'left', valign: 'middle', margin: 0
    });

    // Separator line
    slide.addShape(pres.shapes.LINE, {
      x: 0.80, y: y + rowH - 0.05, w: 10.70, h: 0,
      line: { color: 'F2F2F2', width: 1 }
    });
  });

  addPageNumber(slide, pageNum);
  return slide;
}
```

**Agenda is always top-aligned.** Do not centre vertically, even for short lists. Consistent top alignment is cleaner.

### 4.3 Layout C — Content Slide (Standard)

Used for ALL content slides: tables, charts, text, mixed.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Slide heading — 20pt, blue, bold]                       [JSW Logo] │
│  ════════════════════════════════╤═══════════════════════════════     │ ← y=0.75
│                                                                      │
│  ┌─ CONTENT AREA ──────────────────────────────────────────────┐     │
│  │  x: 0.50  y: 0.95  w: 12.33  h: 5.80                      │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  [pg#]                                              [Source — right]  │
└──────────────────────────────────────────────────────────────────────┘
```

```javascript
function addContentSlide(pres, title, pageNum, sourceText) {
  let slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  slide.addText(title, {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  if (LOGO_B64) slide.addImage({ data: LOGO_B64, x: 10.80, y: 0.02, w: 2.10, h: 0.69 });
  addFooter(slide, pageNum, sourceText);

  return slide;
}

// Content area constants — use GRID for all positioning
const GRID = {
  L: 0.50, R: 12.83, W: 12.33,
  TOP: 0.95, BOTTOM: 6.80, H: 5.85,
  FOOTER_Y: 7.05
};
const CONTENT = { x: GRID.L, y: GRID.TOP, w: GRID.W, h: GRID.H };
```

### 4.4 Layout D — Section Divider

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                                                                      │
│  [Section title — 24pt, blue, bold]                       [JSW Logo] │
│  ════════════════════════════════╤═══════════════════════════════     │ ← y=3.35
│  [Subtitle — 14pt grey]                                              │
│                                                                      │
│                                                                      │
│  [pg#]                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

```javascript
function addSectionSlide(pres, sectionTitle, sectionSubtitle, pageNum) {
  let slide = pres.addSlide();
  slide.background = { color: 'FFFFFF' };

  slide.addText(sectionTitle, {
    x: 0.80, y: 2.40, w: 9.20, h: 0.90,
    fontSize: 24, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 3.35);
  if (LOGO_B64) slide.addImage({ data: LOGO_B64, x: 10.30, y: 2.55, w: 2.40, h: 0.79 });

  if (sectionSubtitle) slide.addText(sectionSubtitle, {
    x: 0.80, y: 3.55, w: 9.20, h: 0.55,
    fontSize: 14, fontFace: 'Calibri', color: '7F7F7F',
    align: 'left', valign: 'top', margin: 0
  });

  addPageNumber(slide, pageNum);
  return slide;
}
```

### 4.5 Layout E — Two-Column Content

Same chrome as Layout C. Content area splits into two columns:

| Element | x | y | w | h |
|---------|---|---|---|---|
| Left column | 0.50 | 0.95 | 5.90 | 5.80 |
| Right column | 6.70 | 0.95 | 5.90 | 5.80 |
| Column gap | — | — | 0.30 | — |

Use `addContentSlide()` for chrome, then place content in left (x: 0.50, w: 5.90) and right (x: 6.70, w: 5.90) columns.

### 4.6 Layout F — Annexure Slide

Same as Layout C but:
- Title format: `"Annexure [N]: [title]"` in sentence case
- Body font one step smaller if deck uses 12pt (use 11pt)

---

## 5. Component Patterns

**Full code for all component functions is in `references/component_code.md`.** Load it before writing any deck script.

```
view references/component_code.md
```

**Quick reference — available components:**

| Component | Function | Key rules |
|-----------|----------|-----------|
| Tables | `addStyledTable()`, `addSimpleTable()` | Header: blue fill, white text. Data: alternating white/grey. ColW must sum ≤ GRID.W (12.33"). |
| Bar/Column charts | `addStyledBarChart()` | Data labels: inside bars, white bold. Value axis hidden. Colors: blue primary, grey secondary. No red. |
| Line charts | Same color/axis rules | Data labels in black (no bar fill). |
| KPI cards | `addKPICard()` | Fixed height: 1.05" (with sublabel) or 0.85" (without). Blue top accent bar. |
| Content heading box | `addContentHeading()` | Blue fill, white text, 0.35" height. |
| Bullet points | Standard pptxgenjs text array | Blue bullet color, 12pt body, paraSpaceAfter: 6. |
| RAG indicators | Blue (on track), Grey (at risk), White+border (off track) | Colorblind-safe — no red/green. |
| Trend arrows | `addUpArrow()` / `addDownArrow()` | Blue for positive (▲), Grey for negative (▼). Color the VALUE text too, not just the arrow. |
| Variance badges | `addVarianceBadge()` | Blue (+) or Grey (-) badge next to metric. |
| Flow arrows | `addFlowArrow()` | Grey arrow between elements. |
| Callout box | `addCalloutBox()` | Blue left border, light fill. Use for inline annotations. |
| Text size flexibility | — | If slide has ≤3 content elements and no table, scale titles/KPIs up (24-36pt). |

**HTML visual pipeline:** For visually rich graphics (heatmaps, waterfall charts, conditional-formatted cards), use the HTML-to-Image pipeline in `references/html_visual_components.md`.

---

## 6. Slide Content & Layout Principles

### 6.0 What is fixed vs what is free

**This skill has two layers. Know which layer you are in.**

| Layer | What it covers | Flexibility |
|-------|---------------|-------------|
| **Brand language** (Sections 2-5, 7) | Colours, fonts, logo, divider, grid, page numbers, number formatting, sentence case | **Zero.** These are identity. Follow exactly. |
| **Content expression** (this section) | How data is presented, how insights are communicated, slide composition, visual storytelling | **High.** These are creative guidelines. Use judgment. Vary your approach. Surprise the reader. |

The worst outcome is a deck where every slide looks identical: table + blue "Key takeaway" box + footer. That is a template, not a presentation. The brand language should be consistent; the content expression should be alive.

### 6.1 Every slide should land a message — but the delivery is yours

A slide with a table and no interpretation is weak. But the fix is NOT always a blue box labeled "Key takeaway" bolted to the bottom. That is one option among many.

**Ways to embed the "so what" into a slide (pick the one that fits, vary across the deck):**

| Technique | When it works best | Example |
|-----------|-------------------|---------|
| **The data IS the message** | When the numbers speak for themselves | A table where the total row is in bold, the miss is highlighted with ▼, and the column header says "vs AOP (+12%)" — no separate takeaway needed |
| **Inline annotation** | When one cell or bar in a chart needs attention | A callout arrow pointing to the outlier bar with "3x QoQ" next to it |
| **Hero stat + supporting detail** | When one number anchors the slide | "INR 1,644 Cr" at 44pt, with a 4-row supporting table below |
| **Two-column: data left, story right** | When the narrative is as important as the numbers | Table on left, 3-4 bullets on right explaining what happened and why |
| **Callout box** (Section 5.8) | When the CEO needs to see one thing | Blue-left-border box at the top: "Private Brands is the only BU on track for AOP" — then the data below it |
| **Bold inline text within bullets** | When insights are woven into the commentary | "UP contributed 45% of volume (**up from 32% last quarter**), driven by 18 new dealer activations in Lucknow and Kanpur." |
| **Chart + annotation labels** | When the trend line tells the story | A line chart with a text label at the inflection point: "CM pricing change (Nov)" |
| **Variance badges** (Section 5.8) | When plus/minus is the story | Metric cards with blue (+12%) or grey (-8%) badges, no separate paragraph needed |
| **Process flow with insights at each step** | When the story is sequential | Lead → Design → Build → Deliver, with conversion rates and drop-off insights at each arrow |
| **A dedicated takeaway box** | When the data is dense and the message isn't obvious from the numbers alone | Blue heading box + text below. This is fine — just don't use it on every single slide. |

**The principle:** If a reader can glance at a slide for 5 seconds and understand whether things are going well or badly, the slide has landed its message — regardless of which technique was used.

**What NOT to do:**
- A table with 8 rows of "[data needed]" and a blue box below saying "[Populate takeaway]" — this is a template, not a slide.
- The same "Key takeaway" blue box on slides 3, 4, 5, 6, 7, 8, 9 — vary the approach.
- A bullet list where every bullet starts with a metric name and ends with a number — that is a table disguised as bullets; use a table.

### 6.2 Layout selection — match the content, not variety for variety's sake

### 6.2 Visual content selection — when to use what

**Quality standard: The output should match the visual quality of a Bain, BCG, or McKinsey slide deck. These firms use charts, diagrams, maps, and visual frameworks liberally because they communicate faster than text. Apply the same judgment — use visuals wherever they make the slide clearer, more compelling, or faster to read. Do not default to text-and-tables when a chart or diagram would tell the story better.**

**When to prefer charts over text/tables:**

| Data pattern | Preferred visual | Avoid |
|-------------|-----------------|-------|
| Trend over 3+ periods (FY25, FY26, FY27) | Bar chart or line chart | Bullets listing numbers per period |
| Comparison across 3+ BUs or competitors | Grouped bar chart | Text paragraph comparing each |
| Composition / share (revenue mix, volume split) | Doughnut chart or stacked bar | Text saying "X is 45%, Y is 30%" |
| Year-over-year growth trajectory | Bar chart with YoY% labels | Table with growth column only |
| EBITDA / P&L walk (bridge from FY26 to FY27) | Waterfall chart (or stacked bar simulation) | Bullets describing each component |

**When tables are the right choice:**
- Single period, many detailed line items (>8 rows of granular data)
- When exact numbers are the point (not the trend)
- Financial statements (P&L, balance sheet)
- Action item trackers (who/what/when)

**General rule: if the story is about "how much" or "which direction", use a chart. If the story is about "what exactly", use a table.**

#### BU-specific visual recommendations

**These BUs have natural visual treatments that make slides significantly more effective. Use them where the content and data support it.**

| BU / Topic | Recommended visual | How to build |
|-----------|-------------------|-------------|
| **Private Brands — geographic presence** | India map with state shading showing distribution footprint | **Generate using Python:** `python scripts/generate_india_map.py --preset pb_distribution --output /home/claude/pb_map.png`, then embed with `slide.addImage()`. If states have changed, create a custom config JSON and pass via `--config`. |
| **Private Brands — supply chain** | Map or diagram showing contract manufacturer locations | Generate map with custom config listing plant cities. |
| **Homes — studio locations** | India map with city markers (live vs planned studios) | **Generate using Python:** `python scripts/generate_india_map.py --preset homes_studios --output /home/claude/homes_map.png`, then embed. Update city list in preset if new studios added. |
| **Homes — project pipeline** | Funnel diagram: leads → design → construction → delivery | Use step badges + arrow shapes from Section 5.8, or a horizontal process flow |
| **Construction — retailer expansion** | Map or bar chart by state showing retailer count growth | Bar chart preferred (state-wise retailer count) |
| **Manufacturing — product mix** | Doughnut chart or stacked bar (HR, CR, HRPO, Coated, WR %) | Use chart, not a table with percentages |
| **Credit — penetration by BU** | Stacked bar or doughnut (Enterprise, SMB, Construction, PB split) | Chart, not text bullets |
| **Overall platform — GMV/volume trend** | Bar chart (multi-year: FY24, FY25, FY26, FY27) | Always a chart for multi-year GMV/volume |
| **AOP — EBITDA bridge** | Waterfall chart (FY26 base → BU contributions → FY27 target) | Build using stacked bar technique from Section 5.5 |

#### Image preservation from source decks

**When the user uploads a previous deck that contains images (maps, photos, diagrams), these MUST be preserved in any refresh or rebuild.**

Steps:
1. When reading the old deck, identify all embedded images using the unpack workflow
2. Extract images from `ppt/media/` directory
3. Re-embed them in the new deck at the same or similar position
4. If extraction fails (corrupted, incompatible format), use a descriptive grey placeholder box:
   ```javascript
   slide.addShape(pres.shapes.RECTANGLE, {
     x: GRID.L, y: cursorY, w: 5.90, h: 3.50,
     fill: { color: 'F2F2F2' }, line: { color: 'CCCCCC', width: 1 }
   });
   slide.addText('[Image from previous deck: India map showing PB distribution]\n[Please re-upload image for embedding]', {
     x: GRID.L + 0.20, y: cursorY + 0.50, w: 5.50, h: 2.50,
     fontSize: 12, fontFace: 'Calibri', color: '7F7F7F',
     align: 'center', valign: 'middle'
   });
   ```
5. NEVER silently drop images and replace with text. If an image existed in the old deck, the new deck must have either the image or a visible placeholder.

**When to prefer visual over text (general rule):**
- *Where* (geography, presence, expansion) → map
- *How much* over time → chart
- *What exactly* (detailed numbers) → table
- *What to do* (actions, priorities) → cards or bullets
- *How it works* (process, flow) → step diagrams with arrows

**Layout toolkit (use what fits the content):**

| Pattern | Components | Good for |
|---------|-----------|----------|
| Full-width table + inline emphasis | Table with bold total row, ▲▼ indicators in cells | Data-dense BU comparisons |
| Hero stat + supporting content | Large number (36-48pt) + small table or bullets below | Exec summary, single-metric slides |
| Two-column: chart + commentary | Bar/line chart left, bullets right | Trend analysis with narrative |
| Two-column: table + table | Compact tables side by side | Actual vs plan, this quarter vs last |
| Two-column: map + bullets/table | Map or image left, text right | Geographic presence, studio rollout |
| KPI row + detail below | 4-5 KPI cards at top, table or chart filling the rest | Dashboard-style overview slides |
| Cards (2 or 3 column) | Content-sized cards with titles | Priorities, recommendations, action items |
| Full-width chart + inline labels | Chart using 80% of content area | When the visual IS the story |

#### HTML-to-Image pipeline — for visually rich graphics

**When the visual quality of pptxgenjs shapes isn't sufficient, use the HTML-to-Image pipeline.** This renders HTML/CSS to a hi-res PNG via Playwright, then embeds the PNG on the slide. The output is dramatically sharper than pptxgenjs shapes — proper typography, shadows, rounded corners, conditional color-coding, and complex layouts.

**Use it for:** KPI card rows with color-coded borders, waterfall/bridge charts, heatmaps (plant × state CM/MT), trend charts with positive/negative bar coloring, comparison dashboards.

**Do NOT use it for:** Simple tables (pptxgenjs is fine and editable), text-heavy slides, content the audience needs to edit in PowerPoint.

**Pipeline:** Write HTML → render via `node scripts/html_to_image.js input.html output.png 900 2` → embed PNG on slide with `slide.addImage()`. Full details in `references/html_visual_components.md`.

**When to trigger:** If the user asks for "high quality visuals", "dashboard-style slides", "better looking charts", or if the analytical engine recommends a waterfall, heatmap, or annotated chart — load `references/html_visual_components.md` and use the pipeline.

### 6.3 Cards — content-aware sizing

**Cards are one tool, not the default.** Use them when content naturally breaks into 2-4 parallel points (priorities, recommendations, comparisons). Do not use cards for sequential information (use numbered steps), single long narratives (use bullets or callout boxes), or data (use tables).

**CRITICAL: Card height must match content, not a fixed value.** Oversized cards with empty bottom halves look worse than plain bullets. Always estimate height from text length.

**Height estimation formula:**
```javascript
function estimateCardH(title, body, cardW) {
  const innerW = cardW - 0.30;
  const charsPerLine = Math.floor(innerW / 0.07);
  const titleLines = Math.ceil(title.length / charsPerLine);
  const bodyLines = Math.ceil(body.length / charsPerLine);
  const titleH = titleLines * 0.22;
  const bodyH = bodyLines * 0.20;
  const padding = 0.30;
  return Math.max(titleH + bodyH + padding, 0.80);
}
```

**Card function:**
```javascript
function addCard(slide, x, y, w, h, title, body) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: h,
    fill: { color: 'FFFFFF' },
    line: { color: 'CCCCCC', width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: w, h: 0.04,
    fill: { color: '213366' }
  });
  slide.addText(title, {
    x: x + 0.15, y: y + 0.12, w: w - 0.30, h: 0.25,
    fontSize: 12, fontFace: 'Calibri', color: '213366',
    bold: true, align: 'left', valign: 'top', margin: 0
  });
  slide.addText(body, {
    x: x + 0.15, y: y + 0.40, w: w - 0.30, h: h - 0.50,
    fontSize: 12, fontFace: 'Calibri', color: '000000',
    align: 'justify', valign: 'top', margin: 0
  });
}
```

**Usage — define content first, then calculate height:**
```javascript
const cardW = (GRID.W - 0.40) / 3;
const cardGap = 0.20;
const cards = [
  { title: 'Scale Private Brands', body: 'Activate 20 new dealers in Bihar. Resolve Raipur CM constraint.' },
  { title: 'Complete DRHP filing', body: 'Legal review done. Target filing by end-March.' },
  { title: 'Reduce NWC days', body: 'Renegotiate top 5 supplier terms. Target X to Y days.' }
];
const cardH = Math.max(...cards.map(c => estimateCardH(c.title, c.body, cardW)));
cards.forEach((c, i) => {
  addCard(slide, GRID.L + i * (cardW + cardGap), GRID.TOP + 0.50, cardW, cardH, c.title, c.body);
});
```

### 6.4 Space management — fill with purpose, not filler

If a slide has significant empty space, the answer is not always "add a takeaway box." Consider:
- Is the content better with breathing room? (exec summary, section divider — these SHOULD be spacious)
- Can the chart or table be made taller to fill the space meaningfully?
- Would a second visual (a supporting mini-chart, a trend sparkline, a before/after comparison) add real value?
- Is this slide actually trying to do too little? Should it be merged with the next slide?

Only add content to fill space if it adds information or emphasis. A forced "Key takeaway" box with generic text is worse than white space.

### 6.5 Text-heavy slides — minimum 12pt

On slides where text is the primary content (recommendations, action items, narrative summaries), **minimum font size is 12pt for all body text.** See Section 5.9 for when to go bigger.

---

## 6A. Slide Thinking — Consulting-Grade Construction Principles

**Full principle explanations with examples are in `references/slide_thinking_principles.md`.** Load it for any new deck build where content quality matters.

```
view references/slide_thinking_principles.md
```

**Quick reference card — all 10 principles (always apply these):**

| # | Principle | One-line check |
|---|-----------|---------------|
| 1 | One slide, one message | Can I state this slide's message in one sentence? |
| 2 | Hybrid titles | Is this a key slide (insight title) or a data slide (topic title)? |
| 3 | Answer first, then support | Does the top 20% of the slide deliver the conclusion? |
| 4 | Every number earns its place | Does every data point support this slide's single message? |
| 5 | Visual hierarchy | Does the eye follow: title → lead → support → detail? |
| 6 | White space is not waste | Is breathing room intentional, or is the slide underdone? |
| 7 | Annotations beat boxes | Can the insight be inline rather than a separate takeaway box? |
| 8 | Sequencing tells a story | Does this section follow SCR, Context-Performance-Outlook, or Summary-Detail? |
| 9 | Comparison over absolutes | Does every metric have at least one comparator? |
| 10 | Simplify for the audience | Is the density calibrated to who's reading this? |

---

## 7. Number Formatting Rules

| Data Type | Format | Example |
|-----------|--------|---------|
| Currency ≥ 1 Cr | `INR X,XXX Cr` | INR 1,234 Cr |
| Currency < 1 Cr | `INR X.X Lac` | INR 85.4 Lac |
| Currency (whole Cr) | `INR X,XXX Cr` | INR 500 Cr |
| Volume (MT) | `X,XXX MT` | 5,000 MT |
| Volume (KMT) | `X,XXX KMT` | 500 KMT |
| Percentage | `XX.X%` | 12.5% |
| Ratio | `X.Xx` | 10.0x |
| Days | `XX days` | 15 days |
| Growth | `+XX%` or `-XX%` | +25%, -10% |
| Counts (dealers, customers, headcount) | `X,XXX` | 4,200 |

**Strict currency rules:**
- **Always use `INR`** as the currency prefix. Never use `₹`, `Rs.`, `Rs`, `Rs.Mn`, `Rs.Bn`, or any other variant.
- **Convert all values to Cr or Lac.** Never use millions (Mn), billions (Bn), or thousands for currency. `INR 15 Cr` not `INR 150 Mn`. `INR 50 Lac` not `INR 5 Mn`.
- **Lac threshold:** Values below INR 1 Cr should be expressed in Lac. `INR 85.4 Lac` not `INR 0.85 Cr`.
- **Maximum 1 decimal place** for INR Cr and INR Lac values. `INR 1,234.5 Cr` is acceptable. `INR 1,234.56 Cr` is not. If the value is a whole number, drop the decimal entirely: `INR 500 Cr` not `INR 500.0 Cr`.
- **No decimals for counts:** Whole numbers only for volume (MT, KMT), headcount, dealer counts, customer counts, studio counts, etc. `4,200 dealers` not `4,200.0 dealers`.
- **Percentage decimals:** One decimal place: `12.5%`. No decimals for round percentages: `25%` not `25.0%`.

Comma separators on all numbers ≥ 1,000 (Indian numbering convention: `1,234` for thousands, `12,345` for ten-thousands, `1,23,456` for lakhs — use whichever is standard in the source data; default to international commas if ambiguous).

---

## 8. Full Script Boilerplate

```javascript
const pptxgen = require("pptxgenjs");
const fs = require('fs');

let pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'JSW One Platforms';
pres.title = 'DECK_TITLE_HERE';

const BODY_SIZE = 12;  // Standard body text size — 12pt for all body text, table cells, bullets

// ── Logo (PNG — use cleaned version with transparent background) ──
let LOGO_B64;
try {
  LOGO_B64 = "image/png;base64," + fs.readFileSync('/home/claude/JSW_Logo_Clean.png').toString('base64');
} catch (e) {
  try {
    LOGO_B64 = "image/png;base64," + fs.readFileSync('/mnt/user-data/uploads/JSW_Logo_Final.png').toString('base64');
  } catch (e2) {
    const uploads = fs.readdirSync('/mnt/user-data/uploads/');
    const logoFile = uploads.find(f => /jsw.*logo/i.test(f));
    if (logoFile) {
      const ext = logoFile.split('.').pop().toLowerCase();
      LOGO_B64 = (ext === 'png' ? 'image/png' : 'image/jpeg') + ";base64,"
        + fs.readFileSync('/mnt/user-data/uploads/' + logoFile).toString('base64');
    }
  }
}

// ── Alignment grid ──
const GRID = {
  L: 0.50, R: 12.83, W: 12.33,
  TOP: 0.95, BOTTOM: 6.80, H: 5.85,
  FOOTER_Y: 7.05
};
const CONTENT = { x: GRID.L, y: GRID.TOP, w: GRID.W, h: GRID.H };

function addDivider(slide, y) {
  const H = 0.05;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: y, w: 8.80, h: H,
    fill: { color: '213366' }, line: { width: 0, color: 'FFFFFF' }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 8.40, y: y, w: 4.93, h: H,
    fill: { color: 'EA2127' }, line: { width: 0, color: 'FFFFFF' }
  });
}

function addPageNumber(slide, num) {
  slide.addText(String(num), {
    x: 0.30, y: 7.05, w: 0.50, h: 0.35,
    fontSize: 10, fontFace: 'Calibri', color: '7F7F7F',
    align: 'left', valign: 'middle', margin: 0
  });
}

function addFooter(slide, num, source) {
  addPageNumber(slide, num);
  if (source) slide.addText(source, {
    x: 6.50, y: 7.05, w: 6.30, h: 0.35,
    fontSize: 10, fontFace: 'Calibri', color: '7F7F7F',
    italic: true, align: 'right', valign: 'middle', margin: 0
  });
}

// ... use layout functions from Section 4 and component patterns from Section 5 ...

pres.writeFile({ fileName: '/home/claude/output.pptx' });
```

---

## 8.1. Handling "No Data File" Scenarios

**When the user asks to create a deck but has not provided a data file (Excel, CSV, or previous deck), follow these rules:**

1. **Build the full deck structure** — title, agenda, section dividers, all slide layouts per the blueprint. The user gets a complete, branded skeleton.
2. **Use placeholder text, not placeholder charts.** Charts with zero values render as empty white space and look broken. Instead, add a text box where the chart would go:
   ```javascript
   slide.addText('[Chart: Monthly volume trend — actual vs AOP]\n[Populate with data from MIS file]', {
     x: GRID.L, y: GRID.TOP, w: GRID.W, h: 3.80,
     fontSize: 14, fontFace: 'Calibri', color: '7F7F7F',
     align: 'center', valign: 'middle', margin: 0,
     fill: { color: 'F2F2F2' }
   });
   ```
3. **Tables are acceptable with `[data needed]` cells** — they show the intended structure clearly and are easy to populate later.
4. **KPI cards with `[X]` values are acceptable** — the card layout communicates the intended design.
5. **Every placeholder slide must include a footer source line** stating what data is needed: `Source: [Please provide Q3 FY26 MIS / financial data file]`
6. **Takeaway boxes should contain prompt text** guiding what to write, e.g., `[Populate: 1-2 lines summarising whether volume is on track vs AOP]`
7. **Never fabricate numbers.** If the user provides numbers in chat, use them. If not, use placeholders. Never fill in figures from memory or training data.

---

## 8.2 India Map Generation

**For any slide requiring geographic visualization (PB distribution, Homes studios, construction presence, supply chain, dealer density, CM service radius), generate a map using Python.**

**Two modes available (auto-detected from config):**

| Mode | When to use | Config key | GeoJSON |
|------|------------|------------|---------|
| **State-level** | Broad presence (e.g., PB distribution across states) | `"states": [...]` in categories | 35 states/UTs |
| **District-level** | Granular view (e.g., top dealer districts, CM locations, retailer density) | `"districts": [...]` in categories | 594 districts |

**Step 1: Install dependencies (once per session)**
```bash
pip install geopandas matplotlib --break-system-packages -q
```

**Step 2: Generate map**
```bash
# State-level preset
python scripts/generate_india_map.py --preset pb_distribution --output /home/claude/pb_map.png

# District-level custom config
python scripts/generate_india_map.py --config custom.json --output /home/claude/map.png
```

**Available presets:** `pb_distribution`, `homes_studios`, `construction_presence`

**Step 3: Embed into slide**
```javascript
slide.addImage({ path: '/home/claude/pb_map.png', x: 6.70, y: GRID.TOP, w: 5.90, h: 5.50 });
```

**District-level config example:**
```json
{
  "title": "CM Locations — District View",
  "subtitle": "Contract manufacturers with service zones",
  "categories": [
    {
      "name": "CM district",
      "color": "#213366",
      "districts": [
        {"district": "Gautam Buddha Nagar", "state": "Uttar Pradesh"},
        {"district": "Raipur", "state": "Chhattisgarh"},
        {"district": "Jaipur", "state": "Rajasthan"}
      ]
    },
    {
      "name": "Primary service zone",
      "color": "#6B8EC2",
      "districts": [
        {"district": "Ghaziabad", "state": "Uttar Pradesh"},
        {"district": "Ajmer", "state": "Rajasthan"}
      ]
    }
  ],
  "shade_parent_states": true,
  "parent_state_color": "#C5D3E8",
  "cities": [
    {"name": "Noida", "lon": 77.39, "lat": 28.53, "size": 8},
    {"name": "Jaipur", "lon": 75.79, "lat": 26.92, "size": 8}
  ],
  "xlim": [72, 90],
  "ylim": [18, 33],
  "dpi": 200
}
```

**State-level config example:**
```json
{
  "title": "PB Distribution",
  "categories": [
    {"name": "Active", "color": "#213366", "states": ["Uttar Pradesh", "Bihar"]},
    {"name": "Planned", "color": "#8FA4CC", "states": ["Maharashtra"]}
  ],
  "cities": [{"name": "Delhi", "lon": 77.2, "lat": 28.6}]
}
```

**District-level features:**
- Shade individual districts in up to 4 color tiers (e.g., Tier 1/2/3 by volume)
- Parent state light-shading (auto: shades all districts of states that contain highlighted districts)
- Regional zoom via `xlim`/`ylim` (e.g., `[72, 90], [18, 33]` for North India)
- Mix district + state shading in one config
- Match report printed to console (confirms each district name resolved)

**State names must match GeoJSON:** Uttar Pradesh, Bihar, Jharkhand, West Bengal, Odisha, Madhya Pradesh, Rajasthan, Delhi, Haryana, Punjab, Uttaranchal, Chhattisgarh, Assam, Maharashtra, Gujarat, Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, Kerala, Goa, Himachal Pradesh, Jammu and Kashmir, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim, Arunachal Pradesh.

**Note on district names:** District GeoJSON uses `NAME_2` for district, `NAME_1` for state. Some names differ from common usage (e.g., "Gautam Buddha Nagar" not "Noida", "Orissa" not "Odisha" in districts file). When unsure, run: `python -c "import geopandas as gpd; d=gpd.read_file('india_districts.geojson'); print(d[d['NAME_1']=='Uttar Pradesh']['NAME_2'].sort_values().tolist())"` to list all districts in a state.

**Color rules:** `#213366` (JSW blue) primary, `#8FA4CC` (light blue) secondary, `#C5D3E8` (lighter) parent state, `#E8E8E8` (grey) inactive. City markers: `#EA2127` (red). For heatmaps: use `#213366` → `#4A6FA5` → `#8FA4CC` → `#C5D3E8` as a 4-tier gradient.

---

## 9. Deck Type Blueprints

**When the user selects a deck type in pre-flight, follow the corresponding blueprint below. This gives Claude the standard agenda, section-by-section layout prescription, metrics to include, narrative arc, and data to request. The user can always modify the proposed agenda — these are starting points, not rigid templates.**

---

### 9.1 Competition Analysis Deck

**Purpose:** Individual competitor analysis. Each competitor gets its own comprehensive set of slides. No combined comparison or JSW One positioning slides unless the user explicitly asks for them.

**Peer classification:**
- **Listed (quarterly data available):** SG Mart, Shankara Buildpro, Grasim Industries (for Birla Pivot segment)
- **Unlisted (annual data only via MCA filings):** OfBusiness, Infra.Market, Zetwerk, Moglix, Tata Nexarc
- **Note:** If a peer IPOs (e.g., Infra.Market), move it to listed and switch to quarterly cadence.

**Pre-flight for competition analysis:**
1. Which competitors? (select from known peer set, or specify new)
2. Quarterly update or annual deep-dive?
3. For listed peers: which quarter's results?
4. For unlisted peers: which FY's MCA filing?
5. Any specific angle to focus on?

**ANALYTICAL PRE-STEPS (MANDATORY):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md`, then execute the Competition Analysis pre-steps from `insight_patterns_by_bu.md` Section 9.4. This computes multi-year financial trends, ranks competitors by threat level, and identifies governance flags. The deck should be ordered by threat level, not alphabetically.

#### Step 0 (MANDATORY): Web search before building any slides

**For every competitor, every time, run a web search BEFORE building slides.**

```
Search queries to run per competitor:
  "[Competitor name] news [current month] [current year]"
  "[Competitor name] funding OR acquisition OR IPO [current year]"
  "[Competitor name] layoffs OR leadership OR CXO [current year]"
```

Fold findings into the "key developments" section. If nothing material found, note "No major developments in last 3 months" on the slide. Do not skip this step even if the user provides financial data files.

---

#### Template: Listed peer, quarterly update — 2-3 slides per competitor
*Use for: SG Mart, Shankara, Grasim (Birla Pivot) after each quarterly result*

| Slide | Layout | Content |
|-------|--------|---------|
| Slide 1: Quarterly financial snapshot | Two-column | **Left:** Quarterly financials table (10 rows: revenue, revenue growth QoQ, revenue growth YoY, gross margin %, EBITDA margin %, PAT margin %, NWC days, segment revenue if applicable e.g. Birla Pivot within Grasim, any guidance changes, cash position). **Right:** 4-5 bullets: what changed this quarter, management commentary highlights from earnings call, red flags or early warning signals, any regulatory/governance developments. |
| Slide 2: Key developments and red flags | Content + takeaway | Recent news from web search (funding, M&A, leadership, product launches, regulatory). Auditor commentary if quarterly review report has emphasis of matter. Early warning signals: margin compression trend, receivable ageing spike, employee count drop, customer churn indicators. |
| Slide 3 (if needed) | Content | Only for material events: earnings call deep-dive, new segment disclosure, capex announcement, DRHP filing. Skip if routine quarter. |

**Commentary (not takeaway for JSW One):** Every slide ends with 1-2 lines of commentary on the competitor's trajectory. E.g., "Third quarter of margin compression. Revenue growth slowing to single digits."

**Data sources:** BSE/NSE quarterly results (standalone + consolidated), earnings call transcript, investor presentation, web search.

---

#### Template: Listed peer, annual deep-dive — 4-5 slides per competitor
*Use for: SG Mart, Shankara, Grasim (Birla Pivot) when full-year annual report is out*

| Slide | Layout | Content |
|-------|--------|---------|
| Slide 1: Multi-year financial trend | Table + chart + commentary | 3-5 year financials: revenue, revenue CAGR, gross margin %, EBITDA margin %, PAT margin %, ROCE, NWC days, capital efficiency ratio. Bar chart for revenue + EBITDA margin trend. Commentary: "Consistent margin expansion" or "Revenue scaling but profitability deteriorating". |
| Slide 2: Segment and operational detail | Two-column | **Left:** Segment-level revenue breakdowns (e.g., Grasim: Birla Pivot revenue vs paints vs chemicals vs textiles), geographic mix if disclosed, product category performance, store/touchpoint count, employee count trend. **Right:** Key developments this year from annual report + web search: strategic moves, new launches, geographic expansion, leadership changes, M&A, capex commitments. |
| Slide 3: Governance deep-dive | Table + commentary | Auditor report analysis: qualified/unqualified opinion, emphasis of matter, CARO remarks, key audit matters. Related party schedule: top 5 RPTs by value with nature of transaction, RPT as % of revenue. MSME payment compliance: amount outstanding >45 days and >180 days as disclosed in notes. Credit ratings and any outlook changes. Charge register: new charges created, charges satisfied, secured vs unsecured split. Commentary: "Clean governance profile" or "Two emphasis of matter paragraphs flagged." |
| Slide 4: Balance sheet and funding | Two-column or table | **Left:** Equity raise history (round, amount, valuation if known, investors). Debt structure (term loans, working capital limits, NCDs, total borrowings trend). **Right:** Cash and bank balance trend, trade receivables ageing (current, 1-2 years, 2-3 years, >3 years), trade payables ageing, contingent liabilities, pending litigations, ESOP dilution if material. |
| Slide 5: Red flags and early warning signals | Bullets + commentary | Synthesise across all slides: margin trajectory risk, cash burn rate, auditor concerns, MSME non-compliance trend, receivable quality deterioration, leadership attrition, customer concentration, regulatory exposure. This is the "what to watch" slide. Each flag should cite the specific data point. |

**Data sources:** Annual report, BSE/NSE annual filings, auditor's report, notes to accounts (schedules for RPTs, MSME, contingent liabilities, borrowings), Probe42 for charge register, web search.

---

#### Template: Unlisted peer, annual update — 2-3 slides per competitor
*Use for: OfBusiness, Infra.Market, Zetwerk, Moglix, Tata Nexarc when MCA filings become available for a new FY*

| Slide | Layout | Content |
|-------|--------|---------|
| Slide 1: Annual financial snapshot | Two-column | **Left:** Annual financials table (12 rows: revenue, revenue growth YoY, gross margin %, EBITDA margin %, PAT margin %, ROCE, NWC days, DSO, DPO, capital efficiency ratio, total equity raised to date, employee count). **Right:** 4-5 bullets: business model in one line, key change this year (funding round, DRHP filing, leadership change, margin shift, pivot, acquisition), governance flags (auditor qualifications, MSME delays, RPT exposure). |
| Slide 2: Key developments and red flags | Content + commentary | Recent news from web search. Red flags: margin compression, cash burn acceleration, employee count drop (signal from Tracxn/LinkedIn), auditor emphasis of matter, MSME payment non-compliance, new secured charges (distress signal). Early warning signals with specific data points cited. |
| Slide 3 (if needed) | Content | DRHP filing analysis if applicable, major acquisition, significant financial distress. |

**Commentary:** On the competitor only. E.g., "Revenue growth collapsed from 82% to 5.5%. Fourth consecutive year of negative EBITDA."

**Data sources:** MCA filings via Probe42 (P&L, balance sheet, auditor report, notes), Screener.in, Tracxn, news articles, web search.

---

#### Template: Unlisted peer, annual deep-dive — 4-5 slides per competitor
*Use for: OfBusiness, Infra.Market, Zetwerk, Moglix, Tata Nexarc when doing detailed analysis after MCA filings drop*

| Slide | Layout | Content |
|-------|--------|---------|
| Slide 1: Multi-year financial trend | Table + chart + commentary | 3-5 year financials (FY20/21 to latest): revenue, revenue CAGR, gross margin trend, EBITDA margin trend, PAT, ROCE, NWC days, capital efficiency. Bar chart for revenue + EBITDA margin trajectory. Commentary on trajectory. |
| Slide 2: Business model and operations | Two-column | **Left:** Revenue model (trading vs marketplace vs manufacturing vs fintech, percentage mix if discernible from P&L line items), customer segments, geographic presence, product categories, SKU count if known, tech team size, total headcount trend. **Right:** What changed this year: strategic moves, new business lines, geographic expansion, leadership changes (CXO exits), M&A activity, investor exits/entries. Source each point. |
| Slide 3: Governance deep-dive | Table + commentary | Auditor report: qualified/unqualified, emphasis of matter (verbatim key phrases), CARO remarks. RPT schedule: top RPTs by value with nature (sales, purchases, loans, guarantees), RPT as % of revenue, any RPTs with entities where directors hold interest. MSME payment: amount >45 days, >180 days, interest due and paid. Credit ratings and outlook. Charge register: new charges, satisfied, total outstanding, secured vs unsecured. |
| Slide 4: Balance sheet and funding structure | Two-column or table | **Left:** Full equity raise timeline (each round: date, amount, lead investor, pre/post-money valuation if known). Current cap table structure if available (promoter vs investor holdings from MCA). Debt: term loans, WC limits, NCDs, inter-corporate deposits. **Right:** Cash balance trend, trade receivables ageing with YoY comparison, trade payables ageing, provisions and contingent liabilities, pending litigations (nature and amount), ESOP pool and vesting. |
| Slide 5: Red flags and early warning signals | Bullets + commentary | Comprehensive synthesis: profitability trajectory (improving or deteriorating), cash runway estimate (cash balance vs burn rate), auditor concern severity, MSME compliance trajectory (improving or worsening), receivable quality (ageing shift), leadership stability (CXO tenure, recent exits), funding environment (last raise date, likely runway), competitive position shifts. Each flag cites specific numbers. |

**Additional slide (if applicable):**
| Slide 6: DRHP/IPO analysis | Bullets + commentary | Only for peers approaching IPO. Offer structure (OFS vs fresh issue, target raise), use of proceeds, key risks disclosed by the company, financial trajectory disclosed for first time, KPIs shared, promoter dilution, BRLM and listing timeline. |

**Data sources:** MCA filings via Probe42 (complete set: P&L, balance sheet, cash flow, auditor report, notes to accounts including RPT schedule, MSME schedule, contingent liabilities, borrowings, related party disclosures), SEBI DRHP (if filed), Screener.in, Tracxn, funding databases, web search.

---

#### Key rules for all competition analysis templates:

1. **Web search is step 0.** Run it before touching the data files. Always.
2. **Every slide has commentary** on the competitor. Never a bare data table.
3. **No JSW One comparison** on individual competitor slides. If user wants comparison, they will ask separately.
4. **Consistent table structure** across competitors of the same type. If OfBusiness slide 1 has 12 rows, Zetwerk slide 1 has the same 12 rows. Use "Data not available" for missing fields, never estimate.
5. **Source every data point.** Footer must cite: "Source: MCA filing FY[XX] via Probe42" or "Source: BSE quarterly results Q[X] FY[XX]" or "Source: [Publication], [Date]".
6. **Structural compliance (per Section 2.8):** Competition analysis decks with 2+ competitors will always exceed 10 slides. They MUST include:
   - Title slide (Slide 1)
   - Agenda slide (Slide 2) listing each competitor as a section
   - A Section Divider (Layout D) before each competitor's slides (e.g., "Infra.Market", "OfBusiness")
   - A Section Divider before any combined comparison section (if user requests one)
7. **Single-competitor decks (3-5 slides):** Still require an Agenda slide as Slide 2 (per Section 2.8, since total is 5+). Section dividers are optional for single-competitor decks under 10 slides.
6. **Red flags are not optional.** Even if the competitor looks healthy, the red flags slide must exist. Write "No material red flags identified" if clean.
7. **Tone: objective analyst commentary.** Not promotional, not dismissive. State facts, note trends, flag risks. Write as if preparing a credit report, not a sales pitch.

---

### 9.2 Board Deck (Quarterly)

**Purpose:** Quarterly business update for the Board of Directors. Must be executive-level, not operational.
**Typical slide count:** 15-20 content slides + annexures (total 25-35 with section dividers)
**Narrative arc:** Lead with the north star KPI and whether we are on track. Then walk through BU performance. Close with strategic priorities and asks.

**ANALYTICAL PRE-STEPS (MANDATORY — run before deciding slide content):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md`, then execute the Board Deck pre-steps from `insight_patterns_by_bu.md` Section 9.1. This computes variance rankings, identifies the #1 surprise, and checks for inflection points. The exec summary slide is framed by these findings, not by listing all metrics equally.

**Data to request from user:**
- Quarter and FY (e.g., Q3 FY26)
- MIS/financial data file (actuals vs AOP)
- Any specific topics the Board has flagged
- NBFC update data (JOFL)
- Key decisions/approvals needed from the Board

**Standard agenda:**

| # | Section | Slides | Layout | What to show |
|---|---------|--------|--------|-------------|
| 1 | Title slide | 1 | Title (Layout A) | "JSW One - Q[X] FY[XX] board update" |
| 2 | Agenda | 1 | Index (Layout B) | Section list |
| 3 | Executive summary | 1 | KPI cards + bullets | 4 KPI cards (GMV, EBITDA, volume, NWC days) showing actual vs target. 2-3 bullet key takeaways below. |
| 4 | Section: Business update | 1 | Section divider (Layout D) | |
| 5 | Platform consolidated performance | 1-2 | Table + chart + takeaway | GMV, revenue, gross margin, CM, EBITDA with QoQ and YoY. Bar chart for GMV trend. Takeaway: are we on track? |
| 6 | Manufacturing performance | 1-2 | Table + takeaway | Enterprise + SMB: volume, revenue, customer metrics, product mix. Takeaway: key wins/misses. |
| 7 | Construction performance | 1 | Table + takeaway | Projects + Retail: volume, revenue, retailer expansion, cross-sell rate |
| 8 | Private Brands performance | 1-2 | Table + chart + takeaway | Volume (KMT), dealer count, repeat rate, state-wise expansion, supply source mix |
| 9 | Homes performance | 1 | Table + takeaway | Units delivered, GTV, studio count, pipeline funnel (leads to design to construction) |
| 10 | Section: Financial update | 1 | Section divider | |
| 11 | P&L summary | 1 | Table + takeaway | Consolidated P&L: actual vs AOP, QoQ, YoY. Highlight variances >10%. |
| 12 | Working capital | 1 | KPI cards or table | DSO, DPO, NWC days, advance outstanding days. Show trend. |
| 13 | Section: NBFC update | 1 | Section divider | |
| 14 | JOFL performance | 1 | Table + takeaway | AUM, disbursals, NPA, collection efficiency, cost of funds |
| 15 | Section: Strategic priorities | 1 | Section divider | |
| 16 | Key priorities and asks | 1-2 | Cards or bullets | Top 3-5 priorities for next quarter. Any Board approvals needed. |
| 17 | Annexures | 3-5 | Data tables | Detailed BU-level financials, customer cohort data, state-wise breakdowns |

**Key rules for this deck type:**
- 1-2 slides per BU max in the main body. Detail goes in annexures.
- **Section dividers are MANDATORY** for board decks, S&OP reviews, and any deck with 10+ slides. Insert a Layout D section divider before each major agenda section. Weekly reviews (<12 slides) are exempt.
- Show metrics in ratios and days, not just absolute currency
- Every data slide must have a "so what" that tells the Board whether to worry or not
- EBITDA walk/waterfall if there's a significant variance to explain
- Sentence case, no jargon the Board wouldn't know (define uncommon acronyms on first use)

---

### 9.3 Monthly S&OP Review

**Purpose:** Cross-functional monthly review of demand, supply, and financial performance.
**Audience:** CEO + BU heads + S&OP + Finance
**Flow:** Demand first, then supply, then financials, then actions
**Typical slide count:** 18-22 slides

**ANALYTICAL PRE-STEPS (MANDATORY):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md`, then execute the S&OP pre-steps from `insight_patterns_by_bu.md` Section 9.2. This computes YTD achievement % by BU and identifies which BUs are off-track — these drive the slide content.

**DETAILED CONSTRUCTION GUIDE:** Read `references/monthly_sop_review.md` before building this deck type. It contains:
- Slide-by-slide content spec (19 slides with exact table columns, chart types, KPI card layouts)
- Data mapping guide (which MIS fields go to which slides)
- BU-specific visual treatments (PB deep-dive, supply metrics)
- Column width specifications for every table
- Common mistakes to avoid (10 specific pitfalls)
- Quality checklist

```
view references/monthly_sop_review.md
```

---

### 9.3.1 Monthly Financial & Profitability Report

**Purpose:** Comprehensive monthly P&L, profitability, and balance sheet review covering all entities and BUs.
**Audience:** CEO, CFO, BU heads, Finance team
**Flow:** Key insights → Executive summary → Topline analysis → Financial profitability → JODL profitability → Balance sheet / Cash flow
**Typical slide count:** 45-50 slides

**ANALYTICAL PRE-STEPS (MANDATORY):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md`, then execute the Monthly Financial pre-steps from `insight_patterns_by_bu.md` Section 9.3. This isolates the 2-3 biggest EBITDA variance drivers and flags unusual MoM movements. The Key Insights slide (Slide 2) is framed by these findings.

**DETAILED CONSTRUCTION GUIDE:** Read `references/monthly_financial_performance.md` before building this deck type. It contains:
- Slide-by-slide content spec (47 slides with exact table columns, chart types, layout positions)
- Reusable standards: 17-column monthly trend table, 11-column P&L table, RGM waterfall construction, EBITDA bridge function
- 4 BU-wise P&L templates (MFG, Construction, PB/TMT, Homes) with per-ton RGM views
- JODL profitability deep-dive: CM1 by credit type, T1S state-wise margin, GM cohorts
- Balance sheet, working capital, cash flow waterfall, borrowing trend, receivable/payable aging
- Common mistakes to avoid (20 specific pitfalls)
- Section-wise quality checklists

```
view references/monthly_financial_performance.md
```

---

### 9.3.2 Monthly Private Brands BizFin Review

**Purpose:** Financial governance and commercial oversight of Private Brands at plant-level and route-level granularity.
**Audience:** CEO, CFO, PB BU head, BizFin team
**Flow:** P&L → Sales mix → DSI/Inventory → Plant-level P&L → Route economics (Plant × State CM/MT) → Advance ageing → Channel margin trend → BE analysis → WC block → Sales productivity → Volume at risk → Outlook
**Typical slide count:** 16-18 slides

**ANALYTICAL PRE-STEPS (MANDATORY):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md` (Section 5 — Private Brands), then:
1. Compute CM1/MT MoM trend — is margin improving or deteriorating?
2. Rank routes (plant × state) by CM/MT — identify top 5 and bottom 5; quantify INR lost on negative routes
3. Compute DSI weighted average and flag any plant >25 days
4. Compute advance ageing — flag anything >90D
5. Compute Retail vs Projects CM/MT spread — flag if narrowing below INR 700
6. Compute volume at risk from MOU achievement analysis
7. Compare salesperson Qty/Pax by state — flag states below 200 MT/pax

**DETAILED CONSTRUCTION GUIDE:** Read `references/monthly_pb_bizfin_review.md` before building. It contains:
- Slide-by-slide content spec (18 slides with exact table structures)
- Route economics analysis methodology (plant × state × grade × channel)
- Working capital governance (DSI, advance ageing, interest cost)
- MOU-based volume-at-risk calculation methodology
- Salesperson productivity benchmarks
- Key analytical patterns and BizFin action recommendations

```
view references/monthly_pb_bizfin_review.md
```

---

### 9.3.3 Monthly Homes CEO Update

**Purpose:** CEO-facing monthly performance review of JSW One Homes — funnel health (QL→M5→M8→Handover), city-level AOP achievement, conversion rates, delivery quality, design throughput, material monetization (GSV + GMV).
**Audience:** CEO + Homes BU head + functional leads
**Flow:** KPI Dashboard (3 slides) → City AOP vs Ach (YTD + month) → YoY comparison → Conversion % → Monthly projection → Highlights → Approvals tracker
**Typical slide count:** 12-14 slides

**ANALYTICAL PRE-STEPS (MANDATORY):**
Load `references/analytical_engine.md` and `references/insight_patterns_by_bu.md` (Section 6 — Homes), then:
1. Compute funnel conversion rates: QL→M5 %, M5→M8 %, M8→Handover % (month and YTD, compare vs FY prior)
2. Rank cities by absolute GSV gap (target - achieved) — top 2-3 cities explain most of the miss
3. Diagnose WHERE in the funnel the shortfall is: leads? conversion? execution?
4. Compute M5/M8 refund rate — M5 >10% = design/pricing issue, M8 >3% = serious churn
5. Compute GSV per handover, GMV per handover — unit economics trend
6. Compute GMV/GSV ratio — cross-sell health
7. Check delivery: on-time %, construction start TAT, design TAT — flag any breach
8. Hockey-stick check: if Feb+Mar GMV is >40% of FY total, flag

**DETAILED CONSTRUCTION GUIDE:** Read `references/monthly_homes_ceo_update.md` before building. It contains:
- Full Homes terminology glossary (M5/M8/M9, GSV/GMV, BOQ, GFC, R-Dash, QL, etc.)
- Slide-by-slide spec (14 slides with exact table structures)
- Homes funnel diagnostic framework
- City-level variance analysis methodology
- 21 key metrics with targets and thresholds
- Analytical pre-steps and common patterns

```
view references/monthly_homes_ceo_update.md
```

---

### 9.4 Weekly Management Review

**Purpose:** Fast, focused update on the week's operational performance. Audience: CEO, COO, BU heads.
**Typical slide count:** 8-12 slides
**Narrative arc:** "This is what happened this week, these are the red flags, and these are the actions we are taking."

**Data to request from user:**
- Week number and dates (e.g., W10: 3-9 Mar 2026)
- Weekly MIS extract (volume, GMV, orders, pipeline)
- Any specific issues or wins to highlight

**Standard agenda:**

| # | Section | Slides | Layout | What to show |
|---|---------|--------|--------|-------------|
| 1 | Title slide | 1 | Title (Layout A) | "Weekly review - W[XX], [Date range]" |
| 2 | Week snapshot | 1 | KPI cards | 4-6 KPIs: week volume, week GMV, WoW change, MTD vs plan %, active orders, OTIF |
| 3 | BU-wise performance | 2-3 | Tables + takeaway | One compact table per BU cluster. Columns: BU, Week actual, Week plan, WoW %, MTD actual, MTD plan, MTD %. Takeaway for each: what's on track, what's not. |
| 4 | Order pipeline | 1 | Table + takeaway | Open orders, pending dispatch, stuck orders, ageing >7 days. Flag anything overdue. |
| 5 | Key wins this week | 1 | Cards (2-3 cards) | New customer wins, milestone achievements, large orders closed. Short, specific, with numbers. |
| 6 | Red flags and escalations | 1 | Table (issue/owner/deadline) | Issues that need CEO/leadership attention this week. RAG indicators. |
| 7 | Action tracker | 1 | Table (action/owner/status) | Carry forward from previous week + new actions. Mark closed/open/delayed. |
| 8 | Priorities for next week | 1 | Bullets or cards | Top 3-5 actions with owners |

**Key rules for this deck type:**
- Speed over polish. This deck is built every week and should take <30 minutes to assemble with the refresh workflow.
- Max 12 slides. If it's longer, it's not a weekly review.
- WoW (week-over-week) and MTD (month-to-date) are the two time dimensions. No need for QoQ or YoY.
- No section dividers needed (too short). Jump straight from title to snapshot.
- Keep tables compact (0.30" row height, 11pt font).
- Red flags slide is mandatory even if there are no issues (write "No escalations this week").
- File naming: `Weekly_Review_W[XX]_[Mon][YYYY].pptx`

---

## 10. QA Checklist

### Brand
- [ ] **Logo on every slide** — if logo was missing at start, deck should not have been generated (Section 3.1)
- [ ] Logo top-right, correct 3.035:1 aspect ratio
- [ ] Divider on every slide, consistent 0.05" thickness, no border artifacts
- [ ] Page number on every slide, left bottom, grey 10pt
- [ ] ONLY Calibri font throughout
- [ ] ONLY approved colors used

### Typography
- [ ] All slide headings: bold, blue (`213366`)
- [ ] Title slide: 28pt. Section divider: 24pt. Content slides: 20pt.
- [ ] **Body text, table cells, bullets, card text: 12pt minimum.** No exceptions except chart data labels (11pt), KPI labels (11pt), and footnotes/source/page numbers (10pt).
- [ ] No text below 10pt anywhere on any slide
- [ ] Sentence case on all headings (only first word capitalized + proper nouns)

### Tables
- [ ] **Column width validation:** Sum of all `colW` values ≤ GRID.W (12.33"). No table overflows the right edge.
- [ ] Table header: blue fill (`213366`), white bold text, 12pt
- [ ] Table body: 12pt (11pt only if 10+ columns and overflow at 12pt)
- [ ] Numbers: center-aligned. Text: left-aligned. Headers match content below.

### Charts
- [ ] Data labels INSIDE bars (`inEnd`), white bold, 11pt
- [ ] No Y-axis shown
- [ ] Colors: blue + grey only
- [ ] No zero-value placeholder charts — use grey text box instead (Section 8.1)
- [ ] ▲ values use blue font (`213366`), ▼ values use grey font (`7F7F7F`)

### Visual quality (Bain/BCG/McKinsey standard)
- [ ] **Visual richness:** Charts, diagrams, and maps used where they communicate faster than text. Deck does not default to text-and-tables when data supports visual treatment.
- [ ] **BU visuals considered:** Geographic slides use maps where available, trend data uses charts, process descriptions use flow diagrams
- [ ] **Images from source deck preserved:** If refreshing, images from old deck are re-embedded or have grey placeholders
- [ ] **Trend data shown visually:** Multi-period data (3+ FYs/quarters) shown as charts where possible

### Number Formatting
- [ ] Currency uses `INR X Cr` or `INR X Lac` — never `₹`, `Rs.`, `Rs.Mn`, `Rs.Bn`
- [ ] Max 1 decimal for INR values. No decimals for whole numbers (counts, volumes, headcount).
- [ ] Values < INR 1 Cr expressed in Lac, not as decimal Cr

### Footer
- [ ] Left bottom: page number only
- [ ] Right bottom: source/asterisks only
- [ ] No content in center bottom

### Structure
- [ ] **Agenda slide present** as Slide 2 (mandatory for 5+ slide decks, per Section 2.8)
- [ ] **Section dividers present** between major agenda sections (mandatory for 10+ slide decks, per Section 2.8)
- [ ] **Agenda top-aligned:** Agenda items start at top of content area, not centred, even for short lists
- [ ] Agenda was proposed and approved by user before building started

### Content Quality
- [ ] Every slide lands a message — the reader can tell in 5 seconds whether things are going well or badly (Section 6.1). The message can be embedded in the data, in a callout, in inline annotations, or in a separate takeaway — any approach works.
- [ ] **Layout matches content:** Each slide uses the layout best suited to its content (chart for trends, table for detail, cards for priorities). Slides CAN repeat layouts if the context demands it (e.g., per-BU tables should all be tables).
- [ ] **Card height audit:** Cards sized to content, no >30% empty space at the bottom
- [ ] Space is used purposefully — empty space is either intentional breathing room or filled with content that adds value (not filler takeaway boxes)
- [ ] **Every number has a comparator** — no metric appears without at least one anchor (vs AOP, vs prior period, vs peer, vs milestone). See `analytical_engine.md` Section 5.3.
- [ ] **Insights are quantified** — no adjectives without numbers. "Strong growth" should be "69% YoY growth". "Margin pressure" should be "GM/MT declined INR 200 to INR 1,230".
- [ ] **Charts follow the decision tree** — chart type was chosen based on data shape, not habit. See `analytical_engine.md` Section 4.1.
- [ ] **No naked charts** — every chart has at least one annotation (callout, label, or highlighted bar/point) that delivers the insight.
- [ ] **Variance ranking done** — for performance decks, BUs are ordered by magnitude of variance contribution, not alphabetically or by org structure.

### Writing Style (Anti-AI)
- [ ] No em dashes (—) or en dashes used as sentence connectors
- [ ] No semicolons joining clauses
- [ ] No filler words (leverage, holistic, seamless, robust, paradigm)
- [ ] No "It is worth noting..." / "Notably..." / "Importantly..." openers
- [ ] Bullets contain specific numbers/data points, not purely qualitative statements
- [ ] Sentence structure is varied (not every bullet starting with a gerund)

---

## 11. Anti-Patterns (NEVER)

- ❌ NEVER proceed with deck generation without the JSW One logo file — ask the user to upload it (Section 3.1)
- ❌ NEVER use Title Case in headings (use sentence case)
- ❌ NEVER use colors outside the approved palette
- ❌ NEVER use red in charts
- ❌ NEVER use any font other than Calibri
- ❌ NEVER use font below 10pt anywhere. 10pt is ONLY for footnotes, source lines, and page numbers.
- ❌ NEVER use font below 12pt for body text, table cells, bullets, or card text. 11pt is only permitted for chart data labels, KPI labels, and as a last resort for 10+ column data-dense tables.
- ❌ NEVER center-align slide headings
- ❌ NEVER put data labels outside bars (use `inEnd`, not `outEnd`)
- ❌ NEVER put anything other than page number in left bottom
- ❌ NEVER skip page numbers on any slide
- ❌ NEVER stretch the logo — maintain 3.035:1 ratio
- ❌ NEVER use non-bold slide headings
- ❌ NEVER center-align or bottom-align text boxes (top + justified default)
- ❌ NEVER skip divider on any slide
- ❌ NEVER use rounded rectangles, gradients, or shadows
- ❌ NEVER create a data slide where the reader cannot tell in 5 seconds whether results are positive or negative — embed the "so what" via any technique from Section 6.1
- ❌ NEVER force layout variety just to avoid repetition — if 5 BU slides all need the same table layout, use the same table layout. Forced variety adds complexity without value.
- ❌ NEVER add a takeaway box just to fill empty space — if the data speaks for itself (bold totals, ▲▼ indicators, descriptive headers), let it breathe
- ❌ NEVER use fixed card heights without estimating from content length — cards with >30% empty bottom space look broken (Section 6.3)
- ❌ NEVER use em dashes (—), en dashes, or semicolons as sentence connectors in slide text
- ❌ NEVER use AI-filler words: "leverage", "holistic", "seamless", "robust", "paradigm" unless technically precise
- ❌ NEVER use "It is worth noting that...", "Notably,...", "Importantly,..." openers
- ❌ NEVER start building slides without user-approved agenda
- ❌ NEVER allow any content element to overlap another (text, tables, charts, shapes, images)
- ❌ NEVER place content elements at x-positions other than GRID.L (0.50") unless it is a documented exception (page number, logo, title slide, section divider, agenda badges)
- ❌ NEVER render a chart with zero or placeholder values — use a grey placeholder text box instead (Section 8.1)
- ❌ NEVER omit the Agenda slide in decks with 5+ slides (Section 2.8)
- ❌ NEVER omit section dividers in decks with 10+ slides except weekly reviews (Section 2.8)
- ❌ NEVER centre agenda items vertically — always top-aligned, even for short lists with empty space below
- ❌ NEVER use `₹`, `Rs.`, `Rs.Mn`, or `Rs.Bn` for currency — always use `INR X Cr` or `INR X Lac` (Section 7)
- ❌ NEVER let table columns overflow the slide edge — validate colW sum ≤ GRID.W (12.33") before every `addTable` call (Section 5.1)
- ❌ AVOID using text bullets to describe trends that span 3+ periods when a chart would be clearer
- ❌ NEVER silently drop images/maps from a source deck during refresh — preserve or use grey placeholder (Section 6.2)
- ❌ AVOID defaulting to text-and-tables for an entire deck when the data supports charts, maps, or diagrams. Aim for the visual richness of a Bain/BCG/McKinsey deck.
- ❌ AVOID describing geographic presence in text when a map or visual would communicate it instantly

---

## 12. JSW One — Business Context Reference

**Full business context (entity structure, BU descriptions, supply-side terminology, financial metrics, strategic narrative, abbreviations) is in `references/business_context.md`.** Load it when building decks for external audiences or when terminology context is needed.

```
view references/business_context.md
```

**This context is also available in the project's userMemories.** For internal decks where the audience already knows the business, this reference is typically not needed.

## 13. Formatting Fix Workflow — Rebranding an Existing PPT

**Full formatting fix workflow is in `references/formatting_and_refresh_workflows.md`.** Load it only when the user uploads a .pptx for rebranding or cleanup.

```
view references/formatting_and_refresh_workflows.md
```

---

## 14. Deck Refresh Workflow — Update a Recurring Deck with New Data

**Full deck refresh workflow is in `references/formatting_and_refresh_workflows.md`.** Load it only when the user uploads a .pptx + data file for a periodic update.

```
view references/formatting_and_refresh_workflows.md
```

---

## 15. Information Security — Data Handling Rules

**This skill is deployed company-wide. It must NOT contain or generate unpublished price-sensitive information (UPSI), forward-looking financial projections, or internal targets without explicit user-provided source data.**

### 14.1 What This Skill Contains (SAFE for company-wide use)

- Organisational context: entity structure, business unit descriptions, what each BU does, customer segments, product categories, GTM descriptions, revenue model types
- Terminology and abbreviations: metric definitions, formatting standards
- Competitor names (publicly known)
- Qualitative strategic narrative (e.g., "capital efficiency over gross margin", "asset-light model")
- Slide design system: colors, fonts, layouts, components, QA checklists
- Workflow instructions: how to create, reformat, or refresh decks

### 14.2 What This Skill Does NOT Contain (and must NEVER hardcode)

- GMV, NMV, GTV, revenue, or EBITDA figures (actual or projected)
- Volume targets or actuals (MT, KMT, MTPA)
- Growth rates, CAGR projections, or ROE targets
- Working capital metrics (specific DSO, DPO, NWC days numbers)
- Specific financial ratios (revenue-to-capital, gross margin %)
- AOP targets for any BU
- IPO timeline specifics or DRHP filing dates
- Investment round amounts
- Credit GMV concentration splits
- Studio count targets, unit delivery targets, or franchise fee details
- Any number that would constitute UPSI under SEBI regulations

### 14.3 Rules for Generating Slides with Financial Data

1. **Every number on a slide must trace to a user-provided source file** (Excel, CSV, or previous deck). Claude must never fabricate, recall from memory, or interpolate financial figures.
2. **If asked to "add projections" without a data file**, respond: "I need a source file with the projections. I can structure the slide layout and formatting, but the numbers need to come from your AOP, financial model, or board-approved data."
3. **If a user provides numbers in chat** (e.g., "revenue was [X] Cr"), those can be used — the user is the authorised source. But never supplement with numbers from Claude's training data or memory.
4. **Comparative metrics** (vs peers, vs previous period): only use if the user provides both sides of the comparison in their data file. Do not fill in peer numbers from memory.
5. **Footnotes on data slides must always include the data source** — e.g., "Source: FY27 AOP (approved 15 Feb 2026)" or "Source: Weekly MIS extract, Week 10 FY26".

### 14.4 Handling Requests for Sensitive Information

| User request | Response |
|-------------|----------|
| "Add FY27 targets to this slide" (no data file) | "I can set up the slide layout. Please share the AOP file or specific numbers you'd like me to use." |
| "What was our GMV last quarter?" | "I don't store financial actuals. Please share the MIS or quarterly data file." |
| "Put the EBITDA bridge from the board deck" | "Please upload the board deck or share the bridge numbers. I'll format them per JSW One standards." |
| "Use the same numbers from last time" | "I don't retain numbers across sessions. Please share the data file or previous deck." |
| "Make a slide showing our IPO timeline" | "I can create the layout. Please provide the timeline details you'd like included." |
| User provides numbers in chat (e.g., "revenue was [amount]") | Acceptable — the user is the authorised source. Use the number as provided. |

### 14.5 Audit Trail

When generating slides with financial data, always include:
- Source file name in the slide footer (e.g., "Source: AOP_FY27_Final.xlsx")
- Data extraction timestamp if from a live system
- Version marker if the source has multiple versions (e.g., "AOP v3, approved 15 Feb 2026")

This ensures any printed or shared deck can be traced back to its authorised data source.
