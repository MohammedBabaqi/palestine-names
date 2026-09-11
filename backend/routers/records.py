"""
Records API router — search, sort, statistics, archive endpoints.
All heavy lifting done in algorithms/ modules.
"""
from fastapi import APIRouter, Query
from typing import Optional
import math
import random

from data.loader import get_records
from algorithms.search import linear_search_by_name, binary_search_by_age, linear_search_by_date
from algorithms.sort import merge_sort_by_name, quick_sort_by_age, insertion_sort_by_date

router = APIRouter()


def paginate(items: list, page: int, page_size: int) -> dict:
    total = len(items)
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": items[start:end],
    }


# ─── Archive ───────────────────────────────────────────────────────────────────

@router.get("/records")
async def list_records(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Return paginated list of all records."""
    records = get_records()
    return paginate(records, page, page_size)


@router.get("/records/count")
async def get_count():
    """Return total record count."""
    return {"count": len(get_records())}


@router.get("/records/sample")
async def get_sample(n: int = Query(200, ge=1, le=5000)):
    """Return a random sample of n records for visualization."""
    records = get_records()
    sample = random.sample(records, min(n, len(records)))
    return {"records": sample, "total": len(records)}


@router.get("/records/one-random")
async def get_one_random():
    """Return one random record for the spotlight scene."""
    records = get_records()
    return random.choice(records)


# ─── Search ────────────────────────────────────────────────────────────────────

@router.get("/search/name")
async def search_by_name(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Linear search by Arabic/English name — O(n)."""
    records = get_records()
    result = linear_search_by_name(records, q)
    paginated = paginate(result["results"], page, page_size)
    return {
        **result,
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


@router.get("/search/age")
async def search_by_age(
    age: int = Query(..., ge=0, le=150),
    tolerance: int = Query(0, ge=0, le=20),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Binary search by age — O(log n)."""
    records = get_records()
    result = binary_search_by_age(records, age, tolerance)
    paginated = paginate(result["results"], page, page_size)
    return {
        **result,
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


@router.get("/search/date")
async def search_by_date(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Linear scan by date-of-birth range — O(n)."""
    records = get_records()
    result = linear_search_by_date(records, date_from, date_to)
    paginated = paginate(result["results"], page, page_size)
    return {
        **result,
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


# ─── Sort ──────────────────────────────────────────────────────────────────────

@router.get("/sort/name")
async def sort_by_name(
    ascending: bool = Query(True),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Merge sort by Arabic name — O(n log n)."""
    records = get_records()
    result = merge_sort_by_name(records, ascending)
    paginated = paginate(result["sorted"], page, page_size)
    return {
        **{k: v for k, v in result.items() if k != "sorted"},
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


@router.get("/sort/age")
async def sort_by_age(
    ascending: bool = Query(True),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Quick sort by age — O(n log n) avg."""
    records = get_records()
    result = quick_sort_by_age(records, ascending)
    paginated = paginate(result["sorted"], page, page_size)
    return {
        **{k: v for k, v in result.items() if k != "sorted"},
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


@router.get("/sort/date")
async def sort_by_date(
    ascending: bool = Query(True),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """Insertion sort by date-of-birth — O(n²)."""
    records = get_records()
    result = insertion_sort_by_date(records, ascending)
    paginated = paginate(result["sorted"], page, page_size)
    return {
        **{k: v for k, v in result.items() if k != "sorted"},
        "results": paginated["items"],
        "pagination": {k: v for k, v in paginated.items() if k != "items"},
    }


# ─── Statistics ────────────────────────────────────────────────────────────────

@router.get("/statistics")
async def get_statistics():
    """Compute all statistics from the real dataset."""
    records = get_records()
    total = len(records)

    ages_all = [r["age"] for r in records if r.get("age") is not None]
    ages_all.sort()

    n_ages = len(ages_all)
    avg_age = round(sum(ages_all) / n_ages, 1) if n_ages else None

    # Median
    if n_ages:
        mid = n_ages // 2
        median_age = ages_all[mid] if n_ages % 2 else (ages_all[mid - 1] + ages_all[mid]) / 2
    else:
        median_age = None

    min_age = ages_all[0] if ages_all else None
    max_age = ages_all[-1] if ages_all else None
    children = sum(1 for a in ages_all if a < 18)

    # Gender
    male = sum(1 for r in records if r.get("sex") == "m")
    female = sum(1 for r in records if r.get("sex") == "f")

    # Age distribution buckets (0-9, 10-19, ..., 100+)
    buckets = {}
    for age in ages_all:
        bucket_label = f"{(age // 10) * 10}-{(age // 10) * 10 + 9}"
        buckets[bucket_label] = buckets.get(bucket_label, 0) + 1

    age_distribution = [
        {"range": k, "count": v}
        for k, v in sorted(buckets.items(), key=lambda x: int(x[0].split("-")[0]))
    ]

    # Records by year (using dob field)
    year_counts: dict[str, int] = {}
    for r in records:
        dob = r.get("dob") or ""
        if dob and len(dob) >= 4:
            year = dob[:4]
            year_counts[year] = year_counts.get(year, 0) + 1

    records_by_year = [
        {"year": k, "count": v}
        for k, v in sorted(year_counts.items())
    ]

    return {
        "total": total,
        "total_with_age": n_ages,
        "average_age": avg_age,
        "median_age": median_age,
        "min_age": min_age,
        "max_age": max_age,
        "children_under_18": children,
        "male": male,
        "female": female,
        "age_distribution": age_distribution,
        "records_by_year": records_by_year,
    }
