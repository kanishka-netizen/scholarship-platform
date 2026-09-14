from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from scraper.models import ScrapeStats, validate_record
    from scraper.api import ScraperApiClient
    from scraper.sources.nsp import NSPSource
    from scraper.sources.tamil_nadu_bcm import TamilNaduBCMSource
    from scraper.sources.tamil_nadu_dce import TamilNaduDCESource
    from scraper.sources.tamil_nadu_esevai import TamilNaduEsevaiSource
    from scraper.sources.vit import VITSource
else:
    from .models import ScrapeStats, validate_record
    from .api import ScraperApiClient
    from .sources.nsp import NSPSource
    from .sources.tamil_nadu_bcm import TamilNaduBCMSource
    from .sources.tamil_nadu_dce import TamilNaduDCESource
    from .sources.tamil_nadu_esevai import TamilNaduEsevaiSource
    from .sources.vit import VITSource

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
load_dotenv(ROOT / "frontend" / ".env.local")

logging.basicConfig(level=os.getenv("SCRAPER_LOG_LEVEL", "INFO"), format="%(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("scraper")

SOURCES = {
    "nsp": NSPSource,
    "tamil_nadu_dce": TamilNaduDCESource,
    "tamil_nadu_bcm": TamilNaduBCMSource,
    "tamil_nadu_esevai": TamilNaduEsevaiSource,
    "vit": VITSource,
}


def run(source_names: list[str], dry_run: bool) -> int:
    total = ScrapeStats()
    importer = None
    if not dry_run:
        importer = ScraperApiClient()

    for source_name in source_names:
        source = SOURCES[source_name]()
        total.sources_attempted += 1
        try:
            records = source.scrape()
            total.sources_succeeded += 1
            total.records_scraped += len(records)
            valid_records = []
            for record in records:
                errors = validate_record(record)
                if errors:
                    total.records_failed_validation += 1
                    logger.warning("Skipping invalid %s record %r: %s", source_name, record.name, "; ".join(errors))
                else:
                    valid_records.append(record)
            total.records_skipped += len(records) - len(valid_records)
            if dry_run:
                logger.info("Dry run %s: parsed %d valid records", source_name, len(valid_records))
                for record in valid_records:
                    logger.info("  %s | %s | %s", record.name, record.provider, record.application_url or record.source)
            elif importer:
                source_stats = importer.import_records(valid_records)
                total.add(source_stats)
        except Exception:
            total.sources_failed += 1
            logger.exception("Source failed: %s", source_name)
    print(total.summary())
    return 0 if total.sources_failed == 0 else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Ingest official scholarship listings into Scholarship.")
    parser.add_argument("--source", choices=[*SOURCES, "all"], default="all")
    parser.add_argument("--dry-run", action="store_true", help="Parse and normalize without writing to PostgreSQL")
    args = parser.parse_args()
    names = list(SOURCES) if args.source == "all" else [args.source]
    return run(names, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
