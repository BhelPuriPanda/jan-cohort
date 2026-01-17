# app/api/resume_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import os

from app.services.text_extractor import extract_text_from_pdf
from app.services.langchain_parser import parse_resume_llm
from app.schemas.resume import ResumeUploadResponse

router = APIRouter()

# Optional: store uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

from app.services.resume_parser import parse_pdf


@router.post(
    "/resume/parse",
    response_model=ResumeUploadResponse
)
async def parse_resume(file: UploadFile = File(...)):

    # 1️⃣ Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Save the file to uploads folder
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents),
        "path": file_path
    }
