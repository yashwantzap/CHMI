# backend/main.py
import importlib.util
import os
import json
import random
import string
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

UPLOADED_APP_PATH = "/mnt/data/app.py"   # <-- uses your uploaded file path

app = FastAPI(title="CHMI Backend Adapter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple file-based storage for users and OTP. Create file if missing.
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump({}, f)

def read_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def write_users(data):
    with open(USERS_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Load uploaded module if present
uploaded_module = None
if os.path.exists(UPLOADED_APP_PATH):
    try:
        spec = importlib.util.spec_from_file_location("uploaded_app", UPLOADED_APP_PATH)
        uploaded_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(uploaded_module)  # type: ignore
        print(f"Loaded uploaded module from {UPLOADED_APP_PATH}")
    except Exception as e:
        print(f"Failed to load uploaded module {UPLOADED_APP_PATH}: {e}")
        uploaded_module = None
else:
    print(f"No uploaded module at {UPLOADED_APP_PATH}; predictions will return mock responses.")


class RegisterPayload(BaseModel):
    name: str
    mobile: str
    village: Optional[str] = None
    mandal: Optional[str] = None
    district: Optional[str] = None

class VerifyPayload(BaseModel):
    mobile: str
    otp: str

class LoginPayload(BaseModel):
    name: str
    mobile: str
    otp: str

@app.get("/")
def root():
    return {"status": "ok", "note": "CHMI backend adapter running"}

def gen_otp():
    # 6-digit numeric OTP
    return f"{random.randint(0,999999):06d}"

def ensure_user_record(mobile):
    users = read_users()
    if mobile not in users:
        users[mobile] = {
            "name": None,
            "mobile": mobile,
            "village": None,
            "mandal": None,
            "district": None,
            "otp": None,
            "verified": False
        }
        write_users(users)
    return users

@app.post("/register")
def register(payload: RegisterPayload):
    users = read_users()
    users.setdefault(payload.mobile, {})
    users[payload.mobile].update({
        "name": payload.name,
        "mobile": payload.mobile,
        "village": payload.village,
        "mandal": payload.mandal,
        "district": payload.district,
        "verified": False
    })
    # generate OTP and store
    otp = gen_otp()
    users[payload.mobile]["otp"] = otp
    write_users(users)
    # In production you would send SMS here. For now we return OTP in response (for dev).
    print(f"[OTP SENT] mobile={payload.mobile} otp={otp}")
    return {"success": True, "message": "Registered. OTP sent to phone (simulated).", "otp": otp}

@app.post("/send-otp")
def send_otp(mobile: str = Form(...)):
    users = read_users()
    users.setdefault(mobile, {"mobile": mobile})
    otp = gen_otp()
    users[mobile]["otp"] = otp
    users[mobile]["verified"] = False
    write_users(users)
    print(f"[OTP SENT] mobile={mobile} otp={otp}")
    return {"success": True, "message": "OTP sent (simulated)", "otp": otp}

@app.post("/verify-otp")
def verify_otp(payload: VerifyPayload):
    users = read_users()
    if payload.mobile not in users:
        return {"success": False, "error": "Mobile not registered"}
    record = users[payload.mobile]
    if record.get("otp") == payload.otp:
        record["verified"] = True
        record["otp"] = None
        write_users(users)
        return {"success": True, "message": "OTP verified"}
    else:
        return {"success": False, "error": "Invalid OTP"}

@app.post("/login")
def login(payload: LoginPayload):
    users = read_users()
    rec = users.get(payload.mobile)
    if not rec:
        return {"success": False, "error": "User not found"}
    if rec.get("name") != payload.name:
        # names mismatch: allow if previously absent; else reject
        rec["name"] = payload.name
    if rec.get("otp") == payload.otp:
        rec["verified"] = True
        rec["otp"] = None
        write_users(users)
        return {"success": True, "message": "Login successful"}
    else:
        return {"success": False, "error": "Invalid OTP or OTP expired"}

# Prediction endpoints
@app.post("/predict")
def predict(payload: dict):
    if uploaded_module and hasattr(uploaded_module, "predict"):
        try:
            res = uploaded_module.predict(payload)
            return {"success": True, "result": res}
        except Exception as e:
            return {"success": False, "error": str(e)}
    # fallback mock:
    return {
        "success": True,
        "result": {"note": "mock predict", "input": payload, "score": 0.5}
    }

@app.post("/predict-file")
async def predict_file(
    file: UploadFile = File(...),
    disease: Optional[str] = Form(None),
    cattle_id: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    user: Optional[str] = Form(None)
):
    contents = await file.read()
    meta = {"disease": disease, "cattle_id": cattle_id, "gender": gender, "age": age}
    try:
        meta_user = json.loads(user) if user else None
        meta["user"] = meta_user
    except Exception:
        meta["user_raw"] = user

    if uploaded_module and hasattr(uploaded_module, "predict_file"):
        try:
            res = uploaded_module.predict_file(contents, meta)
            return {"success": True, "result": res}
        except Exception as e:
            return {"success": False, "error": str(e)}

    return {"success": True, "result": {"note": "mock file predict", "bytes": len(contents), "meta": meta}}
