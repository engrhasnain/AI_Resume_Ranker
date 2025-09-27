from fastapi import FastAPI
from database import supabase
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

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



class Job(BaseModel):
    title: str
    description: str


@app.post("/addjobs")
def create_job(job: Job):
    response = supabase.table("jobs").insert({
        "title" : job.title,
        "description" : job.description
    }).execute()
    return {"Status" : "Job Added", "data": response.data}


@app.get("/jobs")
def list_jobs():
    """Fetch all jobs from Supabase."""
    response = supabase.table("jobs").select("*").execute()
    return {"jobs": response.data}


@app.put("/updatejob/{job_id}")
def update_job(job_id: str, job: Job):
    response = supabase.table("jobs").update({
        "title": job.title,
        "description": job.description
    }).eq("id", job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job updated successfully", "data": response.data}


@app.delete("/deletejob/{job_id}")
def delete_job(job_id: str):
    response = supabase.table("jobs").delete().eq("id", job_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted successfully"}
