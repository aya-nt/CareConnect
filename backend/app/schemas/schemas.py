from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class IncidentType(str, Enum):
    FALL = "FALL"
    HIGH_VOICE = "HIGH_VOICE"
    OTHER = "OTHER"

class UserBase(BaseModel):
    username: str = Field(..., max_length=100)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    is_patient: bool = False

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    fcm_token: Optional[str] = None
    is_patient: Optional[bool] = None

class User(UserBase):
    user_id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class DeviceBase(BaseModel):
    device_mac: str = Field(..., max_length=17, pattern=r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
    location: Optional[str] = Field(None, max_length=100)

class DeviceCreate(DeviceBase):
    patient_user_id: int

class Device(DeviceBase):
    device_id: int
    is_active: bool = True

    class Config:
        from_attributes = True

class IncidentBase(BaseModel):
    incident_type: IncidentType
    details: Optional[str] = None

class IncidentCreate(IncidentBase):
    device_mac: str

class Incident(IncidentBase):
    incident_id: int
    timestamp: datetime
    status: str
    device_id: int
    resolved_by_user_id: Optional[int] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
