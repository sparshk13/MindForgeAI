from pydantic import BaseModel
from uuid import UUID
from typing import Dict, List
from datetime import datetime

class SkillScanCreate(BaseModel):
    user_id: UUID
    career_goal: str
    recommended_pathway: Dict[str, List[str]]  # ✅ FIXED here

class SkillScanOut(SkillScanCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  