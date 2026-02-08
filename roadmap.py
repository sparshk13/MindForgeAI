from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from services.roadmap_service import generate_and_save_roadmap
from services.qdrant_service import search_roadmaps
from app.models import Roadmap
from services.qdrant_service import insert_user_roadmap


router = APIRouter()

class PromptInput(BaseModel):
    prompt: str
    user_id: UUID
    level: str


class SearchInput(BaseModel):
    query: str
    top_k: int = 3
    level: str | None = None


class RoadmapQuery(BaseModel):
    query: str
    user_id: UUID
    level: str = "beginner"
    top_k: int = 3


# Utility function for generating a direct resource link
def generate_link(title: str) -> str:
    slug = title.replace(' ', '-').lower()
    return f"https://www.geeksforgeeks.org/{slug}/"


@router.post("/generate-roadmap")
def generate_roadmap(data: PromptInput, db: Session = Depends(get_db)):
    level = data.level or "Beginner"

    # STEP 1: Qdrant search
    try:
        qdrant_results = search_roadmaps(f"{data.prompt} {level}", top_k=1)
        if qdrant_results and len(qdrant_results) > 0:
            best_match = qdrant_results[0]
            if best_match.get('score', 0) > 0.8:
                roadmap_data = best_match['payload']['roadmap']
                for sub in roadmap_data.get("subtopics", []):
                    if "link" not in sub or not sub["link"]:
                        sub["link"] = generate_link(sub["title"])
                return {
                    "status": "success",
                    "source": "qdrant",
                    "data": roadmap_data
                }
    except Exception as e:
        print(f"⚠️ Qdrant search failed: {e}")

    # STEP 2: DB check
    existing = db.query(Roadmap).filter_by(
        user_id=data.user_id, topic=data.prompt, level=level
    ).first()

    if existing:
        return {
            "status": "success",
            "source": "db",
            "data": {
                "roadmap_id": str(existing.id),
                "topic": existing.topic,
                "level": existing.level,
                "description": existing.description,
                "subtopics": [
                    {
                        "title": st.title,
                        "description": st.description,
                        "link": getattr(st, "link", generate_link(st.title))
                    }
                    for st in existing.subtopics
                ]
            }
        }

    # STEP 3: Generate and save with fallback
    roadmap = generate_and_save_roadmap(data.prompt, data.user_id, db, level=level)

    # Ensure links in generated roadmap
    if roadmap and "subtopics" in roadmap:
        for sub in roadmap["subtopics"]:
            if "link" not in sub or not sub["link"]:
                sub["link"] = generate_link(sub["title"])

    print("DEBUG: Generated Roadmap Response =>", roadmap)

    if not roadmap:
        print("WARNING: Roadmap generation failed. Returning fallback roadmap.")
        roadmap = {
            "roadmap_id": "fallback-id",
            "topic": data.prompt,
            "level": level,
            "description": "Default roadmap due to API failure.",
            "subtopics": [
                {"title": "Step 1", "description": "Start with basics", "link": generate_link("Step 1")},
                {"title": "Step 2", "description": "Explore intermediate topics", "link": generate_link("Step 2")},
                {"title": "Step 3", "description": "Practice with projects", "link": generate_link("Step 3")}
            ]
        }

    insert_user_roadmap(
        user_id=str(data.user_id),
        roadmap_id=roadmap.get("roadmap_id", ""),
        prompt=data.prompt
    )

    return {"status": "success", "source": "generated", "data": roadmap}


@router.post("/search-roadmap")
def search_roadmap(data: SearchInput):
    try:
        results = search_roadmaps(data.query, data.top_k)

        if data.level:
            results = [
                r for r in results
                if r['payload']['roadmap'].get('level', '').lower() == data.level.lower()
            ]

        return {"status": "success", "results": results}

    except Exception as e:
        print(f"SEARCH ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/get-roadmap")
def get_roadmap(data: RoadmapQuery, db: Session = Depends(get_db)):
    try:
        results = search_roadmaps(data.query, top_k=data.top_k)

        if results and results[0].get("score", 0) >= 0.75:
            roadmap_data = results[0]['payload']['roadmap']
            for sub in roadmap_data.get("subtopics", []):
                if "link" not in sub or not sub["link"]:
                    sub["link"] = generate_link(sub["title"])
            return {"status": "success", "source": "qdrant", "results": results}

        roadmap = generate_and_save_roadmap(
            prompt=data.query,
            user_id=data.user_id,
            db=db,
            level=data.level
        )

        # Add links to subtopics
        if roadmap and "subtopics" in roadmap:
            for sub in roadmap["subtopics"]:
                if "link" not in sub or not sub["link"]:
                    sub["link"] = generate_link(sub["title"])

        return {"status": "success", "source": "generated", "data": roadmap}

    except Exception as e:
        import traceback
        print("GET ROADMAP ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
