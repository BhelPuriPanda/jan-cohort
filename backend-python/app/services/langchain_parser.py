from langchain_core.prompts import PromptTemplate
from app.services.ollama_llm import run_llm

PROMPT = PromptTemplate(
    input_variables=["resume"],
    template="""
You are a resume parser.
Extract Name, Email, Skills, Education, Experience.
Return STRICT JSON only.

Resume:
{resume}
"""
)

def parse_resume_llm(resume_text: str):
    response = run_llm(PROMPT.format(resume=resume_text))
    return response