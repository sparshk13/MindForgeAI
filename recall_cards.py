from sqlalchemy.orm import Session
from app.models import RecallCard
from app.schemas.recall_cards import RecallCardCreate
import random

def generate_concept_card(topic: str) -> dict:
    # Dummy AI logic (later LLM se replace kar sakti ho)
    sample_keywords = ["definition", "example", "use case"]
    return {
        "keywords": sample_keywords,
        "diagram_image_url": f"https://dummyimage.com/600x400/000/fff&text={topic}",
        "analogy": f"A real-life analogy for {topic}..."
    }

def create_recall_card(db: Session, card_data: RecallCardCreate):
    content = generate_concept_card(card_data.topic)
    card = RecallCard(
        user_id=card_data.user_id,
        topic=card_data.topic,
        keywords=content["keywords"],
        diagram_image_url=content["diagram_image_url"],
        analogy=content["analogy"]
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

def get_recall_cards_by_user(db: Session, user_id):
    return db.query(RecallCard).filter(RecallCard.user_id == user_id).all()
