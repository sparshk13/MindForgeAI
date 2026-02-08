from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from markdown2 import markdown
from xhtml2pdf import pisa
import os
import requests
from dotenv import load_dotenv

from services.html_to_pdf_service import html_file_to_pdf

load_dotenv()

router = APIRouter()

class PDFRequest(BaseModel):
    topic: str

LLAMA_API_KEY = os.getenv("your_secret_key")

def generate_ai_content(topic: str) -> str:
    prompt = f"""
Create a **detailed study guide** on {topic}.
Include:
1. Introduction
2. Key Concepts (bullet points)
3. Real-world examples
4. Code examples (if applicable)
5. ASCII diagrams or flowcharts.
Generate me proper HTML file with all the contents
Make sure you just return me the html code and no other supporting text.
"""
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {LLAMA_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 2048
            }
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print("[LLaMA API Error]:", e)
        return f"# Study Material for {topic}\n\n❌ LLaMA API error: {str(e)}"

def convert_html_to_pdf(source_html: str, output_filename: str):
    with open(output_filename, "wb") as output_file:
        pisa_status = pisa.CreatePDF(source_html, dest=output_file)
    return pisa_status.err == 0

@router.post("/generate-pdf")
def generate_pdf(data: PDFRequest):
    if not data.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")
    content = generate_ai_content(data.topic)
    url = html_file_to_pdf(content, data.topic)
    return {"pdf_url": url}

    # try:
    #     os.makedirs("generated_pdfs", exist_ok=True)
    #     filename = data.topic.replace(" ", "_") + ".pdf"
    #     pdf_path = os.path.join("generated_pdfs", filename)

    #     if not convert_html_to_pdf(content_html, pdf_path):
    #         raise HTTPException(status_code=500, detail="PDF conversion failed.")

    #     return {"pdf_url": f"http://127.0.0.1:8000/generated_pdfs/{filename}"}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")


