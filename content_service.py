import os
from dotenv import load_dotenv
from openai import OpenAI  # ✅ Make sure it's the new openai>=1.3.0 version

load_dotenv()  # ✅ Load environment variables

api_key = os.getenv("GROQ_KEY")  # ✅ Make sure this matches your .env
if not api_key:
    raise ValueError("GROQ_KEY is missing in environment variables")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"  # ✅ Mandatory for Groq
)

def fetch_study_material(topic: str):
    print(f"[INFO] Fetching study material for: {topic}")
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",  # ✅ Free model on Groq
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Write a detailed study material on {topic}.\n"
                        f"Include:\n"
                        f"- Introduction\n"
                        f"- Key concepts (bullet points)\n"
                        f"- Real-world examples\n"
                        f"- Code snippets (if applicable)\n"
                        f"- ASCII diagrams or flowcharts."
                    )
                }
            ],
            max_tokens=800  # ✅ Safe limit for Groq
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[ERROR] {e}")
        return f"■ LLaMA API error: {e}"
