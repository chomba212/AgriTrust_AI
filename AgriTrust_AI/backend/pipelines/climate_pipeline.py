import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from climate_service import build_climate_risk_layer
from data.mock_data import farmers


def main():
    forecast_days = int(sys.argv[1]) if len(sys.argv) > 1 else 7
    layer = build_climate_risk_layer(farmers, forecast_days=forecast_days)
    print(json.dumps(layer, indent=2))


if __name__ == "__main__":
    main()
