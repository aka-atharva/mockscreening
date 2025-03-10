from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta

from .models import User, get_db
from .auth import get_current_active_user, has_role
from pydantic import BaseModel

# Router
router = APIRouter(prefix="/api/admin", tags=["admin"])

# Models
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class SystemStats(BaseModel):
    total_users: int
    active_users: int
    researchers: int
    regular_users: int
    system_uptime: str
    database_size: str

class UpdateUserRequest(BaseModel):
    is_active: bool = None
    role: str = None

# API Routes
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: User = Depends(has_role("admin")), db: Session = Depends(get_db)):
    """Get all users in the system (admin only)"""
    users = db.query(User).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, current_user: User = Depends(has_role("admin")), db: Session = Depends(get_db)):
    """Get a specific user by ID (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int, 
    user_data: UpdateUserRequest, 
    current_user: User = Depends(has_role("admin")), 
    db: Session = Depends(get_db)
):
    """Update a user's role or active status (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admins from demoting themselves
    if user.id == current_user.id and user_data.role and user_data.role != "admin":
        raise HTTPException(
            status_code=400, 
            detail="Admins cannot demote themselves"
        )
    
    # Update user fields if provided
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    if user_data.role:
        if user_data.role not in ["admin", "researcher", "user"]:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = user_data.role
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int, 
    current_user: User = Depends(has_role("admin")), 
    db: Session = Depends(get_db)
):
    """Delete a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admins from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400, 
            detail="Admins cannot delete themselves"
        )
    
    db.delete(user)
    db.commit()
    return None

@router.get("/stats", response_model=SystemStats)
async def get_system_stats(current_user: User = Depends(has_role("admin")), db: Session = Depends(get_db)):
    """Get system statistics (admin only)"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    researchers = db.query(User).filter(User.role == "researcher").count()
    regular_users = db.query(User).filter(User.role == "user").count()
    
    # In a real system, you would get actual system metrics
    # For this demo, we'll use mock data
    return {
        "total_users": total_users,
        "active_users": active_users,
        "researchers": researchers,
        "regular_users": regular_users,
        "system_uptime": "3 days, 7 hours",
        "database_size": "42.5 MB"
    }

@router.get("/activity", response_model=List[Dict[str, Any]])
async def get_recent_activity(current_user: User = Depends(has_role("admin"))):
    """Get recent system activity (admin only)"""
    # In a real system, you would query an activity log
    # For this demo, we'll use mock data
    now = datetime.now()
    
    return [
        {
            "id": 1,
            "action": "User login",
            "username": "researcher",
            "timestamp": (now - timedelta(minutes=5)).isoformat(),
            "details": "Successful login"
        },
        {
            "id": 2,
            "action": "Data export",
            "username": "researcher",
            "timestamp": (now - timedelta(hours=1)).isoformat(),
            "details": "Exported 1,245 records"
        },
        {
            "id": 3,
            "action": "Failed login attempt",
            "username": "unknown",
            "timestamp": (now - timedelta(hours=2)).isoformat(),
            "details": "Invalid credentials"
        },
        {
            "id": 4,
            "action": "User registration",
            "username": "newuser",
            "timestamp": (now - timedelta(days=1)).isoformat(),
            "details": "New user account created"
        },
        {
            "id": 5,
            "action": "Password reset",
            "username": "user",
            "timestamp": (now - timedelta(days=2)).isoformat(),
            "details": "Password reset completed"
        }
    ]

