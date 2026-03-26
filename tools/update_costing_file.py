#!/usr/bin/env python3
"""Update blue-highlighted cells in the costing Excel file with new prices.

Usage:
    python tools/update_costing_file.py <excel_path> [--output <output_path>] [options]

Raipur tab options:
    --pallet-dri <value>       Pallet DRI price (INR/MT)
    --pig-iron <value>         Pig Iron price (INR/MT)
    --scrap-raipur <value>     Scrap price DAP Raipur (INR/MT)
    --silico-mn <value>        Silico Manganese price (INR/kg)
    --iron-ore-dri <value>     Iron Ore DRI price (INR/MT)
    --report-date <YYYY-MM-DD> Report date
    --billet-raipur <value>    Market price of Billet Raipur (INR/MT)
    --tmt-raipur <value>       Market price of TMT Raipur (INR/MT)

NCR tab options:
    --scrap-mandi <value>      Scrap price DAP Mandi (INR/MT, before -500 adj)
    --billet-mandi <value>     Billet price Mandi Gobindgarh (INR/MT, before -500 adj)
    --tmt-ncr <value>          Market price of TMT NCR (INR/MT)

Exit codes:
    0 — Success
    1 — Error
"""

import argparse
import os
import sys
from datetime import datetime

import openpyxl
from openpyxl.styles import Alignment, Font

# Items tracked in the change log (fixed order)
LOG_ITEMS = [
    "Pallet DRI",
    "Pig Iron",
    "Scrap",
    "Silico Manganese",
    "Iron Ore DRI",
    "Date",
    "Market price Billet",
    "Market price TMT",
]


def update_change_log(args):
    """Create or update the cumulative change log at output/change_log.xlsx."""
    log_path = os.path.join("output", "change_log.xlsx")
    date_str = args.report_date

    # Collect values
    raipur_values = [
        args.pallet_dri,
        args.pig_iron,
        args.scrap_raipur,
        args.silico_mn,
        args.iron_ore_dri,
        args.report_date,
        args.billet_raipur,
        args.tmt_raipur,
    ]

    ncr_values = [
        "-",  # Pallet DRI — auto-calculated from Raipur
        "-",  # Pig Iron — auto-calculated from Raipur
        (args.scrap_mandi - 500) if args.scrap_mandi is not None else None,
        "-",  # Silico Mn — same as Raipur via formula
        "-",  # Iron Ore DRI — auto-calculated from Raipur
        args.report_date,
        (args.billet_mandi - 500) if args.billet_mandi is not None else None,
        args.tmt_ncr,
    ]

    # Load or create workbook
    if os.path.exists(log_path):
        log_wb = openpyxl.load_workbook(log_path)
        ws = log_wb.active
    else:
        log_wb = openpyxl.Workbook()
        ws = log_wb.active
        ws.title = "Change Log"
        # Write item labels
        ws.cell(row=1, column=1, value="Item").font = Font(bold=True)
        for i, item in enumerate(LOG_ITEMS):
            ws.cell(row=i + 3, column=1, value=item)

    # Find existing date column or next available slot
    raipur_col = None
    col = 2
    while ws.cell(row=1, column=col).value is not None:
        if str(ws.cell(row=1, column=col).value) == date_str:
            raipur_col = col
            break
        col += 2
    if raipur_col is None:
        raipur_col = col
    ncr_col = raipur_col + 1

    # Write headers
    bold_center = Font(bold=True)
    center = Alignment(horizontal="center")

    ws.cell(row=1, column=raipur_col, value=date_str).font = bold_center
    ws.cell(row=1, column=raipur_col).alignment = center
    ws.cell(row=2, column=raipur_col, value="Raipur").font = bold_center
    ws.cell(row=2, column=raipur_col).alignment = center
    ws.cell(row=2, column=ncr_col, value="NCR").font = bold_center
    ws.cell(row=2, column=ncr_col).alignment = center

    # Write data (items start at row 3)
    for i, (r_val, n_val) in enumerate(zip(raipur_values, ncr_values)):
        row = i + 3
        if r_val is not None:
            ws.cell(row=row, column=raipur_col, value=r_val)
        if n_val is not None:
            ws.cell(row=row, column=ncr_col, value=n_val)

    # Auto-adjust column widths
    for col_cells in ws.columns:
        max_len = 0
        col_letter = col_cells[0].column_letter
        for cell in col_cells:
            if cell.value is not None:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = max(max_len + 2, 8)

    os.makedirs("output", exist_ok=True)
    log_wb.save(log_path)
    print(f"Change log updated: {log_path}", file=sys.stderr)


def update_workbook(wb, args):
    """Apply price updates to the workbook."""
    updates_applied = []

    # --- Raipur Tab ---
    ws_raipur = wb["Raipur"]

    if args.pallet_dri is not None:
        ws_raipur["E7"] = args.pallet_dri
        updates_applied.append(f"Raipur E7 (Pallet DRI): {args.pallet_dri}")

    if args.pig_iron is not None:
        ws_raipur["E8"] = args.pig_iron
        updates_applied.append(f"Raipur E8 (Pig Iron): {args.pig_iron}")

    if args.scrap_raipur is not None:
        ws_raipur["E9"] = args.scrap_raipur
        updates_applied.append(f"Raipur E9 (Scrap): {args.scrap_raipur}")

    if args.silico_mn is not None:
        ws_raipur["E10"] = args.silico_mn
        updates_applied.append(f"Raipur E10 (Silico Mn): {args.silico_mn}")

    if args.iron_ore_dri is not None:
        ws_raipur["E11"] = args.iron_ore_dri
        updates_applied.append(f"Raipur E11 (Iron Ore DRI): {args.iron_ore_dri}")

    if args.report_date is not None:
        date_val = datetime.strptime(args.report_date, "%Y-%m-%d")
        ws_raipur["C15"] = date_val
        updates_applied.append(f"Raipur C15 (Date): {args.report_date}")

    if args.billet_raipur is not None:
        ws_raipur["I16"] = args.billet_raipur
        updates_applied.append(f"Raipur I16 (Billet Mkt): {args.billet_raipur}")

    if args.tmt_raipur is not None:
        ws_raipur["F34"] = args.tmt_raipur
        updates_applied.append(f"Raipur F34 (TMT Mkt): {args.tmt_raipur}")

    # --- NCR Tab ---
    ws_ncr = wb["NCR"]

    if args.scrap_mandi is not None:
        formula = f"={args.scrap_mandi}-500"
        ws_ncr["D9"] = formula
        updates_applied.append(f"NCR D9 (Scrap): {formula}")

    if args.billet_mandi is not None:
        formula = f"={args.billet_mandi}-500"
        ws_ncr["H16"] = formula
        updates_applied.append(f"NCR H16 (Billet Mkt): {formula}")

    if args.tmt_ncr is not None:
        ws_ncr["F34"] = args.tmt_ncr
        updates_applied.append(f"NCR F34 (TMT Mkt): {args.tmt_ncr}")

    return updates_applied


def main():
    parser = argparse.ArgumentParser(
        description="Update costing Excel file with new prices"
    )
    parser.add_argument("excel_path", help="Path to the costing Excel file")
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: output/<filename>)",
        default=None,
    )

    # Raipur tab
    parser.add_argument("--pallet-dri", type=float, default=None)
    parser.add_argument("--pig-iron", type=float, default=None)
    parser.add_argument("--scrap-raipur", type=float, default=None)
    parser.add_argument("--silico-mn", type=float, default=None)
    parser.add_argument("--iron-ore-dri", type=float, default=None)
    parser.add_argument("--report-date", type=str, default=None)
    parser.add_argument("--billet-raipur", type=float, default=None)
    parser.add_argument("--tmt-raipur", type=float, default=None)

    # NCR tab
    parser.add_argument("--scrap-mandi", type=int, default=None)
    parser.add_argument("--billet-mandi", type=int, default=None)
    parser.add_argument("--tmt-ncr", type=float, default=None)

    args = parser.parse_args()

    if not os.path.exists(args.excel_path):
        print(f"ERROR: File not found: {args.excel_path}", file=sys.stderr)
        sys.exit(1)

    # Determine output path (date-wise folder when report-date is given)
    if args.output:
        output_path = args.output
    else:
        basename = os.path.basename(args.excel_path)
        if args.report_date:
            output_path = os.path.join("output", args.report_date, basename)
        else:
            output_path = os.path.join("output", basename)

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    print(f"Loading: {args.excel_path}", file=sys.stderr)
    wb = openpyxl.load_workbook(args.excel_path)

    updates = update_workbook(wb, args)

    if not updates:
        print("WARNING: No updates specified. Use --help for options.", file=sys.stderr)
        sys.exit(0)

    wb.save(output_path)
    print(f"Saved to: {output_path}", file=sys.stderr)
    print(f"\nApplied {len(updates)} updates:", file=sys.stderr)
    for u in updates:
        print(f"  - {u}", file=sys.stderr)

    # Update cumulative change log
    if args.report_date:
        update_change_log(args)

    sys.exit(0)


if __name__ == "__main__":
    main()
