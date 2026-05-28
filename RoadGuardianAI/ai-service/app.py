from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

app = FastAPI(
    title="RoadSoS AI Backend",
    description="AI backend for emergency triage and accident risk prediction",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TriageData(BaseModel):
    injury: float = Field(..., ge=0, le=100)
    bleeding: float = Field(..., ge=0, le=100)
    consciousness: float = Field(..., ge=0, le=100)
    breathing: float = Field(..., ge=0, le=100)
    distance: float = Field(..., ge=0, le=100)


class RiskData(BaseModel):
    speed: float = Field(..., ge=0, le=150)
    vibration: float = Field(..., ge=0, le=100)
    weather: float = Field(..., ge=0, le=100)
    driver_condition: float = Field(..., ge=0, le=100)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "RoadSoS AI Backend Running",
        "services": [
            "AI Emergency Triage",
            "AI Accident Risk Prediction",
        ],
        "status": "online",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "message": "Backend is working properly",
    }


@app.post("/triage")
def triage(data: TriageData):
    score = (
        data.injury * 0.25
        + data.bleeding * 0.25
        + data.consciousness * 0.20
        + data.breathing * 0.20
        + data.distance * 0.10
    )

    score = round(score, 2)

    if score >= 80:
        priority = "CRITICAL"
        risk_level = "Extreme"
        emergency = True
        color = "red"
        action = (
            "Call ambulance immediately. Share live location and avoid "
            "moving the injured person unless there is danger."
        )
        advice = [
            "Call emergency services immediately.",
            "Keep the victim still and calm.",
            "Check breathing and consciousness.",
            "Share GPS location with emergency contact.",
        ]

    elif score >= 65:
        priority = "HIGH"
        risk_level = "Severe"
        emergency = True
        color = "orange"
        action = (
            "Emergency medical help is required urgently. Move to the "
            "nearest trauma center if ambulance is delayed."
        )
        advice = [
            "Call ambulance as soon as possible.",
            "Control bleeding with clean cloth if present.",
            "Monitor breathing continuously.",
            "Prepare to navigate to nearest hospital.",
        ]

    elif score >= 40:
        priority = "MEDIUM"
        risk_level = "Moderate"
        emergency = False
        color = "yellow"
        action = (
            "Medical attention is recommended. Visit the nearest hospital "
            "or clinic soon."
        )
        advice = [
            "Visit a nearby medical center.",
            "Keep monitoring the victim.",
            "Avoid unnecessary movement.",
            "Use map to locate nearby hospital.",
        ]

    else:
        priority = "LOW"
        risk_level = "Mild"
        emergency = False
        color = "green"
        action = (
            "Condition appears less severe. Continue monitoring and seek "
            "medical advice if symptoms increase."
        )
        advice = [
            "Monitor symptoms carefully.",
            "Keep emergency contact informed.",
            "Visit clinic if pain or discomfort increases.",
            "Stay hydrated and calm.",
        ]

    return {
        "success": True,
        "triage_score": score,
        "priority": priority,
        "risk_level": risk_level,
        "emergency": emergency,
        "color": color,
        "action": action,
        "advice": advice,
        "input_summary": data.model_dump(),
    }


@app.post("/predict")
def predict_risk(data: RiskData):
    score = (
        data.speed * 0.35
        + data.vibration * 0.25
        + data.weather * 0.20
        + data.driver_condition * 0.20
    )

    score = round(score, 2)

    if score >= 85:
        accident_risk = "CRITICAL"
        severity = "Extreme"
        emergency = True
        color = "red"
        action = "Very high accident risk. Slow down immediately and stop at a safe place."

    elif score >= 65:
        accident_risk = "HIGH"
        severity = "Severe"
        emergency = True
        color = "orange"
        action = "High accident risk. Reduce speed and increase attention."

    elif score >= 40:
        accident_risk = "MEDIUM"
        severity = "Moderate"
        emergency = False
        color = "yellow"
        action = "Moderate risk. Drive carefully and monitor road conditions."

    else:
        accident_risk = "LOW"
        severity = "Low"
        emergency = False
        color = "green"
        action = "Low risk. Continue driving safely."

    return {
        "success": True,
        "risk_score": score,
        "accident_risk": accident_risk,
        "severity": severity,
        "emergency": emergency,
        "color": color,
        "action": action,
        "message": "AI accident risk analysis completed",
        "input_summary": data.model_dump(),
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)