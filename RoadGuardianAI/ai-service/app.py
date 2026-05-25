from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriageData(BaseModel):
    injury: float
    bleeding: float
    consciousness: float
    breathing: float
    distance: float

@app.get("/")
def home():
    return {"message": "RoadSoS AI Triage Running"}

@app.post("/triage")
def triage(data: TriageData):
    score = (
        data.injury * 0.25 +
        data.bleeding * 0.25 +
        data.consciousness * 0.20 +
        data.breathing * 0.20 +
        data.distance * 0.10
    )

    if score >= 75:
        priority = "HIGH"
        action = "Call ambulance immediately and share live location."
    elif score >= 45:
        priority = "MEDIUM"
        action = "Reach nearest trauma center as soon as possible."
    else:
        priority = "LOW"
        action = "Monitor condition and seek medical advice."

    return {
        "triage_score": round(score, 2),
        "priority": priority,
        "action": action
    }