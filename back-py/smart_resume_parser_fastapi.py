"""
Smart Resume Parser (FastAPI) - single-file implementation
- File: smart_resume_parser_fastapi.py
- Usage: pip install fastapi uvicorn python-multipart PyPDF2 python-docx pydantic
- Run: uvicorn smart_resume_parser_fastapi:app --reload --port 8000

Endpoints:
- POST  /api/resume/parse    -> upload PDF/DOCX (form field 'file'), returns raw text + parsed fields + confidence
- POST  /api/resume/save     -> save corrected profile (JSON body), returns saved id
- GET   /api/resume/saved    -> list saved profiles metadata
- GET   /api/resume/saved/{id} -> get saved profile

Notes:
- This is a mock parser (no ML). Extraction: PyPDF2 + python-docx for raw text. Parsing uses regex and heuristics.
- Saved profiles stored in a JSON file 'saved_profiles.json' in working dir.
"""

from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import tempfile
from PyPDF2 import PdfReader
from docx import Document
import re
import uuid
import json
import os
import threading

app = FastAPI(title="Smart Resume Parser (Mock)")
router = APIRouter()

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Smart Resume Parser is running"}

# CORS (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_FILE = "saved_profiles.json"
_storage_lock = threading.Lock()

# Ensure storage file exists
if not os.path.exists(STORAGE_FILE):
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

# --- utilities: text extraction ---
async def extract_text_from_pdf(upload_file: UploadFile) -> str:
    contents = await upload_file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    text = ""
    try:
        reader = PdfReader(tmp_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception:
        text = ""
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    return text

async def extract_text_from_docx(upload_file: UploadFile) -> str:
    contents = await upload_file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    text = ""
    try:
        doc = Document(tmp_path)
        for para in doc.paragraphs:
            if para.text:
                text += para.text + "\n"
    except Exception:
        text = ""
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    return text

# --- mock parser ---
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-\s]?)?(?:\(?\d{2,4}\)?[-\s]?)?\d{6,12}")
YEAR_RANGE_RE = re.compile(r"(19|20)\d{2}\s*(?:-\s*(19|20)\d{2})?")

COMMON_SKILLS = [
    "python", "java", "javascript", "react", "node", "node.js", "fastapi", "django",
    "docker", "kubernetes", "aws", "gcp", "sql", "postgresql", "mongodb", "c++", "c#",
    "html", "css", "typescript", "rust", "go"
]

EDU_KEYWORDS = ["b.tech", "bachelor", "bs", "ms", "msc", "mba", "degree", "education", "graduat"]
EXP_KEYWORDS = ["experience", "worked", "intern", "internship", "responsible", "developed"]
PROJ_KEYWORDS = ["project", "projects", "portfolio"]


def guess_name_from_text(text: str) -> (str, int):
    # Heuristic: first non-empty line with 2-4 words and letters
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if not lines:
        return "", 0
    # skip lines that look like emails/phones/headers
    for i, line in enumerate(lines[:8]):
        if EMAIL_RE.search(line) or PHONE_RE.search(line):
            continue
        if len(line.split()) >= 2 and len(line.split()) <= 4:
            # check capitalization
            words = line.split()
            cap_count = sum(1 for w in words if w[0].isupper())
            conf = 85 if cap_count >= len(words) - 0 else 65
            return line, conf
    # fallback to empty
    return lines[0] if lines else "", 50


def extract_skills(text: str) -> (List[str], int):
    found = []
    lowtxt = text.lower()
    for kw in COMMON_SKILLS:
        if kw in lowtxt:
            # canonicalize
            found.append(kw if not kw.startswith("node") else "Node.js")
    conf = 60 + min(len(found) * 8, 35) if found else 0
    return found, conf


def section_detect(text: str, keywords) -> bool:
    lt = text.lower()
    return any(k in lt for k in keywords)


def mock_parse(text: str) -> Dict[str, Any]:
    # Raw text -> structured fields with confidence scores (0-100)
    name, name_conf = guess_name_from_text(text)
    email_m = EMAIL_RE.search(text)
    phone_m = PHONE_RE.search(text)

    email = email_m.group(0) if email_m else None
    phone = phone_m.group(0) if phone_m else None

    email_conf = 95 if email else 0
    phone_conf = 90 if phone else 0

    skills, skills_conf = extract_skills(text)

    education_present = section_detect(text, EDU_KEYWORDS)
    experience_present = section_detect(text, EXP_KEYWORDS)
    projects_present = section_detect(text, PROJ_KEYWORDS)

    education_conf = 85 if education_present else 0
    experience_conf = 80 if experience_present else 0
    projects_conf = 75 if projects_present else 0

    # Try to extract short snippets for experience/education/projects by looking for headings
    def extract_section_lines(sec_names):
        lines = []
        up = text.upper()
        for sec in sec_names:
            idx = up.find(sec.upper())
            if idx != -1:
                # take following 3 lines
                part = text[idx: idx + 800]
                lines = [l.strip() for l in part.splitlines() if l.strip()][:6]
                break
        return lines

    edu_snippet = extract_section_lines(["EDUCATION"])
    exp_snippet = extract_section_lines(["EXPERIENCE", "WORK EXPERIENCE"])
    proj_snippet = extract_section_lines(["PROJECTS"])

    parsed = {
        "name": {"value": name or None, "confidence": int(name_conf)},
        "email": {"value": email or None, "confidence": int(email_conf)},
        "phone": {"value": phone or None, "confidence": int(phone_conf)},
        "skills": {"value": skills, "confidence": int(skills_conf)},
        "education": {"value": edu_snippet, "confidence": int(education_conf)},
        "work_experience": {"value": exp_snippet, "confidence": int(experience_conf)},
        "projects": {"value": proj_snippet, "confidence": int(projects_conf)},
    }
    return parsed

# --- storage helpers ---

def save_profile(profile: dict) -> str:
    profile_id = str(uuid.uuid4())
    entry = {
        "id": profile_id,
        "profile": profile
    }
    with _storage_lock:
        with open(STORAGE_FILE, "r+", encoding="utf-8") as f:
            try:
                arr = json.load(f)
            except Exception:
                arr = []
            arr.append(entry)
            f.seek(0)
            json.dump(arr, f, ensure_ascii=False, indent=2)
            f.truncate()
    return profile_id


def list_saved() -> List[dict]:
    with _storage_lock:
        with open(STORAGE_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return []


def get_saved(pid: str) -> Optional[dict]:
    arr = list_saved()
    for e in arr:
        if e.get("id") == pid:
            return e
    return None

# --- Pydantic models for save endpoint ---
class FieldItem(BaseModel):
    value: Any
    confidence: int = Field(..., ge=0, le=100)

class ResumeProfile(BaseModel):
    name: FieldItem
    email: FieldItem
    phone: FieldItem
    skills: FieldItem
    education: FieldItem
    work_experience: FieldItem
    projects: FieldItem

# --- Routes ---
@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    # Accept PDF or DOCX
    allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]
    if file.content_type not in allowed:
        # also allow based on filename ext fallback
        name = (file.filename or "").lower()
        if not (name.endswith('.pdf') or name.endswith('.docx') or name.endswith('.doc')):
            raise HTTPException(status_code=400, detail="Only PDF or DOCX files allowed")
    # Extract raw text
    if file.content_type == "application/pdf" or file.filename.lower().endswith('.pdf'):
        text = await extract_text_from_pdf(file)
    else:
        text = await extract_text_from_docx(file)

    if not text or not text.strip():
        # return raw empty but with message
        return JSONResponse(status_code=200, content={"success": True, "text": "", "parsed": {}})

    parsed = mock_parse(text)
    return {"success": True, "text": text, "parsed": parsed}

@router.post("/save")
async def save_corrected_profile(profile: ResumeProfile):
    # profile is validated by Pydantic
    pid = save_profile(profile.dict())
    return {"success": True, "id": pid}

@router.get("/saved")
async def list_profiles():
    arr = list_saved()
    # return only ids and brief meta
    res = [{"id": e['id'], "name": (e['profile'].get('name') or {}).get('value')} for e in arr]
    return {"success": True, "count": len(res), "items": res}

@router.get("/saved/{pid}")
async def get_profile(pid: str):
    e = get_saved(pid)
    if not e:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True, "item": e}

app.include_router(router, prefix="/api/resume", tags=["Resume"]) 

# quick CLI runner
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("smart_resume_parser_fastapi:app", host="0.0.0.0", port=8000, reload=True)
