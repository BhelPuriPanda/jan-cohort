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

# ============================================================
# IMPORTS & INITIALIZATION
# ============================================================
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import tempfile
from PyPDF2 import PdfReader  # Extract text from PDF files
from docx import Document  # Extract text from DOCX files
import re  # Regular expressions for pattern matching
import uuid  # Generate unique identifiers for saved profiles
import json  # JSON serialization for storage
import os  # Operating system utilities
import threading  # Thread-safe file access

# Initialize FastAPI application
app = FastAPI(title="Smart Resume Parser (Mock)")
router = APIRouter()  # Create router for API endpoints

# Health check endpoint to verify API is running
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Smart Resume Parser is running"}

# ============================================================
# CORS CONFIGURATION
# ============================================================
# Allow cross-origin requests from all sources
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_credentials=True,  # Allow cookies/credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ============================================================
# STORAGE CONFIGURATION
# ============================================================
STORAGE_FILE = "saved_profiles.json"  # File to store parsed resume profiles
_storage_lock = threading.Lock()  # Prevent concurrent file access

# Initialize storage file if it doesn't exist
if not os.path.exists(STORAGE_FILE):
    with open(STORAGE_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)  # Create empty JSON array

# ============================================================
# TEXT EXTRACTION UTILITIES
# ============================================================
# Extract text from PDF files using PyPDF2
async def extract_text_from_pdf(upload_file: UploadFile) -> str:
    """Extract text content from a PDF file."""
    # Read uploaded PDF file contents
    contents = await upload_file.read()
    
    # Write to temporary file (PyPDF2 requires file path)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    
    text = ""
    try:
        # Parse PDF and extract text from each page
        reader = PdfReader(tmp_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception:
        # Return empty string if extraction fails
        text = ""
    finally:
        # Clean up temporary file
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    
    return text

async def extract_text_from_docx(upload_file: UploadFile) -> str:
    """Extract text content from a DOCX (Word) file."""
    # Read uploaded DOCX file contents
    contents = await upload_file.read()
    
    # Write to temporary file (python-docx requires file path)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    
    text = ""
    try:
        # Parse DOCX and extract text from each paragraph
        doc = Document(tmp_path)
        for para in doc.paragraphs:
            if para.text:
                text += para.text + "\n"
    except Exception:
        # Return empty string if extraction fails
        text = ""
    finally:
        # Clean up temporary file
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    
    return text

# ============================================================
# PARSING CONFIGURATION & REGEX PATTERNS
# ============================================================
# Regular expression patterns for extracting structured data
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")  # Email addresses
PHONE_RE = re.compile(r"(\+?\d{1,3}[-\s]?)?(?:\(?\d{2,4}\)?[-\s]?)?\d{6,12}")  # Phone numbers
YEAR_RANGE_RE = re.compile(r"(19|20)\d{2}\s*(?:-\s*(19|20)\d{2})?")  # Year ranges (employment periods)

# Common technical skills to look for in resumes
COMMON_SKILLS = [
    "python", "java", "javascript", "react", "node", "node.js", "fastapi", "django",
    "docker", "kubernetes", "aws", "gcp", "sql", "postgresql", "mongodb", "c++", "c#",
    "html", "css", "typescript", "rust", "go"
]

# Keywords for detecting different resume sections
EDU_KEYWORDS = ["b.tech", "bachelor", "bs", "ms", "msc", "mba", "degree", "education", "graduat"]  # Education section
EXP_KEYWORDS = ["experience", "worked", "intern", "internship", "responsible", "developed"]  # Work experience section
PROJ_KEYWORDS = ["project", "projects", "portfolio"]  # Projects section


def guess_name_from_text(text: str) -> (str, int):
    """Heuristic to extract person's name from resume text.
    Returns: (name_string, confidence_score)
    """
    # Split text into lines and clean whitespace
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if not lines:
        return "", 0
    
    # Skip lines that look like contact info (emails/phones)
    for i, line in enumerate(lines[:8]):
        if EMAIL_RE.search(line) or PHONE_RE.search(line):
            continue
        
        # Name is typically 2-4 capitalized words
        if len(line.split()) >= 2 and len(line.split()) <= 4:
            # Check if words are properly capitalized
            words = line.split()
            cap_count = sum(1 for w in words if w[0].isupper())
            # Higher confidence if all words capitalized
            conf = 85 if cap_count >= len(words) - 0 else 65
            return line, conf
    
    # Fallback: return first non-empty line with low confidence
    return lines[0] if lines else "", 50


def extract_skills(text: str) -> (List[str], int):
    """Extract known technical skills from resume text.
    Returns: (list_of_skills, confidence_score)
    """
    found = []
    lowtxt = text.lower()  # Convert to lowercase for matching
    
    # Search for each common skill keyword in the text
    for kw in COMMON_SKILLS:
        if kw in lowtxt:
            # Normalize skill names (e.g., "node" -> "Node.js")
            found.append(kw if not kw.startswith("node") else "Node.js")
    
    # Calculate confidence: base 60% + bonus for number of skills found
    conf = 60 + min(len(found) * 8, 35) if found else 0
    return found, conf


def section_detect(text: str, keywords) -> bool:
    """Check if any keyword from a list appears in the resume text.
    Used to detect presence of resume sections (e.g., Education, Experience).
    """
    lt = text.lower()
    return any(k in lt for k in keywords)


def mock_parse(text: str) -> Dict[str, Any]:
    """Parse resume text and extract structured fields with confidence scores.
    This is a heuristic-based parser (not ML-based).
    Returns: Dictionary with extracted fields and confidence scores (0-100)
    """
    # Extract name using heuristic function
    name, name_conf = guess_name_from_text(text)
    
    # Extract email and phone using regex patterns
    email_m = EMAIL_RE.search(text)
    phone_m = PHONE_RE.search(text)

    # Extract contact information
    email = email_m.group(0) if email_m else None
    phone = phone_m.group(0) if phone_m else None

    # Set high confidence for regex-matched contact info
    email_conf = 95 if email else 0
    phone_conf = 90 if phone else 0

    # Extract skills using keyword matching
    skills, skills_conf = extract_skills(text)

    # Detect presence of major resume sections
    education_present = section_detect(text, EDU_KEYWORDS)
    experience_present = section_detect(text, EXP_KEYWORDS)
    projects_present = section_detect(text, PROJ_KEYWORDS)

    # Confidence scores for sections based on keyword detection
    education_conf = 85 if education_present else 0
    experience_conf = 80 if experience_present else 0
    projects_conf = 75 if projects_present else 0

    # Extract text snippets from major sections (first 6 lines after section heading)
    def extract_section_lines(sec_names):
        """Find section heading and extract following lines."""
        lines = []
        up = text.upper()
        for sec in sec_names:
            idx = up.find(sec.upper())
            if idx != -1:
                # Extract 800 characters starting from section heading
                part = text[idx: idx + 800]
                # Take up to 6 lines, stripping whitespace
                lines = [l.strip() for l in part.splitlines() if l.strip()][:6]
                break
        return lines

    # Extract content snippets from each major section
    edu_snippet = extract_section_lines(["EDUCATION"])
    exp_snippet = extract_section_lines(["EXPERIENCE", "WORK EXPERIENCE"])
    proj_snippet = extract_section_lines(["PROJECTS"])

    # Compile all extracted fields with their confidence scores
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

# ============================================================
# STORAGE/PERSISTENCE FUNCTIONS
# ============================================================

def save_profile(profile: dict) -> str:
    """Save a parsed resume profile to persistent storage.
    Returns: Unique profile ID
    """
    # Generate unique identifier for this profile
    profile_id = str(uuid.uuid4())
    entry = {
        "id": profile_id,
        "profile": profile
    }
    
    # Thread-safe file write to prevent concurrent access issues
    with _storage_lock:
        with open(STORAGE_FILE, "r+", encoding="utf-8") as f:
            try:
                # Load existing profiles
                arr = json.load(f)
            except Exception:
                # Initialize empty array if file is invalid
                arr = []
            
            # Add new profile
            arr.append(entry)
            
            # Write updated array back to file
            f.seek(0)  # Move to beginning of file
            json.dump(arr, f, ensure_ascii=False, indent=2)
            f.truncate()  # Remove any remaining old content
    
    return profile_id


def list_saved() -> List[dict]:
    """Retrieve all saved profiles from storage.
    Returns: List of profile entries with ID and data
    """
    with _storage_lock:
        with open(STORAGE_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                # Return empty list if file is corrupted
                return []


def get_saved(pid: str) -> Optional[dict]:
    """Retrieve a specific saved profile by ID.
    Returns: Profile entry or None if not found
    """
    arr = list_saved()
    for e in arr:
        if e.get("id") == pid:
            return e
    return None

# ============================================================
# PYDANTIC MODELS (Request/Response validation)
# ============================================================

class FieldItem(BaseModel):
    """Represents a single extracted field with confidence score."""
    value: Any  # The extracted value (string, list, etc.)
    confidence: int = Field(..., ge=0, le=100)  # Confidence score 0-100

class ResumeProfile(BaseModel):
    """Complete parsed resume profile with all extracted fields."""
    name: FieldItem
    email: FieldItem
    phone: FieldItem
    skills: FieldItem
    education: FieldItem
    work_experience: FieldItem
    projects: FieldItem

# ============================================================
# API ROUTES
# ============================================================

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse a resume file (PDF or DOCX) and extract structured data.
    Returns: Raw text + parsed fields with confidence scores
    """
    # Validate file type
    allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ]
    if file.content_type not in allowed:
        # Fallback to filename extension check
        name = (file.filename or "").lower()
        if not (name.endswith('.pdf') or name.endswith('.docx') or name.endswith('.doc')):
            raise HTTPException(status_code=400, detail="Only PDF or DOCX files allowed")
    
    # Extract text based on file type
    if file.content_type == "application/pdf" or file.filename.lower().endswith('.pdf'):
        text = await extract_text_from_pdf(file)
    else:
        text = await extract_text_from_docx(file)

    # Handle empty file case
    if not text or not text.strip():
        return JSONResponse(status_code=200, content={"success": True, "text": "", "parsed": {}})

    # Parse the extracted text into structured fields
    parsed = mock_parse(text)
    return {"success": True, "text": text, "parsed": parsed}

@router.post("/save")
async def save_corrected_profile(profile: ResumeProfile):
    """Save a parsed/corrected resume profile to persistent storage.
    Request body: Validated ResumeProfile object
    Returns: Saved profile ID
    """
    # Profile is automatically validated by Pydantic
    pid = save_profile(profile.dict())
    return {"success": True, "id": pid}

@router.get("/saved")
async def list_profiles():
    """List all saved resume profiles with brief metadata.
    Returns: List of profile IDs and names
    """
    arr = list_saved()
    # Extract only ID and name for each profile
    res = [{"id": e['id'], "name": (e['profile'].get('name') or {}).get('value')} for e in arr]
    return {"success": True, "count": len(res), "items": res}

@router.get("/saved/{pid}")
async def get_profile(pid: str):
    """Retrieve a specific saved resume profile by ID.
    Returns: Complete profile data or 404 if not found
    """
    e = get_saved(pid)
    if not e:
        raise HTTPException(status_code=404, detail="Not found")
    return {"success": True, "item": e}

# Register router with API prefix
app.include_router(router, prefix="/api/resume", tags=["Resume"]) 

# ============================================================
# APPLICATION STARTUP
# ============================================================
if __name__ == "__main__":
    import uvicorn
    # Run FastAPI server on localhost:8000 with auto-reload for development
    uvicorn.run("smart_resume_parser_fastapi:app", host="0.0.0.0", port=8000, reload=True)
