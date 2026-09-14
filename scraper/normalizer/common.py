from __future__ import annotations

import html
import re
from datetime import date, datetime
from decimal import Decimal
from urllib.parse import urljoin, urlparse

_WHITESPACE = re.compile(r"\s+")
_AMOUNT = re.compile(r"(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(crore|cr|lakh|lac|k)?", re.I)


def clean_text(value: str | None) -> str | None:
    if not value:
        return None
    cleaned = _WHITESPACE.sub(" ", html.unescape(re.sub(r"<[^>]+>", " ", value))).strip()
    return cleaned or None


def normalize_name(value: str | None) -> str | None:
    value = clean_text(value)
    return value.title() if value else None


def normalize_provider(value: str | None) -> str | None:
    return clean_text(value)


def normalize_amount(value: str | int | float | None) -> float | None:
    if value is None or isinstance(value, (int, float)):
        return float(value) if value is not None else None
    text = clean_text(value)
    if not text:
        return None
    match = _AMOUNT.search(text)
    if not match:
        plain = re.sub(r"[^\d.]", "", text)
        try:
            return float(plain) if plain and plain.count(".") <= 1 else None
        except ValueError:
            return None
    amount = Decimal(match.group(1).replace(",", ""))
    unit = (match.group(2) or "").lower()
    multiplier = {"crore": 10_000_000, "cr": 10_000_000, "lakh": 100_000, "lac": 100_000, "k": 1_000}.get(unit, 1)
    return float(amount * multiplier)


def normalize_income_limit(value: str | int | float | None) -> float | None:
    return normalize_amount(value)


def normalize_date(value: str | date | datetime | None) -> date | None:
    if value is None or isinstance(value, date):
        return value.date() if isinstance(value, datetime) else value
    text = clean_text(value)
    if not text:
        return None
    embedded = re.search(r"\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b", text)
    if embedded:
        return date(int(embedded.group(3)), int(embedded.group(2)), int(embedded.group(1)))
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y", "%Y-%m-%d", "%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    match = re.search(r"\b(20\d{2})\b", text)
    return date(int(match.group(1)), 1, 1) if match and text.lower().startswith(("academic", "year")) else None


def normalize_education(value: str | None) -> str | None:
    value = clean_text(value)
    if not value:
        return None
    lowered = value.lower()
    if "school" in lowered or "matric" in lowered:
        return "School"
    if "post-matric" in lowered or "college" in lowered or "undergraduate" in lowered:
        return "Higher education"
    if "research" in lowered or "phd" in lowered or "doctoral" in lowered:
        return "Research"
    return value


def normalize_course(value: str | None) -> str | None:
    return clean_text(value)


def normalize_state(value: str | None) -> str | None:
    value = clean_text(value)
    if not value:
        return None
    if "tamil nadu" in value.lower():
        return "Tamil Nadu"
    if value.lower() in {"india", "all india", "across india", "national"}:
        return "All India"
    return value


def normalize_url(value: str | None, base_url: str | None = None) -> str | None:
    value = clean_text(value)
    if not value:
        return None
    url = urljoin(base_url, value) if base_url else value
    parsed = urlparse(url)
    return url if parsed.scheme in {"http", "https"} and parsed.netloc else None


def dedupe_key(record: object) -> tuple[str, str, str, str]:
    name = normalize_provider(getattr(record, "name", "")) or ""
    provider = normalize_provider(getattr(record, "provider", "")) or ""
    application = normalize_url(getattr(record, "application_url", "")) or ""
    source = normalize_url(getattr(record, "source", "")) or ""
    return (provider.casefold(), name.casefold(), application.casefold(), source.casefold())
