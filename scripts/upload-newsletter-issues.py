#!/usr/bin/env python3
"""Upload every built language of a newsletter issue as its 'current issue'.

For each language that has a built email at newsletters/build/<ID>/<lng>.html,
reads the subject from that language's block file
(public/locales/<lng>/newsletters/<ID>.json) and POSTs
{subject, html, language} to /admin/newsletter/current.

Env:
  ID              issue id (e.g. newsletter-1)   [required]
  API_URL         API base URL (default http://localhost:8106)
  ADMIN_API_KEY   admin key (same as API .env)   [required]

Run via: make newsletter-upload ID=newsletter-1
"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["en", "fr", "de", "es", "it", "nl", "sv", "da", "sl", "ro"]

issue_id = os.environ.get("ID")
api_url = os.environ.get("API_URL", "http://localhost:8106").rstrip("/")
api_key = os.environ.get("ADMIN_API_KEY", "")

if not issue_id:
    sys.exit("ID env var is required (e.g. ID=newsletter-1)")
if not api_key:
    sys.exit("ADMIN_API_KEY env var is required")

build_dir = ROOT / "newsletters" / "build" / issue_id
uploaded = 0
for lng in LANGS:
    html_path = build_dir / f"{lng}.html"
    block_path = ROOT / "public" / "locales" / lng / "newsletters" / f"{issue_id}.json"
    if not html_path.exists() or not block_path.exists():
        continue
    subject = json.loads(block_path.read_text(encoding="utf-8")).get("subject", "")
    body = json.dumps({
        "subject": subject,
        "html": html_path.read_text(encoding="utf-8"),
        "language": lng,
    }).encode()
    req = urllib.request.Request(
        f"{api_url}/api/v1/admin/newsletter/current",
        data=body,
        method="POST",
        headers={"Content-Type": "application/json", "X-API-Key": api_key},
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"uploaded {lng}: HTTP {resp.status}")
            uploaded += 1
    except urllib.error.HTTPError as e:
        print(f"FAILED {lng}: HTTP {e.code} {e.read().decode(errors='replace')}")
    except urllib.error.URLError as e:
        print(f"FAILED {lng}: {e.reason}")

print(f"\nUploaded {uploaded} language(s) for issue '{issue_id}'.")
