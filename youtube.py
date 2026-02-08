from fastapi import APIRouter
from pydantic import BaseModel
from services.youtube_service import fetch_youtube_videos

router = APIRouter()

class YouTubeRequest(BaseModel):
    topic: str

@router.post("/youtube-links")
def get_youtube_links(data: YouTubeRequest):
    """
    API endpoint to fetch study-related YouTube links.
    """
    return fetch_youtube_videos(data.topic)
