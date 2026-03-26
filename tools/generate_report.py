#!/usr/bin/env python3
"""Generate a cost report from processed costing data.

Usage:
    python tools/generate_report.py <input_path> [--type summary|detailed|breakdown] [--group-by <column>] [--output <path>]

Exit codes:
    0 — Success
    1 — Processing error
    2 — File not found or invalid input
"""

import argparse
import os
import sys

import pandas as pd


def load_data(file_path: str) -> pd.DataFrame:
    """Load a processed costing file."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        return pd.read_csv(file_path)
    else:
        return pd.read_excel(file_path)


def find_cost_columns(df: pd.DataFrame) -> list[str]:
    """Identify columns that likely contain cost data."""
    cost_keywords = ["cost", "price", "amount", "total", "rate", "fee", "charge"]
    cost_cols = []
    for col in df.columns:
        col_lower = col.lower()
        if any(kw in col_lower for kw in cost_keywords):
            if pd.api.types.is_numeric_dtype(df[col]):
                cost_cols.append(col)
    # Fallback: use all numeric columns
    if not cost_cols:
        cost_cols = df.select_dtypes(include="number").columns.tolist()
    return cost_cols


def summary_report(df: pd.DataFrame, cost_cols: list[str]) -> str:
    """Generate a summary report."""
    lines = ["=" * 50, "COST SUMMARY REPORT", "=" * 50, ""]
    lines.append(f"Total records: {len(df)}")
    lines.append("")

    for col in cost_cols:
        lines.append(f"--- {col} ---")
        lines.append(f"  Total:   {df[col].sum():,.2f}")
        lines.append(f"  Mean:    {df[col].mean():,.2f}")
        lines.append(f"  Median:  {df[col].median():,.2f}")
        lines.append(f"  Min:     {df[col].min():,.2f}")
        lines.append(f"  Max:     {df[col].max():,.2f}")
        lines.append(f"  Std Dev: {df[col].std():,.2f}")
        null_count = df[col].isna().sum()
        if null_count > 0:
            lines.append(f"  Missing: {null_count}")
        lines.append("")

    lines.append("=" * 50)
    return "\n".join(lines)


def breakdown_report(df: pd.DataFrame, cost_cols: list[str], group_by: str) -> str:
    """Generate a breakdown report grouped by a column."""
    if group_by not in df.columns:
        available = list(df.columns)
        return f"ERROR: Column '{group_by}' not found. Available columns: {available}"

    lines = ["=" * 50, f"COST BREAKDOWN BY: {group_by.upper()}", "=" * 50, ""]

    for col in cost_cols:
        grouped = df.groupby(group_by)[col].agg(["sum", "mean", "count"])
        grouped = grouped.sort_values("sum", ascending=False)

        lines.append(f"--- {col} ---")
        for name, row in grouped.iterrows():
            lines.append(f"  {name}:")
            lines.append(f"    Total: {row['sum']:,.2f}  |  Avg: {row['mean']:,.2f}  |  Count: {int(row['count'])}")
        lines.append("")

    lines.append("=" * 50)
    return "\n".join(lines)


def detailed_report(df: pd.DataFrame, cost_cols: list[str]) -> str:
    """Generate a detailed report with per-row data."""
    lines = ["=" * 50, "DETAILED COST REPORT", "=" * 50, ""]
    lines.append(f"Total records: {len(df)}")
    lines.append(f"Columns: {list(df.columns)}")
    lines.append("")

    # Summary stats first
    lines.append(summary_report(df, cost_cols))
    lines.append("")

    # First 20 rows as preview
    lines.append("--- First 20 Records ---")
    lines.append(df.head(20).to_string(index=False))
    lines.append("")
    lines.append("=" * 50)
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Generate a cost report")
    parser.add_argument("input_path", help="Path to processed costing file")
    parser.add_argument(
        "--type", "-t",
        choices=["summary", "detailed", "breakdown"],
        default="summary",
        help="Report type (default: summary)",
    )
    parser.add_argument(
        "--group-by", "-g",
        help="Column to group by (required for breakdown report)",
        default=None,
    )
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: print to stdout)",
        default=None,
    )
    args = parser.parse_args()

    if args.type == "breakdown" and not args.group_by:
        print("ERROR: --group-by is required for breakdown reports", file=sys.stderr)
        sys.exit(1)

    try:
        df = load_data(args.input_path)
    except Exception as e:
        print(f"ERROR: Failed to load file: {e}", file=sys.stderr)
        sys.exit(2)

    if df.empty:
        print("No matching records — file is empty.", file=sys.stderr)
        sys.exit(0)

    cost_cols = find_cost_columns(df)
    if not cost_cols:
        print("WARNING: No numeric columns found for cost analysis", file=sys.stderr)

    # Generate report
    if args.type == "summary":
        report = summary_report(df, cost_cols)
    elif args.type == "breakdown":
        report = breakdown_report(df, cost_cols, args.group_by)
    elif args.type == "detailed":
        report = detailed_report(df, cost_cols)

    # Output
    if args.output:
        os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
        with open(args.output, "w") as f:
            f.write(report)
        print(f"Report saved to: {args.output}", file=sys.stderr)
    else:
        print(report)

    sys.exit(0)


if __name__ == "__main__":
    main()
