from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class KnowledgeDecayBase(BaseModel):
    topic: str
    last_interaction: datetime
    predicted_forget_score: float
    review_suggested: bool
    decay_model_type: str

class KnowledgeDecayCreate(KnowledgeDecayBase):
    user_id: UUID

class KnowledgeDecayOut(KnowledgeDecayBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
