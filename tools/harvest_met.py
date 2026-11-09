#!/usr/bin/env python3
"""Discover Met Museum objects and export draft-only Orbis Arcanorum JSONL.

Examples:
  python3 tools/harvest_met.py --query amulet --limit 25 --output met-amulets.jsonl
  python3 tools/import_archive_jsonl.py met-amulets.jsonl

No database writes. Uses Met's public API, respects request limits and
includes only individual object records returned by the museum.
Review relevance, rights and cultural context before importing/publishing.
"""
import argparse
import json
import time
import urllib.parse
import urllib.request

API = "https://collectionapi.metmuseum.org/public/collection/v1"
USER_AGENT = "OrbisArcanorumResearch/0.1 (archive metadata discovery)"
def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)

def transform(obj):
    identifier = obj.get("objectID")
    title = str(obj.get("title") or "").strip()
    source_url = str(obj.get("objectURL") or "").strip()
    if not isinstance(identifier, int) or not title or not source_url.startswith("https://"):
        return None
    description = "; ".join(str(v).strip() for v in [
        obj.get("objectDate"), obj.get("culture"), obj.get("medium"),
        obj.get("classification"), obj.get("creditLine")
    ] if v)
    return {
        "institution": "The Metropolitan Museum of Art",
        "catalog_id": str(identifier),
        "title": title,
        "source_url": source_url,
        "section": "Museum ritual and symbolic objects — editorial classification pending",
        "description": description,
        "original_language": None,
        "original_title": None,
        "english_title": title,
    }

def harvest(query, limit, pause):
    search_url = API + "/search?" + urllib.parse.urlencode({"q": query})
    ids = fetch_json(search_url).get("objectIDs") or []
    results, seen = [], set()
    for object_id in ids:
        if len(results) >= limit:
            break
        if not isinstance(object_id, int) or object_id in seen:
            continue
        seen.add(object_id)
        try:
            obj = fetch_json(API + "/objects/" + str(object_id))
            record = transform(obj)
            if record:
                results.append(record)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            print("Skipping object " + str(object_id) + ": " + type(exc).__name__, flush=True)
        if pause:
            time.sleep(pause)
    return results

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--query", required=True)
    p.add_argument("--limit", type=int, default=25)
    p.add_argument("--pause", type=float, default=0.25)
    p.add_argument("--output", required=True)
    args = p.parse_args()
    if not 1 <= args.limit <= 100 or not 0 <= args.pause <= 10:
        p.error("limit must be 1–100 and pause must be 0–10 seconds")
    results = harvest(args.query, args.limit, args.pause)
    with open(args.output, "w", encoding="utf-8") as out:
        for record in results:
            out.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"Exported {len(results)} individual museum objects to {args.output}; no database writes.")

if __name__ == "__main__":
    main()
