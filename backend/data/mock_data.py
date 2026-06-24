farmers = [
    {
        "id": 1,
        "name": "Amina Mwangi",
        "location": "Kiambu, Kenya",
        "primary_crop": "Coffee",
        "cooperative": "Nyeri Harvest Cooperative",
        "loan_status": "Active",
        "credit_readiness": "High",
        "scores": {
            "mobile_money": 84,
            "coop_trust": 78,
            "repayment": 91,
            "farm_data": 82
        },
        "climate_risk": "Moderate",
        "profile": "Smallholder farmer with a strong repayment history, cooperative leadership role, and growing climate resilience.",
        "mobile_money_trend": "Increasing mobile money adoption and transaction transparency.",
        "repayment_history": [
            {"year": 2024, "status": "On time", "amount": 9000},
            {"year": 2025, "status": "On time", "amount": 12000},
            {"year": 2026, "status": "On time", "amount": 14000}
        ],
        "climate_exposure": [
            "Moderate drought pressure during the short rains",
            "Coffee output sensitive to delayed precipitation",
            "Near-term heat stress in farm zone"
        ],
        "graph_insights": [
            "Connected to two trusted cooperatives",
            "Interactions show stable cycle of input purchases and repayments",
            "Strong network signal from active cooperative events"
        ],
        "recommendations": [
            "Keep mobile money records easily accessible",
            "Share cooperative attendance records with lender",
            "Strengthen weather adaptation practices"
        ],
        "next_steps": [
            "Document farm activity data monthly",
            "Enroll in climate-smart extension services",
            "Prepare digital summaries of input and harvest flows"
        ],
        "explainability": {
            "narrative": "Amina's high trust score is driven by dependable repayment behavior, cooperative leadership, and strong digital transaction data. Climate risk is managed through moderate exposure and resilient cropping choices.",
            "drivers": [
                "Repayment reliability",
                "Cooperative participation",
                "Mobile money footprint",
                "Farm data coverage"
            ],
            "evidence": [
                "14 months of on-time loan repayments",
                "Active role in a verified cooperative",
                "High volume of mobile money transactions",
                "Farm production data available for the current season"
            ]
        }
    },
    {
        "id": 2,
        "name": "John Ouma",
        "location": "Kisumu, Kenya",
        "primary_crop": "Maize",
        "cooperative": "Lakeview Farmers Network",
        "loan_status": "Pending",
        "credit_readiness": "Medium",
        "scores": {
            "mobile_money": 72,
            "coop_trust": 65,
            "repayment": 80,
            "farm_data": 70
        },
        "climate_risk": "High",
        "profile": "Maize farmer building trust with consistent repayments and expanding cooperative participation despite stronger climate headwinds.",
        "mobile_money_trend": "Regular but low transaction volume with seasonal variability.",
        "repayment_history": [
            {"year": 2024, "status": "On time", "amount": 7000},
            {"year": 2025, "status": "Delayed", "amount": 9200},
            {"year": 2026, "status": "On time", "amount": 11000}
        ],
        "climate_exposure": [
            "High flood risk during the long rains",
            "Maize fields exposed to erratic temperature swings",
            "Growing need for drought-tolerant seed adoption"
        ],
        "graph_insights": [
            "Emerging cooperative connections",
            "Loan event history is correlated with positive repayment signals",
            "Climate events are the strongest driver for additional support"
        ],
        "recommendations": [
            "Submit more farm purchase records",
            "Increase mobile money transaction consistency",
            "Connect with climate-smart advisory services"
        ],
        "next_steps": [
            "Document input purchases in a simple ledger",
            "Share cooperative repayment receipts",
            "Enroll in local weather insurance"
        ],
        "explainability": {
            "narrative": "John's trust score reflects steady repayment and improving cooperative activity, tempered by higher climate risk and limited farm data coverage.",
            "drivers": [
                "Timely repayments",
                "Cooperative membership",
                "Mobile transaction visibility",
                "Climate risk exposure"
            ],
            "evidence": [
                "Consistent repayments with one delay last season",
                "Membership in Lakeview Farmers Network",
                "Stable mobile money record over the past year",
                "Climate alerts from the region"
            ]
        }
    },
    {
        "id": 3,
        "name": "Fatima Njeri",
        "location": "Embu, Kenya",
        "primary_crop": "Horticulture",
        "cooperative": "Embu Growers Union",
        "loan_status": "Approved",
        "credit_readiness": "Very High",
        "scores": {
            "mobile_money": 92,
            "coop_trust": 88,
            "repayment": 95,
            "farm_data": 88
        },
        "climate_risk": "Low",
        "profile": "Vegetable producer with excellent digital trust signals, strong cooperative partnerships, and resilient weather strategies.",
        "mobile_money_trend": "Consistent and transparent digital records.",
        "repayment_history": [
            {"year": 2024, "status": "On time", "amount": 10500},
            {"year": 2025, "status": "On time", "amount": 11800},
            {"year": 2026, "status": "On time", "amount": 13200}
        ],
        "climate_exposure": [
            "Low drought pressure with irrigation support",
            "Protected horticulture reduces extreme weather losses",
            "Stable crop output despite seasonal variability"
        ],
        "graph_insights": [
            "Strong network signal across horticulture and input suppliers",
            "High-frequency loan and repayment interactions",
            "Consistent climate-ready behavior in dataset"
        ],
        "recommendations": [
            "Continue sharing digital farm records",
            "Use cooperative climate risk reports",
            "Leverage credit readiness coaching for growth loans"
        ],
        "next_steps": [
            "Expand trusted input supplier relationships",
            "Capture harvest volumes in mobile apps",
            "Prepare a credit improvement plan with your cooperative"
        ],
        "explainability": {
            "narrative": "Fatima's score is driven by excellent repayment behavior, rich digital records, and low climate exposure, making her an ideal candidate for growth financing.",
            "drivers": [
                "Digital financial footprints",
                "Verified cooperative ties",
                "High-quality farm data",
                "Low climate risk"
            ],
            "evidence": [
                "Multiple on-time repayments",
                "Verified cooperative reporting",
                "Comprehensive horticulture production logs",
                "Regionally low climate alerts"
            ]
        }
    }
]

applications = {
    "approved": 18,
    "pending": 6,
    "declined": 3,
    "last_month_change": "+12%"
}

climate_data = {
    "weather_alerts": 4,
    "regional_risk": "Medium",
    "recommended_actions": [
        "Increase climate smart advisory coverage",
        "Promote early warning alerts to all farmers",
        "Strengthen adaptive irrigation partnerships"
    ],
    "climate_events": [
        {"type": "drought", "season": "Short rains", "severity": "medium"},
        {"type": "flood", "season": "Long rains", "severity": "high"},
        {"type": "heatwave", "season": "Dry season", "severity": "low"}
    ]
}
