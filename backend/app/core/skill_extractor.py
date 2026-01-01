import re

# Predefined list of technical skills
SKILL_DB = {
    "python", "java", "c++", "c#", "javascript", "typescript", "html", "css",
    "sql", "mysql", "postgresql", "mongodb", "fastapi", "flask", "django",
    "react", "angular", "vue", "node", "express", "aws", "azure", "gcp",
    "docker", "kubernetes", "git", "linux", "machine learning", "ai", 
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"
}

def extract_skills(text: str) -> str:
    """
    Extracts skills from text based on a predefined list.
    Returns a comma-separated string of unique found skills.
    """
    if not text:
        return ""
    
    # Normalize text to lowercase
    text_lower = text.lower()
    
    found_skills = set()
    
    # Simple keyword matching
    # Iterate through skills and check existence in text
    for skill in SKILL_DB:
        # Use regex to match whole words/phrases to avoid partial matches (e.g., 'java' in 'javascript')
        # Escape skill for regex mainly for C++
        escaped_skill = re.escape(skill)
        pattern = r'\b' + escaped_skill + r'\b'
        
        if re.search(pattern, text_lower):
            found_skills.add(skill)
            
    return ",".join(sorted(found_skills))
