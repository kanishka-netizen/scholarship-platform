from __future__ import annotations

from ..models import ScholarshipRecord
from ..normalizer.common import clean_text, normalize_amount, normalize_education, normalize_name, normalize_state, normalize_url
from .base import Source, SourceConfig
from .html import link_from_row, soup, table_rows, value_at


class VITSource(Source):
    config = SourceConfig("vit", "https://vit.ac.in/scholarship")

    def scrape(self) -> list[ScholarshipRecord]:
        document = soup(self.fetch())
        records: list[ScholarshipRecord] = []
        for row, values, mapping in table_rows(document):
            name = value_at(values, mapping, "scholarship", "award", "category", "name") or (values[0] if values else None)
            if not name or len(values) < 2:
                continue
            normalized_name = name.strip().casefold()
            if normalized_name.startswith("sl. no") or normalized_name.startswith("s.no") or normalized_name.isdigit():
                continue
            text = " | ".join(value for value in values if value)
            if not any(word in text.casefold() for word in ("scholarship", "award", "fee", "rank")):
                continue
            records.append(ScholarshipRecord(
                name=normalize_name(name) or name,
                provider="Vellore Institute of Technology",
                description=text,
                amount=normalize_amount(value_at(values, mapping, "amount", "award", "benefit") or text),
                education_level=normalize_education(value_at(values, mapping, "level", "programme", "program")),
                state=normalize_state("All India"),
                application_url=link_from_row(row, self.config.url),
                source=self.config.url,
            ))
        return records
