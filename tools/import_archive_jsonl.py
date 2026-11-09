#!/usr/bin/env python3
"""Orbis Arcanorum: safe, review-only institutional JSONL importer.

Usage:
  python3 tools/import_archive_jsonl.py path/to/items.jsonl
  python3 tools/import_archive_jsonl.py path/to/items.jsonl --commit

Input: one JSON object per line with keys:
 institution, catalog_id, title, source_url, section, description,
 original_language, original_title, english_title

Default is validation/dry-run only. --commit requires SUPABASE_URL and
SUPABASE_SERVICE_ROLE_KEY in the process environment. Never put credentials
in files, GitHub, logs, or a browser. Run only in trusted administrative CI.
"""
import argparse
import json
import os
import re
import sys
import urllib.request
from urllib.parse import urlparse

REQUIRED = ("institution", "catalog_id", "title", "source_url", "section")
MAX_ITEMS = 100
def normalize(raw):
    if not isinstance(raw, dict):
        raise ValueError("record must be an object")
    for key in REQUIRED:
        if not isinstance(raw.get(key), str) or not raw[key].strip():
            raise ValueError("missing required field: " + key)
    url = raw["source_url"].strip()
    parsed = urlparse(url)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password
            or parsed.fragment or any(ch.isspace() for ch in url)):
        raise ValueError("canonical source URL must be HTTPS")
    institution = raw["institution"].strip()
    catalog_id = raw["catalog_id"].strip()
    slug = re.sub(r"[^a-z0-9]+", "-", (institution + "-" + catalog_id).lower()).strip("-")
    if not slug or len(slug) > 180:
        raise ValueError("invalid derived slug")
    return {
        "slug": slug, "title": raw["title"].strip(),
        "archive_section": raw["section"].strip(),
        "description": str(raw.get("description") or "").strip(),
        "source_name": institution, "source_url": url,
        "institution_catalog_id": catalog_id,
        "original_language": raw.get("original_language"),
        "original_title": raw.get("original_title"),
        "english_title": raw.get("english_title"),
        "resource_type": "institutional_object",
        "evidence_class": "unreviewed", "rights_status": "unverified",
        "publication_status": "draft", "acquisition_status": "metadata_imported",
        "translation_status": "not_started"
    }

def load(path):
    records = []
    keys = set()
    slugs = set()
    with open(path, encoding="utf-8") as stream:
        for line_no, line in enumerate(stream, 1):
            if not line.strip():
                continue
            try:
                record = normalize(json.loads(line))
            except (ValueError, TypeError, json.JSONDecodeError) as exc:
                raise ValueError(f"line {line_no}: {exc}") from exc
            key = (record["source_name"].casefold(), record["institution_catalog_id"].casefold())
            if key in keys:
                raise ValueError(f"line {line_no}: duplicate institution/catalog ID")
            if record["slug"] in slugs:
                raise ValueError(f"line {line_no}: duplicate normalized slug")
            keys.add(key)
            slugs.add(record["slug"])
            records.append(record)
            if len(records) > MAX_ITEMS:
                raise ValueError(f"maximum {MAX_ITEMS} records per batch")
    return records

def reject_existing(records, base, key):
    """Reject existing catalog pairs and slugs before writing; fail closed."""
    from urllib.parse import urlencode
    for record in records:
        for filters in (
            {"source_name": "eq." + record["source_name"],
             "institution_catalog_id": "eq." + record["institution_catalog_id"]},
            {"slug": "eq." + record["slug"]},
        ):
            params = urlencode({"select": "id", **filters, "limit": "1"})
            request = urllib.request.Request(
                base + "/rest/v1/archive_resources?" + params,
                headers={"apikey": key, "Authorization": "Bearer " + key,
                         "Accept": "application/json"})
            with urllib.request.urlopen(request, timeout=20) as response:
                existing = json.load(response)
            if not isinstance(existing, list):
                raise ValueError("invalid database lookup response")
            if existing:
                raise ValueError("existing institution/catalog ID or slug: " +
                                 record["source_name"] + " / " +
                                 record["institution_catalog_id"])

def commit(records):
    base = os.environ.get("SUPABASE_URL", "").rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if not base.startswith("https://") or not key:
        raise RuntimeError("missing secure Supabase environment configuration")
    reject_existing(records, base, key)
    endpoint = base + "/rest/v1/archive_resources?on_conflict=slug"
    # Never overwrite existing records: use ignore-duplicates, not merge.
    payload = json.dumps(records).encode("utf-8")
    request = urllib.request.Request(endpoint, data=payload, method="POST", headers={
        "apikey": key, "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=minimal"
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        if response.status not in (200, 201, 204):
            raise RuntimeError("database rejected import")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("jsonl")
    parser.add_argument("--commit", action="store_true")
    args = parser.parse_args()
    try:
        records = load(args.jsonl)
        print(f"Validated {len(records)} distinct records; all remain draft/unverified.")
        if args.commit and records:
            commit(records)
            print("Batch submitted; verify database counts and duplicate behavior.")
        elif not args.commit:
            print("Dry run only. No database changes.")
    except Exception as exc:
        print("Import failed: " + str(exc).split("\n")[0], file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
