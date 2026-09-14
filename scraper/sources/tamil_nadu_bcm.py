from __future__ import annotations

from ..models import ScholarshipRecord
from ..normalizer.common import clean_text, normalize_amount, normalize_education, normalize_name, normalize_state, normalize_url
from .base import Source, SourceConfig
from .html import soup


class TamilNaduBCMSource(Source):
    config = SourceConfig("tamil_nadu_bcm", "https://bcmbcmw.tn.gov.in/", verify_ssl=False)
    welfare_url = "https://bcmbcmw.tn.gov.in/welfschemes.htm"

    def scrape(self) -> list[ScholarshipRecord]:
        document = soup(self.fetch(self.welfare_url))
        records: list[ScholarshipRecord] = []
        for heading in document.select("h1, h2, h3, h4, h5, h6, strong, b"):
            title = clean_text(heading.get_text(" ", strip=True))
            if not title or not any(word in title.casefold() for word in ("scholarship", "education", "free education")):
                continue
            container = heading.parent
            text = clean_text(container.get_text(" ", strip=True)) if container else title
            link = container.select_one("a[href]") if container else None
            application_url = normalize_url(link.get("href"), self.welfare_url) if link else None
            records.append(ScholarshipRecord(
                name=normalize_name(title) or title,
                provider="Tamil Nadu Backward Classes, Most Backward Classes and Denotified Communities Welfare Department",
                description=text,
                amount=normalize_amount(text),
                education_level=normalize_education(text),
                state=normalize_state("Tamil Nadu"),
                application_url=application_url,
                source=self.welfare_url,
            ))
        return _unique(records)


def _unique(records: list[ScholarshipRecord]) -> list[ScholarshipRecord]:
    seen: set[tuple[str, str]] = set()
    result: list[ScholarshipRecord] = []
    for record in records:
        key = (record.provider.casefold(), record.name.casefold())
        if key not in seen:
            seen.add(key)
            result.append(record)
    return result
