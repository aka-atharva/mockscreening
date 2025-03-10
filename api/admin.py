from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from .models import User, get_db
from .auth import get_current_active_user, has_role

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
    is_active: Optional[bool] = None
    role: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None

# Add CreateUserRequest model after UpdateUserRequest
class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"
    is_active: bool = True

class SystemSettingUpdate(BaseModel):
    maintenance_mode: Optional[bool] = None
    debug_mode: Optional[bool] = None
    api_rate_limiting: Optional[bool] = None

class SystemSettings(BaseModel):
    maintenance_mode: bool
    debug_mode: bool
    api_rate_limiting: bool
    last_backup: str

# In-memory storage for system settings (in a real app, this would be in the database)
system_settings = {
    "maintenance_mode": False,
    "debug_mode": True,
    "api_rate_limiting": True,
    "last_backup": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")
}

# API Routes
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: User = Depends(has_role("admin")), db: Session = Depends(get_db)):
    """Get all users in the system (admin only)"""
    users = db.query(User).all()
    return users

# Add the POST endpoint for creating users after the get_all_users endpoint
@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: CreateUserRequest, 
    current_user: User = Depends(has_role("admin")), 
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)"""
    # Check if username exists
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate role
    if user_data.role not in ["admin", "researcher", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Create new user
    hashed_password = User.get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        role=user_data.role,
        is_active=user_data.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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
    
    if user_data.email:
        # Check if email is already taken by another user
        existing_user = db.query(User).filter(User.email == user_data.email, User.id != user_id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_data.email
    
    if user_data.username:
        # Check if username is already taken by another user
        existing_user = db.query(User).filter(User.username == user_data.username, User.id != user_id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already in use")
        user.username = user_data.username
    
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

@router.get("/settings", response_model=SystemSettings)
async def get_system_settings(current_user: User = Depends(has_role("admin"))):
    """Get system settings (admin only)"""
    return system_settings

@router.put("/settings", response_model=SystemSettings)
async def update_system_settings(
    settings: SystemSettingUpdate,
    current_user: User = Depends(has_role("admin"))
):
    """Update system settings (admin only)"""
    if settings.maintenance_mode is not None:
        system_settings["maintenance_mode"] = settings.maintenance_mode
    
    if settings.debug_mode is not None:
        system_settings["debug_mode"] = settings.debug_mode
    
    if settings.api_rate_limiting is not None:
        system_settings["api_rate_limiting"] = settings.api_rate_limiting
    
    return system_settings

@router.post("/backup", status_code=200)
async def run_backup(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(has_role("admin"))
):
    """Run a database backup (admin only)"""
    # In a real system, you would run an actual backup process
    # For this demo, we'll just update the last backup time
    
    def perform_backup():
        # Simulate a backup process
        import time
        time.sleep(2)  # Simulate a 2-second backup process
        system_settings["last_backup"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    background_tasks.add_task(perform_backup)
    return {"message": "Backup started"}

@router.post("/export-data", status_code=200)
async def export_system_data(current_user: User = Depends(has_role("admin"))):
    """Export system data (admin only)"""
    # In a real system, you would generate and return actual export data
    # For this demo, we'll just return a success message
    return {"message": "Data export initiated", "download_url": "/api/admin/download-export"}

@router.post("/cleanup-data", status_code=200)
async def cleanup_data(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(has_role("admin"))
):
    """Clean up old or unused data (admin only)"""
    # In a real system, you would run an actual cleanup process
    # For this demo, we'll just return a success message
    
    def perform_cleanup():
        # Simulate a cleanup process
        import time
        time.sleep(3)  # Simulate a 3-second cleanup process
    
    background_tasks.add_task(perform_cleanup)
    return {"message": "Data cleanup started"}

