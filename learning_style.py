from pydantic import BaseModel
from typing import Optional, Dict
from uuid import UUID
from datetime import datetime

class LearningStyleBase(BaseModel):
    user_id: UUID
    dominant_style: str
    style_scores: Optional[Dict[str, float]] = None  # e.g., {"visual": 0.8, "auditory": 0.6}

class LearningStyleCreate(LearningStyleBase):
    pass

class LearningStyleOut(LearningStyleBase):
    id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
