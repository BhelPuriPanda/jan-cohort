from fastapi import FastAPI
from app.api.resume_routes import router as resume_router

app = FastAPI(title="Smart Resume Parser")

app.include_router(resume_router, prefix="/api", tags=["Resume"])

@app.get("/")
def health():
    return {"status": "running"}
