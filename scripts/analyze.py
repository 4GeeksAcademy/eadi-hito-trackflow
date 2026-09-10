#!/usr/bin/env python3
"""Analyze a TrackFlow incidents CSV from the command line."""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from services.api.analyzer import IncidentSummary, analyze_csv_stream  # noqa: E402


def _print_section(title: str) -> None:
    print(f"\n{'=' * 64}\n{title}\n{'=' * 64}")


def print_summary(summary: IncidentSummary) -> None:
    _print_section("RESUMEN DE INCIDENTES TRACKFLOW")
    print(f"{'Registros procesados:':35}{summary.total_records:>8}")
    print(f"{'Registros válidos:':35}{summary.valid_records:>8}")
    print(f"{'Registros inválidos:':35}{summary.invalid_records:>8}")

    _print_section("PROBLEMAS DE VALIDACIÓN")
    if summary.invalid_by_type:
        for problem, count in summary.invalid_by_type.items():
            print(f"{problem:35}{count:>8}")
    else:
        print("Sin registros inválidos.")

    _print_section("INCIDENTES POR CATEGORÍA")
    for category, count in summary.by_category.items():
        print(f"{category:35}{count:>8}")

    _print_section("INCIDENTES POR ESTADO")
    for status, count in summary.by_status.items():
        print(f"{status:35}{count:>8}")

    _print_section("SATISFACCIÓN")
    average = summary.average_satisfaction_closed
    print(f"{'Media de cierres puntuados:':35}{average if average is not None else 'N/D':>8}")


def write_results(summary: IncidentSummary, output_path: Path) -> None:
    rows = [
        ("total_records", summary.total_records),
        ("valid_records", summary.valid_records),
        ("invalid_records", summary.invalid_records),
        ("average_satisfaction_closed", summary.average_satisfaction_closed or ""),
    ]
    rows.extend((f"invalid_by_type.{key}", value) for key, value in summary.invalid_by_type.items())
    rows.extend((f"by_category.{key}", value) for key, value in summary.by_category.items())
    rows.extend((f"by_status.{key}", value) for key, value in summary.by_status.items())
    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(("metric", "value"))
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser(description="Analiza un CSV de incidentes de TrackFlow.")
    parser.add_argument("csv_path", type=Path, help="Ruta al fichero incidents-TRACKFLOW.csv")
    args = parser.parse_args()
    try:
        with args.csv_path.open(newline="", encoding="utf-8-sig") as file:
            summary = analyze_csv_stream(file)
    except (OSError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print_summary(summary)
    answer = input("¿Deseas exportar los resultados a CSV? [s / n] ").strip().lower()
    if answer == "s":
        write_results(summary, Path("results.csv"))
        print("Resultados guardados en results.csv")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
