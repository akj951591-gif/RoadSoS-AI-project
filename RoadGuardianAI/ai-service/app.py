from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

app = FastAPI(
    title="RoadSoS AI Backend",
    description="AI emergency triage backend for RoadSoS AI project",
    version="1.0.0",
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


@app.get("/")
def home():
    return {
        "success": True,
        "message": "RoadSoS AI Backend Running",
        "service": "AI Emergency Triage",
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
        data.injury * 0.25 +
        data.bleeding * 0.25 +
        data.consciousness * 0.20 +
        data.breathing * 0.20 +
        data.distance * 0.10
    )

    score = round(score, 2)

    if score >= 80:
        priority = "CRITICAL"
        risk_level = "Extreme"
        emergency = True
        color = "red"
        action = "Call ambulance immediately. Share live location and avoid moving the injured person unless there is danger."
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
        action = "Emergency medical help is required urgently. Move to the nearest trauma center if ambulance is delayed."
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
        action = "Medical attention is recommended. Visit the nearest hospital or clinic soon."
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
        action = "Condition appears less severe. Continue monitoring and seek medical advice if symptoms increase."
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
        "input_summary": {
            "injury": data.injury,
            "bleeding": data.bleeding,
            "consciousness": data.consciousness,
            "breathing": data.breathing,
            "distance": data.distance,
        },
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)