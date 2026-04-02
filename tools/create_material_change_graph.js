#!/usr/bin/env node
/**
 * Generate a JSW One branded PowerPoint with absolute-value charts
 * and delta annotations from the costing change log.
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

// Colors for combined raw materials chart
const COLORS = {
  PALLET_DRI:  '1565C0', // blue
  PIG_IRON:    'D32F2F', // red
  IRON_ORE:    '616161', // dark grey
  SILICO_MN:   'FF8F00', // orange
  RAIPUR:      BLUE,
  NCR:         GREY,
};

const GRID = {
  L: 0.50, R: 12.83, W: 12.33,
  TOP: 0.95, BOTTOM: 6.80, H: 5.85,
  FOOTER_Y: 7.05
};

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
    type: 'combinedLine',
    title: 'Raw Materials — Raipur',
    series: [
      { name: 'Pallet DRI',       row: 3, axis: 'primary',   color: COLORS.PALLET_DRI },
      { name: 'Pig Iron',         row: 4, axis: 'primary',   color: COLORS.PIG_IRON },
      { name: 'Iron Ore DRI',     row: 7, axis: 'primary',   color: COLORS.IRON_ORE },
      { name: 'Silico Manganese', row: 6, axis: 'secondary', color: COLORS.SILICO_MN },
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

// Rows to load from change log
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
// DATA LOADING
// ═══════════════════════════════════════════════════════════════
function loadChangeLog(inputPath) {
  const wb = XLSX.readFile(inputPath);
  const ws = wb.Sheets['Change Log'];
  if (!ws) throw new Error('Sheet "Change Log" not found');

  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxCol = range.e.c;

  const dates = [];
  const dateCols = [];
  for (let c = 1; c <= maxCol; c += 2) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (cell && cell.v != null) {
      dates.push(String(cell.v));
      dateCols.push(c);
    }
  }

  const data = {};
  const seenRows = {};
  for (const spec of ROWS_TO_LOAD) {
    const row = spec.row - 1;
    if (seenRows[row]) {
      data[spec.key] = seenRows[row];
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
    data[spec.key] = rowData;
  }

  return { dates, data };
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
    labels.push(formatDateLabel(dates[i]));
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

function formatDateLabel(dateStr) {
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

  slide.addText('Key raw material prices and margin trends with month-on-month changes', {
    x: 0.64, y: 3.12, w: 9.40, h: 0.45,
    fontSize: 12, fontFace: FONT, color: GREY,
    align: 'left', valign: 'top', margin: 0
  });

  slide.addText(`Period: ${dates[0]} to ${dates[dates.length - 1]}  |  ${dates.length} data points`, {
    x: 0.64, y: 3.52, w: 9.40, h: 0.35,
    fontSize: 12, fontFace: FONT, color: GREY,
    align: 'left', valign: 'top', margin: 0
  });

  addPageNumber(slide, pageNum);
  return slide;
}

// --- Dual market bar chart (absolute values) ---
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

  slide.addChart(pres.charts.BAR, chartData, {
    x: GRID.L, y: GRID.TOP, w: GRID.W, h: 4.60,
    barDir: 'col',
    chartColors: [COLORS.RAIPUR, COLORS.NCR],
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 9,
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

  // Delta + average annotation boxes
  const rLatestDelta = rResult.deltas[rResult.deltas.length - 1];
  const nLatestDelta = nResult.deltas[nResult.deltas.length - 1];
  const rDeltaStr = rLatestDelta != null ? formatDelta(rLatestDelta, spec.item) : 'N/A';
  const nDeltaStr = nLatestDelta != null ? formatDelta(nLatestDelta, spec.item) : 'N/A';

  addAnnotationBox(slide,
    `Latest change:  Raipur ${rDeltaStr}  |  NCR ${nDeltaStr}     •     ` +
    `Period avg:  Raipur ${formatNumber(rResult.avg, spec.item)}  |  NCR ${formatNumber(nResult.avg, spec.item)} ${spec.unit}`,
    5.65, BLUE);

  addFooter(slide, pageNum, 'Source: Costing change log');
  return slide;
}

// --- Combined line chart (multi-series, dual Y-axis) ---
function addCombinedLineSlide(pres, spec, dates, data, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText(`${spec.title} — ${spec.primaryUnit} / ${spec.secondaryUnit}`, {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  addLogo(slide, 'content');

  const labels = dates.map(d => formatDateLabel(d));
  const chartData = [];
  const chartColors = [];
  const deltaInfoParts = [];

  for (const s of spec.series) {
    const values = data[s.name]['Raipur'];
    const result = computeAbsolute(values, dates);
    chartData.push({
      name: s.name,
      labels: labels,
      values: result.values,
    });
    chartColors.push(s.color);

    const latestDelta = result.deltas[result.deltas.length - 1];
    const deltaStr = latestDelta != null ? formatDelta(latestDelta, s.name) : 'N/A';
    const unit = s.axis === 'secondary' ? spec.secondaryUnit : spec.primaryUnit;
    deltaInfoParts.push(`${s.name}: ${deltaStr} ${unit}`);
  }

  // Mark secondary axis series
  // pptxgenjs combo: use secondaryValAxis on the last series (Silico Mn)
  const secondaryIdx = spec.series.findIndex(s => s.axis === 'secondary');

  slide.addChart(pres.charts.LINE, chartData, {
    x: GRID.L, y: GRID.TOP, w: GRID.W, h: 4.60,
    chartColors: chartColors,
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 9,
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
    showValue: false,
    lineSize: 2,
    lineSmooth: false,
    showMarker: true,
    markerSize: 5,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 10,
    legendFontFace: FONT,
    legendColor: GREY,
    showTitle: false,
    // Secondary axis for Silico Manganese
    secondaryValAxis: secondaryIdx >= 0,
    secondaryValAxisTitle: secondaryIdx >= 0 ? spec.secondaryUnit : undefined,
    secondaryValAxisTitleColor: GREY,
    secondaryValAxisTitleFontSize: 9,
    secondaryCatAxis: false,
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
  console.error(`Found ${dates.length} dates: ${dates[0]} to ${dates[dates.length - 1]}`);

  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';

  let pageNum = 1;

  // Slide 1: Title
  addTitleSlide(pres, dates, pageNum++);

  // Slides 2-5: Charts
  for (const spec of CHART_SLIDES) {
    console.error(`  Generating chart: ${spec.title || spec.item}...`);
    if (spec.type === 'combinedLine') {
      addCombinedLineSlide(pres, spec, dates, data, pageNum++);
    } else {
      addDualMarketBarSlide(pres, spec, dates, data, pageNum++);
    }
  }

  // Ensure output directory exists
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
