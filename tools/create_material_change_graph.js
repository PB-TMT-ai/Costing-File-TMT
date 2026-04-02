#!/usr/bin/env node
/**
 * Generate a JSW One branded PowerPoint with absolute-value charts,
 * delta colour-box annotations, and dual-axis combo charts.
 *
 * Data is filtered to one point per month (last date of each month).
 *
 * Usage:
 *   node tools/create_material_change_graph.js [--input <path>] [--output <path>]
 *
 * Dependencies: pptxgenjs, xlsx
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const PptxGenJS = require('pptxgenjs');

// ═══════════════════════════════════════════════════════════════
// JSW ONE BRAND CONSTANTS
// ═══════════════════════════════════════════════════════════════
const BLUE   = '213366';
const RED    = 'EA2127';
const GREY   = '7F7F7F';
const LTGREY = 'F2F2F2';
const BORDER = 'CCCCCC';
const WHITE  = 'FFFFFF';
const BLACK  = '000000';
const FONT   = 'Calibri';

const COLORS = {
  PALLET_DRI:  '1565C0',
  PIG_IRON:    'D32F2F',
  IRON_ORE:    '616161',
  SILICO_MN:   'FF8F00',
  RAIPUR:      BLUE,
  NCR:         GREY,
};

const GRID = {
  L: 0.50, R: 12.83, W: 12.33,
  TOP: 0.95, BOTTOM: 6.80, H: 5.85,
  FOOTER_Y: 7.05
};

// Chart area for positioning delta boxes (approximate pptxgenjs plot area)
const CHART = { x: GRID.L, y: GRID.TOP, w: GRID.W, h: 4.60 };
const PLOT_LEFT_PAD = 0.06;   // fraction of chart width for left axis space
const PLOT_RIGHT_PAD = 0.02;

// ═══════════════════════════════════════════════════════════════
// GRAPH SPECIFICATIONS (4 chart slides)
// ═══════════════════════════════════════════════════════════════
const CHART_SLIDES = [
  {
    type: 'dualMarketBar',
    title: 'Scrap (Raipur & NCR)',
    item: 'Scrap',
    row: 5,
    unit: 'INR/MT',
  },
  {
    type: 'comboChart',
    title: 'Raw Materials — Raipur',
    series: [
      { name: 'Pallet DRI',       row: 3, axis: 'primary',   color: COLORS.PALLET_DRI, chartType: 'bar' },
      { name: 'Pig Iron',         row: 4, axis: 'primary',   color: COLORS.PIG_IRON,   chartType: 'bar' },
      { name: 'Iron Ore DRI',     row: 7, axis: 'primary',   color: COLORS.IRON_ORE,   chartType: 'bar' },
      { name: 'Silico Manganese', row: 6, axis: 'secondary', color: COLORS.SILICO_MN,  chartType: 'line' },
    ],
    primaryUnit: 'INR/MT',
    secondaryUnit: 'INR/kg',
  },
  {
    type: 'dualMarketBar',
    title: 'Nett Margin Billet (Raipur & NCR)',
    item: 'Nett Margin Billet',
    row: 10,
    unit: 'INR/MT',
  },
  {
    type: 'dualMarketBar',
    title: 'Margin TMT (Raipur & NCR)',
    item: 'Margin TMT',
    row: 12,
    unit: 'INR/MT',
  },
];

const ROWS_TO_LOAD = [
  { key: 'Scrap',              row: 5 },
  { key: 'Pallet DRI',        row: 3 },
  { key: 'Pig Iron',          row: 4 },
  { key: 'Iron Ore DRI',      row: 7 },
  { key: 'Silico Manganese',  row: 6 },
  { key: 'Nett Margin Billet', row: 10 },
  { key: 'Margin TMT',        row: 12 },
];

// ═══════════════════════════════════════════════════════════════
// LOGO LOADING
// ═══════════════════════════════════════════════════════════════
let LOGO_B64 = null;
const logoPaths = [
  path.join(__dirname, '..', '.claude', 'skills', 'jsw-one-pptx', 'assets', 'JSW_Logo_Clean.png'),
  path.join(__dirname, '..', '.claude', 'skills', 'jsw-one-pptx', 'assets', 'JSW_Logo_Final.png'),
];
for (const lp of logoPaths) {
  if (fs.existsSync(lp)) {
    LOGO_B64 = 'image/png;base64,' + fs.readFileSync(lp).toString('base64');
    break;
  }
}

// ═══════════════════════════════════════════════════════════════
// DATA LOADING & MONTHLY FILTERING
// ═══════════════════════════════════════════════════════════════
function loadChangeLog(inputPath) {
  const wb = XLSX.readFile(inputPath);
  const ws = wb.Sheets['Change Log'];
  if (!ws) throw new Error('Sheet "Change Log" not found');

  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxCol = range.e.c;

  const allDates = [];
  const dateCols = [];
  for (let c = 1; c <= maxCol; c += 2) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (cell && cell.v != null) {
      allDates.push(String(cell.v));
      dateCols.push(c);
    }
  }

  // Parse all row data
  const allData = {};
  const seenRows = {};
  for (const spec of ROWS_TO_LOAD) {
    const row = spec.row - 1;
    if (seenRows[row]) {
      allData[spec.key] = seenRows[row];
      continue;
    }
    const raipur = [];
    const ncr = [];
    for (const c of dateCols) {
      const rCell = ws[XLSX.utils.encode_cell({ r: row, c })];
      const nCell = ws[XLSX.utils.encode_cell({ r: row, c: c + 1 })];
      raipur.push(parseValue(rCell));
      ncr.push(parseValue(nCell));
    }
    const rowData = { Raipur: raipur, NCR: ncr };
    seenRows[row] = rowData;
    allData[spec.key] = rowData;
  }

  // Filter to last date per month
  const monthlyIndices = filterLastPerMonth(allDates);
  const dates = monthlyIndices.map(i => allDates[i]);
  const data = {};
  for (const key of Object.keys(allData)) {
    data[key] = {
      Raipur: monthlyIndices.map(i => allData[key].Raipur[i]),
      NCR:    monthlyIndices.map(i => allData[key].NCR[i]),
    };
  }

  return { dates, data };
}

function filterLastPerMonth(dates) {
  // Group indices by YYYY-MM, keep only the last index per month
  const monthMap = new Map();
  for (let i = 0; i < dates.length; i++) {
    const ym = dates[i].slice(0, 7); // "YYYY-MM"
    monthMap.set(ym, i); // overwrites — keeps last
  }
  return Array.from(monthMap.values()).sort((a, b) => a - b);
}

function parseValue(cell) {
  if (!cell || cell.v == null) return null;
  const v = String(cell.v).trim();
  if (v === '-' || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

// ═══════════════════════════════════════════════════════════════
// DATA HELPERS
// ═══════════════════════════════════════════════════════════════
function computeAbsolute(values, dates) {
  const absValues = [];
  const deltas = [];
  const labels = [];
  for (let i = 0; i < values.length; i++) {
    absValues.push(values[i] != null ? values[i] : 0);
    labels.push(formatMonthLabel(dates[i]));
    if (i === 0) {
      deltas.push(null);
    } else if (values[i] != null && values[i - 1] != null) {
      deltas.push(values[i] - values[i - 1]);
    } else {
      deltas.push(null);
    }
  }
  const validAbs = absValues.filter(v => v !== 0);
  const avg = validAbs.length > 0 ? validAbs.reduce((a, b) => a + b, 0) / validAbs.length : 0;
  return { values: absValues, deltas, labels, avg };
}

function formatMonthLabel(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yr = String(d.getFullYear()).slice(-2);
    return `${months[d.getMonth()]}'${yr}`;
  } catch {
    return dateStr.slice(0, 7);
  }
}

function formatNumber(val, item) {
  if (item && item.includes('Silico Manganese')) return val.toFixed(1);
  if (Math.abs(val) >= 1) return Math.round(val).toLocaleString('en-IN');
  return val.toFixed(2);
}

function formatDelta(val, item) {
  if (val == null) return '';
  const prefix = val >= 0 ? '+' : '';
  return prefix + formatNumber(val, item);
}

// ═══════════════════════════════════════════════════════════════
// JSW ONE SLIDE HELPERS
// ═══════════════════════════════════════════════════════════════
function addDivider(slide, y) {
  slide.addShape('rect', {
    x: 0, y: y, w: 8.80, h: 0.05,
    fill: { color: BLUE }, line: { width: 0, color: WHITE }
  });
  slide.addShape('rect', {
    x: 8.40, y: y, w: 4.93, h: 0.05,
    fill: { color: RED }, line: { width: 0, color: WHITE }
  });
}

function addPageNumber(slide, pageNum) {
  slide.addText(String(pageNum), {
    x: 0.30, y: GRID.FOOTER_Y, w: 0.50, h: 0.35,
    fontSize: 10, fontFace: FONT, color: GREY,
    align: 'left', valign: 'middle', margin: 0
  });
}

function addLogo(slide, type) {
  if (!LOGO_B64) return;
  if (type === 'title') {
    slide.addImage({ data: LOGO_B64, x: 10.30, y: 2.10, w: 2.40, h: 0.79 });
  } else {
    slide.addImage({ data: LOGO_B64, x: 10.80, y: 0.02, w: 2.10, h: 0.69 });
  }
}

function addFooter(slide, pageNum, sourceText) {
  addPageNumber(slide, pageNum);
  if (sourceText) {
    slide.addText(sourceText, {
      x: 6.50, y: GRID.FOOTER_Y, w: 6.30, h: 0.35,
      fontSize: 10, fontFace: FONT, color: GREY,
      italic: true, align: 'right', valign: 'middle', margin: 0
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// DELTA BOX HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Add coloured delta text boxes above/below bars.
 * For dual-market bars: each category has 2 bars (Raipur left, NCR right).
 * seriesDeltas: array of { deltas: [...], color: '...' }
 */
function addDeltaBoxes(slide, seriesDeltas, numCategories, chartY, chartH, valMin, valMax, seriesValues) {
  const numSeries = seriesDeltas.length;
  const plotLeft = CHART.x + CHART.w * PLOT_LEFT_PAD;
  const plotWidth = CHART.w * (1 - PLOT_LEFT_PAD - PLOT_RIGHT_PAD);
  const catWidth = plotWidth / numCategories;
  const barGroupWidth = catWidth * 0.7;
  const barWidth = barGroupWidth / numSeries;
  const boxH = 0.22;
  const boxW = barWidth * 1.1;

  for (let s = 0; s < numSeries; s++) {
    const { deltas, color } = seriesDeltas[s];
    const values = seriesValues[s];
    for (let i = 0; i < numCategories; i++) {
      if (deltas[i] == null) continue;
      const deltaStr = formatDelta(deltas[i], '');
      // Bar center X position
      const catCenter = plotLeft + (i + 0.5) * catWidth;
      const barCenterX = catCenter - barGroupWidth / 2 + (s + 0.5) * barWidth;
      const boxX = barCenterX - boxW / 2;

      // Y position: above bar for positive, below for negative
      const barVal = values[i] || 0;
      const valRange = valMax - valMin || 1;
      const barTopFrac = 1 - (barVal - valMin) / valRange;
      const barTopY = chartY + barTopFrac * chartH;

      let boxY;
      if (deltas[i] >= 0) {
        boxY = barTopY - boxH - 0.02;
      } else {
        boxY = barTopY + 0.02;
      }
      // Clamp within slide
      boxY = Math.max(CHART.y - 0.1, Math.min(boxY, CHART.y + CHART.h + 0.1));

      slide.addShape('roundRect', {
        x: boxX, y: boxY, w: boxW, h: boxH,
        fill: { color: color }, rectRadius: 0.03,
        line: { width: 0 }
      });
      slide.addText(deltaStr, {
        x: boxX, y: boxY, w: boxW, h: boxH,
        fontSize: 7, fontFace: FONT, color: WHITE,
        bold: true, align: 'center', valign: 'middle', margin: 0
      });
    }
  }
}

/**
 * Compute chart axis min/max from multiple value arrays.
 */
function computeAxisRange(allValues) {
  let min = Infinity, max = -Infinity;
  for (const vals of allValues) {
    for (const v of vals) {
      if (v != null && v !== 0) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
  }
  // Add 10% padding
  const range = max - min || 1;
  return { min: min - range * 0.1, max: max + range * 0.15 };
}

// ═══════════════════════════════════════════════════════════════
// ANNOTATION HELPERS
// ═══════════════════════════════════════════════════════════════
function addAnnotationBox(slide, text, yPos, color) {
  slide.addShape('rect', {
    x: GRID.L, y: yPos, w: GRID.W, h: 0.30,
    fill: { color: LTGREY }, line: { color: BORDER, width: 0.5 }
  });
  slide.addText(text, {
    x: GRID.L + 0.15, y: yPos, w: GRID.W - 0.30, h: 0.30,
    fontSize: 11, fontFace: FONT, color: color || BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════════
function addTitleSlide(pres, dates, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText('Material cost & margin analysis', {
    x: 0.60, y: 1.90, w: 9.40, h: 1.00,
    fontSize: 28, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 2.95);
  addLogo(slide, 'title');

  slide.addText('Monthly raw material prices and margin trends with period-on-period changes', {
    x: 0.64, y: 3.12, w: 9.40, h: 0.45,
    fontSize: 12, fontFace: FONT, color: GREY,
    align: 'left', valign: 'top', margin: 0
  });

  slide.addText(`Period: ${dates[0]} to ${dates[dates.length - 1]}  |  ${dates.length} months`, {
    x: 0.64, y: 3.52, w: 9.40, h: 0.35,
    fontSize: 12, fontFace: FONT, color: GREY,
    align: 'left', valign: 'top', margin: 0
  });

  addPageNumber(slide, pageNum);
  return slide;
}

// --- Dual market bar chart (absolute values + delta boxes) ---
function addDualMarketBarSlide(pres, spec, dates, data, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText(`${spec.title} — ${spec.unit}`, {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  addLogo(slide, 'content');

  const rValues = data[spec.item]['Raipur'];
  const nValues = data[spec.item]['NCR'];
  const rResult = computeAbsolute(rValues, dates);
  const nResult = computeAbsolute(nValues, dates);

  const chartData = [
    { name: 'Raipur', labels: rResult.labels, values: rResult.values },
    { name: 'NCR',    labels: nResult.labels, values: nResult.values }
  ];

  const axisRange = computeAxisRange([rResult.values, nResult.values]);

  slide.addChart(pres.charts.BAR, chartData, {
    x: CHART.x, y: CHART.y, w: CHART.w, h: CHART.h,
    barDir: 'col',
    chartColors: [COLORS.RAIPUR, COLORS.NCR],
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 10,
    catAxisLabelFontFace: FONT,
    catGridLine: { style: 'none' },
    valAxisHidden: false,
    valAxisLabelColor: GREY,
    valAxisLabelFontSize: 9,
    valAxisLabelFontFace: FONT,
    valGridLine: { style: 'dash', color: 'E0E0E0', size: 0.5 },
    showValue: false,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 10,
    legendFontFace: FONT,
    legendColor: GREY,
    showTitle: false
  });

  // Delta colour boxes
  addDeltaBoxes(slide,
    [
      { deltas: rResult.deltas, color: COLORS.RAIPUR },
      { deltas: nResult.deltas, color: COLORS.NCR },
    ],
    rResult.labels.length, CHART.y, CHART.h,
    axisRange.min, axisRange.max,
    [rResult.values, nResult.values]
  );

  // Average annotation
  addAnnotationBox(slide,
    `Period avg:  Raipur ${formatNumber(rResult.avg, spec.item)}  |  NCR ${formatNumber(nResult.avg, spec.item)} ${spec.unit}`,
    5.65, BLUE);

  addFooter(slide, pageNum, 'Source: Costing change log');
  return slide;
}

// --- Combo chart: bars (primary axis) + line (secondary axis) ---
function addComboChartSlide(pres, spec, dates, data, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText(`${spec.title} — ${spec.primaryUnit} / ${spec.secondaryUnit}`, {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  addLogo(slide, 'content');

  const labels = dates.map(d => formatMonthLabel(d));

  // Separate bar series (primary axis) and line series (secondary axis)
  const barData = [];
  const barColors = [];
  const lineData = [];
  const lineColors = [];
  const deltaInfoParts = [];

  for (const s of spec.series) {
    const values = data[s.name]['Raipur'];
    const result = computeAbsolute(values, dates);
    const seriesObj = { name: s.name, labels: labels, values: result.values };

    if (s.chartType === 'line') {
      lineData.push(seriesObj);
      lineColors.push(s.color);
    } else {
      barData.push(seriesObj);
      barColors.push(s.color);
    }

    const latestDelta = result.deltas[result.deltas.length - 1];
    const deltaStr = latestDelta != null ? formatDelta(latestDelta, s.name) : 'N/A';
    const unit = s.axis === 'secondary' ? spec.secondaryUnit : spec.primaryUnit;
    deltaInfoParts.push(`${s.name}: ${deltaStr} ${unit}`);
  }

  // pptxgenjs combo chart: array of chart type objects
  const chartTypes = [];

  if (barData.length > 0) {
    chartTypes.push({
      type: pres.charts.BAR,
      data: barData,
      options: {
        barDir: 'col',
        chartColors: barColors,
      }
    });
  }

  if (lineData.length > 0) {
    chartTypes.push({
      type: pres.charts.LINE,
      data: lineData,
      options: {
        secondaryValAxis: true,
        secondaryCatAxis: false,
        chartColors: lineColors,
        lineSize: 2.5,
        lineSmooth: false,
        showMarker: true,
        markerSize: 6,
      }
    });
  }

  slide.addChart(chartTypes, {
    x: CHART.x, y: CHART.y, w: CHART.w, h: CHART.h,
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 10,
    catAxisLabelFontFace: FONT,
    catGridLine: { style: 'none' },
    valAxisHidden: false,
    valAxisLabelColor: GREY,
    valAxisLabelFontSize: 9,
    valAxisLabelFontFace: FONT,
    valAxisTitle: spec.primaryUnit,
    valAxisTitleColor: GREY,
    valAxisTitleFontSize: 9,
    valGridLine: { style: 'dash', color: 'E0E0E0', size: 0.5 },
    secondaryValAxis: true,
    secondaryValAxisTitle: spec.secondaryUnit,
    secondaryValAxisTitleColor: COLORS.SILICO_MN,
    secondaryValAxisTitleFontSize: 9,
    showValue: false,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 10,
    legendFontFace: FONT,
    legendColor: GREY,
    showTitle: false,
  });

  // Delta annotation box
  addAnnotationBox(slide, `Latest change:  ${deltaInfoParts.join('  |  ')}`, 5.65, BLUE);

  addFooter(slide, pageNum, 'Source: Costing change log');
  return slide;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
function main() {
  const args = process.argv.slice(2);
  let inputPath = 'output/change_log.xlsx';
  let outputPath = 'output/material_change_graphs.pptx';

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--input' || args[i] === '-i') && args[i + 1]) inputPath = args[++i];
    if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) outputPath = args[++i];
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`ERROR: Input file not found: ${inputPath}`);
    process.exit(2);
  }

  console.error(`Loading change log: ${inputPath}`);
  const { dates, data } = loadChangeLog(inputPath);
  console.error(`Filtered to ${dates.length} monthly data points: ${dates[0]} to ${dates[dates.length - 1]}`);

  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';

  let pageNum = 1;
  addTitleSlide(pres, dates, pageNum++);

  for (const spec of CHART_SLIDES) {
    console.error(`  Generating chart: ${spec.title || spec.item}...`);
    if (spec.type === 'comboChart') {
      addComboChartSlide(pres, spec, dates, data, pageNum++);
    } else {
      addDualMarketBarSlide(pres, spec, dates, data, pageNum++);
    }
  }

  const outDir = path.dirname(outputPath);
  if (outDir && !fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  pres.writeFile({ fileName: outputPath }).then(() => {
    console.error(`Presentation saved: ${outputPath}`);
    console.error(`Done! ${CHART_SLIDES.length} charts generated.`);
    process.exit(0);
  }).catch(err => {
    console.error(`ERROR writing PPTX: ${err.message}`);
    process.exit(1);
  });
}

main();
