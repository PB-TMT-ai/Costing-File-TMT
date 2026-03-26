# Workflow: Validate Data

## Objective
Check the integrity and correctness of a costing data file before processing. This workflow is often called as a prerequisite by other workflows.

## Required Inputs
- **file_path**: Path to the data file to validate
- **schema** (optional): Path to a JSON schema file defining expected columns and types

## Steps

1. **Check file exists and is readable**
2. **Check file format** — Ensure it's a supported type (CSV, XLSX, XLS)
3. **Load and inspect** — Run `tools/validate_data.py` to check structure
4. **Report results** — Print validation summary to stdout

## Tools Used
| Tool | Purpose |
|------|---------|
| `tools/validate_data.py` | Core validation logic |

## Validation Checks
- File exists and is not empty
- File format is supported
- Required columns are present (if schema provided)
- No entirely empty rows or columns
- Cost/numeric columns contain valid numbers
- No duplicate header names

## Expected Output
- Validation result: PASS or FAIL with details
- List of warnings (non-blocking issues)
- List of errors (blocking issues)

## Edge Cases
- **Password-protected Excel files**: Detected and reported as unsupported
- **CSV encoding issues**: Tool attempts UTF-8, then falls back to latin-1
- **Very large files (>100MB)**: Validates only the first 10,000 rows with a warning

## Lessons Learned
- _(Update this section as you encounter issues)_
