from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    career_goal: str | None = None

class UserCreate(UserBase):
    password: str
    email: EmailStr
    password: str
    career_goal: Optional[str]


class UserOut(UserBase):
    id: uuid.UUID
    created_at: datetime
    name: str
    email: EmailStr
    career_goal: Optional[str]

    class Config:
        from_attributes = True
