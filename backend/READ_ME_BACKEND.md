# CHMI Backend Adapter

Run:
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Endpoints:
- POST /register           -> {name,mobile,village,mandal,district} -> returns otp (simulated)
- POST /send-otp           -> form field 'mobile'
- POST /verify-otp         -> {mobile,otp}
- POST /login              -> {name,mobile,otp}
- POST /predict            -> JSON payload to call uploaded app.predict(payload)
- POST /predict-file       -> multipart, file + meta
