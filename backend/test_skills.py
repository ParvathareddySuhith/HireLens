
try:
    from app.core.skill_extractor import extract_skills
    
    test_text = "I have experience with Python, FastAPI, and I know some Java. I also use Git and Docker."
    expected_skills = {"python", "fastapi", "java", "git", "docker"}
    
    extracted = extract_skills(test_text)
    extracted_set = set(extracted.split(",")) if extracted else set()
    
    print(f"Text: {test_text}")
    print(f"Extracted: {extracted}")
    
    if expected_skills == extracted_set:
        print("SUCCESS: Skills extracted correctly.")
    else:
        print(f"FAILURE: Expected {expected_skills}, got {extracted_set}")

except Exception as e:
    print(f"FAILURE: {e}")
