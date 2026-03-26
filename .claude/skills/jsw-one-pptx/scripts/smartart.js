/**
 * JSW One SmartArt Library for pptxgenjs
 * 
 * Reusable visual components using JSW One brand colors.
 * Import functions as needed in your deck scripts.
 * 
 * Usage:
 *   const smart = require('./scripts/smartart.js');
 *   smart.addTimeline(pres, slide, x, y, w, h, milestones);
 * 
 * All functions use:
 *   - JSW One blue: 213366
 *   - JSW One red:  EA2127 (accent only)
 *   - Grey:         7F7F7F
 *   - Light grey:   F2F2F2
 *   - Border grey:  CCCCCC
 *   - White:        FFFFFF
 *   - Font:         Calibri only
 */

const BLUE = '213366';
const RED  = 'EA2127';
const GREY = '7F7F7F';
const LTGREY = 'F2F2F2';
const BORDER = 'CCCCCC';
const WHITE = 'FFFFFF';
const FONT = 'Calibri';

// ═══════════════════════════════════════════════════════════════
// 1. HORIZONTAL TIMELINE — milestones with dates
// ═══════════════════════════════════════════════════════════════
/**
 * @param {object} pres - pptxgenjs instance
 * @param {object} slide - slide object
 * @param {number} x - left position
 * @param {number} y - top position  
 * @param {number} w - total width
 * @param {number} h - total height (recommend 1.50-2.00")
 * @param {Array} milestones - [{label, detail, color?}]
 *   label: "Q1 FY27" (shown above line)
 *   detail: "Launch UP distribution" (shown below line)
 *   color: optional, defaults to BLUE
 */
function addTimeline(pres, slide, x, y, w, h, milestones) {
  const n = milestones.length;
  const lineY = y + h * 0.45;
  const stepW = w / n;
  const dotR = 0.12;

  // Horizontal line
  slide.addShape(pres.shapes.LINE, {
    x: x, y: lineY, w: w, h: 0,
    line: { color: BLUE, width: 2 }
  });

  milestones.forEach((m, i) => {
    const cx = x + stepW * i + stepW / 2;
    const col = m.color || BLUE;

    // Dot on line
    slide.addShape(pres.shapes.OVAL, {
      x: cx - dotR, y: lineY - dotR, w: dotR * 2, h: dotR * 2,
      fill: { color: col }, line: { width: 0, color: WHITE }
    });

    // Label above (date/period)
    slide.addText(m.label || '', {
      x: cx - stepW / 2 + 0.05, y: y, w: stepW - 0.10, h: h * 0.40,
      fontSize: 11, fontFace: FONT, color: col, bold: true,
      align: 'center', valign: 'bottom', margin: 0
    });

    // Detail below (description)
    slide.addText(m.detail || '', {
      x: cx - stepW / 2 + 0.05, y: lineY + dotR + 0.05, w: stepW - 0.10, h: h * 0.45,
      fontSize: 10, fontFace: FONT, color: GREY,
      align: 'center', valign: 'top', margin: 0
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 2. PROCESS FLOW — step boxes with arrows
// ═══════════════════════════════════════════════════════════════
/**
 * @param {Array} steps - [{title, detail, color?}]
 *   title: "Step 1: Order" (bold heading inside box)
 *   detail: "Customer places order via platform" (body text)
 */
function addProcessFlow(pres, slide, x, y, w, h, steps) {
  const n = steps.length;
  const arrowW = 0.25;
  const totalArrowW = (n - 1) * arrowW;
  const boxW = (w - totalArrowW) / n;
  const boxH = h;

  steps.forEach((step, i) => {
    const bx = x + i * (boxW + arrowW);
    const col = step.color || BLUE;

    // Box
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: y, w: boxW, h: boxH,
      fill: { color: WHITE }, line: { color: BORDER, width: 1 }
    });

    // Top accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: y, w: boxW, h: 0.04,
      fill: { color: col }
    });

    // Title
    slide.addText(step.title || '', {
      x: bx + 0.10, y: y + 0.12, w: boxW - 0.20, h: 0.35,
      fontSize: 11, fontFace: FONT, color: col, bold: true,
      align: 'center', valign: 'top', margin: 0
    });

    // Detail
    slide.addText(step.detail || '', {
      x: bx + 0.10, y: y + 0.48, w: boxW - 0.20, h: boxH - 0.58,
      fontSize: 10, fontFace: FONT, color: '000000',
      align: 'center', valign: 'top', margin: 0
    });

    // Arrow between boxes (except after last)
    if (i < n - 1) {
      const arrowX = bx + boxW;
      slide.addText('\u25B6', {
        x: arrowX, y: y + boxH / 2 - 0.15, w: arrowW, h: 0.30,
        fontSize: 14, fontFace: FONT, color: BLUE,
        align: 'center', valign: 'middle', margin: 0
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. TWO-BY-TWO MATRIX — quadrant chart
// ═══════════════════════════════════════════════════════════════
/**
 * @param {object} config
 *   xAxisLabel: "Low risk → High risk"
 *   yAxisLabel: "Low impact → High impact"
 *   quadrants: [{label, items, color?}] — 4 quadrants, order: TL, TR, BL, BR
 *     items: ["Item 1", "Item 2"] — bullet items inside quadrant
 */
function addMatrix2x2(pres, slide, x, y, w, h, config) {
  const gap = 0.08;
  const axisSpace = 0.35;
  const qw = (w - axisSpace - gap) / 2;
  const qh = (h - axisSpace - gap) / 2;
  const qx = x + axisSpace;
  const qy = y;

  const positions = [
    { x: qx, y: qy },                   // Top-left
    { x: qx + qw + gap, y: qy },        // Top-right
    { x: qx, y: qy + qh + gap },        // Bottom-left
    { x: qx + qw + gap, y: qy + qh + gap } // Bottom-right
  ];

  const defaultColors = [LTGREY, BLUE, WHITE, LTGREY];

  (config.quadrants || []).forEach((q, i) => {
    if (i >= 4) return;
    const p = positions[i];
    const bgCol = i === 1 ? BLUE : (q.color || defaultColors[i]);
    const txtCol = i === 1 ? WHITE : '000000';

    slide.addShape(pres.shapes.RECTANGLE, {
      x: p.x, y: p.y, w: qw, h: qh,
      fill: { color: bgCol }, line: { color: BORDER, width: 0.5 }
    });

    // Quadrant label
    slide.addText(q.label || '', {
      x: p.x + 0.10, y: p.y + 0.08, w: qw - 0.20, h: 0.30,
      fontSize: 11, fontFace: FONT, color: txtCol, bold: true,
      align: 'left', valign: 'top', margin: 0
    });

    // Items
    const itemText = (q.items || []).map(item => `\u2022 ${item}`).join('\n');
    slide.addText(itemText, {
      x: p.x + 0.10, y: p.y + 0.38, w: qw - 0.20, h: qh - 0.48,
      fontSize: 10, fontFace: FONT, color: txtCol,
      align: 'left', valign: 'top', margin: 0
    });
  });

  // Y-axis label (vertical)
  slide.addText(config.yAxisLabel || '', {
    x: x, y: qy, w: axisSpace - 0.05, h: h - axisSpace,
    fontSize: 9, fontFace: FONT, color: GREY,
    align: 'center', valign: 'middle', margin: 0, rotate: 270
  });

  // X-axis label (horizontal)
  slide.addText(config.xAxisLabel || '', {
    x: qx, y: qy + 2 * qh + gap + 0.05, w: 2 * qw + gap, h: axisSpace - 0.10,
    fontSize: 9, fontFace: FONT, color: GREY,
    align: 'center', valign: 'top', margin: 0
  });

  // Axis arrows
  slide.addShape(pres.shapes.LINE, {
    x: qx - 0.02, y: qy + 2 * qh + gap, w: 2 * qw + gap + 0.04, h: 0,
    line: { color: GREY, width: 1, endArrowType: 'triangle' }
  });
  slide.addShape(pres.shapes.LINE, {
    x: qx - 0.02, y: qy + 2 * qh + gap, w: 0, h: -(2 * qh + gap),
    line: { color: GREY, width: 1, endArrowType: 'triangle' }
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. HIERARCHY / ORG CHART — boxes with connector lines
// ═══════════════════════════════════════════════════════════════
/**
 * @param {object} root - {label, detail?, children: [{label, detail?, children?}]}
 * Tree structure. Max 3 levels recommended.
 */
function addHierarchy(pres, slide, x, y, w, h, root) {
  const boxH = 0.55;
  const boxPad = 0.15;
  const levelGap = (h - boxH * 3) / 2;

  function drawBox(bx, by, bw, label, detail, isRoot) {
    const fill = isRoot ? BLUE : WHITE;
    const textCol = isRoot ? WHITE : '000000';
    const lineCol = isRoot ? BLUE : BORDER;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: bw, h: boxH,
      fill: { color: fill }, line: { color: lineCol, width: 1 }
    });

    if (detail) {
      slide.addText(label, {
        x: bx + 0.08, y: by + 0.05, w: bw - 0.16, h: 0.25,
        fontSize: 10, fontFace: FONT, color: textCol, bold: true,
        align: 'center', valign: 'middle', margin: 0
      });
      slide.addText(detail, {
        x: bx + 0.08, y: by + 0.28, w: bw - 0.16, h: 0.22,
        fontSize: 9, fontFace: FONT, color: isRoot ? WHITE : GREY,
        align: 'center', valign: 'top', margin: 0
      });
    } else {
      slide.addText(label, {
        x: bx + 0.08, y: by, w: bw - 0.16, h: boxH,
        fontSize: 10, fontFace: FONT, color: textCol, bold: true,
        align: 'center', valign: 'middle', margin: 0
      });
    }
    return { cx: bx + bw / 2, bottom: by + boxH, top: by };
  }

  // Level 0: root
  const rootW = Math.min(3.00, w * 0.35);
  const rootX = x + (w - rootW) / 2;
  const r = drawBox(rootX, y, rootW, root.label, root.detail, true);

  if (!root.children || root.children.length === 0) return;

  // Level 1
  const l1Count = root.children.length;
  const l1W = Math.min(2.80, (w - (l1Count - 1) * boxPad) / l1Count);
  const l1TotalW = l1Count * l1W + (l1Count - 1) * boxPad;
  const l1StartX = x + (w - l1TotalW) / 2;
  const l1Y = y + boxH + levelGap;

  // Vertical line from root to horizontal connector
  const connY = r.bottom + levelGap * 0.4;
  slide.addShape(pres.shapes.LINE, {
    x: r.cx, y: r.bottom, w: 0, h: connY - r.bottom,
    line: { color: BORDER, width: 1 }
  });

  const l1Nodes = root.children.map((child, i) => {
    const cx = l1StartX + i * (l1W + boxPad);
    return drawBox(cx, l1Y, l1W, child.label, child.detail, false);
  });

  // Horizontal connector across all L1 nodes
  if (l1Nodes.length > 1) {
    slide.addShape(pres.shapes.LINE, {
      x: l1Nodes[0].cx, y: connY, w: l1Nodes[l1Nodes.length - 1].cx - l1Nodes[0].cx, h: 0,
      line: { color: BORDER, width: 1 }
    });
  }

  // Vertical drops to each L1 node
  l1Nodes.forEach(node => {
    slide.addShape(pres.shapes.LINE, {
      x: node.cx, y: connY, w: 0, h: node.top - connY,
      line: { color: BORDER, width: 1 }
    });
  });

  // Level 2 (if any children have children)
  const l2Y = l1Y + boxH + levelGap;
  root.children.forEach((child, i) => {
    if (!child.children || child.children.length === 0) return;
    const parentNode = l1Nodes[i];
    const l2Count = child.children.length;
    const l2W = Math.min(2.00, l1W / l2Count - 0.05);
    const l2TotalW = l2Count * l2W + (l2Count - 1) * 0.08;
    const l2StartX = parentNode.cx - l2TotalW / 2;

    const conn2Y = parentNode.bottom + levelGap * 0.4;
    slide.addShape(pres.shapes.LINE, {
      x: parentNode.cx, y: parentNode.bottom, w: 0, h: conn2Y - parentNode.bottom,
      line: { color: BORDER, width: 1 }
    });

    const l2Nodes = child.children.map((gc, j) => {
      const gcx = l2StartX + j * (l2W + 0.08);
      return drawBox(gcx, l2Y, l2W, gc.label, gc.detail, false);
    });

    if (l2Nodes.length > 1) {
      slide.addShape(pres.shapes.LINE, {
        x: l2Nodes[0].cx, y: conn2Y, w: l2Nodes[l2Nodes.length - 1].cx - l2Nodes[0].cx, h: 0,
        line: { color: BORDER, width: 1 }
      });
    }
    l2Nodes.forEach(node => {
      slide.addShape(pres.shapes.LINE, {
        x: node.cx, y: conn2Y, w: 0, h: node.top - conn2Y,
        line: { color: BORDER, width: 1 }
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. FUNNEL — descending stages
// ═══════════════════════════════════════════════════════════════
/**
 * @param {Array} stages - [{label, value, detail?}]
 *   label: "Leads" (stage name)
 *   value: "1,600+" (number shown)
 *   detail: "Total project inquiries" (optional subtext)
 * Stages go widest at top, narrowest at bottom.
 */
function addFunnel(pres, slide, x, y, w, h, stages) {
  const n = stages.length;
  const stageH = (h - (n - 1) * 0.06) / n;
  const minW = w * 0.35;

  stages.forEach((stage, i) => {
    const ratio = 1 - (i / n) * (1 - minW / w);
    const stageW = w * ratio;
    const sx = x + (w - stageW) / 2;
    const sy = y + i * (stageH + 0.06);

    // Stage bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: stageW, h: stageH,
      fill: { color: i === 0 ? BLUE : (i < n - 1 ? '4A6A9E' : '8FA4CC') },
      line: { width: 0, color: WHITE }
    });

    // Value + label inside
    const text = stage.value ? `${stage.value}  ${stage.label}` : stage.label;
    slide.addText(text, {
      x: sx + 0.10, y: sy, w: stageW - 0.20, h: stageH,
      fontSize: 12, fontFace: FONT, color: WHITE, bold: true,
      align: 'center', valign: 'middle', margin: 0
    });

    // Detail to the right
    if (stage.detail) {
      slide.addText(stage.detail, {
        x: x + w + 0.15, y: sy, w: 3.00, h: stageH,
        fontSize: 10, fontFace: FONT, color: GREY,
        align: 'left', valign: 'middle', margin: 0
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 6. BUILDING BLOCKS — stacked composition bars
// ═══════════════════════════════════════════════════════════════
/**
 * @param {Array} blocks - [{label, value, color?}] — bottom to top
 *   label: "Enterprise" (block label)
 *   value: 2350 (numeric value for proportional sizing)
 * @param {string} title - optional title above the stack
 * @param {boolean} showValues - show value labels inside blocks
 */
function addBuildingBlocks(pres, slide, x, y, w, h, blocks, title, showValues) {
  const total = blocks.reduce((sum, b) => sum + (b.value || 1), 0);
  const colors = [BLUE, '4A6A9E', '8FA4CC', GREY, BORDER];

  if (title) {
    slide.addText(title, {
      x: x, y: y - 0.30, w: w, h: 0.25,
      fontSize: 11, fontFace: FONT, color: BLUE, bold: true,
      align: 'center', valign: 'bottom', margin: 0
    });
  }

  let curY = y + h; // Start from bottom
  blocks.forEach((block, i) => {
    const blockH = (block.value / total) * h;
    curY -= blockH;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: curY, w: w, h: blockH,
      fill: { color: block.color || colors[i % colors.length] },
      line: { color: WHITE, width: 1 }
    });

    const displayText = showValues !== false
      ? `${block.label}: ${block.value.toLocaleString()}`
      : block.label;

    if (blockH > 0.25) {
      slide.addText(displayText, {
        x: x + 0.05, y: curY, w: w - 0.10, h: blockH,
        fontSize: 10, fontFace: FONT, color: WHITE, bold: true,
        align: 'center', valign: 'middle', margin: 0
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 7. COMPARISON LAYOUT — side-by-side vs
// ═══════════════════════════════════════════════════════════════
/**
 * @param {object} left - {title, items: ["point 1", "point 2"]}
 * @param {object} right - {title, items: [...]}
 * @param {string} vsLabel - optional center label (default "vs")
 */
function addComparison(pres, slide, x, y, w, h, left, right, vsLabel) {
  const colW = (w - 0.60) / 2;
  const vsW = 0.60;

  // Left panel
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: colW, h: h,
    fill: { color: WHITE }, line: { color: BORDER, width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: colW, h: 0.04,
    fill: { color: BLUE }
  });
  slide.addText(left.title || '', {
    x: x + 0.15, y: y + 0.10, w: colW - 0.30, h: 0.35,
    fontSize: 12, fontFace: FONT, color: BLUE, bold: true,
    align: 'center', valign: 'middle', margin: 0
  });
  const leftItems = (left.items || []).map(item => `\u2022 ${item}`).join('\n');
  slide.addText(leftItems, {
    x: x + 0.15, y: y + 0.50, w: colW - 0.30, h: h - 0.60,
    fontSize: 11, fontFace: FONT, color: '000000',
    align: 'left', valign: 'top', margin: 0, lineSpacingMultiple: 1.2
  });

  // VS circle
  slide.addShape(pres.shapes.OVAL, {
    x: x + colW + (vsW - 0.45) / 2, y: y + h / 2 - 0.225, w: 0.45, h: 0.45,
    fill: { color: BLUE }, line: { width: 0, color: WHITE }
  });
  slide.addText(vsLabel || 'vs', {
    x: x + colW, y: y + h / 2 - 0.20, w: vsW, h: 0.40,
    fontSize: 11, fontFace: FONT, color: WHITE, bold: true,
    align: 'center', valign: 'middle', margin: 0
  });

  // Right panel
  const rx = x + colW + vsW;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: y, w: colW, h: h,
    fill: { color: WHITE }, line: { color: BORDER, width: 1 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: y, w: colW, h: 0.04,
    fill: { color: GREY }
  });
  slide.addText(right.title || '', {
    x: rx + 0.15, y: y + 0.10, w: colW - 0.30, h: 0.35,
    fontSize: 12, fontFace: FONT, color: GREY, bold: true,
    align: 'center', valign: 'middle', margin: 0
  });
  const rightItems = (right.items || []).map(item => `\u2022 ${item}`).join('\n');
  slide.addText(rightItems, {
    x: rx + 0.15, y: y + 0.50, w: colW - 0.30, h: h - 0.60,
    fontSize: 11, fontFace: FONT, color: '000000',
    align: 'left', valign: 'top', margin: 0, lineSpacingMultiple: 1.2
  });
}

// ═══════════════════════════════════════════════════════════════
// 8. GANTT-STYLE HORIZONTAL BARS
// ═══════════════════════════════════════════════════════════════
/**
 * @param {Array} periods - ["Q1","Q2","Q3","Q4"] — column headers
 * @param {Array} tasks - [{label, start, end, color?}]
 *   label: "UP distribution launch"
 *   start: 0 (0-based index into periods)
 *   end: 1 (inclusive end index)
 */
function addGantt(pres, slide, x, y, w, h, periods, tasks) {
  const labelW = 3.00;
  const chartW = w - labelW;
  const colW = chartW / periods.length;
  const headerH = 0.35;
  const rowH = Math.min(0.45, (h - headerH) / tasks.length);

  // Period headers
  periods.forEach((p, i) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + labelW + i * colW, y: y, w: colW, h: headerH,
      fill: { color: BLUE }, line: { width: 0.5, color: WHITE }
    });
    slide.addText(p, {
      x: x + labelW + i * colW, y: y, w: colW, h: headerH,
      fontSize: 10, fontFace: FONT, color: WHITE, bold: true,
      align: 'center', valign: 'middle', margin: 0
    });
  });

  // Task label header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: labelW, h: headerH,
    fill: { color: BLUE }, line: { width: 0.5, color: WHITE }
  });
  slide.addText('Activity', {
    x: x, y: y, w: labelW, h: headerH,
    fontSize: 10, fontFace: FONT, color: WHITE, bold: true,
    align: 'left', valign: 'middle', margin: [0, 0, 0, 5]
  });

  // Grid lines and task bars
  tasks.forEach((task, i) => {
    const ry = y + headerH + i * rowH;
    const bgCol = i % 2 === 0 ? WHITE : LTGREY;

    // Row background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: ry, w: w, h: rowH,
      fill: { color: bgCol }, line: { width: 0.5, color: BORDER }
    });

    // Task label
    slide.addText(task.label, {
      x: x + 0.10, y: ry, w: labelW - 0.20, h: rowH,
      fontSize: 10, fontFace: FONT, color: '000000',
      align: 'left', valign: 'middle', margin: 0
    });

    // Gantt bar
    const barX = x + labelW + task.start * colW + 0.05;
    const barW = (task.end - task.start + 1) * colW - 0.10;
    const barCol = task.color || BLUE;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: barX, y: ry + rowH * 0.20, w: barW, h: rowH * 0.60,
      fill: { color: barCol }, line: { width: 0, color: WHITE }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════
module.exports = {
  addTimeline,
  addProcessFlow,
  addMatrix2x2,
  addHierarchy,
  addFunnel,
  addBuildingBlocks,
  addComparison,
  addGantt,
  // Constants for custom usage
  BLUE, RED, GREY, LTGREY, BORDER, WHITE, FONT
};
