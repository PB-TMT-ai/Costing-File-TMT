---
name: extract-prices
description: Extract and display steel market prices from a BigMint Daily Report PDF without modifying any files. Use for quick price checks or review before updating.
allowed-tools: Bash, Read, Glob, Grep
argument-hint: [pdf_filename]
---

# Extract Prices from BigMint PDF (Read-Only)

You are extracting market prices from a BigMint Daily Steel Report PDF and displaying them. **Do NOT modify any files.**

## Step 1: Locate PDF

- If `$ARGUMENTS` is provided, use `data/$ARGUMENTS`
- Otherwise, find the latest `BigMint*.pdf` in `data/`

## Step 2: Extract Report Date

Read page 1 and find the date line (e.g., "26 Mar 2026").

## Step 3: Extract All 11 Data Points

**Automated alternative**: Run `python tools/extract_all_pdfs.py` to auto-extract all 11 data points from all discovered PDFs. It handles both old and new PDF naming conventions and outputs JSON.

**Manual extraction** using pymupdf (`import fitz`) to read text from the PDF. Extract these values:

### From Scrap & Metallic > Sponge (India) table
- **Pallet DRI**: Pellet Sponge (P-DRI) > Central India > Raipur > Price
- **Iron Ore DRI**: Sponge Iron (C-DRI) > Central India > Raipur > Price

### From Pig Iron (India) section
- **Pig Iron**: DAP-Raipur > Steel Grade > Price

### From Melting Scrap (India) section
- **Scrap Raipur**: DAP-Raipur > HMS(80:20) > Price (older PDFs use "Ex-Raipur" instead of "DAP-Raipur")
- **Scrap Mandi**: DAP-Mandi > HMS(80:20) > Price (older PDFs use "Ex-Mandi" instead of "DAP-Mandi")
- **Note**: HMS(80:20) may not be the first product under a location — other products (CR Busheling, LMS) may appear first

### From Silico Manganese (India) section
- **Silico Manganese**: Ex-Raipur > 25-150mm HC 60-14 > Price (this is per ton)

### From Steel > Ingot/Billet table
- **Billet Raipur**: Central India > Raipur > BILLET column > Price
- **Billet Mandi**: North India > Mandi Gobindgarh > BILLET column > Price

### From Rebar (India) section
- **TMT Raipur**: Ex-Raipur > 12-25mm IF Route > Fe 500 IS 1786 > Price (basic, not GST). **Note**: Fe 500D entry appears first — skip it and use the Fe 500 (not Fe 500D) entry
- **TMT NCR**: Ex-Delhi/NCR > 12-25mm IF Route > Fe 500 IS 1786 > Price (basic, not GST)

## Step 4: Display Results

Print a formatted summary table:

```
=== BigMint Price Extraction: <DATE> ===

RAIPUR INPUTS:
  Pallet DRI (P-DRI):      <value> INR/MT
  Pig Iron (DAP-Raipur):   <value> INR/MT
  Scrap (DAP-Raipur):      <value> INR/MT
  Silico Manganese:         <value> INR/ton  ->  <value/1000> INR/kg
  Iron Ore DRI (C-DRI):    <value> INR/MT
  Market Billet (Raipur):   <value> INR/MT
  Market TMT (Raipur):      <value> INR/MT

NCR INPUTS:
  Scrap (DAP-Mandi):       <value> INR/MT  ->  <value-500> after adj
  Market Billet (Mandi):    <value> INR/MT  ->  <value-500> after adj
  Market TMT (NCR):         <value> INR/MT

Report Date: <date>
Source: <pdf_filename>
```

**Do not create or modify any files. This is a read-only operation.**
