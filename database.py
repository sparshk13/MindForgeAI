import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env explicitly
# ENV_PATH = r"C:\Users\diyar\NirvanaHackathon\.env"
# print("Looking for .env at:", ENV_PATH)

# load_dotenv(dotenv_path=ENV_PATH)

# DATABASE_URL = os.getenv("DATABASE_URL")
# print("Loaded DATABASE_URL:", repr(DATABASE_URL))

# if not DATABASE_URL:
#     raise ValueError("DATABASE_URL not found in .env file!")

DATABASE_URL = "postgresql+psycopg2://postgres:root@localhost:5432/Nirvana_hackathon"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
