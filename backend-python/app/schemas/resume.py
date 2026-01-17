from pydantic import BaseModel
from typing import Any

class ResumeUploadResponse(BaseModel):
    success: bool
    data: Any | None = None
    error: str | None = None
