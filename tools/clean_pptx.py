#!/usr/bin/env python3
"""Remove orphaned Content_Types references from a PPTX file.

pptxgenjs registers slideMaster entries in [Content_Types].xml that
don't actually exist as files, causing PowerPoint to request repair.
This script strips those orphaned references.

Usage: python tools/clean_pptx.py <pptx_path>
"""

import os
import shutil
import sys
import tempfile
import zipfile
from xml.etree import ElementTree as ET


def clean_pptx(filepath):
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".pptx")
    os.close(tmp_fd)

    with zipfile.ZipFile(filepath, "r") as zin:
        names_set = set(zin.namelist())
        with zipfile.ZipFile(tmp_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                data = zin.read(item.filename)

                if item.filename == "[Content_Types].xml":
                    root = ET.fromstring(data)
                    to_remove = []
                    for el in root:
                        pn = el.get("PartName", "")
                        if pn and pn.startswith("/"):
                            inner = pn[1:]
                            if inner not in names_set:
                                to_remove.append(el)
                    if to_remove:
                        for el in to_remove:
                            root.remove(el)
                        print(f"Removed {len(to_remove)} orphaned references", file=sys.stderr)
                    data = ET.tostring(root, xml_declaration=True, encoding="UTF-8")

                zout.writestr(item, data)

    shutil.move(tmp_path, filepath)
    print(f"Cleaned: {filepath}", file=sys.stderr)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/clean_pptx.py <pptx_path>", file=sys.stderr)
        sys.exit(1)
    clean_pptx(sys.argv[1])
