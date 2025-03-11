from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from .models import User, ActivityLog, get_db, Role
from .auth import get_current_active_user, has_role, log_activity

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

# Add ActivityLogResponse model
class ActivityLogResponse(BaseModel):
    id: int
    username: str
    action: str
    details: Optional[str] = None
    timestamp: datetime
    ip_address: Optional[str] = None

    class Config:
        orm_mode = True

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
  db: Session = Depends(get_db),
  request: Request = None
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
  
  # Log the user creation activity
  ip = request.client.host if request else None
  user_agent = request.headers.get("user-agent") if request else None
  log_activity(
    db=db,
    username=current_user.username,
    action="User created",
    details=f"Created user '{user_data.username}' with role '{user_data.role}'",
    ip_address=ip,
    user_agent=user_agent
  )
  
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
  db: Session = Depends(get_db),
  request: Request = None
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
  
  # Create a changes list to log what was changed
  changes = []
  
  # Update user fields if provided
  if user_data.is_active is not None and user.is_active != user_data.is_active:
      old_status = "active" if user.is_active else "inactive"
      new_status = "active" if user_data.is_active else "inactive"
      user.is_active = user_data.is_active
      changes.append(f"status from {old_status} to {new_status}")
  
  if user_data.role and user.role != user_data.role:
    # Remove or modify this validation to accept custom roles
    # Instead of restricting to only ["admin", "researcher", "user"]
    # We'll check if the role exists in our system
    db_roles = db.query(Role).all()
    role_names = [r.name for r in db_roles] if db_roles else ["admin", "researcher", "user"]
    
    if user_data.role not in role_names:
        # If the role doesn't exist yet, create it
        new_role = Role(name=user_data.role, description=f"Custom role: {user_data.role}")
        db.add(new_role)
        db.commit()
    
    changes.append(f"role from '{user.role}' to '{user_data.role}'")
    user.role = user_data.role
  
  if user_data.email and user.email != user_data.email:
      # Check if email is already taken by another user
      existing_user = db.query(User).filter(User.email == user_data.email, User.id != user_id).first()
      if existing_user:
          raise HTTPException(status_code=400, detail="Email already in use")
      changes.append(f"email from '{user.email}' to '{user_data.email}'")
      user.email = user_data.email
  
  if user_data.username and user.username != user_data.username:
      # Check if username is already taken by another user
      existing_user = db.query(User).filter(User.username == user_data.username, User.id != user_id).first()
      if existing_user:
          raise HTTPException(status_code=400, detail="Username already in use")
      changes.append(f"username from '{user.username}' to '{user_data.username}'")
      user.username = user_data.username
  
  db.commit()
  db.refresh(user)
  
  # Log the user update activity
  ip = request.client.host if request else None
  user_agent = request.headers.get("user-agent") if request else None
  
  changes_text = ", ".join(changes) if changes else "no changes made"
  log_activity(
    db=db,
    username=current_user.username,
    action="User updated",
    details=f"Updated user ID {user_id}: {changes_text}",
    ip_address=ip,
    user_agent=user_agent
  )
  
  return user

@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
  user_id: int, 
  current_user: User = Depends(has_role("admin")), 
  db: Session = Depends(get_db),
  request: Request = None
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
  
  # Save user info for the activity log
  deleted_username = user.username
  deleted_role = user.role
  
  db.delete(user)
  db.commit()
  
  # Log the user deletion activity
  ip = request.client.host if request else None
  user_agent = request.headers.get("user-agent") if request else None
  log_activity(
    db=db,
    username=current_user.username,
    action="User deleted",
    details=f"Deleted user '{deleted_username}' with role '{deleted_role}'",
    ip_address=ip,
    user_agent=user_agent
  )
  
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

# Update the activity endpoint to return real data
@router.get("/activity", response_model=List[ActivityLogResponse])
async def get_recent_activity(
  current_user: User = Depends(has_role("admin")), 
  db: Session = Depends(get_db),
  limit: int = 50,
  skip: int = 0
):
  """Get recent system activity from the database (admin only)"""
  # Log this admin action
  log_activity(
      db=db,
      username=current_user.username,
      action="View activity logs",
      details=f"Admin viewed activity logs with limit={limit}, skip={skip}"
  )
  
  # Query the activity logs
  logs = db.query(ActivityLog) \
          .order_by(ActivityLog.timestamp.desc()) \
          .offset(skip) \
          .limit(limit) \
          .all()
  
  # Ensure timestamps are in ISO format for consistent parsing
  for log in logs:
      if isinstance(log.timestamp, datetime):
          # Convert to ISO format string if it's a datetime object
          log.timestamp = log.timestamp.isoformat()
  
  return logs

# Add a new endpoint to clear activity logs (with proper authorization)
@router.delete("/activity/clear", status_code=204)
async def clear_activity_logs(
    current_user: User = Depends(has_role("admin")),
    db: Session = Depends(get_db),
    days: Optional[int] = None
):
    """Clear activity logs (admin only)"""
    try:
        # Log this admin action
        log_activity(
            db=db,
            username=current_user.username,
            action="Clear activity logs",
            details=f"Admin cleared activity logs older than {days} days" if days else "Admin cleared all activity logs"
        )
        
        if days:
            # Delete logs older than specified days
            cutoff_date = datetime.now() - timedelta(days=days)
            db.query(ActivityLog).filter(ActivityLog.timestamp < cutoff_date).delete()
        else:
            # Don't delete all logs - keep at least the most recent ones
            # This is to avoid completely emptying the log table
            logs_to_keep = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(10).all()
            keep_ids = [log.id for log in logs_to_keep]
            db.query(ActivityLog).filter(ActivityLog.id.notin_(keep_ids)).delete()
            
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear logs: {str(e)}")

# Add an endpoint to log custom admin actions
@router.post("/activity/log", status_code=201)
async def add_activity_log(
    action: str,
    details: Optional[str] = None,
    username: Optional[str] = None,
    current_user: User = Depends(has_role("admin")),
    db: Session = Depends(get_db),
    request: Request = None
):
    """Add a custom activity log entry (admin only)"""
    try:
        log_username = username or current_user.username
        ip = request.client.host if request else None
        user_agent = request.headers.get("user-agent") if request else None
        
        log_activity(
            db=db,
            username=log_username,
            action=action,
            details=details,
            ip_address=ip,
            user_agent=user_agent
        )
        
        return {"status": "success", "message": "Activity logged successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log activity: {str(e)}")

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

