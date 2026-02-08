import os
import json
import requests
import re
import uuid
from sqlalchemy.orm import Session
from app.models import Roadmap, SubTopic
from dotenv import load_dotenv
from services.qdrant_service import insert_roadmap, insert_user_roadmap, init_qdrant_collection, embedding_model

# Load environment variables
load_dotenv()
API_KEY = os.getenv("your_secret_key")

LLM_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Ensure main Qdrant collection exists
init_qdrant_collection()

# ----------------- UTILITIES -----------------
def extract_clean_json(raw: str) -> str:
    """Extract and clean JSON content from LLM response."""
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise Exception("No JSON object found in LLM response.")

    content = match.group(0).strip()
    content = content.replace("“", '"').replace("”", '"').replace("’", "'")
    content = content.replace('Bayes" theorem', "Bayes' theorem")
    content = re.sub(r'([a-zA-Z])"([a-zA-Z])', r'\1\'\2', content).replace("'", '"')
    content = re.sub(r'\\(?!["\\/bfnrt])', r'\\\\', content)
    content = re.sub(r"\s+", " ", content)
    content = re.sub(r",\s*}", "}", content)
    content = re.sub(r",\s*]", "]", content)

    json.loads(content)  # Validate JSON
    return content


def get_roadmap_from_prompt(prompt: str):
    """Call LLM API to generate roadmap JSON with resource links."""
    payload = {
        "model": LLM_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a roadmap generator. "
                    "Return valid JSON with keys: topic, description, subtopics (list of {title, description, link}). "
                    "The 'link' must be a direct tutorial page from GeeksforGeeks only."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Generate a detailed learning roadmap for: {prompt}. "
                    "Each subtopic must include a direct GeeksforGeeks tutorial link. Respond with JSON only."
                )
            }
        ],
        "temperature": 0.2
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    response.raise_for_status()

    raw_content = response.json()['choices'][0]['message']['content']
    return json.loads(extract_clean_json(raw_content))


# ----------------- MAIN FUNCTION -----------------
def generate_and_save_roadmap(prompt: str, user_id: str, db: Session, level: str = "Beginner"):
    """Generate roadmap, save to Postgres, Qdrant, and user_roadmaps."""

    print(f"🔑 API_KEY loaded: {API_KEY}")

    try:
        roadmap_json = get_roadmap_from_prompt(prompt)
    except Exception as e:
        print(f"⚠️ Groq API failed: {e}")
        roadmap_json = {
            "topic": prompt,
            "description": "Default roadmap due to API failure.",
            "subtopics": []
        }

    roadmap_json["level"] = roadmap_json.get("level", level)

    # Save in Postgres
    roadmap = Roadmap(
        user_id=user_id,
        topic=roadmap_json.get('topic', 'Unknown Topic'),
        description=roadmap_json.get('description', ''),
        level=roadmap_json["level"]
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    clean_subtopics = []
    for sub in roadmap_json.get("subtopics", []):
        title = sub.get('title', sub.get('topic', ''))
        desc = sub.get('description', '')

        # Generate direct GeeksforGeeks link
        link = sub.get('link') or f"https://www.geeksforgeeks.org/{title.strip().replace(' ', '-').lower()}/"

        db.add(SubTopic(roadmap_id=roadmap.id, title=title, description=desc))
        clean_subtopics.append({
            "title": title,
            "description": desc,
            "link": link
        })
    db.commit()

    # Save in Qdrant
    try:
        roadmap_payload = {
            "roadmap_id": str(roadmap.id),
            "user_id": str(user_id),
            "topic": roadmap.topic,
            "level": roadmap.level,
            "description": roadmap.description,
            "subtopics": clean_subtopics
        }

        vector = embedding_model.encode(json.dumps(roadmap_payload)).tolist()
        insert_roadmap(str(uuid.uuid4()), vector, roadmap_payload)
        insert_user_roadmap(str(user_id), str(roadmap.id), prompt)

        print(f"✅ Roadmap inserted for user_id={roadmap_payload['user_id']} (vector length={len(vector)})")
    except Exception as e:
        print(f"⚠️ Qdrant insertion skipped: {e}")

    return roadmap_payload
