from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List

class ConfusionBase(BaseModel):
    user_id: UUID
    topic: str
    question_id: UUID
    confusion_score: float
    ai_feedback: str

class ConfusionSignalCreate(BaseModel):
    user_id: str
    topic: str
    message: str


class ConfusionCreate(ConfusionBase):
    pass

class ConfusionOut(ConfusionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  # updated for Pydantic v2


class UserAnswer(BaseModel):
    question_id: UUID
    answer: str

class QuizAttempt(BaseModel):
    user_id: UUID
    answers: List[UserAnswer]

class QuizFeedback(BaseModel):
    score: int
    total: int
    percentage: float
    feedback: List[dict]  # Each item: {question, your_answer, correct_answer, is_correct}
