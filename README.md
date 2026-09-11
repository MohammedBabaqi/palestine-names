# أسماء لا تُنسى — Palestinian Names Archive

## "From Numbers to Names" — Interactive Data Storytelling

An interactive data story built for a university project on **72,835** Palestinian records.

> "لم تكن أرقامًا. كانت أسماء."
> *"They were not numbers. They were names."*

---

## Quick Start

### 1. Backend (FastAPI)

```powershell
cd backend
pip install fastapi uvicorn python-multipart pydantic aiofiles
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend loads **`killed-in-gaza.csv`** from the project root automatically.
API docs available at: http://localhost:8000/docs

### 2. Frontend (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

Open: **http://localhost:3000**

---

## Project Structure

```
palestine_names/
├── killed-in-gaza.csv          ← Real dataset (72,835 records)
│
├── backend/                    ← FastAPI Python backend
│   ├── main.py                 ← App entry point (CORS configured)
│   ├── data/
│   │   └── loader.py           ← CSV loader (pure Python, no pandas)
│   ├── algorithms/
│   │   ├── search.py           ← Linear Search O(n), Binary Search O(log n)
│   │   └── sort.py             ← Merge Sort, Quick Sort, Insertion Sort
│   └── routers/
│       └── records.py          ← All API endpoints
│
└── frontend/                   ← Next.js 14 React frontend
    └── src/
        ├── app/
        │   ├── layout.tsx      ← RTL Arabic layout + SEO metadata
        │   ├── page.tsx        ← Main page (all sections composed)
        │   └── globals.css     ← Design system (paper textures, Palestinian accents)
        ├── lib/
        │   ├── api.ts          ← API client
        │   └── types.ts        ← TypeScript types
        └── components/
            ├── hero/           ← Giant animated number
            ├── particles/      ← Canvas particle engine (number → scatter)
            ├── names/          ← Floating Arabic names cloud
            ├── impact/         ← Abstract symbolic impact animation
            ├── one-name/       ← Single person spotlight
            ├── archive/        ← Virtualized archive list + search
            ├── algorithms/     ← Sort viz + real data sorting
            ├── statistics/     ← Data storytelling charts
            ├── archivist/      ← AI Archivist (حارس الأرشيف)
            └── finale/         ← Closing scene
```

---

## Dataset Fields

| Field | Description |
|---|---|
| `id` | Unique record ID |
| `en_name` | Name in English |
| `ar_name` | Name in Arabic |
| `age` | Age at time of record |
| `dob` | Date of birth (ISO 8601) |
| `sex` | `m` (male) / `f` (female) |
| `update` | Update version |

---

## Algorithms Implemented

### Search
| Algorithm | Complexity | Used For |
|---|---|---|
| Linear Search | O(n) | Search by name |
| Binary Search | O(log n) | Search by age |
| Linear Scan | O(n) | Search by date range |

### Sort
| Algorithm | Complexity | Used For |
|---|---|---|
| Merge Sort | O(n log n) | Sort by name (stable) |
| Quick Sort | O(n log n) avg | Sort by age (in-place) |
| Insertion Sort | O(n²) | Sort by date (great for animation) |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/records/count` | Total record count |
| GET | `/api/records?page=1` | Paginated archive |
| GET | `/api/records/sample?n=200` | Random sample |
| GET | `/api/records/one-random` | Single random record |
| GET | `/api/search/name?q=محمد` | Linear search by name |
| GET | `/api/search/age?age=25` | Binary search by age |
| GET | `/api/search/date?date_from=1980-01-01` | Date range scan |
| GET | `/api/sort/name` | Merge sort by name |
| GET | `/api/sort/age` | Quick sort by age |
| GET | `/api/sort/date` | Insertion sort by date |
| GET | `/api/statistics` | Full dataset statistics |

---

## Key Statistics (Real Data)

- **72,835** total records
- **21,637** children under 18 years old
- **28.7** average age
- **27** median age
- **50,959** male / **21,876** female
- Births recorded from **1914 to 2025**

---

## Design Philosophy

This is **not** a dashboard. It is an interactive data archive.

- **White/ivory paper aesthetic** — premium editorial design
- **Arabic-first, RTL** — IBM Plex Sans Arabic
- **Palestinian colors as accents only** — green #006233, red #CE1126
- **Scroll-driven storytelling** — GSAP ScrollTrigger
- **Canvas particle engine** — number → particles → names
- **Virtualized lists** — handles 72k records without DOM bloat
- **No fake algorithms** — every sort and search is real

---

*"الرقم يُحصى، لكن الاسم يُتذكّر."*
*"A number can be counted. A name is remembered."*
