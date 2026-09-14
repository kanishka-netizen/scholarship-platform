from __future__ import annotations

import os
import uuid
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import psycopg
from psycopg.rows import dict_row

from ..models import ScholarshipRecord, ScrapeStats
from ..normalizer.common import dedupe_key


def psycopg_connection_string(connection_string: str) -> str:
    """Remove pooler-only query options that psycopg does not understand."""
    parts = urlsplit(connection_string)
    query = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key.casefold() != "pgbouncer"
    ]
    return urlunsplit(
        (parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment),
    )


class ScholarshipRepository:
    def __init__(self, connection_string: str | None = None):
        raw_connection_string = connection_string or os.getenv("DATABASE_URL")
        if not raw_connection_string:
            raise RuntimeError("DATABASE_URL is required for database writes")
        self.connection_string = psycopg_connection_string(raw_connection_string)
        self.connection = psycopg.connect(self.connection_string, row_factory=dict_row)

    def close(self) -> None:
        self.connection.close()

    def upsert_records(self, records: list[ScholarshipRecord]) -> ScrapeStats:
        stats = ScrapeStats()
        with self.connection.transaction():
            for record in records:
                key = dedupe_key(record)
                existing = self._find(key)
                params = record.as_db_params()
                if existing:
                    self.connection.execute(
                        """
                        UPDATE \"Scholarship\" SET
                          name = %(name)s, provider = %(provider)s, description = %(description)s,
                          amount = %(amount)s, \"startDate\" = %(start_date)s, deadline = %(deadline)s,
                          \"educationLevel\" = %(education_level)s, course = %(course)s, branch = %(branch)s,
                          state = %(state)s, \"incomeLimit\" = %(income_limit)s, \"applicationUrl\" = %(application_url)s,
                          source = %(source)s, verified = %(verified)s, \"lastVerified\" = CURRENT_TIMESTAMP,
                          active = %(active)s, \"updatedAt\" = CURRENT_TIMESTAMP
                        WHERE id = %(id)s
                        """,
                        {**params, "id": existing["id"]},
                    )
                    stats.records_updated += 1
                else:
                    self.connection.execute(
                        """
                        INSERT INTO \"Scholarship\"
                          (id, name, provider, description, amount, \"startDate\", deadline, \"educationLevel\", course,
                           branch, state, \"incomeLimit\", \"applicationUrl\", source, verified, \"lastVerified\", active,
                           \"createdAt\", \"updatedAt\")
                        VALUES (%(id)s, %(name)s, %(provider)s, %(description)s, %(amount)s, %(start_date)s,
                                %(deadline)s, %(education_level)s, %(course)s, %(branch)s, %(state)s, %(income_limit)s,
                                %(application_url)s, %(source)s, %(verified)s, CURRENT_TIMESTAMP, %(active)s,
                                CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        """,
                        {**params, "id": uuid.uuid4().hex},
                    )
                    stats.records_added += 1
        return stats

    def _find(self, key: tuple[str, str, str, str]):
        provider, name, application_url, source = key
        return self.connection.execute(
            """
            SELECT id FROM \"Scholarship\"
            WHERE lower(regexp_replace(provider, '\\s+', ' ', 'g')) = %s
              AND lower(regexp_replace(name, '\\s+', ' ', 'g')) = %s
              AND (%s = '' OR \"applicationUrl\" = %s)
              AND (%s = '' OR source = %s)
            LIMIT 1
            """,
            (provider, name, application_url, application_url, source, source),
        ).fetchone()

    def deactivate_missing(self, source: str, seen_records: list[ScholarshipRecord]) -> int:
        keys = {dedupe_key(record) for record in seen_records}
        rows = self.connection.execute(
            'SELECT id, name, provider, "applicationUrl", source FROM "Scholarship" WHERE source = %s AND active = true',
            (source,),
        ).fetchall()
        deactivated = 0
        with self.connection.transaction():
            for row in rows:
                row_key = dedupe_key(type("Existing", (), {
                    "name": row["name"], "provider": row["provider"],
                    "application_url": row["applicationUrl"], "source": row["source"],
                })())
                if row_key not in keys:
                    self.connection.execute('UPDATE "Scholarship" SET active = false, "updatedAt" = CURRENT_TIMESTAMP WHERE id = %s', (row["id"],))
                    deactivated += 1
        return deactivated
