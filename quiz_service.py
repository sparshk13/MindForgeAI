import os
import json
import requests
import uuid
from sqlalchemy.orm import Session
from app.models import Question
from datetime import datetime
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

API_KEY = os.getenv("your_secret_key")
LLM_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def safe_json_parse(raw_text: str):
    """Clean and safely parse JSON from AI response."""
    cleaned = re.sub(r"^```(json)?", "", raw_text).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    try:
        return json.loads(cleaned)
    except Exception as e:
        print(f"❌ JSON Parsing Failed: {e}, Raw: {cleaned[:200]}...")
        return None


# ---------------- AI QUIZ GENERATOR ----------------
def generate_quiz_from_ai(topic: str, num_questions: int = 10):
    """Call LLM API to generate quiz questions for a topic."""
    if not API_KEY:
        print("❌ API_KEY is missing. Check your .env file!")
        return None

    prompt = (
        f"Generate {num_questions} multiple-choice questions that gradually increase in difficulty based on the topic '{topic}'. With following considerations. "
        " - Questions must be sensfull and should start from a level of a college student."
        " - Question must be technical based."
        " - Each question must have exactly 4 unique options relevant to the topic and exactly 1 correct answer. "
        " - Respond ONLY with a valid JSON array of objects like this: "
        "  - [{'question': 'What does AI stand for?', 'options': ['Artificial Intelligence', 'Automated Input', 'Advanced Interface', 'Applied Innovation'], 'answer': 'Artificial Intelligence', 'tags': ['AI'], 'difficulty': 1}]. "
        "Do not include any text outside the JSON array."
    )

    payload = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "system", "content": "You are a quiz generator."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    print("➡️ Sending request to Groq LLaMA...")
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        print("⬅️ Status Code:", response.status_code)
        print("⬅️ Raw Response:", response.text[:500])

        if response.status_code != 200:
            print("❌ API request failed!")
            return None

        data = response.json()
        raw_content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

        if not raw_content:
            print("❌ AI returned empty content.")
            return None

        # Extract JSON array from the response
        match = re.search(r"\[.*\]", raw_content, re.S)
        json_text = match.group(0) if match else raw_content
        quiz_data = safe_json_parse(json_text)

        if not quiz_data or not isinstance(quiz_data, list):
            print("❌ Failed to parse valid JSON.")
            return None

        # Validate options and answer
        valid_quiz = []
        for q in quiz_data:
            if q.get("question") and isinstance(q.get("options"), list):
                options = list(dict.fromkeys(q.get("options")))  # remove duplicates
                if q.get("answer") not in options:
                    if options:
                        options[0] = q.get("answer")  # replace first option with correct answer
                while len(options) < 4:  # fill missing options
                    options.append(f"Extra Option {len(options)+1}")

                valid_quiz.append({
                    "question": q.get("question"),
                    "options": options[:4],
                    "answer": q.get("answer"),
                    "tags": q.get("tags", []),
                    "difficulty": q.get("difficulty", 1)
                })

        return valid_quiz

    except Exception as e:
        print(f"⚠️ AI Quiz Generation Failed: {e}")
        return None


# ---------------- STORE QUIZ IN DB ----------------
def save_quiz_to_db(quiz_data: list, topic: str, db: Session):
    """Save quiz questions to database."""
    for item in quiz_data:
        question = Question(
            id=str(uuid.uuid4()),
            topic=topic,
            question_text=item.get("question"),
            answer_text=item.get("answer"),
            concept_tags=item.get("tags", []),
            difficulty=item.get("difficulty", 1),
            created_at=datetime.utcnow()
        )
        db.add(question)
        db.flush()
        item["question_id"] = question.id
    db.commit()
    print(f"✅ {len(quiz_data)} quiz questions saved to DB.")
    return quiz_data


# ---------------- MAIN FUNCTION ----------------
def get_quiz(topic: str, db: Session, num_questions: int = 10):
    """Try AI quiz generation first, fallback to DB if fails."""
    quiz_data = generate_quiz_from_ai(topic, num_questions)

    if quiz_data:
        return save_quiz_to_db(quiz_data, topic, db)

    # Fallback to DB if AI fails
    questions = db.query(Question).filter_by(topic=topic).limit(num_questions).all()
    if questions:
        return [
            {
                "question": q.question_text,
                "options": ["A", "B", "C", "D"],  # fallback options
                "answer": q.answer_text,
                "tags": q.concept_tags,
                "difficulty": q.difficulty
            }
            for q in questions
        ]
    return []


# ---------------- QUIZ ATTEMPT ----------------
def evaluate_quiz_attempt(user_answers: dict, questions: list) -> dict:
    """
    Compare user answers with correct answers and return score.

    Parameters:
    - user_answers (dict): A dictionary of answers submitted by the user, with question indices as keys.
    - questions (list): A list of questions, each containing the correct 'answer' key.

    Returns:
    - dict: A dictionary containing:
        - score (int): Number of correct answers
        - total (int): Total number of questions
        - correct_questions (list): List of correctly answered question objects
    """
    score = 0
    correct_questions = []

    for idx, question in enumerate(questions):
        correct_answer = question["answer"]
        user_answer = user_answers.get(str(idx))  # keys from frontend are strings

        print(f" user answer - {user_answer}")

        if user_answer and user_answer.strip().lower() == correct_answer.strip().lower():
            score += 1
            correct_questions.append(question)
    

    print("-----------------------")
    print(score)
    print(correct_questions)
    print("-----------------------")

    return {
        "score": score,
        "total": len(questions),
        "correct_questions": correct_questions
    }

