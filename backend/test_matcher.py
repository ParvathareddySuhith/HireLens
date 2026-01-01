
try:
    from app.core.matcher import match_resume_to_job
    
    resume_skills = "python, fastapi, mysql"
    job_skills_1 = "python, fastapi, mysql, docker"
    job_skills_2 = "java, spring"
    
    # Test 1: Partial Match
    result1 = match_resume_to_job(resume_skills, job_skills_1)
    print(f"Test 1 (Partial): {result1['score']}% - {result1['explanation']}")
    
    # Test 2: No Match
    result2 = match_resume_to_job(resume_skills, job_skills_2)
    print(f"Test 2 (No Match): {result2['score']}% - {result2['explanation']}")

    if result1['score'] == 75.0 and result2['score'] == 0.0:
        print("SUCCESS: Matcher logic is correct.")
    else:
        print("FAILURE: Scores are incorrect.")

except Exception as e:
    print(f"FAILURE: {e}")
