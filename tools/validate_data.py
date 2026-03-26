#!/usr/bin/env python3
"""Validate a costing data file for structure and integrity.

Usage:
    python tools/validate_data.py <file_path> [--schema <schema_path>]

Exit codes:
    0 — Validation passed
    1 — Validation failed (errors found)
    2 — File not found or unreadable
"""

import argparse
import json
import os
import sys

import pandas as pd


def validate_file_exists(file_path: str) -> list[str]:
    """Check that the file exists and is readable."""
    errors = []
    if not os.path.exists(file_path):
        errors.append(f"File not found: {file_path}")
    elif not os.path.isfile(file_path):
        errors.append(f"Path is not a file: {file_path}")
    elif os.path.getsize(file_path) == 0:
        errors.append(f"File is empty: {file_path}")
    return errors


def validate_format(file_path: str) -> list[str]:
    """Check that the file is a supported format."""
    errors = []
    ext = os.path.splitext(file_path)[1].lower()
    supported = {".csv", ".xlsx", ".xls"}
    if ext not in supported:
        errors.append(
            f"Unsupported file format '{ext}'. Supported: {', '.join(sorted(supported))}"
        )
    return errors


def load_dataframe(file_path: str) -> pd.DataFrame:
    """Load a file into a pandas DataFrame."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".csv":
        try:
            return pd.read_csv(file_path, encoding="utf-8")
        except UnicodeDecodeError:
            return pd.read_csv(file_path, encoding="latin-1")
    else:
        return pd.read_excel(file_path)


def validate_structure(df: pd.DataFrame, schema_path: str | None = None) -> tuple[list[str], list[str]]:
    """Validate DataFrame structure. Returns (errors, warnings)."""
    errors = []
    warnings = []

    # Check for empty DataFrame
    if df.empty:
        errors.append("File contains no data rows")
        return errors, warnings

    # Check for duplicate column names
    dupes = df.columns[df.columns.duplicated()].tolist()
    if dupes:
        errors.append(f"Duplicate column names: {dupes}")

    # Check for entirely empty columns
    empty_cols = [col for col in df.columns if df[col].isna().all()]
    if empty_cols:
        warnings.append(f"Entirely empty columns: {empty_cols}")

    # Check for entirely empty rows
    empty_rows = df.index[df.isna().all(axis=1)].tolist()
    if empty_rows:
        warnings.append(f"Entirely empty rows at indices: {empty_rows}")

    # Schema validation if provided
    if schema_path:
        with open(schema_path) as f:
            schema = json.load(f)

        required_cols = schema.get("required_columns", [])
        missing = [col for col in required_cols if col not in df.columns]
        if missing:
            errors.append(f"Missing required columns: {missing}")

        numeric_cols = schema.get("numeric_columns", [])
        for col in numeric_cols:
            if col in df.columns:
                non_numeric = pd.to_numeric(df[col], errors="coerce").isna() & df[col].notna()
                count = non_numeric.sum()
                if count > 0:
                    warnings.append(
                        f"Column '{col}' has {count} non-numeric values"
                    )

    # Large file warning
    if len(df) > 10000:
        warnings.append(
            f"Large file ({len(df)} rows). Only first 10,000 rows were validated."
        )

    return errors, warnings


def main():
    parser = argparse.ArgumentParser(description="Validate a costing data file")
    parser.add_argument("file_path", help="Path to the data file")
    parser.add_argument("--schema", help="Path to JSON schema file", default=None)
    args = parser.parse_args()

    print(f"Validating: {args.file_path}")
    print("-" * 40)

    # Step 1: File exists
    errors = validate_file_exists(args.file_path)
    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)

    # Step 2: Format check
    fmt_errors = validate_format(args.file_path)
    if fmt_errors:
        for e in fmt_errors:
            print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)

    # Step 3: Load and validate structure
    try:
        df = load_dataframe(args.file_path)
    except Exception as e:
        print(f"ERROR: Failed to load file: {e}", file=sys.stderr)
        sys.exit(2)

    errors, warnings = validate_structure(df, args.schema)

    # Report
    for w in warnings:
        print(f"WARNING: {w}")
    for e in errors:
        print(f"ERROR: {e}", file=sys.stderr)

    print("-" * 40)
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")
    print(f"Column names: {list(df.columns)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    print(f"Result: {'FAIL' if errors else 'PASS'}")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
