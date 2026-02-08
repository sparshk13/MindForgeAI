from pydantic import BaseModel
from uuid import UUID  # Add this import

class RoadmapRequest(BaseModel):
    prompt: str
    user_id: UUID  # Add this line
    level: str | None = None  # Optional field, if needed
