from datetime import date

from scraper.models import ScholarshipRecord, validate_record
from scraper.normalizer.common import dedupe_key, normalize_amount, normalize_date, normalize_url


def test_amount_and_income_normalization():
    assert normalize_amount("₹50,000 per year") == 50000
    assert normalize_amount("Rs. 2.5 lakh per annum") == 250000
    assert normalize_amount("INR 1 crore") == 10000000


def test_dates_and_urls():
    assert normalize_date("31/10/2026") == date(2026, 10, 31)
    assert normalize_url("/apply", "https://example.gov.in/page") == "https://example.gov.in/apply"
    assert normalize_url("javascript:void(0)") is None


def test_validation_and_dedupe():
    record = ScholarshipRecord(name="Scheme", provider="Provider", source="https://example.gov.in")
    assert validate_record(record) == []
    assert dedupe_key(record) == ("provider", "scheme", "", "https://example.gov.in")
    assert validate_record(ScholarshipRecord(name="", provider="Provider"))
