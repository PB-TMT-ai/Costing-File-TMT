# Workflow: Generate Cost Report

## Objective
Take processed costing data and generate a formatted summary report with totals, breakdowns by category, and optional visualizations.

## Required Inputs
- **input_path**: Path to a processed/cleaned costing file (output of process_costing_file workflow)
- **report_type** (optional): `summary`, `detailed`, or `breakdown` (default: `summary`)
- **group_by** (optional): Column name to group costs by (e.g., `category`, `department`)

## Steps

1. **Load processed data** — Read the cleaned costing file
2. **Aggregate** — Run `tools/generate_report.py` to compute totals, averages, and breakdowns
3. **Format output** — Generate the report in the requested format
4. **Save** — Write report to `output/`

## Tools Used
| Tool | Purpose |
|------|---------|
| `tools/generate_report.py` | Aggregates data and produces formatted reports |

## Expected Output
- Report file in `output/` (CSV for data, or text summary to stdout)
- Summary statistics: total cost, average cost, count of line items, breakdown by group

## Edge Cases
- **No data after filtering**: Report states "No matching records" rather than failing
- **Invalid group_by column**: Lists available columns and exits with error
- **Very large files**: Processes in chunks to avoid memory issues

## Lessons Learned
- _(Update this section as you encounter issues)_
