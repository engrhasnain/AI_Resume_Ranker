from fastapi import FastAPI
from database import supabase

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# 👇 Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "put /ping to test in the url after 8000, put /jobs after 8000 to get all the jobs"}

@app.get("/ping")
def ping():
    return {"message" : "pong"}

@app.post("/addjob")
def addjob(title: str, description: str):
    response = supabase.table("jobs").insert({
        "title" : title,
        "description" : description
    }).execute()
    return {"Status" : "Job Added", "data": response.data}

@app.get("/jobs")
def list_jobs():
    """Fetch all jobs from Supabase."""
    response = supabase.table("jobs").select("*").execute()
    return {"jobs": response.data}