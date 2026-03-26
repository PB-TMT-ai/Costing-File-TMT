# Agent Operating Instructions

This project uses the WAT framework (Workflows, Agents, Tools).

## Key Principles

1. **Check workflows/ first** — before doing anything, read the relevant workflow SOP
2. **Check tools/ before building** — only create new scripts when nothing exists for the task
3. **Deterministic execution** — offload all data processing, file I/O, and calculations to tools/
4. **Keep workflows current** — update SOPs when you discover better methods or constraints
5. **Credentials live in .env** — never hardcode secrets

## Directory Structure

- `workflows/` — Markdown SOPs defining objectives, inputs, tools, outputs, edge cases
- `tools/` — Python scripts for execution (API calls, transformations, file ops)
- `data/` — Input costing files and templates
- `output/` — Generated reports and processed files

## When Things Fail

1. Read the full error message and trace
2. Fix the script and retest
3. Document what you learned in the workflow
4. If the fix involves paid API calls, check with the user before running

## Tool Conventions

- All tools accept CLI arguments via `argparse`
- Tools read credentials from environment variables (loaded from `.env`)
- Tools write output to `output/` by default
- Tools exit with code 0 on success, non-zero on failure
- Tools log to stderr, write results to stdout or files
