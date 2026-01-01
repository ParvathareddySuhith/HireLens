from fastapi import UploadFile
import pypdf
import io

def extract_text_from_pdf(file_stream: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_stream))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_txt(file_stream: bytes) -> str:
    """Extract text from TXT bytes."""
    try:
        return file_stream.decode("utf-8").strip()
    except Exception as e:
        print(f"Error reading TXT: {e}")
        return ""

async def parse_resume(file: UploadFile) -> str:
    """
    Main function to parse resume based on file type.
    Returns extracted text.
    """
    content = await file.read()
    
    if file.filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif file.filename.lower().endswith(".txt"):
        return extract_text_from_txt(content)
    else:
        return ""
