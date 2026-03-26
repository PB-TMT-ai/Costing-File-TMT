/**
 * html_to_image.js — Renders HTML to hi-res PNG for embedding in PPTX
 * 
 * Usage:
 *   node scripts/html_to_image.js <input.html> <output.png> [width] [dpr]
 * 
 * Arguments:
 *   input.html  — Path to HTML file to render
 *   output.png  — Path for output PNG
 *   width       — Viewport width in px (default: 900, matches PPTX content area)
 *   dpr         — Device pixel ratio (default: 2 for hi-res, use 3 for retina)
 * 
 * Examples:
 *   node scripts/html_to_image.js /home/claude/kpi_row.html /home/claude/kpi_row.png
 *   node scripts/html_to_image.js /home/claude/chart.html /home/claude/chart.png 1100 2
 *   node scripts/html_to_image.js /home/claude/waterfall.html /home/claude/waterfall.png 900 3
 * 
 * Output: PNG clipped to content bounds (no whitespace below content).
 * At 2x DPR with 900px width, output is 1800px wide — crisp on any projector or screen.
 * 
 * Dependencies: playwright (pre-installed in Claude environment)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function renderHtmlToImage(inputPath, outputPath, width = 900, dpr = 2) {
  // Validate input
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(inputPath, 'utf8');
  
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({
    viewport: { width: parseInt(width), height: 800 },
    deviceScaleFactor: parseInt(dpr)
  });

  // Set content and wait for rendering
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300); // Allow CSS transitions/rendering

  // Get content bounds for tight clipping
  const body = await page.$('body');
  const box = await body.boundingBox();
  
  // Add small padding
  const padding = 2;
  const clip = {
    x: 0,
    y: 0,
    width: Math.ceil(box.width) + padding,
    height: Math.ceil(box.height) + padding
  };

  await page.screenshot({
    path: outputPath,
    clip: clip,
    type: 'png'
  });

  await browser.close();

  // Report
  const stats = fs.statSync(outputPath);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`Rendered: ${outputPath}`);
  console.log(`  Dimensions: ${clip.width * dpr}x${clip.height * dpr}px (${dpr}x DPR)`);
  console.log(`  File size: ${sizeKB} KB`);
  console.log(`  Viewport: ${width}px wide`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node html_to_image.js <input.html> <output.png> [width] [dpr]');
  process.exit(1);
}

renderHtmlToImage(args[0], args[1], args[2] || 900, args[3] || 2)
  .catch(err => { console.error(err.message); process.exit(1); });
