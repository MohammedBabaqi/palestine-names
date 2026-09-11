"""
Dataset loader — reads the CSV and exposes the full record list.
Loaded once at startup for fast in-memory operations.
Fields: id, en_name, ar_name, age, dob, sex, update
"""
import csv
import os
import math
from pathlib import Path
from typing import Optional

# Resolve path: loader.py is at backend/data/loader.py
# Go up two levels (data/ → backend/ → project root) to find the CSV
DATA_PATH = Path(__file__).parent.parent.parent / "killed-in-gaza.csv"


def _parse_record(row: dict) -> dict:
    """Normalize one CSV row into a clean record dict."""
    age_raw = row.get("age", "").strip()
    try:
        age = int(float(age_raw)) if age_raw else None
    except ValueError:
        age = None

    return {
        "id": row.get("id", "").strip(),
        "en_name": row.get("en_name", "").strip(),
        "ar_name": row.get("ar_name", "").strip(),
        "age": age,
        "dob": row.get("dob", "").strip() or None,
        "sex": row.get("sex", "").strip() or None,
        "update": row.get("update", "").strip() or None,
    }


def load_records() -> list[dict]:
    """Load all records from the CSV file."""
    records = []
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

    with open(DATA_PATH, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(_parse_record(row))

    return records


# Module-level singleton — loaded once
_records: Optional[list[dict]] = None


def get_records() -> list[dict]:
    global _records
    if _records is None:
        _records = load_records()
    return _records
