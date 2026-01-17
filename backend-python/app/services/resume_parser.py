import re

def parse_resume(text: str) -> dict:
    email = re.search(r'[\w\.-]+@[\w\.-]+', text)
    phone = re.search(r'\+?\d[\d\s-]{8,}', text)

    skills = []
    skills_section = re.search(r"SKILLS(.+?)\n\n", text, re.DOTALL | re.IGNORECASE)
    if skills_section:
        skills = [s.strip() for s in skills_section.group(1).split(",")]

    return {
        "name": text.split("\n")[0],
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None,
        "skills": skills
    }