from __future__ import annotations

import logging
from datetime import date

from ..models import ScholarshipRecord
from ..normalizer.common import (
    clean_text,
    normalize_amount,
    normalize_course,
    normalize_date,
    normalize_education,
    normalize_income_limit,
    normalize_name,
    normalize_state,
    normalize_url,
)
from .base import Source, SourceConfig
from .html import link_from_row, soup, table_rows, value_at

logger = logging.getLogger(__name__)


class NSPSource(Source):
    config = SourceConfig("nsp", "https://scholarships.gov.in/All-Scholarships")

    def scrape(self) -> list[ScholarshipRecord]:
        document = soup(self.fetch())
        records: list[ScholarshipRecord] = []
        current_year = date.today().year
        for row, values, mapping in table_rows(document):
            name = value_at(values, mapping, "scheme name", "scholarship name", "name")
            if not name and len(values) >= 2:
                name = values[0]
            provider = value_at(values, mapping, "ministry", "department", "provider", "organisation")
            if not provider and len(values) >= 2:
                provider = values[1]
            if not name or not provider or name.casefold() in {"schemes on nsp", "search central sector scheme"}:
                continue
            text = " | ".join(value for value in values if value)
            records.append(ScholarshipRecord(
                name=normalize_name(name) or name,
                provider=clean_text(provider) or provider,
                description=text,
                amount=normalize_amount(value_at(values, mapping, "amount", "benefit", "scholarship amount")),
                start_date=normalize_date(value_at(values, mapping, "opening date", "start date")),
                deadline=normalize_date(value_at(values, mapping, "closing date", "deadline", "last date")),
                education_level=normalize_education(value_at(values, mapping, "education level", "level")),
                course=normalize_course(value_at(values, mapping, "course", "discipline", "stream")),
                state=normalize_state(value_at(values, mapping, "state", "domicile") or "All India"),
                income_limit=normalize_income_limit(value_at(values, mapping, "income limit", "family income")),
                application_url=normalize_url(value_at(values, mapping, "application url", "apply"), self.config.url) or link_from_row(row, self.config.url),
                source=self.config.url,
            ))
        if not records:
            for heading in document.select("h6"):
                name = clean_text(heading.get_text(" ", strip=True))
                if not name or name.casefold().startswith("academic year"):
                    continue
                listing = name.casefold()
                if not any(
                    token in listing
                    for token in ("scheme", "scholarship", "fellowship", "assistance")
                ):
                    continue
                container = heading.find_parent("div", class_=lambda value: value and "row" in value)
                text = clean_text(container.get_text(" ", strip=True)) if container else name
                image = container.select_one("img[src]") if container else None
                provider = "Government of India"
                if image and image.get("src"):
                    provider = clean_text(image["src"].rsplit("/", 1)[-1].rsplit(".", 1)[0].replace("-", " ")) or provider
                if provider.casefold() == "scholarship1":
                    provider = "Government of India"
                guideline = container.select_one("a[href*='schemeGuidelines']") if container else None
                records.append(ScholarshipRecord(
                    name=normalize_name(name) or name,
                    provider=provider,
                    description=text,
                    start_date=normalize_date(text[text.find("Open from"):]),
                    deadline=normalize_date(text[text.find("Open till"):]),
                    state="All India",
                    application_url=normalize_url("https://scholarships.gov.in/All-Scholarships.action"),
                    source=self.config.url,
                ))
        logger.info("NSP academic-year context: %s-%s", current_year, str(current_year + 1)[-2:])
        return records
