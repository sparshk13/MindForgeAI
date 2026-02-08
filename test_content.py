import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_KEY")  # your Groq API key
url = "https://api.groq.com/openai/v1/chat/completions"

def test_fetch(topic: str):
    print(f"[INFO] Fetching study material for: {topic}")
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "llama3-8b-8192",   # or llama3-70b-8192 if enabled
            "messages": [
                {
                    "role": "user",
                    "content": (
                        f"Write a detailed study material on {topic}.\n"
                        f"Include sections:\n"
                        f"- Introduction\n"
                        f"- Key concepts (bullet points)\n"
                        f"- Real-world examples\n"
                        f"- Code snippets (if applicable)\n"
                        f"- ASCII diagrams or flowcharts."
                    )
                }
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()  # raise if error
        res_json = response.json()

        print("\n=== RESPONSE ===\n")
        print(res_json["choices"][0]["message"]["content"])

    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    test_fetch("Polymorphism")
