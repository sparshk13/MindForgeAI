import os
import requests

GROQ_API_KEY = os.getenv("GROQ_KEY")  # Make sure this is in your .env file

def generate_summary_for_topic(topic: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama3-70b-8192",
        "messages": [
            {
                "role": "system",
                "content": "You are an AI tutor. Given a topic, generate a short and useful summary with key concepts in simple words."
            },
            {
                "role": "user",
                "content": f"Generate a short, bullet-point style summary for: {topic}"
            }
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        reply = response.json()["choices"][0]["message"]["content"]
        return reply.strip()
    except Exception as e:
        print("Groq LLM error:", e)
        return "Summary generation failed. Try again later."
