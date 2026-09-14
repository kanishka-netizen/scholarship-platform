from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from typing import Any


@dataclass
class ScholarshipRecord:
    name: str
    provider: str
    description: str | None = None
    amount: float | None = None
    start_date: date | None = None
    deadline: date | None = None
    education_level: str | None = None
    course: str | None = None
    branch: str | None = None
    state: str | None = None
    income_limit: float | None = None
    application_url: str | None = None
    source: str | None = None
    verified: bool = True
    active: bool = True

    def as_db_params(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "provider": self.provider,
            "description": self.description,
            "amount": self.amount,
            "start_date": self.start_date,
            "deadline": self.deadline,
            "education_level": self.education_level,
            "course": self.course,
            "branch": self.branch,
            "state": self.state,
            "income_limit": self.income_limit,
            "application_url": self.application_url,
            "source": self.source,
            "verified": self.verified,
            "active": self.active,
        }


@dataclass
class ScrapeStats:
    sources_attempted: int = 0
    sources_succeeded: int = 0
    sources_failed: int = 0
    records_scraped: int = 0
    records_added: int = 0
    records_updated: int = 0
    records_skipped: int = 0
    records_failed_validation: int = 0

    def add(self, other: ScrapeStats) -> None:
        for field in self.__dataclass_fields__:
            setattr(self, field, getattr(self, field) + getattr(other, field))

    def summary(self) -> str:
        return "\n".join(
            [
                f"Sources attempted: {self.sources_attempted}",
                f"Sources succeeded: {self.sources_succeeded}",
                f"Sources failed: {self.sources_failed}",
                f"Records scraped: {self.records_scraped}",
                f"Records added: {self.records_added}",
                f"Records updated: {self.records_updated}",
                f"Records skipped: {self.records_skipped}",
                f"Records failed validation: {self.records_failed_validation}",
            ],
        )


def validate_record(record: ScholarshipRecord) -> list[str]:
    errors: list[str] = []
    if not record.name.strip():
        errors.append("name is required")
    if not record.provider.strip():
        errors.append("provider is required")
    if record.amount is not None and record.amount < 0:
        errors.append("amount cannot be negative")
    if record.income_limit is not None and record.income_limit < 0:
        errors.append("income_limit cannot be negative")
    if record.start_date and record.deadline and record.start_date > record.deadline:
        errors.append("start_date cannot be after deadline")
    for field in ("application_url", "source"):
        value = getattr(record, field)
        if value and not value.startswith(("http://", "https://")):
            errors.append(f"{field} must be an absolute HTTP URL")
    return errors
