#!/usr/bin/env python3
"""Parse and normalize a costing file into a clean format.

Usage:
    python tools/parse_costing_file.py <file_path> [--output <output_path>] [--format csv|xlsx]

Exit codes:
    0 — Success
    1 — Processing error
    2 — File not found or unreadable
"""

import argparse
import os
import sys

import pandas as pd


def load_file(file_path: str) -> pd.DataFrame:
    """Load a costing file into a DataFrame."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        try:
            return pd.read_csv(file_path, encoding="utf-8")
        except UnicodeDecodeError:
            return pd.read_csv(file_path, encoding="latin-1")
    else:
        return pd.read_excel(file_path)


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names: lowercase, strip whitespace, replace spaces with underscores."""
    df.columns = (
        df.columns.str.strip()
        .str.lower()
        .str.replace(r"[^\w]+", "_", regex=True)
        .str.strip("_")
    )
    return df


def clean_data(df: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    """Clean the data and return (cleaned_df, warnings)."""
    warnings = []

    # Remove entirely empty rows
    empty_mask = df.isna().all(axis=1)
    empty_count = empty_mask.sum()
    if empty_count > 0:
        df = df[~empty_mask].reset_index(drop=True)
        warnings.append(f"Removed {empty_count} empty rows")

    # Strip whitespace from string columns
    for col in df.select_dtypes(include=["object"]).columns:
        df[col] = df[col].str.strip()

    # Attempt numeric coercion on columns that look like costs
    cost_keywords = ["cost", "price", "amount", "total", "rate", "fee", "charge"]
    for col in df.columns:
        if any(kw in col for kw in cost_keywords):
            original = df[col].copy()
            df[col] = pd.to_numeric(df[col], errors="coerce")
            coerced = original.notna() & df[col].isna()
            count = coerced.sum()
            if count > 0:
                warnings.append(
                    f"Column '{col}': {count} values could not be converted to numeric"
                )

    # Flag duplicates
    dupes = df.duplicated()
    dupe_count = dupes.sum()
    if dupe_count > 0:
        warnings.append(f"Found {dupe_count} duplicate rows (kept, not removed)")

    return df, warnings


def save_output(df: pd.DataFrame, output_path: str, fmt: str) -> None:
    """Save DataFrame to file."""
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    if fmt == "xlsx":
        df.to_excel(output_path, index=False)
    else:
        df.to_csv(output_path, index=False)


def main():
    parser = argparse.ArgumentParser(description="Parse and normalize a costing file")
    parser.add_argument("file_path", help="Path to the costing file")
    parser.add_argument(
        "--output", "-o",
        help="Output file path (default: output/parsed_<filename>)",
        default=None,
    )
    parser.add_argument(
        "--format", "-f",
        choices=["csv", "xlsx"],
        default="csv",
        help="Output format (default: csv)",
    )
    args = parser.parse_args()

    # Determine output path
    if args.output:
        output_path = args.output
    else:
        basename = os.path.splitext(os.path.basename(args.file_path))[0]
        ext = ".xlsx" if args.format == "xlsx" else ".csv"
        output_path = os.path.join("output", f"parsed_{basename}{ext}")

    print(f"Parsing: {args.file_path}", file=sys.stderr)

    try:
        df = load_file(args.file_path)
    except Exception as e:
        print(f"ERROR: Failed to load file: {e}", file=sys.stderr)
        sys.exit(2)

    df = normalize_columns(df)
    df, warnings = clean_data(df)

    for w in warnings:
        print(f"WARNING: {w}", file=sys.stderr)

    save_output(df, output_path, args.format)
    print(f"Output saved to: {output_path}", file=sys.stderr)
    print(f"Rows: {len(df)}, Columns: {len(df.columns)}", file=sys.stderr)

    sys.exit(0)


if __name__ == "__main__":
    main()
