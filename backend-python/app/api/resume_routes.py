from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.text_extractor import extract_text_from_pdf
from app.services.langchain_parser import parse_resume_llm
from app.schemas.resume import ResumeUploadResponse

router = APIRouter()

@router.post("/resume/parse", response_model=ResumeUploadResponse)
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    try:
        text = await extract_text_from_pdf(file)
        parsed_data = parse_resume_llm(text)

        return {
            "success": True,
            "data": parsed_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))