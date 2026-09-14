# Scholarship scraper

Python ingestion pipeline for official Indian government and institutional scholarship sources. In normal mode it posts normalized batches to the NestJS admin ingestion endpoint; NestJS writes to the existing Prisma `Scholarship` table. The scraper does not connect directly to PostgreSQL during normal execution.

## Supported sources

- [National Scholarship Portal](https://scholarships.gov.in/All-Scholarships) (`nsp`)
- [Tamil Nadu Directorate of Collegiate Education](https://tndce.tn.gov.in/Home/scholarship) (`tamil_nadu_dce`)
- [Tamil Nadu BC/MBC/DNC Welfare](https://bcmbcmw.tn.gov.in/) and its official [welfare schemes page](https://bcmbcmw.tn.gov.in/welfschemes.htm) (`tamil_nadu_bcm`)
- [Tamil Nadu e-Sevai](https://www.tnesevai.tn.gov.in/) and its official [service list](https://www.tnesevai.tn.gov.in/Pages/ServiceList.aspx) (`tamil_nadu_esevai`)
- [VIT scholarship page](https://vit.ac.in/scholarship) (`vit`)

The parsers only mark successfully parsed official records as verified. A source that is unavailable or has no identifiable rows is logged and does not stop other sources.

## Installation

From the repository root:

```powershell
python -m pip install -r scraper/requirements.txt
```

Normal mode requires these environment variables:

```text
SCRAPER_API_URL=http://localhost:3001
SCRAPER_ADMIN_TOKEN=<an authenticated Supabase admin user's access token>
```

The token is sent only as an `Authorization: Bearer` header and is never logged. The Supabase service-role key is not used by Python. `DATABASE_URL` remains backend-only; the legacy direct repository is retained for compatibility but is not used by the CLI.

## Running

Always start with a dry run:

```powershell
python scraper/main.py --source nsp --dry-run
python scraper/main.py --source tamil_nadu_dce --dry-run
python scraper/main.py --dry-run
```

After reviewing dry-run output, run one source or all sources without `--dry-run`:

```powershell
python scraper/main.py --source nsp
python scraper/main.py
```

The CLI prints attempted/succeeded/failed sources and scraped/added/updated/skipped/failed-validation record counts. Normal mode sends each source's validated batch to `POST /admin/scholarships/import`, protected by NestJS `AuthGuard` and `AdminGuard`.

## Database behavior

Records are inserted or updated in the existing `Scholarship` table. Matching uses normalized provider/name plus application URL and source URL. Existing IDs are preserved. Successful source runs can mark previously active records from that source inactive when they no longer appear; records are never deleted automatically.

Dates, INR amounts, education levels, courses, states, and URLs are normalized before validation. Missing data stays null. Tamil Nadu records use `Tamil Nadu`; national records use `All India` where the source supports that interpretation.

## Tests

Tests use saved HTML fixtures and never make live web requests:

```powershell
python -m pytest scraper/tests -q
```

## Adding a source

Create a module under `scraper/sources/` with a `SourceConfig` and a `scrape() -> list[ScholarshipRecord]` implementation. Use the normalizers and validate records in `main.py`, add a fixture and parser test, then register the source in `scraper/main.py`.
