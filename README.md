
 AgriTrust AI

Making the Invisible Farmer Visible

> An Explainable Graph AI Platform that helps financial institutions assess smallholder farmers  more fairly and accurately
using alternative data, climate intelligence, and trusted agricultural networks.

Overview

Across Africa, millions of smallholder farmers remain excluded from formal credit systems despite being productive and economically active. Traditional lending models depend heavily on collateral, land ownership, and formal financial records—requirements that many farmers cannot meet.

AgriTrust AI addresses this challenge by creating a **Digital Trust Profile** for farmers using alternative data sources such as mobile money transactions, cooperative participation, farm activity, repayment behavior, and climate risk indicators.

Using **Neo4j Graph Technology**, Explainable AI, and Climate Intelligence, the platform enables lenders to make faster, fairer, and more transparent lending decisions while improving financial inclusion for underserved farming communities.

 Challenge Statement

This project was developed for the **AFRACA Challenge** under the **Kenya AI Challenge 2026**.

Problem

Smallholder farmers often lack:

* Formal credit histories
* Land titles
* Collateral
* Structured financial records

As a result, many are classified as high-risk despite demonstrating responsible financial and farming behavior.

Impact

This exclusion limits:

* Access to agricultural financing
* Adoption of modern farming technologies
* Climate resilience investments
* Agricultural productivity
* Rural economic growth

---

 Our Solution

AgriTrust AI transforms alternative farmer data into actionable lending intelligence.

Instead of asking:

> "What collateral does this farmer own?"

We ask:

> "What trust signals has this farmer demonstrated?"

The platform analyzes:

* Mobile money activity
* Cooperative membership
* Loan repayment behavior
* Farm production records
* Input purchase history
* Weather and climate exposure
* Community trust networks

to generate a transparent and explainable **Farmer Trust Score**.

---

 Key Features

1.Graph AI Credit Scoring

Uses Neo4j Graph Data Science to model relationships between farmers, cooperatives, lenders, climate events, and agricultural activities.

2. Loan Officer Dashboard

Provides a complete view of:

* Farmer profiles
* Trust scores
* Risk levels
* Lending recommendations
* Climate risk indicators

3. Explainable AI

Every recommendation is accompanied by a clear explanation showing the factors that influenced the score.

4. Climate-Aware Risk Assessment

Integrates weather and drought intelligence to improve agricultural lending decisions.

5.Credit Readiness Recommendations

Provides farmers with actionable steps to improve their future access to finance.

System Architecture

```text
Farmer Data Sources
│
├── Mobile Money Activity
├── Cooperative Records
├── Loan History
├── Farm Production Data
├── Climate Data
└── Input Purchases
        │
        ▼
Neo4j Graph Database
        │
        ▼
Graph AI & Risk Engine
        │
        ▼
Explainable AI Layer
        │
        ▼
Loan Officer Dashboard
        │
        ▼
Lending Recommendations
```

---

Technology Stack

1. Frontend

* React
* TypeScript
* Tailwind CSS
* Lovable

2. Backend

* Node.js
* Express
* REST APIs

3. Database

* Neo4j AuraDB
* PostgreSQL

4.Artificial Intelligence

* Python
* Scikit-Learn
* XGBoost
* SHAP
* Neo4j Graph Data Science

5.Data Sources

* Open-Meteo API
* Climate datasets
* Cooperative data
* Mobile money simulations

 6.Cloud & DevOps

* Docker
* GitHub Actions
* AWS / Azure
* Masumi

 Team Structure

| Role                     | Responsibility                                          |
| ------------------------ | ------------------------------------------------------- |
| Product Lead             | Product strategy, documentation, business impact, pitch |
| Graph AI Engineer        | Neo4j graph modeling and trust engine                   |
| AI/ML Engineer           | Credit scoring, explainability, risk prediction         |
| Frontend Engineer        | Dashboard, user experience, visualizations              |
| Backend & Cloud Engineer | APIs, integrations, deployment                          |


 Repository Structure

```text
agritrust-ai/
│
├── frontend/
├── backend/
├── neo4j/
├── ai-engine/
├── integrations/
├── deployment/
├── docs/
└── presentations/
```

 Expected Outcomes

AgriTrust AI aims to:

* Increase access to formal agricultural credit
* Improve lending confidence
* Support women and youth inclusion
* Reduce financial exclusion
* Enhance agricultural productivity
* Strengthen climate resilience



Vision

We envision a future where access to finance is determined not by collateral ownership alone, but by a farmer's demonstrated trustworthiness, productivity, and potential.

AgriTrust AI transforms invisible farmers into visible opportunities.


Partners & Ecosystem

This project leverages technologies and resources from:

* Neo4j
* Lovable
* Masumi
* Featherless AI
* AFRACA
* Kenya AI Challenge


License

This project is developed for educational, innovation, and competition purposes under the Kenya AI Challenge 2026.


“Building trust-driven finance for Africa's farmers, one relationship at a time.”
