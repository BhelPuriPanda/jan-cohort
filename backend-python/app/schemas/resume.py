from pydantic import BaseModel
from typing import Any

class FieldConfidence(BaseModel):
    value: Any
    confidence: int

class ResumeResponse(BaseModel):
    success: bool
    data: dict