
import json
from pathlib import Path
from config import COMMISSION_EMAIL, OUTPUT_JSON_PATH


def save_report_to_json(report: dict, output_path: str = OUTPUT_JSON_PATH) -> None:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open("w", encoding="utf-8") as file:
        json.dump(report, file, ensure_ascii=False, indent=4)


def send_report_to_committee(report: dict) -> None:
    print("=" * 70)
    print(f"Sending report to admissions committee: {COMMISSION_EMAIL}")
    print("=" * 70)
    print(json.dumps(report, ensure_ascii=False, indent=4))
    print("=" * 70)
    print("Report prepared and sent successfully.")