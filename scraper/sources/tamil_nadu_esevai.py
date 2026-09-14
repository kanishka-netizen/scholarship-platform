from __future__ import annotations

from ..models import ScholarshipRecord
from ..normalizer.common import clean_text, normalize_amount, normalize_education, normalize_name, normalize_state, normalize_url
from .base import Source, SourceConfig
from .html import link_from_row, soup, table_rows, value_at


class TamilNaduEsevaiSource(Source):
    config = SourceConfig("tamil_nadu_esevai", "https://www.tnesevai.tn.gov.in/")
    services_url = "https://www.tnesevai.tn.gov.in/Pages/ServiceList.aspx"

    def scrape(self) -> list[ScholarshipRecord]:
        document = soup(self.fetch(self.services_url))
        records: list[ScholarshipRecord] = []
        for row, values, mapping in table_rows(document):
            service = value_at(values, mapping, "service name") or (values[2] if len(values) > 2 else None)
            department = value_at(values, mapping, "department") or (values[1] if len(values) > 1 else None)
            if not service or not department:
                continue
            text = " | ".join(value for value in values if value)
            service_text = service.casefold()
            if not any(word in service_text for word in ("scholarship", "educational assistance")):
                continue
            records.append(ScholarshipRecord(
                name=normalize_name(service) or service,
                provider=f"Tamil Nadu {clean_text(department) or department}",
                description=text,
                amount=normalize_amount(text),
                education_level=normalize_education(text),
                state="Tamil Nadu",
                application_url=link_from_row(row, self.services_url),
                source=self.services_url,
            ))
        return records
