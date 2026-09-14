from __future__ import annotations

from bs4 import BeautifulSoup

from ..normalizer.common import clean_text, normalize_url


def soup(html: str) -> BeautifulSoup:
    return BeautifulSoup(html, "html.parser")


def rows_with_cells(document: BeautifulSoup):
    for row in document.select("tr"):
        cells = row.select("th, td")
        values = [clean_text(cell.get_text(" ", strip=True)) for cell in cells]
        if any(values):
            yield row, values


def table_rows(document: BeautifulSoup):
    for table in document.select("table"):
        rows = list(rows_with_cells(table))
        if not rows:
            continue
        header = header_map(rows[0][1])
        for row, values in rows[1:]:
            yield row, values, header


def link_from_row(row, base_url: str) -> str | None:
    link = row.select_one("a[href]")
    return normalize_url(link.get("href"), base_url) if link else None


def header_map(values: list[str | None]) -> dict[str, int]:
    result: dict[str, int] = {}
    for index, value in enumerate(values):
        if value:
            result[value.casefold().strip()] = index
    return result


def value_at(values: list[str | None], mapping: dict[str, int], *names: str) -> str | None:
    for name in names:
        index = mapping.get(name.casefold())
        if index is not None and index < len(values):
            return values[index]
    return None
