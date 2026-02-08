import uuid
from sqlalchemy import Column, DateTime, String, Text, Float, Boolean, Integer, TIMESTAMP, ForeignKey, ARRAY , JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime


recommended_pathway = Column(JSONB)

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    career_goal = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class SkillScanResult(Base):
    __tablename__ = "skill_scan_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    career_goal = Column(Text, nullable=False)
    recommended_pathway = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class LearningSession(Base):
    __tablename__ = "learning_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic = Column(Text, nullable=False)
    content_type = Column(String, nullable=False)
    time_spent = Column(Integer, nullable=False)
    retention_score = Column(Float, nullable=False)
    interaction_pattern = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class ConfusionSignal(Base):
    __tablename__ = "confusion_signals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    topic = Column(Text)
    question_id = Column(UUID(as_uuid=True))
    confusion_score = Column(Float)
    ai_feedback = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class RecallCard(Base):
    __tablename__ = "recall_cards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic = Column(Text, nullable=False)
    keywords = Column(ARRAY(Text), nullable=False)
    diagram_image_url = Column(Text, nullable=False)
    analogy = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class KnowledgeDecayEvent(Base):
    __tablename__ = "knowledge_decay_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic = Column(Text, nullable=False)
    last_interaction = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    predicted_forget_score = Column(Float, nullable=False)
    review_suggested = Column(Boolean, nullable=False, default=False)
    decay_model_type = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic = Column(Text)
    question_text = Column(Text)
    answer_text = Column(Text)
    concept_tags = Column(ARRAY(Text))
    difficulty = Column(Integer)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class LearningStyle(Base):
    __tablename__ = "learning_styles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    dominant_style = Column(String, nullable=False)  # e.g., 'visual', 'auditory', 'reading/writing', 'kinesthetic'
    style_scores = Column(JSONB)  # optional: store confidence per style (e.g., {'visual': 0.8, 'auditory': 0.6})
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class Roadmap(Base):
    __tablename__ = "roadmaps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String, nullable=True, default="beginner")
    subtopics = relationship("SubTopic", back_populates="roadmap", cascade="all, delete")


class SubTopic(Base):
    __tablename__ = "subtopics"
    __table_args__ = {'extend_existing': True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    roadmap_id = Column(UUID(as_uuid=True), ForeignKey("roadmaps.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    roadmap = relationship("Roadmap", back_populates="subtopics")


# class QuizAnswer(Base):
#     __tablename__ = "quiz_answers"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = Column(UUID(as_uuid=True), nullable=False)
#     question = Column(Text)
#     selected = Column(Text)
#     correct = Column(Text)
#     topic = Column(String)
#     is_correct = Column(Boolean)
#     created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    topic = Column(String, nullable=False)
    score = Column(Integer)
    total_questions = Column(Integer)
    timestamp = Column(TIMESTAMP(timezone=False), server_default=func.now()) 


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    questions = Column(JSON, nullable=False)  # List of questions (store as JSON)



class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=True)  # Optional, if quiz linkage needed
    topic = Column(String, nullable=False)
    selected_answers = Column(JSON, nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="quiz_attempts")
    quiz = relationship("Quiz", backref="attempts")
