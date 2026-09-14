from __future__ import annotations

from ..models import ScholarshipRecord
from ..normalizer.common import clean_text, normalize_amount, normalize_date, normalize_education, normalize_name, normalize_state, normalize_url
from .base import Source, SourceConfig
from .html import link_from_row, soup, table_rows, value_at


class TamilNaduDCESource(Source):
    config = SourceConfig("tamil_nadu_dce", "https://tndce.tn.gov.in/Home/scholarship")

    def scrape(self) -> list[ScholarshipRecord]:
        document = soup(self.fetch())
        records: list[ScholarshipRecord] = []
        for row, values, mapping in table_rows(document):
            name = value_at(values, mapping, "scholarship name", "name", "scheme") or (values[0] if values else None)
            if not name or len(values) < 2:
                continue
            link = link_from_row(row, self.config.url)
            text = " | ".join(value for value in values if value)
            records.append(ScholarshipRecord(
                name=normalize_name(name) or name,
                provider="Tamil Nadu Directorate of Collegiate Education",
                description=text,
                amount=normalize_amount(value_at(values, mapping, "amount", "award", "benefit")),
                start_date=normalize_date(value_at(values, mapping, "opening date", "start date")),
                deadline=normalize_date(value_at(values, mapping, "closing date", "deadline", "last date")),
                education_level=normalize_education(value_at(values, mapping, "education level", "level")),
                course=value_at(values, mapping, "course", "discipline"),
                state="Tamil Nadu",
                application_url=link,
                source=self.config.url,
            ))
        return records
