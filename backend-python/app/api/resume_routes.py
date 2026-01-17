from fastapi import APIRouter, UploadFile, File
from app.services.text_extractor import extract_text_from_pdf
from app.services.confidence_parser import parse_with_confidence
from app.schemas.resume import ResumeResponse

router = APIRouter()

@router.post("/resume/parse", response_model=ResumeResponse)
async def parse_resume_api(file: UploadFile = File(...)):
    text = await extract_text_from_pdf(file)
    parsed_data = parse_with_confidence(text)

    return {
        "success": True,
        "data": parsed_data
    }