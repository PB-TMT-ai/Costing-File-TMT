# Monthly S&OP Review — Deck Construction Guide

**Read this file when the user asks for a monthly S&OP review, monthly review, or MIS review deck.**

---

## Context

- **Audience:** CEO + BU heads + S&OP + Finance (cross-functional, 8-12 people)
- **Cadence:** Monthly, presented at T+7 to T+10 after month close
- **Flow:** Demand first, then supply, then financials, then actions
- **Density:** Moderate to high. This audience knows the business. Show the data, highlight the gaps, assign actions.
- **Title style:** Topic titles for data slides. Insight titles only for the opening snapshot and closing priorities.
- **Typical slide count:** 18-22 slides (including title, agenda, section dividers)

---

## Data to request from user

Before building, ask for:
1. **Month and FY** (e.g., "February FY26")
2. **MIS data file** — monthly actuals by BU (volume, GMV, revenue, CM1, EBITDA)
3. **AOP targets** — the annual plan broken into monthly targets
4. **Previous month's deck** — if this is a refresh, upload last month's version
5. **Action items from last month** — status updates on open items
6. **Any specific topics to highlight** — new initiatives, escalations, one-off events

---

## Slide-by-slide construction spec

### SECTION A: OPENING (3 slides)

#### Slide 1: Title slide
- Layout: Title (Layout A)
- Title: "S&OP review — [Month] FY[XX]"
- Subtitle: "Cross-functional monthly review"
- Date: "[Day] [Month] [Year]"

#### Slide 2: Agenda
- Layout: Index (Layout B)
- Always top-aligned, never centred
- Sections:
  1. Month snapshot
  2. Demand performance by BU
  3. Customer and credit metrics
  4. Supply and delivery performance
  5. Working capital
  6. Financial performance
  7. Private Brands deep-dive
  8. Action tracker and priorities

#### Slide 3: Month snapshot (INSIGHT TITLE)
- **Title:** "[Month] at [X]% of AOP volume — [on track / X% gap to plan]"
- **Layout:** 6 KPI cards at top, 3-4 bullet highlights below
- **KPI cards (1 row of 6):**

| Card | Value | Sublabel |
|------|-------|----------|
| Volume | [X] KMT | vs [Y] KMT AOP ([Z]%) |
| GMV | INR [X] Cr | vs INR [Y] Cr AOP |
| CM1 | INR [X] Cr | ▲/▼ [Z]% vs prev month |
| OTIF | [X]% | vs [Y]% prev month |
| Credit penetration | [X]% | of total GMV |
| NWC days | [X] days | vs [Y] days prev month |

- **KPI card sizing:** w = (GRID.W - 5*0.12) / 6 = ~1.95". h = 0.95". Use compact format: value 24pt, label 10pt, sublabel 10pt.
- **Below KPIs (cursorY starts after cards + 0.15 gap):** 3-4 bullets highlighting:
  - Biggest BU win this month (with number)
  - Biggest BU miss this month (with number)
  - Any one-off event (plant shutdown, new geography launch, etc.)
  - MTD vs YTD trajectory (are we catching up or falling behind AOP?)
- **Font:** 12pt body, bullets with blue bullet markers

---

### SECTION B: DEMAND PERFORMANCE (4-5 slides)

#### Slide 4: Section divider
- "Demand performance"
- Subtitle: "Volume and GMV actual vs AOP across business units"

#### Slide 5: Consolidated volume — actual vs AOP by BU (CHART)
- **Title:** "BU-wise volume: [Month] actual vs AOP vs previous month"
- **Layout:** Grouped bar chart (full width)
- **Chart spec:**
  - 3 series: AOP target (grey), Actual (blue), Previous month (light grey outline)
  - X-axis: BU names (MFG Enterprise, MFG SMB, Construction, Private Brands, Cement)
  - Data labels inside bars, white bold 11pt
  - No Y-axis, no gridlines
- **Below chart:** One-line annotation in grey 12pt:
  "Total volume: [X] KMT ([Y]% of AOP). [BU name] was the largest miss at [Z]% achievement."
- **Data source:** MIS file, volume columns, AOP file for targets
- **Chart height:** ~4.50". Leave room for annotation below.

#### Slide 6: Manufacturing demand detail
- **Title:** "Manufacturing volume and revenue — [Month] FY[XX]"
- **Layout:** Full-width table + inline commentary
- **Table columns:** BU | Month actual | Month AOP | Ach% | Prev month | MoM change | YTD actual | YTD AOP | YTD Ach%
- **Table rows:** Enterprise (JOPL, JODL OE, T1S, JIT subtotals), SMB (FOS, T1S-Retail, IS subtotals), MFG Total
- **Column widths:** [2.50, 1.20, 1.20, 0.90, 1.20, 1.05, 1.20, 1.20, 1.68] = 12.13" (within GRID.W)
- **Formatting:**
  - Ach% column: ▲ blue if >=95%, ▼ grey if <95%
  - MoM change: ▲ blue if positive, ▼ grey if negative
  - Total rows: bold
  - Row height: 0.35" (compact, this is a dense table)
  - Font: 12pt. If table overflows, reduce to 11pt.
- **Below table (if space):** One line: "[Key observation about Enterprise vs SMB performance]"

#### Slide 7: Construction + Private Brands demand
- **Title:** "Construction and Private Brands — [Month] FY[XX]"
- **Layout:** Two-column (Layout E)
- **Left column (Construction):**
  - Heading: "Construction"
  - Table: Segment (Projects, Retail) | Month actual | AOP | Ach% | YTD Ach%
  - Column widths within 5.90": [1.40, 1.00, 1.00, 0.75, 0.75]
  - Below table: key observation bullet
- **Right column (Private Brands):**
  - Heading: "Private Brands"
  - Table: Metric (Volume KMT, GMV INR Cr, Dealers active, D30 repeat %) | Month | Prev month | MoM
  - Column widths within 5.90": [1.80, 1.20, 1.20, 0.70]
  - Below table: key observation bullet
- **Header boxes must match column widths (Section 2.7.1)**

#### Slide 8: Customer and credit metrics
- **Title:** "Customer metrics and credit penetration — [Month] FY[XX]"
- **Layout:** Two-column
- **Left column: Customer waterfall**
  - Heading: "Customer movement"
  - Table: Category | Count
  - Rows: Opening active customers | + New acquisitions | + Reactivated | - Churned | = Closing active | Repeat rate (%)
  - Or if data supports it: horizontal bar chart showing new/repeat/churned
- **Right column: Credit penetration**
  - Heading: "Credit penetration by BU"
  - If 3+ BUs: doughnut chart or horizontal bar (BU on Y-axis, penetration % on X)
  - If only summary: KPI cards (total credit GMV, penetration %, disbursals, partner count)
  - Below: one-line annotation on credit attachment trend

---

### SECTION C: SUPPLY PERFORMANCE (2-3 slides)

#### Slide 9: Section divider
- "Supply and delivery performance"
- Subtitle: "OTIF, lead time, and operational metrics"

#### Slide 10: OTIF and delivery metrics
- **Title:** "Supply chain performance — [Month] FY[XX]"
- **Layout:** Full-width table + commentary
- **Table columns:** BU/Channel | OTIF % | Lead time (days) | Rejection rate % | Month trend (▲▼)
- **Table rows:** Enterprise (JOPL, JODL), SMB, Construction, Private Brands (by plant if data available), JOTS logistics
- **Formatting:**
  - OTIF: ▲ blue if >=85%, ▼ grey if <85%
  - Lead time: ▼ blue if improving (fewer days), ▲ grey if worsening
  - Rejection: ▼ blue if improving, ▲ grey if worsening
  - Note: for supply metrics, LOWER is better for lead time and rejection. Color coding inverts.
- **Below table:** "OTIF at [X]% vs target of 85%. [Specific bottleneck or win]."

#### Slide 11: Working capital
- **Title:** "Working capital metrics — [Month] FY[XX]"
- **Layout:** KPI cards (top) + trend table (below)
- **KPI cards (4):**

| Card | Value | Sublabel |
|------|-------|----------|
| NWC days | [X] days | vs [Y] prev month |
| DSO | [X] days | vs [Y] prev month |
| DPO | [X] days | vs [Y] prev month |
| Advance outstanding | INR [X] Cr | vs [Y] prev month |

- **Below KPIs: 3-month trend table:**
  - Columns: Metric | M-2 | M-1 | Current month | Trend
  - Rows: NWC days, DSO, DPO, Advance days, Inventory days
  - Trend column: ▲▼ with blue/grey coloring
- **Commentary:** "NWC at [X] days vs target of [Y] days. [Specific driver: receivable spike from [customer/BU], or advance reduction from [action]]."

---

### SECTION D: FINANCIAL PERFORMANCE (2-3 slides)

#### Slide 12: Section divider
- "Financial performance"
- Subtitle: "P&L summary and BU-wise EBITDA"

#### Slide 13: P&L summary
- **Title:** "Consolidated P&L — [Month] FY[XX]"
- **Layout:** Full-width table
- **Table columns:** Particulars | Month actual | Month AOP | Var % | Prev month | MoM % | YTD actual | YTD AOP | YTD Var %
- **Table rows (8-10, summary level):**
  1. GMV (INR Cr)
  2. NMV (INR Cr)
  3. Revenue (INR Cr)
  4. Gross margin (INR Cr)
  5. GM % to NMV
  6. CM1 (INR Cr)
  7. CM1 % to NMV
  8. Op EBITDA (INR Cr)
  9. PBT excl ESOPs (INR Cr)
- **Column widths:** [2.80, 1.10, 1.10, 0.90, 1.10, 0.90, 1.10, 1.10, 1.23] = 11.33"
- **Formatting:**
  - Var % column: ▲ blue if favorable (revenue up, cost down), ▼ grey if unfavorable
  - EBITDA row: bold, blue fill if positive, grey text if negative
  - All currency in INR Cr format. Margins in % with 1 decimal.
- **Below table:** "Revenue at [X]% of AOP. EBITDA variance driven by [specific driver]."

#### Slide 14: CM1 and EBITDA by BU
- **Title:** "BU-wise CM1 and EBITDA — [Month] FY[XX]"
- **Layout:** Full-width table OR chart + table
- **If table:**
  - Columns: BU | CM1 actual | CM1 AOP | CM1 Var | EBITDA actual | EBITDA AOP | EBITDA Var
  - Rows: MFG Enterprise, MFG SMB, Construction, Private Brands, Homes, New Categories, Total
  - Var columns: ▲▼ with blue/grey
- **If chart + table (preferred for visual variety):**
  - Left (7"): Horizontal bar chart — BU on Y-axis, CM1 actual vs AOP as paired bars
  - Right (5"): Compact EBITDA table (BU | Actual | AOP | Var)
- **Commentary:** "[BU] is the largest CM1 contributor at INR [X] Cr. [BU] missed CM1 target by [Y]%."

---

### SECTION E: PRIVATE BRANDS DEEP-DIVE (2 slides)

#### Slide 15: PB operational metrics
- **Title:** "Private Brands — dealer and distribution metrics"
- **Layout:** Two-column
- **Left: State-wise volume table**
  - Heading: "Volume by state (top 5 + others)"
  - Columns: State | Month (MT) | AOP | Ach% | Dealers active
  - Rows: Top 5 states by volume + "Others" + Total
  - Sort by volume descending
- **Right: Dealer health metrics**
  - Heading: "Dealer engagement"
  - Table or KPI cards:
    - Total dealers: [X]
    - Active this month (D30): [X] ([Y]%)
    - D30 repeat rate: [X]%
    - D60 repeat rate: [X]%
    - Avg purchase frequency: [X] orders/month
    - Avg order size: [X] MT
  - If trend data available: 3-month trend line for repeat rate

#### Slide 16: PB supply and inventory
- **Title:** "Private Brands — plant-wise production and stock"
- **Layout:** Full-width table
- **Table columns:** Plant/CM | Production (MT) | Dispatch (MT) | Closing stock (MT) | Stock days | Rejection % | OTIF %
- **Rows:** Each contract manufacturer (6 plants) + Total
- **Formatting:**
  - Stock days: ▼ blue if <15, ▲ grey if >15
  - Rejection: ▼ blue if <2%, ▲ grey if >=2%
  - OTIF: ▲ blue if >=90%, ▼ grey if <90%
- **Commentary:** "Production at [X] MT vs dispatch of [Y] MT. Stock days at [Z]. [Specific plant issue if any]."

---

### SECTION F: CLOSE (2-3 slides)

#### Slide 17: Action items from last month
- **Title:** "Action tracker — items from [Previous month] review"
- **Layout:** Full-width table
- **Table columns:** # | Action item | Owner | Deadline | Status
- **Status values:** Closed (blue text), Open (black text), Delayed (grey text with ▼)
- **Rows:** All items from previous month's "priorities" slide
- **Formatting:**
  - Closed items: regular weight
  - Delayed items: bold, grey
  - Row height: 0.38" (allow for 2-line descriptions)
- **This slide is mandatory even if all items are closed.** Shows accountability.

#### Slide 18: Open issues and escalations
- **Title:** "Open issues requiring leadership attention"
- **Layout:** Full-width table
- **Table columns:** Issue | BU | Owner | Deadline | Severity
- **Severity:** RAG indicator — blue circle (on track), grey circle (at risk), white circle with grey border (off track)
- **Rows:** Any issue that needs CEO/BU head decision
- **If no issues:** Single row: "No open escalations this month." This slide is mandatory.

#### Slide 19: Priorities for next month
- **Title (INSIGHT):** "[X] priorities for [Next month] — [key theme]"
- **Layout:** 3-4 cards (content-aware sizing)
- **Each card:**
  - Blue top-accent bar
  - Title: priority description (bold, 12pt)
  - Body: 1-2 lines of specifics (12pt)
  - Owner name at bottom (grey, 11pt)
- **Card count:** 3-4 max. If more than 4, the top priorities aren't clear enough.

---

## Data mapping guide

**Which MIS data goes where:**

| MIS data field | Slide(s) | How to use |
|---------------|----------|-----------|
| Volume by BU (monthly) | 3, 5, 6, 7 | KPI snapshot, bar chart, detail tables |
| GMV by BU | 3, 13 | KPI snapshot, P&L |
| Revenue, GM, CM1, EBITDA | 13, 14 | P&L table, BU EBITDA table |
| AOP targets (monthly) | 5, 6, 7, 13, 14 | Comparison columns in all performance tables |
| Previous month actuals | 3, 6, 7, 11, 13 | MoM comparison columns |
| Customer count (new, repeat, churned) | 8 | Customer waterfall |
| Credit GMV, disbursals, penetration | 8 | Credit metrics |
| OTIF, lead time, rejection | 10 | Supply chain table |
| DSO, DPO, NWC days, advances | 11 | Working capital KPIs and trend |
| PB state-wise volume | 15 | State table |
| PB dealer metrics (D30, D60, frequency) | 15 | Dealer health metrics |
| PB plant-wise production/dispatch/stock | 16 | Plant table |
| Previous month's action items | 17 | Action tracker |

---

## Common mistakes in S&OP decks (avoid these)

1. **Showing only current month without AOP comparison.** Every volume and financial metric must show actual vs AOP. A number in isolation is meaningless.
2. **Missing MoM trend.** The audience needs to know direction. Was this month better or worse than last month, not just vs AOP.
3. **No YTD column.** Monthly can be noisy. YTD shows whether the annual plan is on track.
4. **Generic takeaways.** "Volume was strong this month" is useless. "Enterprise hit 102% of AOP driven by JOPL spot orders from Tata Steel" is useful.
5. **No action items.** If the review doesn't produce actions, it was a status meeting, not a review. Always close with specific actions + owners + deadlines.
6. **Missing PB deep-dive.** PB is the highest-risk BU in the AOP. It needs 2 dedicated slides every month.
7. **Working capital shown as a single number.** Break into DSO, DPO, advances. Show trend (3 months min). A single NWC days number hides the drivers.
8. **Supply metrics without context.** OTIF at 82% means nothing if the target isn't stated. Always show actual vs target.
9. **Credit metrics buried in a BU table.** Credit penetration is a platform-level metric. Give it its own space on slide 8.
10. **Action tracker with no status updates.** If last month's actions have no status, the review process isn't working.

---

## Quality checklist (run before delivering)

- [ ] Every data slide shows: actual vs AOP vs previous month (3 comparisons minimum)
- [ ] ▲ in blue for favorable, ▼ in grey for unfavorable (including value text, not just arrow)
- [ ] Supply metrics: lower is better for lead time/rejection (color coding inverts)
- [ ] YTD columns present on all performance tables
- [ ] PB deep-dive has 2 dedicated slides (dealer metrics + plant metrics)
- [ ] Working capital shows 3-month trend, not just current month
- [ ] Action tracker from previous month is populated with status updates
- [ ] Priorities slide has 3-4 cards max with named owners
- [ ] No slide has overlapping content (cursorY tracking used)
- [ ] Section dividers present between each major section
- [ ] All currency in INR Cr/Lac format, never Rs. or ₹
- [ ] Source footer on every data slide citing MIS file and date
