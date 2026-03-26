# Analytical Engine — Data Pre-Processing & Chart Intelligence

**Read this file BEFORE building any deck that involves data analysis, financial data, volume data, or performance metrics. This file governs how Claude processes raw data into slide-ready insights. It runs before any slide layout decisions.**

---

## 1. The Pre-Processing Mandate

**Rule: Never go from raw data directly to slides.** Every data-driven deck must follow this sequence:

```
RAW DATA → COMPUTE → RANK → FRAME → BUILD SLIDES
```

| Step | What Claude does | Output |
|------|-----------------|--------|
| **COMPUTE** | Calculate all derived metrics (growth %, variance, ratios, per-unit economics) | Enriched dataset |
| **RANK** | Sort entities by magnitude of variance, growth, or risk — identify the 2-3 that matter most | Priority list |
| **FRAME** | For each priority item, write the "so-what" in one sentence | Insight sentences |
| **BUILD** | Only now decide slide layout, chart type, and content hierarchy | Slides |

**If you skip COMPUTE and RANK, the deck will be a data dump, not an analysis.**

---

## 2. Standard Computations — Run These on Any Dataset

### 2.1 Variance analysis (ALWAYS compute when actuals vs targets exist)

For every line item where both actual and target/AOP/budget exist:

```
Absolute variance = Actual - Target
Variance % = (Actual - Target) / Target × 100
Contribution to total variance = BU variance / Total variance × 100
```

**Then rank BUs by absolute contribution to total variance.** The BU with the largest absolute gap is the story, not the one with the worst percentage. A 5% miss on a 200 KMT target (10 KMT gap) matters more than a 30% miss on a 5 KMT target (1.5 KMT gap).

**Materiality threshold:** Flag any line item with variance > ±10% of target OR absolute variance > INR 5 Cr (for financial items) or > 10 KMT (for volume items). Everything below this is noise for the main slides — push it to annexure.

### 2.2 Growth rate decomposition (ALWAYS compute for multi-period data)

```
YoY growth % = (Current period - Same period last year) / Same period last year × 100
QoQ growth % = (Current quarter - Previous quarter) / Previous quarter × 100
MoM growth % = (Current month - Previous month) / Previous month × 100
CAGR = (End value / Start value)^(1/n) - 1
```

**Signal vs noise rule:** If MoM growth is volatile but YoY growth is consistent, the story is the trend, not the noise. Use MoM only for operational reviews. Use YoY for board and investor decks.

**Growth deceleration flag:** If YoY growth in the current period is lower than the prior period's YoY growth by >10 percentage points, flag it. Example: FY25 revenue grew 184%, FY26 grew 48% — flag as "Growth decelerating from 184% to 48%, consistent with base effect but monitor."

### 2.3 Per-unit economics (ALWAYS compute for any P&L data)

```
GM/MT = Gross margin (INR Cr) / Volume (KMT) × 1000
CM1/MT = Contribution margin 1 / Volume × 1000
EBITDA/MT = Operating EBITDA / Volume × 1000
Revenue/MT = Total revenue / Volume × 1000
```

**Why this matters for JSW One:** The business has structurally thin margins (3-4% gross margin). Showing INR 666 Cr gross margin on INR 22,323 Cr NMV looks thin. Showing INR 2,180/MT gross margin improving from INR 1,430/MT tells a different story — margin expansion per ton. Always compute both, but lead with per-unit in management decks.

### 2.4 Mix analysis (COMPUTE when multiple BUs/segments contribute to a total)

```
Revenue mix % = BU revenue / Total revenue × 100
Volume mix % = BU volume / Total volume × 100
Margin mix = BU gross margin % vs blended gross margin %
```

**Separate mix effect from rate effect:**

```
Mix effect = Σ (Actual mix% - Prior mix%) × Prior period margin%
Rate effect = Σ Actual mix% × (Current margin% - Prior margin%)
```

If JODL's share of revenue increased and JODL has higher margins, the blended margin improvement is partly a mix effect, not an operational improvement.

### 2.5 Working capital metrics (COMPUTE when balance sheet data exists)

```
Receivable days = (Trade receivables / Revenue) × 365
Payable days = (Trade payables / COGS) × 365
Inventory days = (Inventory / COGS) × 365
NWC days = Receivable days + Inventory days - Payable days
Capital efficiency ratio = Revenue / Total equity
ROCE = EBIT / Capital employed × 100
```

**JSW One benchmark:** NWC should be 12-18 days. If it trends above 20, flag it. Receivable days should be below 20. Peer anchors: OfBusiness ~50 NWC days, Infra.Market ~71 days, Zetwerk ~28 days, Moglix ~33 days.

**NWC cash impact — always translate days to INR:** `INR impact = (Change in NWC days / 365) × Annual revenue`. Example: 5-day NWC increase on INR 25,000 Cr revenue = ~INR 340 Cr additional capital locked.

### 2.6 Cohort and retention (COMPUTE when dealer/customer transaction data exists)

```
D30 repeat rate = % of customers who transacted in month M who also transacted in M+1
D60 repeat rate = % who transacted in M who also transacted within M+1 or M+2
D90 repeat rate = same logic for 3-month window
Churn rate = % of active customers in period P who did NOT transact in P+1
Activation rate = New transacting customers / Total onboarded customers
```

**Critical distinction:** Repeat rate, retention, and churn are three separate metrics. Never conflate them. Repeat = re-purchase within a window. Retention = cohort survival over N periods. Churn = inverse of retention at a defined interval.

### 2.7 EBITDA sensitivity (COMPUTE for any AOP, forecast, or budget deck)

For each major BU, compute the impact of a 10% volume miss on consolidated EBITDA:

```
EBITDA impact of 10% BU miss = BU volume × 10% × BU CM1/MT ÷ 1000
```

Express as a percentage of total planned EBITDA. This tells the Board: "If PB misses by 10%, it wipes out X% of the total EBITDA plan."

**Sensitivity table (mandatory annexure for AOP and Board decks):**

| BU | Volume (KMT) | CM1/MT (INR) | EBITDA impact of 10% miss (INR Cr) | % of total EBITDA |
|----|---|---|---|---|

### 2.8 Operating leverage (COMPUTE for multi-period P&L)

```
Opex/Revenue ratio = Total operating costs / Revenue × 100
Employee cost/Revenue = Employee cost / Revenue × 100
Fulfilment cost/NMV = Fulfilment cost / NMV × 100
Marketing cost/Revenue = (Marketing + Branding) / Revenue × 100
```

Track each ratio across periods. Revenue growing faster than opex = operating leverage materializing. Opex growing faster = scaling costs ahead of revenue — flag it.

**JSW One context:** The EBITDA turnaround depends on operating leverage. If fulfilment cost/NMV rises (e.g., 1.0% to 1.5%), it directly drags on EBITDA. Always compute and flag.

### 2.9 Seasonality and hockey-stick detection

```
Q4 share = Q4 value / Full-year value × 100
H2/H1 ratio = H2 value / H1 value
Intra-year ramp = Last month value / First month value
```

**Flag as hockey-stick if:** Q4 share >35% of annual total, OR H2/H1 >1.8x, OR intra-year ramp >2.5x.

**Why this matters:** JSW One has structural Q4 loading across PB, Construction, and JODL. If Q4 carries >35% of the plan, the real risk is a Q4 miss. The deck should state: "X% of annual target loaded in Q4; a Y% Q4 miss translates to Z% annual miss."

### 2.10 Route economics (COMPUTE for PB BizFin review or any plant/state analysis)

```
Route CM/MT = (Sales realization - Purchase cost - Freight) per MT for a specific Plant × State combination
Total route loss = Σ (negative CM/MT × volume) for all negative-margin routes
Route profitability rank = Sort all plant-state pairs by CM/MT descending
```

Route analysis reveals freight arbitrage, pricing leakage, and plant-state assignment errors. A route with negative CM/MT is either underpriced, over-freighted, or served from the wrong plant. Always quantify the total INR lost on negative routes.

**Grade-level split:** Within each route, separate Fe550 from Fe550D margins. Some routes are profitable on Fe550 but loss-making on Fe550D (or vice versa) due to pricing or availability.

**Channel-level split:** Compute route CM/MT separately for Retail and Projects. Retail CM/MT should be ~INR 700-1,000 higher than Projects on the same route.

### 2.11 DSI — Days of Stock Inventory by plant (COMPUTE for PB BizFin review)

```
DSI days (plant) = (Closing stock MT at plant ÷ Average daily dispatch from plant)
Weighted avg DSI = Σ (Plant DSI × Plant stock MT) ÷ Total stock MT
WC locked in inventory = Closing stock MT × Avg purchase price/MT
WC release from DSI reduction = (DSI old - DSI new) × Avg daily dispatch × Avg purchase price/MT
```

**Target:** Weighted avg DSI <20 days. Any plant >25 days = working capital drag.
**Flag:** Stock increase >50% MoM at any plant despite reasonable DSI (indicates month-end PO timing).

### 2.12 Advance ageing (COMPUTE for PB BizFin review)

```
Advance ageing % >30D = Advances >30 days ÷ Total advances × 100
Interest cost on advances = Total advance outstanding × Interest rate (9% p.a.) ÷ 12
```

Track by CM plant. Any advance >90 days is a governance escalation. Compute the interest cost drag on CM1 — this is a hidden margin leak.

---

## 3. Ranking Framework — Identify What Matters

### 3.1 Variance ranking (for performance review decks)

Sort all BUs by absolute contribution to total variance. The top 2-3 items that explain >70% of the total variance are the slide-worthy topics. Everything else is a passing mention.

### 3.2 Growth contribution ranking (for strategic / board decks)

```
Incremental contribution = BU current period value - BU prior period value
Share of growth = BU incremental / Total incremental × 100
```

Reveals which BUs are driving growth vs riding the tide. A BU growing 100% off a tiny base contributes less than a BU growing 30% off a large base.

### 3.3 Risk ranking (for AOP / planning decks)

```
Stretch factor = Target / Prior year actual (use ACTUAL, not prior AOP)
Historical achievement rate = Quarters hitting ≥90% of target in last 4 quarters
```

| Stretch factor | Historical hit rate | Risk level |
|---------------|-------------------|------------|
| <1.3x | >75% quarters | Low |
| 1.3-2.0x | 50-75% quarters | Medium |
| >2.0x | <50% quarters | High |
| >3.0x | Any | Critical — quantify downside explicitly |

### 3.4 Inflection point detection

Scan for sign changes and non-linear shifts:
- EBITDA turning positive after losses (breakeven inflection)
- Growth rate accelerating after deceleration (re-acceleration)
- NWC days spiking after a steady trend (working capital stress)
- Margin per MT declining for 3+ consecutive months (structural pressure)
- A BU crossing a materiality threshold (e.g., PB crossing 10% of platform volume)

**If an inflection point exists, it becomes the headline.** "December 2025 marks EBITDA breakeven" beats "FY26 financial summary" as a title.

**Surface positive inflections too.** If a BU beat target for 4+ consecutive quarters, or a metric hit an all-time high, lead with it.

---

## 4. Chart Decision Engine

### 4.1 Decision tree

```
What is the data showing?
│
├── TREND (same metric, 3+ periods)
│   ├── 1 series → VERTICAL BAR
│   ├── 2-3 series → GROUPED BAR or LINE
│   │   └── Very different scales → dual-axis
│   └── >3 series → LINE CHART
│
├── COMPARISON (same period, multiple entities)
│   ├── 3-6 entities, 1 metric → HORIZONTAL BAR (sorted)
│   ├── 3-6 entities, 2-3 metrics → GROUPED VERTICAL BAR
│   └── 2 entities → KPI cards (chart is overkill)
│
├── COMPOSITION (parts of a whole)
│   ├── 2-5 categories → DOUGHNUT
│   ├── Composition over time → STACKED BAR
│   └── 1 category >70% → text only
│
├── BRIDGE (change from A to B)
│   ├── P&L or EBITDA walk → WATERFALL
│   ├── Volume bridge → WATERFALL or STACKED BAR
│   └── <3 components → text callout (waterfall overkill)
│
├── DISTRIBUTION → HISTOGRAM or sorted bar
│
└── RELATIONSHIP → SCATTER (rare in JSW One decks)
```

### 4.2 Anti-patterns — when NOT to chart

| Situation | Use instead |
|-----------|-------------|
| Single data point | KPI card |
| 2 data points | KPI card with sublabel |
| Exact numbers are the point (P&L, 15+ rows) | Table with variance column |
| >8 categories in pie/doughnut | Table or top-5 bar + "Others" |
| No pattern in the data | Bullets acknowledging mixed signals |
| Monthly P&L trend (17-col) | Table — the 17-col format is standard |

### 4.3 JSW One chart quick-pick

| Context | Chart | Why |
|---------|-------|-----|
| GMV/Volume trend FY24-FY28 | Vertical bar + CAGR | Single series, 4-5 periods |
| BU volume vs AOP | Grouped bar (blue=actual, grey=AOP) | 4-6 BUs, 2 series |
| EBITDA bridge | Waterfall | 6-10 components |
| Revenue/volume mix | Doughnut or stacked bar | 4-6 categories |
| Working capital trend | Combo (bar + line) | 5+ quarters, dual metric |
| Competitor comparison | Horizontal bar sorted | 5-6 entities |
| PB state-wise volume | India map (generate_india_map.py) | Geographic |
| Homes studio pipeline | India map (homes_studios preset) | Geographic |
| D30/D60/D90 trend | Grouped bar by quarter | 4Q, 3 series |
| Opex ratio trend | Line chart (3+ ratios) | Operating leverage story |
| Q4 concentration | Stacked bar (Q1-Q4, Q4 labeled) | Hockey-stick viz |
| EBITDA sensitivity | Horizontal bar sorted by impact | 5-6 BUs |

### 4.4 Annotation rules

Every chart needs at least one annotation:
- **Bar:** Label the critical bar ("35% YoY" or "Missed by 120 KMT")
- **Waterfall:** Label largest positive and largest negative
- **Line:** Mark the inflection point
- **Doughnut:** Call out dominant segment + shift vs prior
- **Horizontal bar (competitor):** Highlight JSW One bar
- **Stacked bar (quarterly):** Annotate Q4 if >35% of annual

**No naked charts.** A chart without annotation is a missed opportunity.

---

## 5. Framing — Writing the Insight Before Building the Slide

### 5.1 The "So-What" test

| Raw data | Bad (descriptive) | Good (insight) |
|----------|------------------|----------------|
| Volume: 1,800 → 3,046 KMT | "Volume grew to 3,046 KMT" | "Volume grew 69%, but 80% from MFG; PB underdelivered by 30%" |
| GM: 3.0% | "GM was 3.0%" | "GM expanded 60 bps to 3.0% — on track for 3.5% target, driven by JODL mix" |
| NWC: 18 days | "NWC was 18 days" | "NWC stable at 18 days, 3-4x better than closest peer — capital efficiency intact" |
| EBITDA positive | "EBITDA was INR 5 Cr" | "First positive month in platform history — validates operating leverage thesis" |

### 5.2 Insight layering

| Layer | Structure | Audience |
|-------|-----------|----------|
| **L1: Headline** | "[Metric] [direction] [magnitude]" | Board, exec summary |
| **L2: Driver** | "Driven by [cause], offset by [counter]" | CEO review, section slides |
| **L3: Implication** | "This means [consequence] and requires [action]" | Ops review, action slides |

**Board: L1+L2. CEO: L2+L3. Weekly ops: L3 only.**

### 5.3 Comparison anchoring — every number needs context

| Anchor | When | Format |
|--------|------|--------|
| vs Target/AOP | Performance tracking | "3,046 KMT (97% of AOP)" |
| vs Prior period | Trend direction | "+69% YoY" |
| vs Peer | Competitive positioning | "NWC 12 days vs peer avg 54 days" |
| vs Milestone | Narrative emphasis | "First EBITDA-positive month" |
| vs Unit economics | Margin health | "INR 2,180/MT GM, up from INR 1,430/MT" |
| vs Sensitivity | Risk quantification | "10% miss wipes out INR 15 Cr (28% of plan)" |

**If a number has no comparator, it should not be on the slide.**

---

## 6. Data Integrity Checks

### 6.1 Cross-verification (run before building)

```
✓ GMV ≥ NMV ≥ Revenue?
✓ BU volumes sum to platform total? (within ±1%)
✓ GM% = GM INR / NMV?
✓ Growth rates use correct base period?
✓ JOPL + JODL + JOFL reconcile to consolidated?
✓ AOP is the board-approved version?
```

### 6.2 Reasonableness checks

| Metric | JSW One range | If outside |
|--------|--------------|------------|
| Gross margin % | 2.0-5.0% | Verify entity scope, JODL vs JOPL mix |
| NWC days | 10-25 | Receivable/inventory spike? Quarter-end? |
| Volume growth (annual) | 30-80% | New BU? Inorganic? |
| Revenue/MT | INR 35K-55K | Product mix shift? Price? |
| GM/MT | INR 800-3,000 | BU mix? JODL vs marketplace? |
| Employee cost/Rev | 0.8-1.5% | Headcount outpacing revenue? |
| Fulfilment/NMV | 0.8-1.8% | Logistics scaling ahead of volume? |

### 6.3 Entity scope

Every financial slide must specify scope in footer: "JOPL + JODL (Consolidated excl. JOFL)" or "JOPL Standalone" or "JODL Only" or "Consolidated incl. JOFL". Never mix scopes on the same slide without labeling.

---

## 7. When to Override the Engine

1. **User provides explicit framing:** Lead with growth if asked, but still include misses
2. **Audience is known:** Don't over-simplify for ops or over-summarize for Board
3. **Data is noisy:** Say so. "Mixed signals" is more honest than forcing a narrative
4. **Comparison isn't fair:** New BU? Use MoM, not YoY
5. **Positive stories deserve airtime:** Don't only flag risks. If a BU beat target 4 consecutive quarters, surface it
