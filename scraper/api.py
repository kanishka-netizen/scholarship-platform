from __future__ import annotations

import os

import requests

from .models import ScholarshipRecord, ScrapeStats


class ScraperApiClient:
    def __init__(self, api_url: str | None = None, token: str | None = None):
        self.api_url = (api_url or os.getenv("SCRAPER_API_URL") or "http://localhost:3001").rstrip("/")
        self.token = token or os.getenv("SCRAPER_ADMIN_TOKEN")
        if not self.token:
            raise RuntimeError("SCRAPER_ADMIN_TOKEN is required for normal scraper execution")

    def import_records(self, records: list[ScholarshipRecord]) -> ScrapeStats:
        payload = {"records": [self._serialize(record) for record in records]}
        response = requests.post(
            f"{self.api_url}/admin/scholarships/import",
            json=payload,
            headers={"Authorization": f"Bearer {self.token}"},
            timeout=60,
        )
        if not response.ok:
            raise RuntimeError(
                f"Scholarship import request failed with HTTP {response.status_code}: {response.text[:500]}"
            )
        result = response.json()
        return ScrapeStats(
            records_added=int(result.get("recordsAdded", 0)),
            records_updated=int(result.get("recordsUpdated", 0)),
        )

    @staticmethod
    def _serialize(record: ScholarshipRecord) -> dict[str, object | None]:
        values = record.as_db_params()
        for field in ("start_date", "deadline"):
            value = values[field]
            values[field] = value.isoformat() if value else None
        return {
            "name": values["name"],
            "provider": values["provider"],
            "description": values["description"],
            "amount": values["amount"],
            "startDate": values["start_date"],
            "deadline": values["deadline"],
            "educationLevel": values["education_level"],
            "course": values["course"],
            "branch": values["branch"],
            "state": values["state"],
            "incomeLimit": values["income_limit"],
            "applicationUrl": values["application_url"],
            "source": values["source"],
            "verified": values["verified"],
            "active": values["active"],
        }
