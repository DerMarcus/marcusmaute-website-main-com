#!/usr/bin/env python3
"""Embed marcus-maute.md into every page's Agent view.

marcusmaute.com has no build step and no per-page templates: each HTML file is
hand-authored. The Agent view (see CLAUDE.md) is the SAME site-wide Markdown
document, marcus-maute.md, embedded identically into every page between two
HTML comment markers:

    <!--AGENT-MD--><script type="text/markdown" id="agent-md">
    ...marcus-maute.md, escaped...
    </script><!--/AGENT-MD-->

This script only refreshes the text between those markers. The surrounding
markup (the nav toggle, the <main id="human-view"> wrapper, the
<main id="agent-view"> block with its heading/buttons/<pre>) is regular,
hand-edited page content and is left untouched.

Run after any change to marcus-maute.md, and after any page edit that could
make the embedded copy stale (e.g. adding a new page whose links belong in
marcus-maute.md's "Every page on this site" list).

Python 3 standard library only.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MD_PATH = ROOT / "marcus-maute.md"

MARKER_RE = re.compile(
    r'<!--AGENT-MD--><script type="text/markdown" id="agent-md">\n.*?\n</script><!--/AGENT-MD-->',
    re.S,
)


def build_block(markdown_text: str) -> str:
    escaped = markdown_text.replace("</script", "<\\/script")
    return (
        '<!--AGENT-MD--><script type="text/markdown" id="agent-md">\n'
        f"{escaped}\n"
        "</script><!--/AGENT-MD-->"
    )


def main() -> int:
    if not MD_PATH.exists():
        print(f"error: {MD_PATH} not found", file=sys.stderr)
        return 1
    markdown_text = MD_PATH.read_text(encoding="utf-8").rstrip("\n")
    block = build_block(markdown_text)

    pages = sorted(p for p in ROOT.rglob("*.html") if "<!--AGENT-MD-->" in p.read_text(encoding="utf-8"))
    if not pages:
        print("warning: no pages with an <!--AGENT-MD--> marker were found", file=sys.stderr)
        return 1

    changed = 0
    for page in pages:
        text = page.read_text(encoding="utf-8")
        if not MARKER_RE.search(text):
            print(f"warning: {page.relative_to(ROOT)} has an AGENT-MD marker but it did not match the expected shape; skipped", file=sys.stderr)
            continue
        new_text = MARKER_RE.sub(lambda _m: block, text, count=1)
        if new_text != text:
            page.write_text(new_text, encoding="utf-8")
            changed += 1
            print(f"updated: {page.relative_to(ROOT)}")
        else:
            print(f"unchanged: {page.relative_to(ROOT)}")

    print(f"\n{changed} page(s) updated, {len(pages) - changed} already current, {len(pages)} total.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
