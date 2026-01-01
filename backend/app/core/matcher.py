def match_resume_to_job(resume_skills_str: str, job_skills_str: str) -> dict:
    """
    Compare resume skills with job required skills.
    Returns score, matched skills, missing skills, and explanation.
    """
    # Normalize and parse skills into sets
    def parse_skills(skills_str):
        if not skills_str:
            return set()
        # Split by comma, strip whitespace, and lower case
        return {s.strip().lower() for s in skills_str.split(',') if s.strip()}

    resume_skills = parse_skills(resume_skills_str)
    job_skills = parse_skills(job_skills_str)

    if not job_skills:
        return {
            "score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "explanation": "No skills required for this job."
        }

    # Calculate intersection and difference
    matched = resume_skills.intersection(job_skills)
    missing = job_skills - resume_skills

    # Calculate Score
    # Simple formula: (matched / total required) * 100
    score = (len(matched) / len(job_skills)) * 100
    score = round(score, 2)

    # Convert sets back to sorted lists for display
    matched_list = sorted(list(matched))
    missing_list = sorted(list(missing))

    # Generate Explanation
    explanation = f"Match Score: {score}%. "
    if matched_list:
        explanation += f"Matched skills: {', '.join(matched_list)}. "
    else:
        explanation += "No skills matched. "
    
    if missing_list:
        explanation += f"Missing skills: {', '.join(missing_list)}."
    else:
        explanation += "Candidate has all required skills."

    return {
        "score": score,
        "matched_skills": matched_list,
        "missing_skills": missing_list,
        "explanation": explanation
    }
