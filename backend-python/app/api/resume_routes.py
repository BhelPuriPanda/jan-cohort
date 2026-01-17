# app/api/resume_routes.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import os

router = APIRouter()

# Make sure the uploads folder exists
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Only allow PDFs
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

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
