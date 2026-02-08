from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from utils.streaks import calculate_streaks

router = APIRouter()

@router.get("/progress-card/{user_id}")
def get_progress_card(user_id: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT DISTINCT DATE(created_at) AS study_date
        FROM learning_sessions
        WHERE user_id = :uid
        ORDER BY study_date
    """)
    result = db.execute(query, {"uid": user_id})
    dates = [str(row.study_date) for row in result.fetchall()]
    
    streaks = calculate_streaks(dates)
    return {"learningStreak": streaks}
