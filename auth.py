# app/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.auth.auth_bearer import JWTBearer
from app.database import get_db
from app.schemas.token import LoginRequest, Token
from app.models.models import User
from app.schemas.user import UserCreate, UserOut
from app.auth.auth_handler import create_access_token
from utils.s3.security import get_password_hash, verify_password




router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/auth/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # ✅ Hash the password before saving
    hashed_password = get_password_hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        career_goal=user.career_goal,
        password_hash=hashed_password  # Make sure your model field is 'password_hash'
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

    # Corrected: Use user.password instead of password_hash
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        career_goal=user.career_goal,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"user_id": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/protected", dependencies=[Depends(JWTBearer())])
def protected_route(user=Depends(JWTBearer())):
    return {"msg": "You are authorized!", "user": user}
