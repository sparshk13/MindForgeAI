import os
import requests
from fastapi import HTTPException

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def fetch_youtube_videos(topic: str):
    """
    Fetch only study-related YouTube videos (tutorials, lectures, courses).
    """
    if not topic.strip():
        raise HTTPException(status_code=400, detail="Topic is required.")

    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API key not configured.")

    try:
        # Add study-specific keywords to search
        study_query = f"{topic} tutorial OR lecture OR course OR study material OR beginners guide"

        params = {
            "part": "snippet",
            "q": study_query,
            "type": "video",
            "maxResults": 5,
            "key": YOUTUBE_API_KEY,
            "order": "relevance",
            "videoDuration": "medium" ,  # Medium length = usually educational
            "safeSearch": "strict",
            "relevanceLanguage": "en" or "hi" #for Hindi preference

        }

        response = requests.get("https://www.googleapis.com/youtube/v3/search", params=params)
        data = response.json()
        print("YouTube API Response:", data)

        # Fallback: retry with simpler query if empty
        if "items" not in data or len(data["items"]) == 0:
            fallback_query = f"{topic} tutorial lecture course"
            print(f"[Fallback Query] Retrying with: {fallback_query}")
            params["q"] = fallback_query
            response = requests.get("https://www.googleapis.com/youtube/v3/search", params=params)
            data = response.json()

        if "items" not in data or len(data["items"]) == 0:
            raise HTTPException(status_code=404, detail="No study videos found for this topic.")

        video_links = [
            f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            for item in data.get("items", [])
            if "videoId" in item.get("id", {})
        ]

        return {"videos": video_links}

    except Exception as e:
        print("YouTube API Error:", e)
        raise HTTPException(status_code=500, detail="YouTube API fetch failed")
