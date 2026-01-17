import pdfplumber
import os

def parse_pdf(file_path: str) -> dict:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        
        # In a real scenario with LLM, we would send 'text' to the LLM here.
        # For now, we return the raw text and some basic metadata.
        return {
            "success": True,
            "text": text,
            "message": "Text extracted successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
