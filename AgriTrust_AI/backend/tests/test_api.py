from unittest.mock import patch

from app import app


def test_health_endpoint():
    client = app.test_client()
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_climate_risk_uses_forecast_data():
    client = app.test_client()
    weather = {
        "daily": {
            "temperature_2m_max": [28],
            "precipitation_sum": [2],
            "precipitation_probability_max": [20],
            "wind_speed_10m_max": [18],
            "et0_fao_evapotranspiration": [24],
        }
    }

    with patch("app.fetch_weather_forecast", return_value=weather):
        response = client.get("/api/climate-risk?lat=-1.2&lon=36.8")

    body = response.get_json()
    assert response.status_code == 200
    assert body["risk"]["risk_level"] == "Moderate"
    assert "Drought pressure from low rain and high crop water demand" in body["risk"]["drivers"]
