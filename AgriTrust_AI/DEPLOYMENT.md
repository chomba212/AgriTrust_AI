# AgriTrust AI Cloud Deployment

This project now has the Person 5 cloud, GIS, weather, DevOps, and pipeline deliverables:

- Weather API integration through Open-Meteo
- Climate risk service and GIS-ready GeoJSON risk layer
- Dockerized backend and frontend
- CI/CD with GitHub Actions
- Climate data pipeline command
- Optional Google Cloud Run deployment job

## Local Docker Run

```bash
docker compose up --build
```

Open the frontend at:

```text
http://localhost:8080
```

The backend API is available at:

```text
http://localhost:5000/api/health
```

## Weather And Climate Risk APIs

Open-Meteo does not require an API key for the forecast endpoint used here.

```text
GET /api/weather?lat=-1.1714&lon=36.8356&days=7
GET /api/climate-risk?lat=-1.1714&lon=36.8356&days=7
GET /api/farmers/1/climate-risk?days=7
GET /api/climate-risk/layer?days=7
```

`/api/climate-risk/layer` returns GeoJSON, so it can be rendered directly in GIS tools such as QGIS, Mapbox, Leaflet, ArcGIS, or cloud map services.

## Climate Data Pipeline

Generate the current GeoJSON climate risk layer from the backend:

```bash
cd backend
python pipelines/climate_pipeline.py 7
```

The optional argument is the Open-Meteo forecast window in days. Valid values are `1` through `16`.

## GitHub Actions CI/CD

The workflow at `.github/workflows/ci-cd.yml` runs:

1. Backend dependency installation and pytest tests
2. Frontend TypeScript/Vite build
3. Docker image builds and pushes to GitHub Container Registry on `main`
4. Optional deployment of the backend image to Google Cloud Run

For GHCR image push, no extra secret is needed because the workflow uses `GITHUB_TOKEN`.

## Optional Google Cloud Run Deployment

Add these GitHub variables/secrets to enable the deploy job:

- Variable: `GCP_PROJECT_ID`
- Variable: `GCP_REGION`, for example `europe-west1`
- Secret: `GCP_WORKLOAD_IDENTITY_PROVIDER`
- Secret: `GCP_SERVICE_ACCOUNT`

The backend will deploy as `agritrust-ai-backend`.

## AWS Or Azure Alternative

The Docker images built by the pipeline can also be deployed to:

- AWS ECS, App Runner, or Elastic Beanstalk
- Azure Container Apps, App Service, or AKS

Use the backend container on port `5000` and the frontend container on port `80`. Keep `VITE_API_BASE=/api` when the frontend reverse-proxies API calls through nginx, or set it to the public backend URL when deploying frontend and backend separately.
