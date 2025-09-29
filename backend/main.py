from fastapi import FastAPI, Depends
from database import supabase
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from auth import get_current_user

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



#application basemodel, api .post & .get methods are given
class Application(BaseModel):
    user_id: str
    job_id: str
    resume_id: str
    cover_letter: str = ""

@app.post("/apply")
def apply_job(app: Application):
    response = supabase.table("applications").insert({
        "user_id": app.user_id,
        "job_id": app.job_id,
        "resume_id": app.resume_id,
        "cover_letter": app.cover_letter
    }).execute()
    return {"message": "Application submitted", "data": response.data}

@app.get("/applications/{job_id}")
def get_applications(job_id: str):
    response = supabase.table("applications").select("*").eq("job_id", job_id).execute()
    return {"applications": response.data}


#get user from the backend
@app.post("/users/upsert")
def upsert_user(user = Depends(get_current_user)):
    # user is object returned from Supabase auth endpoint
    user_id = user["id"]
    email = user.get("email")
    name = user.get("user_metadata", {}).get("full_name") or user.get("email")
    resp = supabase.table("users").upsert({
        "id": user_id,
        "email": email,
        "full_name": name
    }).execute()
    return {"user": resp.data}