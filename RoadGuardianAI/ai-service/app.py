from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from passlib.hash import bcrypt
import os
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["roadsos_ai"]
users_collection = db["users"]


class TriageData(BaseModel):
    injury: float
    bleeding: float
    consciousness: float
    breathing: float
    distance: float


class UserSignup(BaseModel):
    name: str
    email: str
    phone: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class ChangePassword(BaseModel):
    email: str
    old_password: str
    new_password: str


@app.get("/")
def home():
    return {"message": "RoadSoS AI Backend Running"}


@app.post("/signup")
def signup(user: UserSignup):
    existing = users_collection.find_one({"email": user.email})

    if existing:
        return {"success": False, "message": "User already exists"}

    role = "admin" if user.email == "admin@roadsos.com" else "user"

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "password": bcrypt.hash(user.password),
        "role": role,
    })

    return {"success": True, "message": "Account created successfully"}


@app.post("/login")
def login(user: UserLogin):
    existing = users_collection.find_one({"email": user.email})

    if not existing:
        return {"success": False, "message": "User not found"}

    if not bcrypt.verify(user.password, existing["password"]):
        return {"success": False, "message": "Invalid password"}

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "name": existing["name"],
            "email": existing["email"],
            "phone": existing["phone"],
            "role": existing.get("role", "user"),
        },
    }


@app.post("/change-password")
def change_password(data: ChangePassword):
    existing = users_collection.find_one({"email": data.email})

    if not existing:
        return {"success": False, "message": "User not found"}

    if not bcrypt.verify(data.old_password, existing["password"]):
        return {"success": False, "message": "Old password incorrect"}

    users_collection.update_one(
        {"email": data.email},
        {"$set": {"password": bcrypt.hash(data.new_password)}}
    )

    return {"success": True, "message": "Password changed successfully"}


@app.get("/admin/users")
def get_all_users():
    users = []

    for user in users_collection.find({}, {"password": 0}):
        users.append({
            "name": user.get("name"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "role": user.get("role", "user"),
        })

    return {"users": users}


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
        "action": action,
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)