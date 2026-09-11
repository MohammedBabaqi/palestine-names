"""
Sort algorithms — manually implemented (not using Python's sorted()).

Three algorithms:
  1. merge_sort_by_name  — O(n log n)  — stable, ideal for strings
  2. quick_sort_by_age   — O(n log n) avg / O(n²) worst — in-place partitioning
  3. insertion_sort_by_date — O(n²)   — ideal for animation, nearly-sorted data
"""
import unicodedata


# ─── helpers ──────────────────────────────────────────────────────────────────

def _normalize(text: str) -> str:
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower()


# ─── 1. Merge Sort by Name ────────────────────────────────────────────────────

def merge_sort_by_name(records: list[dict], ascending: bool = True) -> dict:
    """
    Merge Sort — O(n log n), stable
    Sorts records by Arabic name using Unicode-normalized comparison.
    Returns sorted list + step count.
    """
    data = list(records)  # copy — do not mutate input
    comparisons = [0]

    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        return merge(left, right)

    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            comparisons[0] += 1
            l_key = _normalize(left[i].get("ar_name") or left[i].get("en_name") or "")
            r_key = _normalize(right[j].get("ar_name") or right[j].get("en_name") or "")
            if (l_key <= r_key) == ascending:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    sorted_data = merge_sort(data)

    return {
        "algorithm": "Merge Sort",
        "complexity": "O(n log n)",
        "comparisons": comparisons[0],
        "sorted": sorted_data,
        "sort_by": "name",
        "ascending": ascending,
    }


# ─── 2. Quick Sort by Age ─────────────────────────────────────────────────────

def quick_sort_by_age(records: list[dict], ascending: bool = True) -> dict:
    """
    Quick Sort — O(n log n) average, O(n²) worst
    Uses median-of-three pivot for better average performance.
    """
    data = list(records)
    comparisons = [0]
    swaps = [0]

    def get_age(r):
        a = r.get("age")
        return a if a is not None else (float("inf") if ascending else float("-inf"))

    def median_of_three(arr, lo, hi):
        mid = (lo + hi) // 2
        if get_age(arr[lo]) > get_age(arr[mid]):
            arr[lo], arr[mid] = arr[mid], arr[lo]
        if get_age(arr[lo]) > get_age(arr[hi]):
            arr[lo], arr[hi] = arr[hi], arr[lo]
        if get_age(arr[mid]) > get_age(arr[hi]):
            arr[mid], arr[hi] = arr[hi], arr[mid]
        return mid

    def partition(arr, lo, hi):
        pivot_idx = median_of_three(arr, lo, hi)
        pivot_val = get_age(arr[pivot_idx])
        arr[pivot_idx], arr[hi] = arr[hi], arr[pivot_idx]
        store = lo
        for i in range(lo, hi):
            comparisons[0] += 1
            cond = get_age(arr[i]) <= pivot_val if ascending else get_age(arr[i]) >= pivot_val
            if cond:
                arr[store], arr[i] = arr[i], arr[store]
                swaps[0] += 1
                store += 1
        arr[store], arr[hi] = arr[hi], arr[store]
        swaps[0] += 1
        return store

    def quicksort(arr, lo, hi):
        if lo < hi:
            p = partition(arr, lo, hi)
            quicksort(arr, lo, p - 1)
            quicksort(arr, p + 1, hi)

    import sys
    sys.setrecursionlimit(100000)
    quicksort(data, 0, len(data) - 1)

    return {
        "algorithm": "Quick Sort",
        "complexity": "O(n log n) avg",
        "comparisons": comparisons[0],
        "swaps": swaps[0],
        "sorted": data,
        "sort_by": "age",
        "ascending": ascending,
    }


# ─── 3. Insertion Sort by Date ────────────────────────────────────────────────

def insertion_sort_by_date(records: list[dict], ascending: bool = True) -> dict:
    """
    Insertion Sort — O(n²)
    Ideal for visualization due to incremental nature.
    Sorts by date-of-birth string (ISO 8601 — lexicographic sort is correct).
    """
    data = list(records)
    comparisons = 0
    swaps = 0

    def get_dob(r):
        d = r.get("dob") or ""
        return d if d else ("9999-99-99" if ascending else "")

    for i in range(1, len(data)):
        key = data[i]
        key_val = get_dob(key)
        j = i - 1
        while j >= 0:
            comparisons += 1
            cond = (get_dob(data[j]) > key_val) if ascending else (get_dob(data[j]) < key_val)
            if cond:
                data[j + 1] = data[j]
                swaps += 1
                j -= 1
            else:
                break
        data[j + 1] = key

    return {
        "algorithm": "Insertion Sort",
        "complexity": "O(n²)",
        "comparisons": comparisons,
        "swaps": swaps,
        "sorted": data,
        "sort_by": "date",
        "ascending": ascending,
    }
