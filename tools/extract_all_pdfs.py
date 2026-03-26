#!/usr/bin/env python3
"""Extract prices from all BigMint PDFs for batch processing."""

import json
import re
import sys

import fitz


def parse_number(s):
    """Parse a number string like '37,250' or '75,500' to float."""
    s = s.strip().replace(",", "").replace(" ", "")
    if s in ("-", "", "NA"):
        return None
    # Remove leading +/- signs that are change indicators
    return float(s)


def extract_date(doc):
    """Extract report date from cover page."""
    text = doc[0].get_text()
    # Look for pattern like "26 Mar 2026"
    m = re.search(r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})', text)
    if m:
        from datetime import datetime
        date_str = f"{m.group(1)} {m.group(2)} {m.group(3)}"
        dt = datetime.strptime(date_str, "%d %b %Y")
        return dt.strftime("%Y-%m-%d")
    return None


def find_sponge_data(doc):
    """Extract Pallet DRI (P-DRI) and Iron Ore DRI (C-DRI) for Central India/Raipur."""
    pallet_dri = None
    iron_ore_dri = None

    for page in doc:
        text = page.get_text()
        if "Sponge (India)" not in text or "Central India" not in text:
            continue

        lines = text.split("\n")
        # Find "Central India" followed by "Raipur" and extract values
        for i, line in enumerate(lines):
            if "Central India" in line:
                # Check if next line is Raipur
                if i + 1 < len(lines) and "Raipur" in lines[i + 1]:
                    # After "Raipur", collect numbers
                    nums = []
                    for j in range(i + 2, min(i + 20, len(lines))):
                        val = lines[j].strip().replace(",", "").replace(" ", "")
                        # Match price-like numbers (4-6 digits)
                        if re.match(r'^[\d,]+$', lines[j].strip().replace(",", "")) and len(val) >= 4:
                            nums.append(float(val))
                        elif val in ("-", "+", "0") or re.match(r'^[+-]\s*[\d,]+', lines[j].strip()):
                            nums.append(None)  # change/wow/1m values
                        elif "Central India" in lines[j] or "South India" in lines[j] or "East" in lines[j] or "All prices" in lines[j]:
                            break

                    # First valid large number is C-DRI price, numbers after changes are P-DRI price
                    # Structure: C-DRI_price, change, wow, 1m, P-DRI_price, change, wow, 1m
                    if nums:
                        iron_ore_dri = nums[0]  # First number = C-DRI
                        # Find the next large number (P-DRI)
                        large_nums = [n for n in nums if n is not None and n > 10000]
                        if len(large_nums) >= 2:
                            pallet_dri = large_nums[1]
                        elif len(large_nums) == 1:
                            iron_ore_dri = large_nums[0]
                    break
        if pallet_dri is not None:
            break

    return pallet_dri, iron_ore_dri


def find_sponge_data_v2(doc):
    """More robust extraction using the table structure."""
    for page in doc:
        text = page.get_text()
        if "Sponge (India)" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]

        # Find Central India / Raipur section
        for i, line in enumerate(lines):
            if line == "Central India" and i + 1 < len(lines) and lines[i + 1] == "Raipur":
                # Collect all numbers after "Raipur" until next region
                raw_vals = []
                for j in range(i + 2, min(i + 30, len(lines))):
                    l = lines[j]
                    if l in ("South India", "Eastern India", "East India", "North India", "All prices are basic, GST extra."):
                        break
                    # Try to parse as number
                    cleaned = l.replace(",", "").replace(" ", "")
                    if re.match(r'^-?\d+$', cleaned) and abs(int(cleaned)) >= 1000:
                        raw_vals.append(int(cleaned))
                    elif cleaned == "-":
                        raw_vals.append(None)
                    elif re.match(r'^[+-]\s*[\d,]+', l):
                        pass  # skip change values
                    elif cleaned == "0":
                        pass  # skip zero changes

                # The raw_vals should be: [C-DRI_price, ...changes..., P-DRI_price, ...changes...]
                # But we stored only large absolute values and dashes
                # Actually let me use a different approach - get ALL tokens
                all_tokens = []
                for j in range(i + 2, min(i + 30, len(lines))):
                    l = lines[j]
                    if l in ("South India", "Eastern India", "East India", "North India", "All prices are basic, GST extra."):
                        break
                    all_tokens.append(l)

                # Parse: price, change, w-o-w, 1m, price, change, w-o-w, 1m
                prices = []
                for t in all_tokens:
                    cleaned = t.replace(",", "").replace(" ", "")
                    if re.match(r'^\d{4,6}$', cleaned):
                        prices.append(int(cleaned))

                if len(prices) >= 2:
                    return prices[1], prices[0]  # P-DRI, C-DRI
                elif len(prices) == 1:
                    # Only one available (might be C-DRI only)
                    return None, prices[0]

                break
    return None, None


def find_pig_iron(doc):
    """Extract Pig Iron price for DAP-Raipur Steel Grade."""
    for page in doc:
        text = page.get_text()
        if "Pig Iron (India)" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]
        for i, line in enumerate(lines):
            if line == "DAP-Raipur" and i + 1 < len(lines) and "Steel Grade" in lines[i + 1]:
                # Find first large number after this
                for j in range(i + 2, min(i + 10, len(lines))):
                    cleaned = lines[j].replace(",", "").replace(" ", "")
                    if re.match(r'^\d{4,6}$', cleaned):
                        return int(cleaned)
        break
    return None


def find_scrap(doc, location="DAP-Raipur"):
    """Extract Melting Scrap HMS(80:20) price for given location."""
    # Handle both old ("Ex-Raipur"/"Ex-Mandi") and new ("DAP-Raipur"/"DAP-Mandi") naming
    alt_locations = {
        "DAP-Raipur": ["DAP-Raipur", "Ex-Raipur"],
        "DAP-Mandi": ["DAP-Mandi", "Ex-Mandi"],
    }
    search_names = alt_locations.get(location, [location])

    for page in doc:
        text = page.get_text()
        if "Melting Scrap" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]
        for i, line in enumerate(lines):
            if line in search_names:
                # Look for HMS(80:20) within 25 lines (multiple products may precede it)
                for j in range(i + 1, min(i + 25, len(lines))):
                    # Stop if we hit another location header
                    if lines[j].startswith("DAP-") or lines[j].startswith("Ex-") and lines[j] not in ("Ex-Works", "Ex-Yard", "Ex-Plant"):
                        if lines[j] not in search_names:
                            break
                    if "HMS(80:20)" in lines[j] or "HMS (80:20)" in lines[j]:
                        # Find first large number after HMS
                        for k in range(j + 1, min(j + 8, len(lines))):
                            cleaned = lines[k].replace(",", "").replace(" ", "")
                            if re.match(r'^\d{4,6}$', cleaned):
                                return int(cleaned)
                        break
        break
    return None


def find_silico_mn(doc):
    """Extract Silico Manganese price for Ex-Raipur 25-150mm HC 60-14."""
    for page in doc:
        text = page.get_text()
        if "Silico Manganese (India)" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]
        for i, line in enumerate(lines):
            if line == "Ex-Raipur":
                # Look for 25-150 mm HC 60-14 within 15 lines (other products may appear first)
                for j in range(i + 1, min(i + 15, len(lines))):
                    if "25-150" in lines[j] and ("HC 60-14" in lines[j] or "60-14" in lines[j]):
                        # Find first large number
                        for k in range(j + 1, min(j + 8, len(lines))):
                            cleaned = lines[k].replace(",", "").replace(" ", "")
                            if re.match(r'^\d{4,6}$', cleaned):
                                return int(cleaned)
                        break
                    # Stop if we hit another location
                    if lines[j].startswith("Ex-") and lines[j] not in ("Ex-Works", "Ex-Yard", "Ex-Plant"):
                        break
        break
    return None


def find_billet(doc, region="Central India", particular="Raipur"):
    """Extract Billet price from Ingot/Billet table."""
    for page in doc:
        text = page.get_text()
        if "Ingot/Billet" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]

        # Find the region/particular row
        for i, line in enumerate(lines):
            if line == region and i + 1 < len(lines) and particular in lines[i + 1]:
                # Collect all numbers in the row
                prices = []
                for j in range(i + 2, min(i + 25, len(lines))):
                    l = lines[j]
                    if l in ("North India", "East India", "Central India", "West India",
                             "South India", "Eastern India", "All prices", "Rebar"):
                        break
                    cleaned = l.replace(",", "").replace(" ", "")
                    if re.match(r'^\d{4,6}$', cleaned):
                        prices.append(int(cleaned))

                # Structure: INGOT_price, changes(3), BILLET_price, changes(3)
                # For some rows only INGOT or only BILLET exists
                if len(prices) >= 2:
                    # Second large number is BILLET (first is INGOT)
                    return prices[1]
                elif len(prices) == 1:
                    return prices[0]
                break
        break
    return None


def find_billet_v2(doc, region="Central India", particular="Raipur"):
    """Extract Billet price - handles both INGOT+BILLET and BILLET-only rows."""
    for page in doc:
        text = page.get_text()
        if "Ingot/Billet" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]

        for i, line in enumerate(lines):
            if line == region and i + 1 < len(lines) and particular in lines[i + 1]:
                # Collect all tokens until next region
                tokens = []
                for j in range(i + 2, min(i + 25, len(lines))):
                    l = lines[j]
                    if l in ("North India", "East India", "Central India", "West India",
                             "South India", "Eastern India", "All prices", "Rebar"):
                        break
                    tokens.append(l)

                # Parse all numbers (prices and changes)
                all_nums = []
                for t in tokens:
                    cleaned = t.replace(",", "").replace(" ", "")
                    if re.match(r'^\d{4,6}$', cleaned):
                        all_nums.append(int(cleaned))
                    elif cleaned == "-":
                        all_nums.append(None)
                    # Changes like "+ 500" or "- 200" are skipped

                # For rows with both INGOT and BILLET:
                # [ingot_price, change, wow, 1m, billet_price, change, wow, 1m]
                # Large prices are > 30000 typically
                big_prices = [n for n in all_nums if n is not None and n > 30000]

                if len(big_prices) >= 2:
                    return big_prices[1]  # BILLET is second
                elif len(big_prices) == 1:
                    return big_prices[0]

                break
        break
    return None


def find_tmt(doc, location="Ex-Raipur"):
    """Extract TMT (Rebar) price for given location, IF Route, Fe 500, IS 1786."""
    for page in doc:
        text = page.get_text()
        if "Rebar (India)" not in text or location not in text or "IF Route" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]

        # Search for the IF Route section (not BF Route)
        in_if_section = False
        for i, line in enumerate(lines):
            if location in line:
                # Check if nearby lines mention "IF Route" and "Fe 500" (not Fe 500D)
                context = " ".join(lines[i:i + 4])
                if "IF Route" in context and "Fe 500" in context:
                    # Check it's Fe 500 IS 1786 (not Fe 500D)
                    if "Fe 500D" in context and location == "Ex-Raipur":
                        continue  # Skip Fe 500D, look for Fe 500
                    # Find the price - first large number
                    for j in range(i + 2, min(i + 10, len(lines))):
                        cleaned = lines[j].replace(",", "").replace(" ", "")
                        if re.match(r'^\d{4,6}$', cleaned):
                            return int(cleaned)
    return None


def find_tmt_v2(doc, location="Ex-Raipur"):
    """More robust TMT extraction - searches the Rebar IF Route section."""
    for page in doc:
        text = page.get_text()
        if "Rebar (India)" not in text or "IF Route" not in text:
            continue

        lines = [l.strip() for l in text.split("\n")]

        # For Ex-Raipur: find the location, then scan for "Fe 500, IS 1786" (not Fe 500D)
        # The structure is: Ex-Raipur -> Fe 500D entry -> Fe 500 entry (continuation)
        found_location = False
        for i, line in enumerate(lines):
            if line == location or line.startswith(location):
                window = " ".join(lines[i:i + 5])
                if "IF Route" not in window:
                    continue
                found_location = True
                # Scan forward for the right Fe grade
                j = i + 1
                while j < min(i + 25, len(lines)):
                    grade_line = lines[j]
                    if "IF Route" in grade_line and "Fe 500" in grade_line:
                        if location == "Ex-Raipur" and "Fe 500D" in grade_line:
                            # Skip Fe 500D entry - jump past its data
                            j += 1
                            continue
                        # Found the right entry - get first 5-digit price
                        for k in range(j + 1, min(j + 8, len(lines))):
                            cleaned = lines[k].replace(",", "").replace(" ", "")
                            if re.match(r'^\d{5,6}$', cleaned):
                                return int(cleaned)
                    # Stop if we hit another location
                    if j > i and (lines[j].startswith("Ex-") and lines[j] not in ("Ex-Works", "Ex-Yard", "Ex-Plant")):
                        if lines[j] != location:
                            break
                    j += 1
                if found_location:
                    break

    return None


def extract_from_pdf(pdf_path):
    """Extract all 11 data points from a BigMint PDF."""
    doc = fitz.open(pdf_path)

    report_date = extract_date(doc)

    # Try v2 first (more robust), fall back to v1
    pallet_dri, iron_ore_dri = find_sponge_data_v2(doc)
    if pallet_dri is None or iron_ore_dri is None:
        p, i = find_sponge_data(doc)
        pallet_dri = pallet_dri or p
        iron_ore_dri = iron_ore_dri or i

    pig_iron = find_pig_iron(doc)
    scrap_raipur = find_scrap(doc, "DAP-Raipur")
    scrap_mandi = find_scrap(doc, "DAP-Mandi")
    silico_mn_ton = find_silico_mn(doc)

    billet_raipur = find_billet_v2(doc, "Central India", "Raipur")
    billet_mandi = find_billet_v2(doc, "North India", "Mandi Gobindgarh")

    tmt_raipur = find_tmt_v2(doc, "Ex-Raipur")
    if tmt_raipur is None:
        tmt_raipur = find_tmt(doc, "Ex-Raipur")

    tmt_ncr = find_tmt_v2(doc, "Ex-Delhi/NCR")
    if tmt_ncr is None:
        tmt_ncr = find_tmt(doc, "Ex-Delhi/NCR")

    doc.close()

    return {
        "report_date": report_date,
        "pallet_dri": pallet_dri,
        "pig_iron": pig_iron,
        "scrap_raipur": scrap_raipur,
        "silico_mn_ton": silico_mn_ton,
        "silico_mn_kg": round(silico_mn_ton / 1000, 2) if silico_mn_ton else None,
        "iron_ore_dri": iron_ore_dri,
        "billet_raipur": billet_raipur,
        "tmt_raipur": tmt_raipur,
        "scrap_mandi": scrap_mandi,
        "billet_mandi": billet_mandi,
        "tmt_ncr": tmt_ncr,
    }


if __name__ == "__main__":
    pdfs = [
        "BigMint_Daily_Report_as_on_31_Oct_2025_1761888015199_359.pdf",
        "BigMint_Daily_Report_as_on_29_Nov_2025_1764392036835_558.pdf",
        "BigMint_Daily_Report_as_on_20_Dec_2025_1766206695495_135.pdf",
        "BigMint_Daily_Report_as_on_15_Jan_2026_1768444629402_396.pdf",
        "BigMint_Daily_Report_as_on_30_Jan_2026_1769750135777_127.pdf",
        "BigMint_Daily_Report_as_on_13_Feb_2026_1770953142120_643.pdf",
        "BigMint_Daily_Report_as_on_27_Feb_2026_1772168610808_71.pdf",
        "BigMint_Daily_Report_as_on_17_Mar_2026_1773722780192_230.pdf",
        "data/BigMint_Daily_Report_as_on_23_Mar_2026_1774243648079_567.pdf",
        "data/BigMint_Daily_Report_as_on_26_Mar_2026_1774502910818_548.pdf",
    ]

    results = []
    for pdf in pdfs:
        try:
            data = extract_from_pdf(pdf)
            results.append({"file": pdf, **data})
            print(f"OK: {pdf} -> {data['report_date']}", file=sys.stderr)
        except Exception as e:
            print(f"ERROR: {pdf} -> {e}", file=sys.stderr)
            results.append({"file": pdf, "error": str(e)})

    # Print JSON for programmatic use
    print(json.dumps(results, indent=2))
