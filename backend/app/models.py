import enum

from sqlalchemy import Boolean, Column, Enum, ForeignKey, Integer, String, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class IncidentType(str, enum.Enum):
    FALL = "FALL"
    HIGH_VOICE = "HIGH_VOICE"
    OTHER = "OTHER"


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=True)
    fcm_token = Column(String, nullable=True)
    is_patient = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False)

    devices = relationship("Device", back_populates="patient", foreign_keys="Device.patient_user_id")
    resolved_incidents = relationship("Incident", back_populates="resolved_by", foreign_keys="Incident.resolved_by_user_id")


class Device(Base):
    __tablename__ = "devices"

    device_id = Column(Integer, primary_key=True, index=True)
    device_mac = Column(String(17), unique=True, nullable=False, index=True)
    location = Column(String(100), nullable=True)
    patient_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    patient = relationship("User", back_populates="devices", foreign_keys=[patient_user_id])
    incidents = relationship("Incident", back_populates="device")


class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(Enum(IncidentType), nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    status = Column(String(20), default="PENDING", nullable=False)
    details = Column(String, nullable=True)
    device_id = Column(Integer, ForeignKey("devices.device_id"), nullable=False)
    resolved_by_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)

    device = relationship("Device", back_populates="incidents")
    resolved_by = relationship("User", back_populates="resolved_incidents", foreign_keys=[resolved_by_user_id])
