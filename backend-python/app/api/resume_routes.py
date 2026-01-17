# app/api/resume_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import os

from app.services.text_extractor import extract_text_from_pdf
from app.services.confidence_parser import parse_with_confidence
from app.schemas.resume import ResumeResponse

router = APIRouter()

# Optional: store uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

    try:
        # 2️⃣ (Optional) Save file to disk
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file_bytes = await file.read()

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        # 3️⃣ Extract text from PDF (WORKING LOGIC)
        # IMPORTANT: pass UploadFile again using BytesIO logic
        from io import BytesIO
        import pdfplumber

        text = ""
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        if not text.strip():
            raise ValueError("No extractable text found in PDF")

        # 4️⃣ Parse resume using LLM
        parsed_data = parse_resume_llm(text)

        # 5️⃣ Return clean response
        return {
            "success": True,
            "data": parsed_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    # Optional cleanup
    # finally:
    #     if os.path.exists(file_path):
    #         os.remove(file_path)
