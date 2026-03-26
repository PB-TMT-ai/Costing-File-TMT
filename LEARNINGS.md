# Learnings

Accumulated lessons from building and maintaining the Costing File TMT system. Update this file whenever a non-obvious issue is encountered and resolved.

---

## PowerPoint / Presentation Generation

### PptxGenJS native charts do not render in all viewers
**Date:** 2026-03-26
**Context:** Built a material change graph tool using PptxGenJS (Node.js) with `slide.addChart()` for native bar charts.
**Problem:** Charts appeared blank/empty when opened in Google Slides and some PowerPoint versions. The XML chart data was correct (verified by inspecting the PPTX zip), but the viewer did not render it.
**Root cause:** PptxGenJS `addChart()` generates XML-based chart objects that require the viewer to render the chart from raw data at open time. Many viewers (Google Slides, LibreOffice, older PowerPoint, web-based viewers) either don't support this rendering or display a blank placeholder.
**Fix:** Switched to **matplotlib-generated chart images (PNG)** embedded on python-pptx slides. Pre-rendered images display universally in every viewer.
**Rule:** For presentations that must work across viewers, always use image-based charts (matplotlib/HTML-to-image), not native PPTX chart objects. Reserve native charts only when editability in PowerPoint desktop is a hard requirement.

### White data labels on white background are invisible
**Date:** 2026-03-26
**Context:** JSW One brand standard specifies white bold data labels inside bars (`dataLabelPosition: 'inEnd'`, `dataLabelColor: 'FFFFFF'`).
**Problem:** For small bars or negative values, white text renders against the white slide background and becomes invisible.
**Fix:** Use `outEnd` position with dark-colored labels (matching chart series color) instead of white `inEnd` labels, especially when bar sizes vary significantly.

### Calibri font not available in matplotlib on Linux
**Date:** 2026-03-26
**Context:** JSW One branding requires Calibri font exclusively.
**Problem:** `matplotlib` on Linux servers does not have Calibri installed, producing hundreds of `findfont: Font family 'Calibri' not found` warnings.
**Fix:** Use `sans-serif` fallback in matplotlib for chart images. The PPTX text elements (headings, labels) still use Calibri correctly via python-pptx since the font is specified declaratively and rendered by the viewer.

---

## Excel / Costing File

### No Excel formulas in output
All output cells must be pre-computed plain numbers. Openpyxl formulas have no cached values and cause errors in Excel Online, GitHub preview, and some viewers.

### External links cause "found a problem" errors
External links, comments, and VML drawings from the source template must be stripped from output xlsx files automatically.

### File chaining is critical
Each daily update must chain from the previous day's output, not the original template. This preserves accumulated computed values and formatting.

### Silico Manganese unit conversion
BigMint PDF reports Silico Manganese in INR/ton. The costing file uses INR/kg. Always divide by 1000.

### NCR adjustments
Scrap and Billet for NCR use a -500 INR adjustment computed in Python. Never rely on cross-sheet Excel formulas.

### Change log column ordering
Processing historical dates out of order produces non-chronological columns. When rebuilding, delete `change_log.xlsx` and reprocess all dates in chronological order.

---

## PDF Extraction

### BigMint PDF structure is consistent but section order varies
Section headers remain stable across daily reports, but page numbers and product ordering within sections may shift. Always search by section header, not page number.

### Multiple product entries under a location
HMS(80:20) may not be the first product under a scrap location. Silico Manganese 25-150mm HC 60-14 may not be first under Ex-Raipur. Search ahead (up to 15-25 lines) for the correct product.

### TMT Raipur has two entries
Fe 500D appears first, then Fe 500 IS 1786. Use the Fe 500 (not Fe 500D) entry.

### Older PDFs use different location names
Pre-2026 PDFs use "Ex-Raipur"/"Ex-Mandi" instead of "DAP-Raipur"/"DAP-Mandi" in the Melting Scrap section.

### PDF filenames vary
Both standard format (`BigMint_Daily_Report_as_on_...`) and timestamp-prefixed format (`1737343182595_iffsptpf8_BigMint_...`) are valid.

---

## General Development

### Use image-based visuals for cross-platform compatibility
Any visual that must display correctly across PowerPoint, Google Slides, web viewers, and mobile should be a pre-rendered image (PNG), not a native editable object. This applies to charts, diagrams, and complex formatted content.

### JSW One PPTX skill uses PptxGenJS (Node.js) for native slides
The skill is installed at `.claude/skills/jsw-one-pptx/` with brand assets, SmartArt library, and reference docs. For chart-heavy slides, combine the JSW One slide layout (python-pptx for branding) with matplotlib chart images for reliable rendering.

### Auto-push and batch processing
Use `SKIP_PUSH=1` environment variable during batch runs to skip the auto-push retry loop (~30s saved per invocation). Push once after all processing is complete.
