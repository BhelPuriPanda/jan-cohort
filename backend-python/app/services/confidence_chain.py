from app.services.ollama_llm import run_llm

def parse_resume(text: str):
    prompt = f"""
    Extract structured resume data from the text below:
    {text}
    """
    return run_llm(prompt)
