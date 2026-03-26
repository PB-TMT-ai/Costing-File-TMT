#!/usr/bin/env python3
"""Generate a PowerPoint presentation with month-on-month change graphs from the costing change log.

Usage:
    python tools/create_material_change_graph.py [--input <change_log_path>] [--output <pptx_path>]

Exit codes:
    0 -- Success
    1 -- Error
    2 -- File not found or invalid input
"""

import argparse
import os
import shutil
import sys
import tempfile
from datetime import datetime

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import matplotlib.ticker as ticker
except ImportError:
    print("ERROR: matplotlib not installed. Run: pip install matplotlib", file=sys.stderr)
    sys.exit(1)

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
except ImportError:
    print("ERROR: python-pptx not installed. Run: pip install python-pptx", file=sys.stderr)
    sys.exit(1)

import openpyxl

# Graph specifications: item name, row in change log, markets to show, unit
GRAPH_SPECS = [
    {"item": "Pallet DRI",         "row": 3,  "markets": ["Raipur"],        "unit": "INR/MT"},
    {"item": "Pig Iron",           "row": 4,  "markets": ["Raipur"],        "unit": "INR/MT"},
    {"item": "Scrap",              "row": 5,  "markets": ["Raipur", "NCR"], "unit": "INR/MT"},
    {"item": "Silico Manganese",   "row": 6,  "markets": ["Raipur"],        "unit": "INR/kg"},
    {"item": "Iron Ore DRI",       "row": 7,  "markets": ["Raipur"],        "unit": "INR/MT"},
    {"item": "Nett Margin Billet (Raipur)", "row": 10, "markets": ["Raipur"], "market_key": "Raipur", "unit": "INR/MT"},
    {"item": "Nett Margin Billet (NCR)",    "row": 10, "markets": ["NCR"],    "market_key": "NCR",    "unit": "INR/MT"},
    {"item": "Margin TMT (Raipur)",         "row": 12, "markets": ["Raipur"], "market_key": "Raipur", "unit": "INR/MT"},
    {"item": "Margin TMT (NCR)",            "row": 12, "markets": ["NCR"],    "market_key": "NCR",    "unit": "INR/MT"},
]

# Colors
COLOR_RAIPUR = "#1565C0"
COLOR_NCR = "#FF8F00"
COLOR_POS = "#4CAF50"
COLOR_NEG = "#F44336"
COLOR_AVG_RAIPUR = "#0D47A1"
COLOR_AVG_NCR = "#E65100"
COLOR_AVG_SINGLE = "#1A237E"


def load_change_log(path):
    """Load change log data from Excel file.

    Returns:
        dates: list of date strings
        data: dict {item_name: {"Raipur": [float|None, ...], "NCR": [float|None, ...]}}
    """
    wb = openpyxl.load_workbook(path)
    ws = wb["Change Log"]

    # Collect dates from row 1 (even columns starting at 2)
    dates = []
    date_cols = []
    for col in range(2, ws.max_column + 1, 2):
        val = ws.cell(row=1, column=col).value
        if val is not None:
            dates.append(str(val))
            date_cols.append(col)

    # Parse data for each unique row in graph specs
    data = {}
    seen_rows = {}
    for spec in GRAPH_SPECS:
        row = spec["row"]
        if row in seen_rows:
            # Reuse already-parsed data for duplicate rows (e.g. margins split by market)
            data[spec["item"]] = seen_rows[row]
            continue
        raipur_vals = []
        ncr_vals = []
        for col in date_cols:
            # Raipur is in even column, NCR in odd (col+1)
            r_val = ws.cell(row=row, column=col).value
            n_val = ws.cell(row=row, column=col + 1).value
            raipur_vals.append(_parse_value(r_val))
            ncr_vals.append(_parse_value(n_val))
        row_data = {"Raipur": raipur_vals, "NCR": ncr_vals}
        seen_rows[row] = row_data
        data[spec["item"]] = row_data

    wb.close()
    return dates, data


def _parse_value(val):
    """Convert cell value to float, returning None for '-' or empty."""
    if val is None or str(val).strip() in ("-", ""):
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def compute_changes(values, dates):
    """Compute month-on-month absolute changes.

    Returns:
        changes: list of floats (length n-1)
        labels: list of period label strings (length n-1)
        avg: average of changes (float)
    """
    changes = []
    labels = []
    for i in range(1, len(values)):
        if values[i] is not None and values[i - 1] is not None:
            changes.append(values[i] - values[i - 1])
        else:
            changes.append(None)
        labels.append(_format_date_label(dates[i]))

    valid = [c for c in changes if c is not None]
    avg = sum(valid) / len(valid) if valid else 0
    return changes, labels, avg


def _format_date_label(date_str):
    """Format date string to abbreviated label like \"Jan'25\"."""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return dt.strftime("%b'%y")
    except ValueError:
        return date_str[:7]


def create_chart_image(spec, dates, data, tmp_dir):
    """Create a bar chart image for a single item and save as PNG."""
    item = spec["item"]
    markets = spec["markets"]
    unit = spec["unit"]
    is_dual = len(markets) == 2

    fig, ax = plt.subplots(figsize=(12, 5.5), dpi=150)

    if is_dual:
        _plot_dual_market(ax, spec, dates, data)
    else:
        _plot_single_market(ax, spec, dates, data)

    ax.set_title(f"Month-on-Month Change: {item}", fontsize=16, fontweight="bold", pad=15)
    ax.set_ylabel(f"Change ({unit})", fontsize=12)
    ax.axhline(y=0, color="gray", linewidth=0.5)
    ax.grid(axis="y", alpha=0.3, linestyle="--")
    ax.tick_params(axis="x", rotation=45)

    plt.tight_layout()
    path = os.path.join(tmp_dir, f"{item.replace(' ', '_')}.png")
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return path


def _plot_single_market(ax, spec, dates, data):
    """Plot bar chart for a single market."""
    item = spec["item"]
    market_key = spec.get("market_key", "Raipur")
    values = data[item][market_key]
    changes, labels, avg = compute_changes(values, dates)

    x = range(len(labels))
    colors = []
    plot_changes = []
    for c in changes:
        if c is None:
            plot_changes.append(0)
            colors.append("lightgray")
        elif c >= 0:
            plot_changes.append(c)
            colors.append(COLOR_POS)
        else:
            plot_changes.append(c)
            colors.append(COLOR_NEG)

    bars = ax.bar(x, plot_changes, color=colors, width=0.6, edgecolor="white", linewidth=0.5)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)

    # Value labels on bars
    _add_bar_labels(ax, bars, plot_changes, spec)

    # Average line
    ax.axhline(y=avg, color=COLOR_AVG_SINGLE, linewidth=1.5, linestyle="--", alpha=0.8)
    ax.annotate(
        f"Avg: {_fmt_val(avg, spec)}",
        xy=(len(labels) - 1, avg),
        fontsize=10,
        fontweight="bold",
        color=COLOR_AVG_SINGLE,
        ha="right",
        va="bottom" if avg >= 0 else "top",
    )


def _plot_dual_market(ax, spec, dates, data):
    """Plot grouped bar chart for two markets."""
    item = spec["item"]
    r_values = data[item]["Raipur"]
    n_values = data[item]["NCR"]

    r_changes, labels, r_avg = compute_changes(r_values, dates)
    n_changes, _, n_avg = compute_changes(n_values, dates)

    x = list(range(len(labels)))
    width = 0.35

    r_plot = [c if c is not None else 0 for c in r_changes]
    n_plot = [c if c is not None else 0 for c in n_changes]

    x_r = [xi - width / 2 for xi in x]
    x_n = [xi + width / 2 for xi in x]

    bars_r = ax.bar(x_r, r_plot, width=width, color=COLOR_RAIPUR, label="Raipur",
                    edgecolor="white", linewidth=0.5, alpha=0.85)
    bars_n = ax.bar(x_n, n_plot, width=width, color=COLOR_NCR, label="NCR",
                    edgecolor="white", linewidth=0.5, alpha=0.85)

    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)

    # Value labels
    _add_bar_labels(ax, bars_r, r_plot, spec, fontsize=7)
    _add_bar_labels(ax, bars_n, n_plot, spec, fontsize=7)

    # Average lines
    ax.axhline(y=r_avg, color=COLOR_AVG_RAIPUR, linewidth=1.5, linestyle="--", alpha=0.7)
    ax.axhline(y=n_avg, color=COLOR_AVG_NCR, linewidth=1.5, linestyle="--", alpha=0.7)

    ax.annotate(
        f"Raipur Avg: {_fmt_val(r_avg, spec)}",
        xy=(0, r_avg),
        fontsize=9,
        fontweight="bold",
        color=COLOR_AVG_RAIPUR,
        va="bottom" if r_avg >= 0 else "top",
    )
    ax.annotate(
        f"NCR Avg: {_fmt_val(n_avg, spec)}",
        xy=(len(labels) - 1, n_avg),
        fontsize=9,
        fontweight="bold",
        color=COLOR_AVG_NCR,
        ha="right",
        va="bottom" if n_avg >= 0 else "top",
    )

    ax.legend(loc="upper left", fontsize=10)


def _add_bar_labels(ax, bars, values, spec, fontsize=8):
    """Add value labels on top of bars."""
    for bar, val in zip(bars, values):
        if val == 0:
            continue
        y = bar.get_height()
        va = "bottom" if y >= 0 else "top"
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            y,
            _fmt_val(val, spec),
            ha="center",
            va=va,
            fontsize=fontsize,
            fontweight="bold",
        )


def _fmt_val(val, spec):
    """Format a value for display based on the item's unit."""
    if spec["item"] == "Silico Manganese":
        return f"{val:+.1f}"
    if abs(val) >= 1:
        return f"{val:+,.0f}"
    return f"{val:+.2f}"


def build_presentation(chart_paths, specs, dates, output_path):
    """Build a PowerPoint presentation with chart images."""
    prs = Presentation()
    # Set widescreen 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Title slide
    _add_title_slide(prs, dates)

    # Chart slides
    for chart_path, spec in zip(chart_paths, specs):
        _add_chart_slide(prs, chart_path, spec)

    prs.save(output_path)
    print(f"Presentation saved: {output_path}", file=sys.stderr)


def _add_title_slide(prs, dates):
    """Add the title slide."""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Title
    txBox = slide.shapes.add_textbox(Inches(1), Inches(2), Inches(11.333), Inches(1.5))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Material Cost Change Analysis"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = RGBColor(0x15, 0x65, 0xC0)
    p.alignment = PP_ALIGN.CENTER

    # Subtitle
    txBox2 = slide.shapes.add_textbox(Inches(1), Inches(3.8), Inches(11.333), Inches(1))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = f"Month-on-Month Absolute Change (INR)"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(0x42, 0x42, 0x42)
    p2.alignment = PP_ALIGN.CENTER

    # Date range
    txBox3 = slide.shapes.add_textbox(Inches(1), Inches(4.8), Inches(11.333), Inches(0.8))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p3 = tf3.paragraphs[0]
    p3.text = f"Period: {dates[0]} to {dates[-1]}  |  {len(dates)} data points"
    p3.font.size = Pt(16)
    p3.font.color.rgb = RGBColor(0x75, 0x75, 0x75)
    p3.alignment = PP_ALIGN.CENTER

    # Generated date
    txBox4 = slide.shapes.add_textbox(Inches(1), Inches(6), Inches(11.333), Inches(0.5))
    tf4 = txBox4.text_frame
    p4 = tf4.paragraphs[0]
    p4.text = f"Generated: {datetime.now().strftime('%Y-%m-%d')}"
    p4.font.size = Pt(12)
    p4.font.color.rgb = RGBColor(0x9E, 0x9E, 0x9E)
    p4.alignment = PP_ALIGN.CENTER


def _add_chart_slide(prs, chart_path, spec):
    """Add a slide with a chart image."""
    slide_layout = prs.slide_layouts[6]  # Blank
    slide = prs.slides.add_slide(slide_layout)

    # Title bar
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.2), Inches(12.333), Inches(0.6))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    if "market_key" in spec:
        p.text = f"{spec['item']} - {spec['unit']}"
    else:
        markets_str = " & ".join(spec["markets"])
        p.text = f"{spec['item']} ({markets_str}) - {spec['unit']}"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(0x21, 0x21, 0x21)
    p.alignment = PP_ALIGN.LEFT

    # Chart image - fill most of the slide
    slide.shapes.add_picture(chart_path, Inches(0.3), Inches(0.9), Inches(12.7), Inches(6.3))


def main():
    parser = argparse.ArgumentParser(description="Generate material change graph PowerPoint")
    parser.add_argument(
        "--input", "-i",
        default="output/change_log.xlsx",
        help="Path to change_log.xlsx (default: output/change_log.xlsx)",
    )
    parser.add_argument(
        "--output", "-o",
        default="output/material_change_graphs.pptx",
        help="Output PPTX path (default: output/material_change_graphs.pptx)",
    )
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"ERROR: Input file not found: {args.input}", file=sys.stderr)
        sys.exit(2)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)

    print(f"Loading change log: {args.input}", file=sys.stderr)
    dates, data = load_change_log(args.input)
    print(f"Found {len(dates)} dates: {dates[0]} to {dates[-1]}", file=sys.stderr)

    # Generate chart images
    tmp_dir = tempfile.mkdtemp(prefix="material_charts_")
    chart_paths = []
    try:
        for spec in GRAPH_SPECS:
            print(f"  Generating chart: {spec['item']}...", file=sys.stderr)
            path = create_chart_image(spec, dates, data, tmp_dir)
            chart_paths.append(path)

        # Build presentation
        build_presentation(chart_paths, GRAPH_SPECS, dates, args.output)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)

    print(f"Done! {len(GRAPH_SPECS)} charts generated in {args.output}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
