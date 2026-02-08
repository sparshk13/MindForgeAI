from pydantic import BaseModel
from typing import List
import uuid
from datetime import datetime

class QuestionBase(BaseModel):
    topic: str
    question_text: str
    answer_text: str
    concept_tags: List[str]
    difficulty: int

class QuestionCreate(QuestionBase):
    pass

class QuestionOut(QuestionBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
