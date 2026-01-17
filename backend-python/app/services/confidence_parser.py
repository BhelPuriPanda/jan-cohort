from app.services.resume_parser import parse_resume
from app.services.confidence_scorer import score_field

def parse_with_confidence(text: str):
    parsed = parse_resume(text)

    return {
        "name": {
            "value": parsed.get("name"),
            "confidence": score_field(parsed.get("name"))
        },
        "email": {
            "value": parsed.get("email"),
            "confidence": score_field(parsed.get("email"))
        },
        "phone": {
            "value": parsed.get("phone"),
            "confidence": score_field(parsed.get("phone"))
        },
        "skills": {
            "value": parsed.get("skills"),
            "confidence": score_field(parsed.get("skills"))
        }
    }