# backend/auth.py
import os, requests
from fastapi import Header, HTTPException, Depends
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = parts[1]

    # Query Supabase auth user endpoint
    r = requests.get(f"{SUPABASE_URL}/auth/v1/user",
                     headers={"Authorization": f"Bearer {token}"})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return r.json()   # returns user object (contains id, email, user_metadata, etc.)
