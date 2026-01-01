from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.session import get_db_connection
import mysql.connector

router = APIRouter()

class JobCreate(BaseModel):
    user_id: int
    title: str
    description: str
    required_skills: str

@router.post("/jobs/")
def create_job(job: JobCreate):
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO jobs (user_id, title, description, required_skills)
            VALUES (%s, %s, %s, %s)
        """
        values = (job.user_id, job.title, job.description, job.required_skills)
        
        cursor.execute(query, values)
        connection.commit()
        job_id = cursor.lastrowid
        
        cursor.close()
        connection.close()
        
        return {"id": job_id, "message": "Job created successfully"}
        
    except mysql.connector.Error as err:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@router.get("/jobs/")
def get_jobs():
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, title FROM jobs ORDER BY id DESC")
        jobs = cursor.fetchall()
        cursor.close()
        connection.close()
        return jobs
    except Exception as e:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# Resume API
from fastapi import File, UploadFile, Form
from app.core.resume_parser import parse_resume
from app.core.skill_extractor import extract_skills

@router.post("/resumes/")
async def upload_resume(
    user_id: int = Form(...),
    candidate_name: str = Form(...),
    file: UploadFile = File(...)
):
    # Validate file type
    if not (file.filename.lower().endswith(".pdf") or file.filename.lower().endswith(".txt")):
         raise HTTPException(status_code=400, detail="Only PDF and TXT files are allowed")

    # Extract text
    resume_text = await parse_resume(file)
    if not resume_text:
        raise HTTPException(status_code=400, detail="Failed to extract text from resume")

    # Extract skills
    extracted_skills_str = extract_skills(resume_text)

    # Save to DB
    connection = get_db_connection()
    if not connection:
         raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = connection.cursor()
        query = """
            INSERT INTO resumes (user_id, candidate_name, content, extracted_skills, experience_years)
            VALUES (%s, %s, %s, %s, %s)
        """
        # For now, experience is placeholder as per requirements
        values = (user_id, candidate_name, resume_text, extracted_skills_str, 0)
        
        cursor.execute(query, values)
        connection.commit()
        resume_id = cursor.lastrowid
        
        cursor.close()
        connection.close()
        
        return {"id": resume_id, "message": "Resume uploaded successfully"}

    except mysql.connector.Error as err:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@router.get("/resumes/")
def get_resumes():
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, candidate_name FROM resumes ORDER BY id DESC")
        resumes = cursor.fetchall()
        cursor.close()
        connection.close()
        return resumes
    except Exception as e:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# Matcher API
from app.core.matcher import match_resume_to_job

class MatchRequest(BaseModel):
    job_id: int
    resume_id: int

@router.post("/matches/")
def create_match(match_req: MatchRequest):
    connection = get_db_connection()
    if not connection:
         raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = connection.cursor(dictionary=True) # Use dictionary cursor for easier access

        # Fetch Job
        cursor.execute("SELECT required_skills FROM jobs WHERE id = %s", (match_req.job_id,))
        job = cursor.fetchone()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Fetch Resume
        cursor.execute("SELECT extracted_skills FROM resumes WHERE id = %s", (match_req.resume_id,))
        resume = cursor.fetchone()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
            
        # Perform Match
        job_skills = job['required_skills'] or ""
        resume_skills = resume['extracted_skills'] or ""
        
        result = match_resume_to_job(resume_skills, job_skills)
        
        # Insert Match Result
        query = """
            INSERT INTO matches (job_id, resume_id, score, matched_skills, missing_skills, explanation)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        matched_str = ",".join(result['matched_skills'])
        missing_str = ",".join(result['missing_skills'])
        
        cursor.execute(query, (
            match_req.job_id, 
            match_req.resume_id, 
            result['score'], 
            matched_str, 
            missing_str, 
            result['explanation']
        ))
        
        connection.commit()
        match_id = cursor.lastrowid
        
        cursor.close()
        connection.close()
        
        return {
            "match_id": match_id,
            "score": result['score'],
            "explanation": result['explanation'],
            "matched_skills": result['matched_skills'],
            "missing_skills": result['missing_skills']
        }

    except mysql.connector.Error as err:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        if connection:
            connection.close()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

