# Costing File TMT

A costing file management system built on the **WAT framework** (Workflows, Agents, Tools).

## Architecture

```
Costing-File-TMT/
├── workflows/           # Markdown SOPs — the instructions
├── tools/               # Python scripts — the execution layer
├── .claude/skills/      # Claude Code skills (slash commands)
├── data/                # Input data (costing files, templates)
├── output/              # Generated outputs (date-wise folders + change log + graphs)
│   ├── YYYY-MM-DD/      # Daily output folders
│   ├── change_log.xlsx  # Cumulative price & margin history
│   └── material_change_graphs.pptx  # JSW One branded MoM change charts
├── .env.example         # Template for environment variables
├── LEARNINGS.md         # Accumulated lessons and gotchas
└── CLAUDE.md            # Agent operating instructions
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
| [update_costing_from_pdf.md](workflows/update_costing_from_pdf.md) | **Primary** — Extract prices from BigMint PDF and update costing Excel |
| [process_costing_file.md](workflows/process_costing_file.md) | Parse and validate costing file data |
| [generate_cost_report.md](workflows/generate_cost_report.md) | Generate formatted cost reports |
| [validate_data.md](workflows/validate_data.md) | Validate input data integrity |
| [generate_change_graphs.md](workflows/generate_change_graphs.md) | Generate JSW One branded PPTX with MoM change charts |

## Tools Index

| Tool | Description |
|------|-------------|
| `tools/update_costing_file.py` | Compute all values, verify zero formulas, save to date folder, append change log, auto-push to main |
| `tools/format_output.py` | Apply professional formatting to costing sheets and change log |
| `tools/validate_data.py` | Validate file structure and data integrity |
| `tools/parse_costing_file.py` | Parse and normalize costing file data |
| `tools/generate_report.py` | Generate summary/detailed/breakdown cost reports |
| `tools/create_material_change_graph.py` | Generate JSW One branded PPTX with MoM change bar charts |

## Skills (Slash Commands)

| Command | Description |
|---------|-------------|
| `/update-costing` | End-to-end: extract PDF prices, update Excel, verify, auto-push to main |
| `/verify-costing [date]` | Verify output file values, zero formulas, and change log |
| `/extract-prices [pdf]` | Read-only price extraction from BigMint PDF |
| `/jsw-one-pptx` | JSW One branded PowerPoint generation (board decks, reviews, charts) |

## Key Design Decisions

- **Zero formulas in output** — All cells are pre-computed numbers. Prevents errors in Excel Online / GitHub preview.
- **Auto-push to main** — Output files commit and push automatically after each run. No manual merge needed.
- **Safety check** — Tool scans output after save and fails if any formula strings remain.
- **Clean xlsx** — External links, comments, and stale references are stripped to prevent Excel errors.
- **File chaining** — Each day's update builds on the previous output, not the original template.
- **Image-based charts** — PPTX charts use matplotlib images (not native PptxGenJS charts) for universal viewer compatibility.
- **JSW One branding** — Presentations follow JSW One brand standards (blue `#213366`, grey `#7F7F7F`, Calibri, logo, divider).
- **Learnings documented** — Non-obvious issues and their fixes are recorded in `LEARNINGS.md`.
