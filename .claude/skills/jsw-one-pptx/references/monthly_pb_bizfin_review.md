# Monthly Private Brands BizFin Review — Deck Construction Guide

**Read this file when the user asks for a monthly Private Brands review, PB BizFin review, PB monthly performance, or PB finance review deck.**

---

## Context

- **Audience:** CEO, CFO, PB BU head, BizFin team (6-10 people)
- **Cadence:** Monthly, presented at T+7 to T+12 after month close
- **Purpose:** Financial governance and commercial oversight of Private Brands. This is NOT the S&OP demand review (that's in monthly_sop_review.md). This deck answers: "Are we making money on PB, where are we leaking margin, and is working capital under control?"
- **Lens:** BizFin — unit economics, route profitability, CM plant economics, working capital governance, sales productivity, forward risk. Every slide should have a commercial governance angle.
- **Density:** High. This audience operates at plant-level and route-level granularity. Tables dominate. Commentary is brief and action-oriented.
- **Title style:** Topic titles for data slides. Insight titles only for the opening P&L slide and closing outlook.
- **Typical slide count:** 16-18 slides (including title and thank you)
- **Currency:** All figures in INR Cr unless stated otherwise. Per-ton figures in INR/MT (labeled "PMT").
- **Entity scope:** JODL (all PB transactions flow through JODL). Specify in footer.

---

## Data to request from user

Before building, ask for:
1. **Month and FY** (e.g., "January FY26" or "Jan'26")
2. **PB P&L data** — monthly actuals by line item (volume, GMV, sales, purchase, gross margin, fulfilment, employee cost direct, branding, CM1, EBITDA)
3. **Plant-wise P&L** — sales, purchase, GM, fulfilment, CM1 by each contract manufacturer
4. **RGM data** — CM/MT by grade (Fe550, Fe550D) × channel (Retail, Projects) × plant
5. **Plant × State margin data** — CM/MT cross-tab (plant as columns, shipping state as rows) for Overall, Retail, Projects
6. **DSI data** — Days of Stock Inventory by plant, monthly trend, closing stock in MT
7. **Advance ageing data** — advances paid to CMs, aged by 0-30/31-60/61-90/>90 days, PO-level detail for >30D
8. **Working capital block** — advance + inventory value by plant, monthly trend, interest cost at 9% p.a.
9. **Sales mix data** — by payment type (C&C, CF-Kotak, CF-Tata), by delivery type (JOTS, self-pickup), by state with stocking %
10. **Salesperson productivity** — quantity sold per salesperson by state, monthly trend, headcount
11. **MOU achievement** — distributor-level MOU target vs YTD achievement, volume at risk calculation
12. **Next month outlook** — actuals-to-date + rest-of-month estimate with assumptions
13. **Previous month's deck** — if refreshing, upload last month's version

---

## Slide-by-slide construction spec

### SLIDE 1: Title slide
- Layout: Title (Layout A)
- Title: "Private Brands"
- Subtitle: "Business Finance : [Month]-[YY]"

---

### SLIDE 2: Financial performance — YTD (INSIGHT TITLE for this slide)
- **Title:** "[Positive/negative] CM1 trajectory in [Month] — [one-line summary of the month]"
- Example: "Jan'26 CM1/MT recovers to INR 2,019 after 6-month monsoon drag"
- **Layout:** Full-width table, 13 columns (monthly Apr to current + PMT column + FY YTD)

**Table structure (22 rows):**

| Row | Line item | Notes |
|-----|-----------|-------|
| 1 | Volume MT | Total quantity sold |
| 2 | GMV | Gross Merchandise Value (INR Cr) |
| 3 | PMT label row | "PMT" column header for per-ton values |
| 4 | Total Sales | Net sales realization (INR Cr) |
| 5 | Less: Total Purchase | Purchase cost from CMs (INR Cr) |
| 6 | Gross Margin | Sales - Purchase |
| 7 | Gross Margin % | GM / Sales × 100 |
| 8 | Gross Margin PMT | GM / Volume × 1000 |
| 9 | Less: Fulfilment cost | JOTS logistics + delivery |
| 10 | Fulfilment PMT | Fulfilment / Volume × 1000 |
| 11 | Revenue Gross Margin (RGM) | GM - Fulfilment |
| 12 | RGM % | RGM / Sales × 100 |
| 13 | RGM PMT | RGM / Volume × 1000 |
| 14 | Less: Employee cost (direct) | Direct sales team cost mapped to PB (up to L14) |
| 15 | Employee PMT | Employee / Volume × 1000 |
| 16 | Less: Branding & Promotion | BTL, dealer kits, fabricator meets, digital |
| 17 | Branding PMT | Branding / Volume × 1000 |
| 18 | CM1 | RGM - Employee - Branding |
| 19 | CM1 % | CM1 / Sales × 100 |
| 20 | CM1 PMT | CM1 / Volume × 1000 |
| 21 | Less: Other overheads | Allocated indirect costs |
| 22 | Operating EBITDA | CM1 - Overheads |

**Formatting:**
- Font: 11pt for dense table (exception per SKILL.md Section 2.2)
- Header: blue fill (213366), white text
- Negative values: grey font (7F7F7F), not red
- Total/summary rows: bold, light grey fill (F2F2F2)
- PMT column: right-aligned, INR format with commas
- FY YTD column: bold

**Footer note:** "Employee Benefits Expenses (Direct): direct employee costs mapped to PB up to L14"

**Analytical pre-computation for this slide:**
1. Compute MoM change for CM1/MT — is margin improving or deteriorating?
2. Compute GM/MT trend — separate the purchase price effect from the sales realization effect
3. Compute fulfilment cost/MT trend — is logistics cost per ton stable?
4. Flag any month where CM1/MT turned negative (and whether it recovered)
5. Compute YTD CM1 vs FY AOP CM1 target — on track?

---

### SLIDE 3: Sales mix
- **Title:** "Sales mix — [Month]'[YY]"
- **Layout:** Three tables + commentary box

**Table 1: By payment type** (5-6 rows × 3 cols: Payment type, Quantity MT, %)
- Cash & Carry (advance), CF-Kotak, CF-Tata, BG, LC, Total
- Key metric: credit penetration % (non-C&C share)

**Table 2: By delivery type** (3-4 rows × 3 cols)
- JOTS, Self-pickup, Total
- Key metric: JOTS share (should be >90%)

**Table 3: State-wise stocking analysis** (15-20 rows × 6 cols)
- Shipping state, Projects qty, Retail qty, Self-stocking qty, Grand Total, % stocking to total
- Sorted by stocking % descending
- Key metric: overall stock allocation to total sales

**Commentary box:** Call out states with high stocking % (>30%) — these indicate distributor self-stocking behavior which may inflate volume without sell-through. Also flag any shift in credit penetration.

---

### SLIDE 4: DSI days (MoM)
- **Title:** "DSI days (M-o-M)"
- **Layout:** Full-width table (14 rows × 14 cols: Plant, Location state, monthly DSI + closing stock for current and prior month)

**Table structure:**
- Row per CM plant (6-10 plants)
- Columns: Plant name, Location, Apr through current month DSI days, prior month closing stock (MT), current month closing stock (MT)
- Total row at bottom

**Commentary box (below table):**
- Highlight DSI improvement/deterioration from peak
- Flag any plant with DSI >25 days (working capital drag)
- Flag any plant with stock increase >50% MoM (inventory build-up signal)
- Quantify working capital released/consumed from DSI movement

**Analytical pre-computation:**
1. Compute weighted average DSI across all plants
2. Identify the plant with highest DSI — is it improving or worsening?
3. Compute total closing stock in MT — trend vs prior 3 months
4. Flag any plant where stock surged >50% MoM despite reasonable DSI (could indicate large inbound PO timed at month-end)

---

### SLIDE 5: Plant-wise P&L
- **Title:** "Plant wise P&L — [Month]'[YY]"
- **Layout:** Full-width table (14 rows × 13 cols: one column per plant + Total + PMT)

**Table structure:**
- Rows: Quantity sold, Total sales, Less: Total purchase, Gross margin, GM%, Less: Fulfilment, Revenue Gross Margin, RGM%, Less: Interest cost, Less: WC cost, CM1, CM1%, CM1 PMT
- Columns: One per CM plant (Amba Shakti, API, Aditya, AIC, SKA, ASUL, German Steel, SGML, Real Ispat, SGSML) + Total + PMT (INR)

**Key insights to surface:**
- Which plant has the highest CM1/MT? Which has the lowest?
- Any plant with negative CM1? (flag for pricing/routing review)
- Volume concentration: is >50% coming from 1-2 plants? (supply risk)
- Compare plant-level GM/MT to identify pricing/purchase cost anomalies

---

### SLIDE 6: RGM details — Grade wise & plant wise
- **Title:** "RGM details — Grade wise & plant wise ([Month]'[YY] and [Prior Month]'[YY])"
- **Layout:** Two tables (current month and prior month) stacked or side by side

**Table structure per month** (7 rows × 11 cols):
- Rows: Project-550, Project-550D, Project Total, Retail-550, Retail-550D, Retail Total
- Columns: Each CM plant + Total
- Cell value: CM/MT (INR)

**Key insights:**
- CM/MT by grade: is Fe550 or Fe550D more profitable?
- CM/MT by channel: Retail CM/MT should be ~2x Projects (structural)
- Any plant × grade with negative CM/MT? (pricing governance flag)
- MoM change in CM/MT by grade — are we gaining or losing on specific grades?

---

### SLIDES 7-8: Advance to CM ageing
- **Title:** "Advance to CM as on [date] (1/2)" and "(2/2)"

**Slide 7 — Summary + PO-level detail for >30D:**
- Table 1 (6 rows × 6 cols): Overall ageing — 0-30D, 31-60D, 61-90D, >90D, Total. Current month vs prior month. Directional arrows (↑/↓).
- Table 2: PO-level detail for all advances >30 days — PO number, Grade, CM name, Days outstanding, Amount, Remarks

**Slide 8 — Plant-level ageing:**
- Table (10 rows × 12 cols): CM name, Credit period, 0-30D, 31-60D, 61-90D, >90D, Total current, Total prior, Status (↑/↓), Remarks, Suggested Actionable

**Analytical pre-computation:**
1. Total advance outstanding — trend vs prior 3 months
2. % of advances >30 days (should be declining)
3. Any >90D advances? Flag with specific PO and CM name — these are governance escalation items
4. Compute interest cost on advances (at 9% p.a.) — this directly hits CM1

---

### SLIDES 9-11: Plant × State margins (Overall, Retail, Projects)
- **Title:** "Plant x State margins (Overall/Retail/Projects) — [Month]'[YY]"
- **Layout:** Full-width cross-tab table (20 rows × 19 cols)

**Table structure:**
- Rows: Shipping states (15-18 states)
- Columns: Each plant × 2 (Qty, CM/MT) + Total Quantity + Total CM/MT
- Three separate slides: Overall (Slide 9), Retail only (Slide 10), Projects only (Slide 11)

**Commentary (below table on each slide):**
- Identify best routes (highest CM/MT plant-state combinations)
- Identify worst routes (negative CM/MT — pricing or freight issue)
- Identify routes where CM/MT improved/declined significantly MoM

**Analytical pre-computation:**
1. Rank top 5 and bottom 5 routes by CM/MT
2. Flag all negative CM/MT routes — these are margin leakage points
3. Compute the total INR loss on negative-margin routes: Σ (negative CM/MT × volume on that route)
4. Identify routes where Retail CM/MT is below INR 500 (below sustainable threshold)

---

### SLIDE 12: Project & Retail RGM (MoM)
- **Title:** "Project & Retail RGM (M-o-M)"
- **Layout:** Two tables stacked (Projects, then Retail), each with monthly columns

**Table structure per channel** (4 rows × 13 cols):
- Rows: Quantity (MT), CM/MT (INR), CM%
- Columns: Apr through current month + FY YTD

**Commentary (between and below tables):**
- Key insight: "Retail margin is +INR X/MT higher than Projects on average"
- Retail orders account for X% of total quantity
- Flag: is Projects CM/MT positive this month? If turning positive after losses, highlight as inflection
- Flag: any month where Projects went deeply negative — quantify the loss

**Analytical pre-computation:**
1. Compute average Retail CM/MT - Projects CM/MT spread (should be ~INR 700-1,000)
2. Count consecutive months of negative Projects CM/MT
3. Compute Retail volume share of total (target: >65%)
4. Flag if Projects CM/MT turned positive — this is an inflection event worth highlighting

---

### SLIDE 13: Retail BE margin vs actual
- **Title:** "Retail BE Margin Vs Actual Margin for [Month]'[YY]"
- **Layout:** Table + chart/image

**Table structure** (11 rows × 3 cols: Values, 1st week BE, Actuals):
- Quantity, Sales incl. freight (PMT), Purchase price ex-works (PMT), Gross margin (PMT), Fulfilment cost (PMT), RGM (PMT), Employee cost (PMT), Branding (PMT), CM1 (PMT), CM1 %

**Key insight:** Compare the breakeven estimate (set at start of month based on 1st week pricing) against actual month-end. Did actual CM1/MT beat or miss the BE estimate? By how much?

---

### SLIDE 14: Working capital block and interest cost (MoM)
- **Title:** "Working capital block and Interest cost (M-o-M)"
- **Layout:** Two tables stacked (WC block by plant, Interest cost by plant), monthly columns

**Table 1: WC block** (12 rows × 11 cols):
- Row per plant, columns monthly (Apr through current), values in INR Cr
- Total row at bottom

**Table 2: Interest cost** (same structure):
- Interest computed at 9% p.a. on WC block
- Total row

**Commentary:** Quantify WC reduction from peak to current. State the interest saving in INR terms.

**Analytical pre-computation:**
1. Compute peak WC month and current WC — what % reduction?
2. Total interest cost YTD — is it material relative to CM1?
3. Any plant where WC is increasing while others are decreasing? (flag)

---

### SLIDE 15: Salesperson productivity
- **Title:** "Salesperson productivity (Retail, PTR and retail at special prices) — YTD FY[XX]"
- **Layout:** Dense table (23 rows × 31 cols — state rows, monthly columns with Qty/Headcount/Qty per Pax)

**Table structure:**
- Rows: States (15-20)
- Column groups: Each month has 3 sub-columns (Qty MT, Head Count, Qty/Pax)
- Total row at bottom

**Commentary:**
- Identify lowest productivity state (Qty/Pax) — flag for intervention
- Identify highest productivity state — benchmark for others
- Flag any state where headcount increased but Qty/Pax declined (negative ROI on hiring)

**Analytical pre-computation:**
1. Rank states by Qty/Pax (salesperson productivity) for current month
2. Compute MoM trend in Qty/Pax — is productivity improving system-wide?
3. Flag states with Qty/Pax below 200 MT/month — underperforming threshold
4. Compute cost-per-MT implied by salesperson cost ÷ volume — does it erode CM1?

---

### SLIDE 16: Volume at risk
- **Title:** "Volume at risk — FY[XX]"
- **Layout:** Two tables + assumption box

**Table 1: MOU achievement summary** (7 rows × 5 cols):
- Buckets: <50%, 50-60%, 60-70%, 70-80%, >80%
- Columns: % achieved, # Distributors, MOU target, Vol. achieved, Vol. at risk

**Risk calculation methodology (display in a callout box):**
- >80% achievement: No risk
- 70-80%: 5% volume at risk
- 60-70%: 15% at risk
- 50-60%: 20% at risk
- <50%: 40% at risk

**Table 2: Distributor-level detail for low achievers** (7-10 rows × 7 cols):
- Sr No, State, Distributor Name, FY MOU, Vol achieved, Balance left, Vol at risk

**Analytical pre-computation:**
1. Total volume at risk (INR and KMT)
2. Volume at risk as % of full-year AOP
3. Concentration: how many distributors account for >50% of at-risk volume?
4. State-wise risk concentration — which states have the most at-risk volume?

---

### SLIDE 17: Outlook for next month
- **Title:** "Outlook for [Next Month]'[YY] — A Snapshot" (INSIGHT TITLE)
- Example: "Feb'26 estimated exit at 23,500 MT vs BE of 36,700 MT — 36% below plan"
- **Layout:** Table + assumptions box

**Table structure** (12 rows × 7 cols):
- Rows grouped by channel: Retail (Actuals, Rest of month, Total), Projects (same), Overall (same)
- Columns: Type, CM/MT, Fe550, Fe550D, Total, Qty, Total CM (INR Cr)

**Assumptions box:**
- Volume assumption (sales team BE vs BizFin estimate — flag if different)
- Price assumption (current prices continue, or adjustment expected)
- Any one-off events (plant shutdown, nodal approval, price change)

---

### SLIDE 18: Thank you
- Layout: Title (Layout A)
- Text: "Thank You"

---

## Key analytical patterns specific to this deck

### Route economics is the core value-add

The Plant × State CM/MT matrix (slides 9-11) is the most analytically rich content in this deck. It reveals:
- **Freight arbitrage:** Some routes are profitable purely because freight cost is low (plant proximity)
- **Grade mismatch:** Some states can only be served by specific grades (Fe550D not available at all plants)
- **Pricing leakage:** Negative CM/MT routes indicate either underpricing or wrong plant-state assignment

**BizFin action:** When route CM/MT is negative, the actionable is either (a) stop serving that route from that plant, (b) reprice, or (c) shift to a closer CM. The commentary must state which.

### Retail vs Projects spread is a structural feature

Retail CM/MT is structurally ~INR 700-1,000 higher than Projects CM/MT. This is because:
- Retail sells on price list (controlled pricing)
- Projects sell on negotiated/competitive pricing
- Retail has better realization, Projects has larger volume per order but thinner margin

**BizFin action:** If Projects share exceeds 35% of monthly volume AND Projects CM/MT is negative, the blended CM1 will be dragged down. Flag and recommend volume caps or price floors for Projects.

### DSI and advance ageing are working capital governance tools

- DSI days by plant shows inventory efficiency at each CM
- Advance ageing shows how much cash is locked with CMs and for how long
- Interest cost on WC directly reduces CM1 — quantify it

**BizFin action:** Any advance >90 days requires an escalation memo. Any plant with DSI >25 days requires a sales plan to liquidate stock. Compute: if DSI drops from X to Y days, how much WC (INR Cr) is released?

### Volume at risk is a forward-looking governance tool

The MOU achievement analysis is unique to this deck — it doesn't appear in S&OP or Board decks. It:
- Grades distributors by YTD achievement buckets
- Applies a risk-weighted methodology to estimate volume at risk
- Names specific underperforming distributors

**BizFin action:** The at-risk volume should be compared to the full-year AOP gap. If at-risk volume exceeds the remaining AOP gap, the plan is unachievable without distributor intervention.

### Salesperson productivity reveals geographic ROI

Qty/Pax (MT sold per salesperson per month) varies dramatically by state. States with <200 MT/Pax are candidates for either (a) more distributor coverage, (b) territory rebalancing, or (c) headcount reduction.

**BizFin action:** Compare employee cost per MT across states. If a state's employee cost/MT exceeds CM1/MT, the state is not self-funding from a sales cost perspective.

---

## Metrics that matter in this deck (for analytical_engine.md integration)

These metrics should be added to the PB signal patterns:

1. **CM1/MT (monthly)** — the north star. Track MoM, flag if <INR 500 outside monsoon
2. **Retail vs Projects CM/MT spread** — should be INR 700-1,000. If narrowing, Retail pricing or Projects undercutting
3. **Route CM/MT (plant × state)** — negative routes are margin leakage. Quantify total INR lost on negative routes
4. **DSI days (weighted avg)** — target <20 days. >25 is WC drag
5. **Advance ageing (>30D %)** — should be declining. >90D = escalation
6. **WC block (INR Cr)** — track peak-to-current reduction. Compute interest saving
7. **Stocking ratio (%)** — overall self-stocking to total sales. >30% = distributor hoarding risk
8. **Salesperson Qty/Pax** — <200 MT/month = underperformance
9. **MOU achievement rate** — distributors at <60% achievement need intervention
10. **Volume at risk (KMT)** — forward-looking risk from MOU analysis
11. **BE vs Actual CM1/MT** — did month-end beat or miss the breakeven estimate?
12. **Credit penetration %** — non-C&C share (CF-Kotak + CF-Tata + BG + LC as % of total)
13. **JOTS delivery share** — should be >90%
14. **Projects CM/MT sign** — is it positive or negative this month? Track consecutive months of negativity

---

## Common mistakes to avoid

1. **Don't show all slides with equal weight.** The P&L slide (2) and Route economics slides (9-11) are the most important. If time is limited, cut salesperson productivity before cutting route analysis.
2. **Don't present negative routes without an action recommendation.** "CM/MT is negative on ASUL-Delhi" is incomplete. Add: "Recommend: reprice or reroute to SKA (INR 2,113/MT on same route)."
3. **Don't ignore the advance ageing slide.** It's a governance checkpoint. Any >90D advance must have a resolution plan stated on the slide.
4. **Don't present the outlook without stating the gap to plan.** "We estimate 23,500 MT" is incomplete. "23,500 MT vs sales team BE of 36,700 MT (36% gap) — BizFin recommends adjusting the monthly target" is the BizFin value-add.
5. **Don't forget to separate direct employee costs.** The deck uses "Employee Benefits Expenses (Direct)" mapped to L14 — these are field sales team costs, not HQ finance or tech. Ensure the data source maps correctly.
6. **Don't conflate PMT (per metric ton) values with INR Cr values.** PMT column must be clearly labeled. All PMT values are in INR (not INR Cr or INR Lac).
