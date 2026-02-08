from pydantic import BaseModel
from uuid import UUID
from typing import Dict, Any
from datetime import datetime

class LearningSessionCreate(BaseModel):
    user_id: UUID
    topic: str
    content_type: str
    time_spent: int
    retention_score: float
    interaction_pattern: Dict[str, Any]  # ✅ This should NOT be Optional or None

class LearningSessionOut(LearningSessionCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
