# Workflow: Process Costing File

## Objective
Parse a costing file (CSV or Excel), validate its structure, normalize the data, and produce a clean output ready for reporting or analysis.

## Required Inputs
- **file_path**: Path to the costing file (CSV, XLSX, or XLS)
- **output_format** (optional): Output format — `csv` or `xlsx` (default: `csv`)

## Steps

1. **Validate the input file** — Run `tools/validate_data.py` to check the file exists, is readable, and has the expected columns
2. **Parse the file** — Run `tools/parse_costing_file.py` to extract data into a normalized structure
3. **Check for anomalies** — Review the parsed output for missing values, negative costs, or duplicate entries
4. **Save output** — Write the cleaned data to `output/`

## Tools Used
| Tool | Purpose |
|------|---------|
| `tools/validate_data.py` | Validates file structure and data integrity |
| `tools/parse_costing_file.py` | Parses and normalizes costing file data |

## Expected Output
- Cleaned CSV/XLSX file in `output/` with normalized column names and validated data
- Validation report printed to stdout

## Edge Cases
- **Missing columns**: Tool logs which columns are missing and exits with error
- **Empty file**: Detected during validation, exits with clear error message
- **Mixed data types in cost column**: Tool attempts numeric coercion, flags non-numeric rows
- **Duplicate entries**: Flagged in output but not removed (user decides)

## Lessons Learned
- All output Excel cells must be pre-computed values (no formulas) — openpyxl formulas cause errors in Excel Online/GitHub preview
- External links and comments must be stripped from output xlsx to prevent "found a problem" errors
- See `LEARNINGS.md` for accumulated cross-project lessons
