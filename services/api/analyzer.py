"""Shared CSV validation and incident analysis logic."""

from __future__ import annotations

import csv
import io
import re
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import date
from statistics import mean
from typing import Iterable, TextIO

REQUIRED_COLUMNS = (
    "incident_id",
    "date",
    "country",
    "customer_type",
    "tracking_number",
    "carrier",
    "category",
    "description",
    "status",
    "customer_email",
    "satisfaction_score",
)
VALID_COUNTRIES = {"ES", "US"}
VALID_CUSTOMER_TYPES = {"B2B", "B2C"}
VALID_CATEGORIES = {"DAMAGE", "DELAYED_DELIVERY", "LOST_PARCEL", "RETURN_REQUEST", "WRONG_ADDRESS"}
VALID_STATUSES = {"OPEN", "CLOSED", "DISCARDED"}
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@dataclass(frozen=True)
class InvalidRecord:
    """One rejected CSV row and its human-readable validation reasons."""

    row_number: int
    reasons: list[str]


@dataclass(frozen=True)
class IncidentSummary:
    """Serializable analysis result shared by CLI, API and frontend."""

    total_records: int
    valid_records: int
    invalid_records: int
    invalid_by_type: dict[str, int]
    by_category: dict[str, int]
    by_status: dict[str, int]
    average_satisfaction_closed: float | None
    invalid_records_detail: list[InvalidRecord]

    def as_dict(self) -> dict[str, object]:
        return asdict(self)


def _validate_row(row: dict[str, str]) -> list[str]:
    reasons: list[str] = []
    required_fields = (
        "incident_id",
        "date",
        "country",
        "customer_type",
        "tracking_number",
        "carrier",
        "category",
        "description",
        "status",
    )
    for field in required_fields:
        if not row.get(field, "").strip():
            reasons.append(f"missing_field:{field}")

    try:
        date.fromisoformat(row.get("date", ""))
    except ValueError:
        reasons.append("invalid_date_format")

    if row.get("country") not in VALID_COUNTRIES:
        reasons.append("invalid_country")
    if row.get("customer_type") not in VALID_CUSTOMER_TYPES:
        reasons.append("invalid_customer_type")
    if row.get("category") not in VALID_CATEGORIES:
        reasons.append("invalid_category")
    if row.get("status") not in VALID_STATUSES:
        reasons.append("invalid_status")
    if not EMAIL_PATTERN.fullmatch(row.get("customer_email", "").strip()):
        reasons.append("invalid_email")

    satisfaction = row.get("satisfaction_score", "").strip()
    if satisfaction:
        try:
            score = int(satisfaction)
        except ValueError:
            reasons.append("invalid_satisfaction_score")
        else:
            if score < 1 or score > 5:
                reasons.append("satisfaction_score_out_of_range")
    return reasons


def analyze_rows(rows: Iterable[dict[str, str]]) -> IncidentSummary:
    """Validate rows and aggregate metrics from valid records only."""

    total_records = 0
    valid_rows: list[dict[str, str]] = []
    invalid_records: list[InvalidRecord] = []
    invalid_by_type: Counter[str] = Counter()

    for row_number, row in enumerate(rows, start=2):
        total_records += 1
        reasons = _validate_row(row)
        if reasons:
            invalid_records.append(InvalidRecord(row_number, reasons))
            for reason in reasons:
                invalid_by_type[reason.split(":", 1)[0]] += 1
        else:
            valid_rows.append(row)

    category_counts = Counter(row["category"] for row in valid_rows)
    status_counts = Counter(row["status"] for row in valid_rows)
    closed_scores = [
        int(row["satisfaction_score"])
        for row in valid_rows
        if row["status"] == "CLOSED" and row["satisfaction_score"].strip()
    ]

    return IncidentSummary(
        total_records=total_records,
        valid_records=len(valid_rows),
        invalid_records=len(invalid_records),
        invalid_by_type=dict(sorted(invalid_by_type.items())),
        by_category=dict(sorted(category_counts.items())),
        by_status={status: status_counts.get(status, 0) for status in sorted(VALID_STATUSES)},
        average_satisfaction_closed=round(mean(closed_scores), 2) if closed_scores else None,
        invalid_records_detail=invalid_records,
    )


def analyze_csv_stream(stream: TextIO) -> IncidentSummary:
    """Analyze a text CSV stream and reject missing or unexpected headers."""

    reader = csv.DictReader(stream)
    if reader.fieldnames is None:
        raise ValueError("El fichero CSV está vacío o no contiene cabecera.")
    if tuple(reader.fieldnames) != REQUIRED_COLUMNS:
        raise ValueError(
            "Formato incorrecto. Las columnas esperadas son: " + ", ".join(REQUIRED_COLUMNS)
        )
    return analyze_rows(reader)


def analyze_csv_bytes(content: bytes) -> IncidentSummary:
    """Decode UTF-8 CSV bytes and analyze them."""

    if not content.strip():
        raise ValueError("El fichero CSV está vacío.")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise ValueError("El fichero debe estar codificado en UTF-8.") from error
    return analyze_csv_stream(io.StringIO(text))
