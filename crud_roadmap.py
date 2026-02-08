from app.models import Roadmap, SubTopic
from sqlalchemy.orm import Session
import uuid

def save_roadmap(user_id: str, roadmap_data: list, db: Session):
    roadmap_ids = []
    for week in roadmap_data:
        roadmap = Roadmap(
            id=uuid.uuid4(),
            user_id=user_id,
            topic=f"Week {week['week']}",
            description=None
        )
        db.add(roadmap)
        db.flush()  # get roadmap.id before adding subtopics

        for topic in week["topics"]:
            sub = SubTopic(
                id=uuid.uuid4(),
                roadmap_id=roadmap.id,
                title=topic["name"],
                description=", ".join(topic.get("resources", []))
            )
            db.add(sub)

        roadmap_ids.append(str(roadmap.id))
    db.commit()
    return roadmap_ids
