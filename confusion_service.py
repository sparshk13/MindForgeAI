import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("your_secret_key")
LLM_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def get_confusion_summary(topic: str) -> str:
    """
    Generate an easy explanation for a topic using LLaMA.
    """
    prompt = (
        f"Explain '{topic}' in simple terms with examples, in 4-5 bullet points."
    )

    try:
        payload = {
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": "You are a helpful teacher."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.4
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        return content.strip()
    except Exception as e:
        print(f"⚠️ Confusion Summary Generation Failed: {e}")
        return "Sorry, could not generate summary."
