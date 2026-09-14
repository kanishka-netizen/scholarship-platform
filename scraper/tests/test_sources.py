from pathlib import Path

import pytest

from scraper.sources.nsp import NSPSource
from scraper.sources.tamil_nadu_bcm import TamilNaduBCMSource
from scraper.sources.tamil_nadu_dce import TamilNaduDCESource
from scraper.sources.tamil_nadu_esevai import TamilNaduEsevaiSource
from scraper.sources.vit import VITSource

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.mark.parametrize(
    ("source_class", "fixture", "expected"),
    [
        (NSPSource, "nsp.html", "National Merit Scheme"),
        (TamilNaduDCESource, "dce.html", "Evr Nagammai Scholarship, Tamil Nadu"),
        (TamilNaduBCMSource, "bcm.html", "Scholarship Schemes"),
        (TamilNaduEsevaiSource, "esevai.html", "Application For Scholarship"),
        (VITSource, "vit.html", "Vit Merit Scholarship"),
    ],
)
def test_each_source_parser(source_class, fixture, expected, monkeypatch):
    source = source_class()
    content = (FIXTURES / fixture).read_text(encoding="utf-8")
    monkeypatch.setattr(source, "fetch", lambda url=None: content)
    records = source.scrape()
    assert records
    assert records[0].name == expected
    assert records[0].verified is True


def test_esevai_excludes_unrelated_services(monkeypatch):
    source = TamilNaduEsevaiSource()
    content = (FIXTURES / "esevai.html").read_text(encoding="utf-8")
    monkeypatch.setattr(source, "fetch", lambda url=None: content)
    records = source.scrape()
    assert [record.name for record in records] == ["Application For Scholarship"]
