from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.recall_cards import RecallCardCreate, RecallCardOut
from app.crud import recall_cards
from app.database import get_db
from app.groq_llm import generate_summary_for_topic

router = APIRouter(tags=["Recall Cards"])

# 🟢 Original manual card creation (keep this if needed separately)
@router.post("/", response_model=RecallCardOut)
def create_card(card_data: RecallCardCreate, db: Session = Depends(get_db)):
    return recall_cards.create_recall_card(db, card_data)

# ✅ New: Auto-generate summary using LLM when user hits /generate
@router.post("/generate", response_model=RecallCardOut)
def generate_recall_card(card_data: RecallCardCreate, db: Session = Depends(get_db)):
    summary = generate_summary_for_topic(card_data.topic)

    # 🧠 Use generated summary in creation
    new_card = recall_cards.create_recall_card(
        db,
        RecallCardCreate(
            user_id=card_data.user_id,
            topic=card_data.topic,
            summary=summary
        )
    )
    return new_card

# ✅ Get all recall cards for a user
@router.get("/{user_id}", response_model=list[RecallCardOut])
def get_user_cards(user_id: UUID, db: Session = Depends(get_db)):
    return recall_cards.get_recall_cards_by_user(db, user_id)
