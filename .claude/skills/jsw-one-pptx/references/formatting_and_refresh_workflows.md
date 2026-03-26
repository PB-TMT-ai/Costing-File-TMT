## 13. Formatting Fix Workflow — Rebranding an Existing PPT

**Trigger this workflow when the user uploads an existing .pptx file and asks to "fix formatting", "apply JSW One branding", "clean up this deck", or similar requests where content already exists and only visual/brand compliance is needed.**

### 12.1 Pre-Flight for Formatting Fix

Ask the user (conversationally, no widget needed):
1. "Should I preserve all existing content as-is, or can I also fix sentence case, number formatting, and terminology?"
2. "Any slides to skip or treat differently?"

### 12.2 Workflow Steps

```
Step 1: READ the uploaded deck
  → python -m markitdown uploaded.pptx         (extract text content)
  → python scripts/thumbnail.py uploaded.pptx   (visual overview)
  → python scripts/office/unpack.py uploaded.pptx unpacked/  (raw XML if needed)

Step 2: AUDIT against JSW One brand standards
  Check and log every violation:
  □ Font (anything non-Calibri?)
  □ Colors (any off-palette hex codes?)
  □ Heading style (bold? blue? sentence case? correct pt size?)
  □ Logo present on every slide? Correct position? Correct aspect ratio?
  □ Divider present on every slide? Consistent thickness?
  □ Page numbers on every slide?
  □ Table formatting (blue headers? alternating rows? alignment?)
  □ Chart colors (only blue + grey?)
  □ Data labels (inside bars? white bold?)
  □ Footer layout (page# left, source right?)
  □ Text alignment (top + justified in text boxes?)
  □ Capitalization (sentence case on headings?)
  □ Number formatting (commas, INR Cr/Lac, MT/KMT?)

Step 3: DECIDE approach
  Option A — Surgical edit (few fixes needed):
    → Use the editing workflow from /mnt/skills/public/pptx/editing.md
    → Unpack → fix XML/content → repack

  Option B — Rebuild from scratch (many violations or complex fixes):
    → Extract all content from original deck
    → Rebuild each slide using this skill's layout functions
    → Populate with extracted content
    → This is usually cleaner and more reliable

Step 4: REBUILD / EDIT
  Apply ALL brand standards from this skill:
  - Replace all fonts with Calibri
  - Replace all colors with approved palette
  - Add/fix logo on every slide (PNG, correct aspect ratio)
  - Add/fix divider on every slide (consistent 0.05")
  - Add page numbers (left bottom, grey 10pt)
  - Fix table headers (blue fill, white bold, alignment per column type)
  - Fix chart colors and data labels
  - Apply sentence case to all headings
  - Fix number formatting
  - Consolidate footnotes/sources to right bottom only

Step 5: QA
  → Run full QA checklist from Section 9
  → Visual inspection via thumbnail/PDF conversion
  → Content verification (no lost text, tables, or data)
```

### 12.3 Audit Report Template

Before making changes, present the user with a summary:

```
BRAND COMPLIANCE AUDIT — [Deck Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total slides: XX
Violations found: XX

FONTS:         [X slides] using non-Calibri fonts (e.g., Arial on slides 3, 7, 12)
COLORS:        [X slides] using off-palette colors (e.g., #4472C4 on slide 5 chart)
HEADINGS:      [X slides] not bold / wrong size / Title Case instead of sentence case
LOGO:          [X slides] missing or incorrect placement
DIVIDER:       [X slides] missing or inconsistent thickness
PAGE NUMBERS:  [X slides] missing
TABLES:        [X tables] with non-compliant headers or alignment
CHARTS:        [X charts] with wrong colors or data label position
FOOTER:        [X slides] with content in wrong position

RECOMMENDED APPROACH: [Surgical edit / Full rebuild]
Proceed?
```

### 12.4 Content Preservation Rules

When reformatting, NEVER alter:
- Data values, numbers, or calculations
- Business logic or narrative meaning
- Slide order (unless user explicitly asks)
- Speaker notes
- Hyperlinks

You MAY adjust (with user permission from pre-flight Q1):
- Sentence case on headings
- Number formatting (add commas, INR Cr/Lac, MT/KMT units)
- Terminology standardization (e.g., "Rs" → "INR", "tonnes" → "MT")
- Consolidating fragmented text boxes into cleaner layouts

---

## 14. Deck Refresh Workflow — Update a Recurring Deck with New Data

**Trigger this workflow when the user uploads a previous period's .pptx deck AND a new data file (Excel, CSV, or table) and asks to "refresh", "update with new numbers", "create this week's version", "same format new data", or similar requests where the deck structure stays the same but data changes.**

This is the most common use case for weekly management reviews, monthly S&OP decks, quarterly board updates, and periodic BU reviews.

### 13.1 Pre-Flight for Deck Refresh

Ask using `ask_user_input` tool:

**Question 1:** "What has changed between the previous deck and this refresh?"
Options: `Only numbers/data updated` | `Numbers + some new slides needed` | `Numbers + some slides removed` | `Significant structural changes`

**Question 2:** "Any specific slides to skip or handle differently?"

**NOTE: Formatting fix (Section 13) is ALWAYS applied during a deck refresh. Do not ask the user whether to fix formatting — always do it. The previous deck likely has inconsistent formatting, and every refresh is an opportunity to bring the deck to full brand compliance. Apply all brand standards from Sections 2–6 to every slide while populating new data.**

Then ask conversationally:
- "Which file has the new data?" (confirm which upload is the old deck vs the data file)
- "Any specific slides to skip or handle differently?"
- "Any commentary or narrative changes to go with the new numbers?" (e.g., "Q3 missed target, add a risk callout")
- "What period does this cover?" (e.g., "Week ending 7 Mar 2026", "Q3 FY26")

### 13.2 Workflow Steps

```
Step 1: READ the previous deck (the template)
  → python -m markitdown old_deck.pptx           (extract all text + table content)
  → Convert to images for visual reference:
     python scripts/office/soffice.py --headless --convert-to pdf old_deck.pptx
     pdftoppm -jpeg -r 150 old_deck.pdf old-slide
  → View each slide image to understand layout and flow
  → Build a SLIDE MAP:
     Slide 1: Title slide — "[Deck title]", "[Date]"
     Slide 2: Agenda — [list of sections]
     Slide 3: Section divider — "[Section name]"
     Slide 4: Data table — "[Title]", columns: [...], rows: [...]
     Slide 5: Chart — "[Title]", type: bar, series: [...]
     ... etc.

Step 2: READ the new data file
  → For Excel: use openpyxl or pandas to read all sheets
     python3 -c "import pandas as pd; [print(pd.read_excel('data.xlsx', sheet_name=s)) for s in pd.ExcelFile('data.xlsx').sheet_names]"
  → For CSV: pandas.read_csv
  → Identify which data maps to which slide in the old deck
  → Flag any new data that doesn't have a corresponding slide (may need new slides)
  → Flag any old slides whose data is missing from new file (confirm with user: keep old data or remove slide?)

Step 3: MAP old slides ↔ new data
  Present the user with a mapping summary:

  DECK REFRESH PLAN
  ━━━━━━━━━━━━━━━━
  Old deck: [filename] ([N] slides)
  New data: [filename] ([M] sheets/tables)

  SLIDE-BY-SLIDE PLAN:
  Slide 1: Title slide → Update date to "[new period]"
  Slide 2: Agenda → [Keep as-is / Update section names]
  Slide 3: Section divider → Keep as-is
  Slide 4: "[Volume targets]" table → UPDATE from Sheet "Volumes" in new data
  Slide 5: "[Revenue chart]" → UPDATE from Sheet "Revenue" in new data
  Slide 6: "[Two-column comparison]" → UPDATE left table from Sheet "Metrics"
  ...
  NEW SLIDE NEEDED: Data in Sheet "Risk flags" has no matching slide → Add after slide 8?
  OLD SLIDE WITHOUT DATA: Slide 10 "[Q2 special initiative]" — no matching new data → Remove or keep with old data?

  Proceed with this plan?

Step 4: BUILD the refreshed deck (with mandatory formatting fix)
  → Use the SAME layout functions from this skill (addTitleSlide, addContentSlide, etc.)
  → Preserve EXACT slide order from old deck (unless user approved changes in Step 3)
  → ALWAYS rebuild every slide using this skill's brand standards — treat this as a
     simultaneous formatting fix (Section 13). The old deck's fonts, colors, alignment,
     logo placement, divider thickness, heading style, chart colors, etc. are NOT carried
     forward. Only the CONTENT and STRUCTURE are preserved from the old deck.
  → For each slide:
     a. Use the same layout type as the original (table → table, chart → chart, etc.)
     b. Use the same slide title (update period reference if applicable, e.g., "Q2" → "Q3")
     c. Populate with new data from the mapped source
     d. Apply ALL JSW One brand standards: Calibri only, correct colors, bold blue headings,
        sentence case, divider (0.05" consistent), logo (PNG, correct aspect ratio, top-right),
        page numbers (left bottom), tables (blue headers, text left / numbers center),
        charts (blue+grey, data labels inEnd white bold, no Y-axis), footer (source right only),
        text boxes (top-aligned, justified)
     e. Keep the same footnotes/sources (update period references)
  → For new slides (if any): ask user which layout to use, or infer from data shape
  → Update title slide date/period
  → Update agenda slide if sections changed

Step 5: QA (data integrity + formatting compliance)
  → Run full QA checklist from Section 10 (this covers all brand/formatting standards)
  → CRITICAL additional checks for data integrity:
     Compare slide-by-slide: old deck text vs new deck text
     Every number on a data slide should come from the new data file, not the old deck
  → CRITICAL additional checks for formatting (since old deck may have been non-compliant):
     Verify every slide now passes the full Section 10 checklist
     No remnant fonts, colors, or layouts from the old deck carried through
  → Verify slide count matches plan from Step 3
  → Visual inspection
```

### 13.3 Data Mapping Rules

**How to match old slides to new data:**

1. **By slide title keywords:** If slide title says "volume targets" and the Excel has a sheet named "Volumes" or "Volume_Target", that's the match.
2. **By column headers:** If old slide has a table with columns [BU, FY26 Actual, FY27 Target], look for a sheet with similar column structure.
3. **By BU name:** If a slide is titled "Private Brands — monthly update", look for data tagged to Private Brands.
4. **By chart type:** If old slide had a bar chart with series [NMV, EBITDA] by [FY25, FY26, FY27], look for matching time-series data.

**When mapping is ambiguous:**
- Ask the user: "Sheet 'Data_Q3' could map to either Slide 5 (volume table) or Slide 7 (revenue chart). Which one?"
- NEVER guess silently. Always confirm.

### 13.4 Period Reference Updates

When refreshing a recurring deck, automatically update these text elements:

| Element | Old | New (infer from data or ask) |
|---------|-----|-----|
| Title slide date | "February 2026" | "March 2026" |
| Slide titles with period | "Q2 FY26 performance" | "Q3 FY26 performance" |
| Source lines | "Data as of 28 Feb 2026" | "Data as of 31 Mar 2026" |
| Footnote periods | "YTD as of Q2 FY26" | "YTD as of Q3 FY26" |
| Agenda items with dates | Update if period-specific | |

**Rules:**
- Only update period references, not substantive text
- If unsure whether something is a period reference or a data point, ask the user
- Week numbers: infer from data file or ask user ("Week ending [date]")

### 13.5 Handling Common Recurring Deck Types

#### Weekly Management Review
- Typically 8-15 slides
- Data changes: volume actuals, revenue actuals, order pipeline, credit disbursals
- Usually same structure every week — pure data refresh
- Title slide date updates to current week
- Often includes a "key highlights / lowlights" text slide — ask user for new commentary

#### Monthly S&OP Review
- Typically 15-25 slides
- Data changes: month actuals vs AOP, supply plan, demand forecast, inventory levels
- May include new commentary slides or updated risk flags
- Often has BU-specific sections — map data by BU

#### Quarterly Board Deck
- Typically 20-40 slides + annexures
- Data changes: quarterly financials, KPI dashboards, competitive updates
- More likely to have structural changes (new initiatives, dropped topics)
- Always confirm slide map with user before building

#### BU-Specific Monthly Reviews (Private Brands, Homes, etc.)
- Use BU context from Section 12.2 to understand which metrics matter
- Private Brands: repeat rates, dealer activation, state-wise volume, supply mix
- Homes: studio pipeline, units delivered, GTV, conversion funnel
- Manufacturing: customer activation, JODL codes, product-wise volumes
- Credit: disbursals, AUM, NPA, partner-wise split

### 13.6 Data Integrity Safeguards

**Before presenting the final deck, verify:**
- [ ] Every number on every data slide traces back to the new data file
- [ ] No numbers from the old deck carried over accidentally
- [ ] Totals and subtotals are arithmetically correct (recompute, don't copy)
- [ ] Percentage calculations match (growth %, margins, shares)
- [ ] Period references are consistent across all slides
- [ ] Slide count matches the approved plan from Step 3
- [ ] Any "keep old data" slides are clearly marked in footnotes (e.g., "Data as of prior period")

### 13.7 Output Naming Convention

Name the output file with the period to avoid confusion:
```
[DeckName]_[Period].pptx
```
Examples:
- `Weekly_Management_Review_W10_Mar2026.pptx`
- `S&OP_Review_Mar2026.pptx`
- `Board_Deck_Q3_FY26.pptx`
- `Private_Brands_Monthly_Feb2026.pptx`

---

