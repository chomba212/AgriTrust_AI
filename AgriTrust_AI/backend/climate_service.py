import os
from datetime import datetime, timezone

import requests


OPEN_METEO_FORECAST_URL = os.getenv(
    "OPEN_METEO_FORECAST_URL",
    "https://api.open-meteo.com/v1/forecast",
)

DEFAULT_DAILY_VARIABLES = ",".join(
    [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "precipitation_probability_max",
        "wind_speed_10m_max",
        "et0_fao_evapotranspiration",
    ]
)

CURRENT_VARIABLES = ",".join(
    [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
    ]
)


def fetch_weather_forecast(latitude, longitude, forecast_days=7, timezone_name="Africa/Nairobi"):
    if not -90 <= latitude <= 90:
        raise ValueError("latitude must be between -90 and 90")
    if not -180 <= longitude <= 180:
        raise ValueError("longitude must be between -180 and 180")
    if not 1 <= forecast_days <= 16:
        raise ValueError("forecast_days must be between 1 and 16")

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": CURRENT_VARIABLES,
        "daily": DEFAULT_DAILY_VARIABLES,
        "forecast_days": forecast_days,
        "timezone": timezone_name,
    }
    timeout = float(os.getenv("OPEN_METEO_TIMEOUT_SECONDS", "8"))
    response = requests.get(OPEN_METEO_FORECAST_URL, params=params, timeout=timeout)
    response.raise_for_status()
    return response.json()


def _values(weather, key):
    return weather.get("daily", {}).get(key) or []


def _is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _sum(values):
    return round(sum(value for value in values if _is_number(value)), 2)


def _max(values):
    numeric_values = [value for value in values if _is_number(value)]
    return max(numeric_values) if numeric_values else 0


def compute_climate_risk(weather):
    precipitation_sum = _sum(_values(weather, "precipitation_sum"))
    max_temp = _max(_values(weather, "temperature_2m_max"))
    max_wind = _max(_values(weather, "wind_speed_10m_max"))
    evapotranspiration = _sum(_values(weather, "et0_fao_evapotranspiration"))
    precipitation_probability = _max(_values(weather, "precipitation_probability_max"))

    risk_points = 0
    drivers = []

    if precipitation_sum >= 75 or (precipitation_sum >= 35 and precipitation_probability >= 85):
        risk_points += 35
        drivers.append("Flood pressure from heavy forecast rainfall")
    elif precipitation_sum <= 8 and evapotranspiration >= 22:
        risk_points += 30
        drivers.append("Drought pressure from low rain and high crop water demand")

    if max_temp >= 32:
        risk_points += 25
        drivers.append("Heat stress risk for crops and livestock")

    if max_wind >= 35:
        risk_points += 15
        drivers.append("High wind exposure that can damage field crops")

    if risk_points >= 55:
        level = "High"
    elif risk_points >= 25:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "risk_level": level,
        "risk_score": min(100, risk_points),
        "drivers": drivers or ["No major climate stressors detected in the forecast window"],
        "metrics": {
            "forecast_precipitation_mm": precipitation_sum,
            "max_temperature_c": max_temp,
            "max_wind_speed_kmh": max_wind,
            "evapotranspiration_mm": evapotranspiration,
            "max_precipitation_probability": precipitation_probability,
        },
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def build_climate_risk_layer(farmers, forecast_days=7):
    features = []
    for farmer in farmers:
        coordinates = farmer.get("coordinates")
        if not coordinates:
            continue

        weather = fetch_weather_forecast(
            coordinates["latitude"],
            coordinates["longitude"],
            forecast_days=forecast_days,
        )
        risk = compute_climate_risk(weather)
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [coordinates["longitude"], coordinates["latitude"]],
                },
                "properties": {
                    "farmer_id": farmer["id"],
                    "farmer_name": farmer["name"],
                    "location": farmer["location"],
                    "primary_crop": farmer["primary_crop"],
                    "risk_level": risk["risk_level"],
                    "risk_score": risk["risk_score"],
                    "drivers": risk["drivers"],
                    "metrics": risk["metrics"],
                    "generated_at": risk["generated_at"],
                },
            }
        )

    return {"type": "FeatureCollection", "features": features}
