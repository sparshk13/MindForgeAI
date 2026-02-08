from pydantic import BaseModel
from typing import List, Dict

# When creating a quiz
class QuizCreate(BaseModel):
    topic: str
    count: int = 10


# Single Question Output
class QuestionOut(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

    class Config:
        orm_mode = True  # ✅ For SQLAlchemy to Pydantic conversion


# When sending full quiz to frontend
class QuizOut(BaseModel):
    questions: List[QuestionOut]


# When user submits quiz attempt
class QuizSubmitRequest(BaseModel):
    topic: str
    answers: List  # {question_id: selected_option}


# Response after submitting
class QuizSubmitResponse(BaseModel):
    message: str
    attempt_id: int


# After checking answers (score response)
class QuizScoreResponse(BaseModel):
    score_percent: float
    correct_answers: int
    total_questions: int
    weak_topics: List[str]


# For saving a quiz attempt to DB
class QuizQuestion(BaseModel):
    question_id: int
    selected_option: str


class QuizRequest(BaseModel):
    user_id: int
    topic: str
    count: int

# ✅ NEW: Add this only if you're returning quiz attempt data
class QuizAttemptResponse(BaseModel):
    attempt_id: int
    user_id: int
    topic: str
    score: float

    class Config:
        from_attributes = True

