# Costing File TMT

A costing file management system built on the **WAT framework** (Workflows, Agents, Tools).

## Architecture

```
Costing-File-TMT/
├── workflows/       # Markdown SOPs — the instructions
├── tools/           # Python scripts — the execution layer
├── data/            # Input data (costing files, templates)
├── output/          # Generated outputs (reports, processed files)
├── .env.example     # Template for environment variables
└── CLAUDE.md        # Agent operating instructions
```

### How It Works

| Layer      | Role                  | Location      |
|------------|-----------------------|---------------|
| Workflows  | Define what to do     | `workflows/`  |
| Agent      | Decides how to do it  | Claude / AI   |
| Tools      | Execute deterministic | `tools/`      |

**Workflows** are plain-language SOPs that describe objectives, inputs, tools, outputs, and edge cases.

**The Agent** reads the relevant workflow, runs tools in sequence, handles failures, and asks clarifying questions when needed.

**Tools** are Python scripts that handle API calls, data transformations, file operations, and calculations. They are consistent, testable, and fast.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials
2. Install dependencies: `pip install -r requirements.txt`
3. Review workflows in `workflows/` to understand available operations
4. Run tools via the agent or directly from the command line

## Workflow Index

| Workflow | Description |
|----------|-------------|
| [process_costing_file.md](workflows/process_costing_file.md) | Parse and validate costing file data |
| [generate_cost_report.md](workflows/generate_cost_report.md) | Generate formatted cost reports |
| [validate_data.md](workflows/validate_data.md) | Validate input data integrity |
