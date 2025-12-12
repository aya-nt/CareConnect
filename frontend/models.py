from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import enum

# Base class for declarative table definition
Base = declarative_base()

# --- Utility Enum for Incident Types ---
class IncidentType(str, enum.Enum):
    """Defines possible types of detected incidents."""
    FALL = "FALL"
    HIGH_VOICE = "HIGH_VOICE"
    OTHER = "OTHER"

# --- 1. Users Model (The SQL Table Structure) ---
class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True, index=True)
    fcm_token = Column(String)  # Firebase Cloud Messaging token for push notifications
    is_patient = Column(Boolean, default=False)
    
    # Relationships
    devices = relationship("Device", back_populates="patient", foreign_keys="Device.patient_user_id")
    resolved_incidents = relationship("Incident", back_populates="resolved_by")


# --- 2. Devices Model (The SQL Table Structure) ---
class Device(Base):
    __tablename__ = "devices"
    
    device_id = Column(Integer, primary_key=True, index=True)
    device_mac = Column(String(17), unique=True, nullable=False, index=True)
    location = Column(String(100))
    
    # Foreign Key linking device to the monitored patient
    patient_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    
    # Relationships
    patient = relationship("User", back_populates="devices")
    incidents = relationship("Incident", back_populates="device")


# --- 3. Incidents Model (The SQL Table Structure) ---
class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(Integer, primary_key=True, index=True)
    
    # Enum for Incident Type (e.g., 'FALL', 'HIGH_VOICE')
    incident_type = Column(String(50), nullable=False)
    
    timestamp = Column(TIMESTAMP(timezone=True), default=func.now())
    status = Column(String(20), default="PENDING") # 'PENDING', 'RESOLVED', 'FALSE_ALARM'

    # Foreign Keys
    device_id = Column(Integer, ForeignKey("devices.device_id"), nullable=False)
    resolved_by_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True) # Null until resolved

    # Relationships
    device = relationship("Device", back_populates="incidents")
    resolved_by = relationship("User", back_populates="resolved_incidents", foreign_keys=[resolved_by_user_id])