#!/usr/bin/env node
/**
 * Generate a JSW One branded PowerPoint with month-on-month change bar charts
 * from the costing change log.
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

const GRID = {
  L: 0.50, R: 12.83, W: 12.33,
  TOP: 0.95, BOTTOM: 6.80, H: 5.85,
  FOOTER_Y: 7.05
};

// ═══════════════════════════════════════════════════════════════
// GRAPH SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════
const GRAPH_SPECS = [
  { item: 'Pallet DRI',                row: 3,  markets: ['Raipur'],        unit: 'INR/MT' },
  { item: 'Pig Iron',                  row: 4,  markets: ['Raipur'],        unit: 'INR/MT' },
  { item: 'Scrap',                     row: 5,  markets: ['Raipur', 'NCR'], unit: 'INR/MT' },
  { item: 'Silico Manganese',          row: 6,  markets: ['Raipur'],        unit: 'INR/kg' },
  { item: 'Iron Ore DRI',              row: 7,  markets: ['Raipur'],        unit: 'INR/MT' },
  { item: 'Nett Margin Billet (Raipur)', row: 10, markets: ['Raipur'], marketKey: 'Raipur', unit: 'INR/MT' },
  { item: 'Nett Margin Billet (NCR)',    row: 10, markets: ['NCR'],    marketKey: 'NCR',    unit: 'INR/MT' },
  { item: 'Margin TMT (Raipur)',         row: 12, markets: ['Raipur'], marketKey: 'Raipur', unit: 'INR/MT' },
  { item: 'Margin TMT (NCR)',            row: 12, markets: ['NCR'],    marketKey: 'NCR',    unit: 'INR/MT' },
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

  // Collect dates from row 0 (Excel row 1), even columns (0-indexed: col 1, 3, 5...)
  const dates = [];
  const dateCols = []; // 0-indexed column indices for Raipur
  for (let c = 1; c <= maxCol; c += 2) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (cell && cell.v != null) {
      dates.push(String(cell.v));
      dateCols.push(c);
    }
  }

  // Parse data for each unique row
  const data = {};
  const seenRows = {};
  for (const spec of GRAPH_SPECS) {
    const row = spec.row - 1; // Convert to 0-indexed
    if (seenRows[row]) {
      data[spec.item] = seenRows[row];
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
    data[spec.item] = rowData;
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
// CHANGE COMPUTATION
// ═══════════════════════════════════════════════════════════════
function computeChanges(values, dates) {
  const changes = [];
  const labels = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i] != null && values[i - 1] != null) {
      changes.push(values[i] - values[i - 1]);
    } else {
      changes.push(0);
    }
    labels.push(formatDateLabel(dates[i]));
  }
  const valid = changes.filter(c => c !== 0);
  const avg = valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  return { changes, labels, avg };
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
  if (item.includes('Silico Manganese')) return val.toFixed(1);
  if (Math.abs(val) >= 1) return Math.round(val).toLocaleString('en-IN');
  return val.toFixed(2);
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
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════════
function addTitleSlide(pres, dates, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  slide.addText('Material cost change analysis', {
    x: 0.60, y: 1.90, w: 9.40, h: 1.00,
    fontSize: 28, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 2.95);
  addLogo(slide, 'title');

  slide.addText('Month-on-month absolute change (INR) for key raw materials and margins', {
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

function addChartSlide(pres, spec, dates, data, pageNum) {
  const slide = pres.addSlide();
  slide.background = { color: WHITE };

  // Slide heading
  const titleText = spec.marketKey
    ? `${spec.item} — ${spec.unit}`
    : `${spec.item} (${spec.markets.join(' & ')}) — ${spec.unit}`;

  slide.addText(titleText, {
    x: 0.50, y: 0.10, w: 10.05, h: 0.58,
    fontSize: 20, fontFace: FONT, color: BLUE,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });

  addDivider(slide, 0.75);
  addLogo(slide, 'content');

  const isDual = spec.markets.length === 2 && !spec.marketKey;

  if (isDual) {
    addDualMarketChart(pres, slide, spec, dates, data);
  } else {
    addSingleMarketChart(pres, slide, spec, dates, data);
  }

  addFooter(slide, pageNum, 'Source: Costing change log');
  return slide;
}

function addSingleMarketChart(pres, slide, spec, dates, data) {
  const marketKey = spec.marketKey || 'Raipur';
  const values = data[spec.item][marketKey];
  const { changes, labels, avg } = computeChanges(values, dates);

  const chartData = [{
    name: marketKey,
    labels: labels,
    values: changes
  }];

  slide.addChart(pres.charts.BAR, chartData, {
    x: GRID.L, y: GRID.TOP, w: GRID.W, h: 4.80,
    barDir: 'col',
    chartColors: [BLUE],
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 11,
    catAxisLabelFontFace: FONT,
    catGridLine: { style: 'none' },
    valAxisHidden: true,
    valGridLine: { style: 'none' },
    showValue: true,
    dataLabelPosition: 'inEnd',
    dataLabelColor: WHITE,
    dataLabelFontSize: 11,
    dataLabelFontFace: FONT,
    dataLabelFontBold: true,
    showLegend: false,
    showTitle: false
  });

  // Average annotation
  addAverageAnnotation(slide, avg, spec, marketKey);
}

function addDualMarketChart(pres, slide, spec, dates, data) {
  const rValues = data[spec.item]['Raipur'];
  const nValues = data[spec.item]['NCR'];
  const rResult = computeChanges(rValues, dates);
  const nResult = computeChanges(nValues, dates);

  const chartData = [
    { name: 'Raipur', labels: rResult.labels, values: rResult.changes },
    { name: 'NCR',    labels: nResult.labels, values: nResult.changes }
  ];

  slide.addChart(pres.charts.BAR, chartData, {
    x: GRID.L, y: GRID.TOP, w: GRID.W, h: 4.80,
    barDir: 'col',
    chartColors: [BLUE, GREY],
    chartArea: { fill: { color: WHITE } },
    catAxisHidden: false,
    catAxisLabelColor: GREY,
    catAxisLabelFontSize: 11,
    catAxisLabelFontFace: FONT,
    catGridLine: { style: 'none' },
    valAxisHidden: true,
    valGridLine: { style: 'none' },
    showValue: true,
    dataLabelPosition: 'inEnd',
    dataLabelColor: WHITE,
    dataLabelFontSize: 11,
    dataLabelFontFace: FONT,
    dataLabelFontBold: true,
    showLegend: true,
    legendPos: 'b',
    legendFontSize: 11,
    legendFontFace: FONT,
    legendColor: GREY,
    showTitle: false
  });

  // Average annotations for both markets
  addAverageAnnotation(slide, rResult.avg, spec, 'Raipur', 0);
  addAverageAnnotation(slide, nResult.avg, spec, 'NCR', 1);
}

function addAverageAnnotation(slide, avg, spec, market, index) {
  const yPos = index === 1 ? 6.10 : 5.85;
  const color = index === 1 ? GREY : BLUE;
  const label = spec.markets.length === 2 && !spec.marketKey
    ? `${market} avg: ${formatNumber(avg, spec.item)} ${spec.unit}`
    : `Period avg: ${formatNumber(avg, spec.item)} ${spec.unit}`;

  // Content heading style box for average
  slide.addShape('rect', {
    x: GRID.L, y: yPos, w: GRID.W, h: 0.35,
    fill: { color: LTGREY }, line: { color: BORDER, width: 0.5 }
  });
  slide.addText(label, {
    x: GRID.L + 0.15, y: yPos, w: GRID.W - 0.30, h: 0.35,
    fontSize: 12, fontFace: FONT, color: color,
    bold: true, align: 'left', valign: 'middle', margin: 0
  });
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

  // Slides 2-10: Charts
  for (const spec of GRAPH_SPECS) {
    console.error(`  Generating chart: ${spec.item}...`);
    addChartSlide(pres, spec, dates, data, pageNum++);
  }

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (outDir && !fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  pres.writeFile({ fileName: outputPath }).then(() => {
    console.error(`Presentation saved: ${outputPath}`);
    console.error(`Done! ${GRAPH_SPECS.length} charts generated.`);
    process.exit(0);
  }).catch(err => {
    console.error(`ERROR writing PPTX: ${err.message}`);
    process.exit(1);
  });
}

main();
