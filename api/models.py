from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Table, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
import os
from passlib.context import CryptContext

# Create SQLite database
DATABASE_URL = "sqlite:///./auth.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define User model
class User(Base):
  __tablename__ = "users"

  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, index=True)
  email = Column(String, unique=True, index=True)
  hashed_password = Column(String)
  is_active = Column(Boolean, default=True)
  created_at = Column(DateTime, default=datetime.utcnow)
  role = Column(String, default="user")  # Options: admin, researcher, user

  def verify_password(self, password):
      return pwd_context.verify(password, self.hashed_password)

  @staticmethod
  def get_password_hash(password):
      return pwd_context.hash(password)

# Define Role model
class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Define a relationship with permissions if needed
    # permissions = relationship("Permission", secondary=role_permission_table)

# Define Activity Log model
class ActivityLog(Base):
  __tablename__ = "activity_logs"

  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, index=True)
  action = Column(String, index=True)
  details = Column(String, nullable=True)
  timestamp = Column(DateTime, default=datetime.utcnow)
  ip_address = Column(String, nullable=True)
  user_agent = Column(String, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
  db = SessionLocal()
  try:
      yield db
  finally:
      db.close()

