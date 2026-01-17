from fastapi import HTTPException
import pdfplumber
from io import BytesIO

async def extract_text_from_pdf(file) -> str:
    text = ""
    file_bytes = await file.read()

    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    if not text or len(text.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="No extractable text found in PDF (possibly scanned image)"
        )

    print("Extracted Characters:", len(text))
    return text
# import tempfile
# from PyPDF2 import PdfReader

# async def extract_text_from_pdf(upload_file):
#     contents = await upload_file.read()

#     with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
#         tmp.write(contents)
#         tmp_path = tmp.name

#     reader = PdfReader(tmp_path)

#     text = ""
#     for page in reader.pages:
#         extracted = page.extract_text()
#         if extracted:
#             text += extracted + "\n"

#     return text
