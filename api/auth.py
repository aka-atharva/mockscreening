from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import Column, String, DateTime
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr
import secrets
import uuid

from .models import User, get_db, Base

# JWT Configuration
SECRET_KEY = "YOUR_SECRET_KEY_HERE"  # In production, use a secure random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# User models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "user"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool

    class Config:
        orm_mode = True

# Password reset models
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    password: str

# Password reset token model
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token = Column(String, primary_key=True, index=True)
    email = Column(String, index=True)
    expires_at = Column(DateTime)

# Create the password reset tokens table
from .models import engine
Base.metadata.create_all(bind=engine)

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# Router
router = APIRouter(prefix="/api/auth", tags=["auth"])

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user or not user.verify_password(password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=payload.get("role"))
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Role-based access control
def has_role(required_role: str):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if required_role == "admin" and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        if required_role == "researcher" and current_user.role not in ["admin", "researcher"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Password reset functions
def generate_password_reset_token(db: Session, email: str):
    # Delete any existing tokens for this email
    db.query(PasswordResetToken).filter(PasswordResetToken.email == email).delete()
    
    # Generate a new token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Store the token
    db_token = PasswordResetToken(
        token=token,
        email=email,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    
    return token

def verify_password_reset_token(db: Session, token: str):
    # Find the token
    db_token = db.query(PasswordResetToken).filter(PasswordResetToken.token == token).first()
    
    if not db_token:
        return None
    
    # Check if token is expired
    if db_token.expires_at < datetime.utcnow():
        # Delete expired token
        db.delete(db_token)
        db.commit()
        return None
    
    return db_token.email

# Simulate sending an email (in a real app, you would use an email service)
def send_password_reset_email(email: str, token: str):
    # In a real application, you would send an actual email
    # For this demo, we'll just print the reset link
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    print(f"Password reset link for {email}: {reset_link}")

# Endpoints
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "username": user.username}

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = User.get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.get("/admin", response_model=UserResponse)
async def admin_only(current_user: User = Depends(has_role("admin"))):
    return current_user

@router.get("/researcher", response_model=UserResponse)
async def researcher_only(current_user: User = Depends(has_role("researcher"))):
    return current_user

# Password reset endpoints
@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Find user by email
    user = get_user_by_email(db, request.email)
    
    # Always return success, even if email doesn't exist (security best practice)
    # This prevents user enumeration attacks
    if user:
        # Generate token
        token = generate_password_reset_token(db, request.email)
        
        # Send email in background
        background_tasks.add_task(send_password_reset_email, request.email, token)
    
    return {"message": "If an account with that email exists, a password reset link has been sent"}

@router.post("/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    # Verify token
    email = verify_password_reset_token(db, reset_data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Find user
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = User.get_password_hash(reset_data.password)
    
    # Delete the token
    db.query(PasswordResetToken).filter(PasswordResetToken.token == reset_data.token).delete()
    
    # Commit changes
    db.commit()
    
    return {"message": "Password has been reset successfully"}

