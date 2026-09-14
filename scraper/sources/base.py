from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Callable

import requests

from ..models import ScholarshipRecord

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class SourceConfig:
    name: str
    url: str
    timeout: float = 20
    retries: int = 2
    delay: float = 1.0
    verify_ssl: bool = True


class Source:
    config: SourceConfig

    def scrape(self) -> list[ScholarshipRecord]:
        raise NotImplementedError

    def fetch(self, url: str | None = None) -> str:
        target = url or self.config.url
        last_error: Exception | None = None
        for attempt in range(self.config.retries + 1):
            try:
                response = requests.get(
                    target,
                    timeout=self.config.timeout,
                    headers={"User-Agent": "ScholarlyScholarshipBot/1.0 (+official-source-ingestion)"},
                    verify=self.config.verify_ssl,
                )
                response.raise_for_status()
                time.sleep(self.config.delay)
                return response.text
            except requests.RequestException as error:
                last_error = error
                if attempt < self.config.retries:
                    time.sleep(self.config.delay * (attempt + 1))
        raise RuntimeError(f"{self.config.name} failed to fetch {target}: {last_error}")


def text_or_none(value: str | None) -> str | None:
    return value.strip() if value and value.strip() else None
