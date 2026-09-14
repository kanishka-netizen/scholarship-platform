from scraper.db.postgres import psycopg_connection_string


def test_removes_pgbouncer_when_first_query_parameter():
    result = psycopg_connection_string(
        "postgresql://db.example/postgres?pgbouncer=true&sslmode=require&connect_timeout=10",
    )
    assert result == "postgresql://db.example/postgres?sslmode=require&connect_timeout=10"


def test_removes_pgbouncer_when_later_query_parameter():
    result = psycopg_connection_string(
        "postgresql://db.example/postgres?sslmode=require&pgbouncer=true&application_name=scraper",
    )
    assert result == "postgresql://db.example/postgres?sslmode=require&application_name=scraper"


def test_preserves_other_connection_parameters_and_credentials():
    result = psycopg_connection_string(
        "postgresql://user:p%40ss@db.example:5432/postgres?sslmode=require&pgbouncer=true&target_session_attrs=read-write",
    )
    assert result == "postgresql://user:p%40ss@db.example:5432/postgres?sslmode=require&target_session_attrs=read-write"