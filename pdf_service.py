import os
from fpdf import FPDF
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

client = OpenAI(api_key=os.getenv("CHATGPT_KEY"))

def fetch_topic_content(topic: str) -> str:
    try:
        print(f"[INFO] Fetching content for topic: {topic}")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": (
                    f"Create a detailed study guide on {topic}.\n"
                    f"Include sections:\n"
                    f"1. Introduction\n"
                    f"2. Key Concepts (bullet points)\n"
                    f"3. Real-world examples\n"
                    f"4. Code examples (if applicable)\n"
                    f"5. ASCII diagrams or flowcharts.\n"
                    f"Make it well-structured and clear."
                )
            }],
            max_completion_tokens=1000
        )
        print("[DEBUG] API Raw Response:", response)
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[PDF Service] OpenAI API Error: {e}")
        return f"Study material for {topic} is currently unavailable due to API error."

def generate_topic_pdf(topic: str) -> str:
    content = fetch_topic_content(topic)
    safe_content = content.encode('latin-1', 'replace').decode('latin-1')

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, f"Study Material: {topic}\n\n{safe_content}")

    folder_path = "generated_pdfs"
    os.makedirs(folder_path, exist_ok=True)
    pdf_path = f"{folder_path}/{topic.replace(' ', '_')}.pdf"
    pdf.output(pdf_path)

    print(f"[INFO] PDF generated at {pdf_path}")
    return pdf_path
