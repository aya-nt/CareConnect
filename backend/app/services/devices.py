from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..schemas import schemas

from . import models, schemas, auth
from .database import get_db

router = APIRouter(prefix="/devices", tags=["devices"])

@router.post("/", response_model=schemas.Device, status_code=status.HTTP_201_CREATED)
async def create_device(
    device: schemas.DeviceCreate, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Check if device MAC already exists
    db_device = db.query(schemas.Device).filter(schemas.Device.device_mac == device.device_mac).first()
    if db_device:
        raise HTTPException(status_code=400, detail="Device with this MAC already registered")
    
    # Check if patient exists
    patient = db.query(schemas.User).filter(
        schemas.User.user_id == device.patient_user_id,
        schemas.User.is_patient == True
    ).first()
    
    if not patient:
        raise HTTPException(status_code=400, detail="Patient not found")
    
    # Create new device
    db_device = schemas.Device(
        device_mac=device.device_mac,
        location=device.location,
        patient_user_id=device.patient_user_id
    )
    
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.get("/", response_model=List[schemas.Device])
async def read_devices(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    # Only show devices for patients the current user has access to
    if current_user.is_patient:
        devices = db.query(schemas.Device).filter(
            schemas.Device.patient_user_id == current_user.user_id
        ).offset(skip).limit(limit).all()
    else:
        # For non-patient users (family members), show all devices
        devices = db.query(schemas.Device).offset(skip).limit(limit).all()
    
    return devices

@router.get("/{device_id}", response_model=schemas.Device)
async def read_device(
    device_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    db_device = db.query(schemas.Device).filter(schemas.Device.device_id == device_id).first()
    if db_device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Check if user has access to this device
    if current_user.is_patient and db_device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_device

@router.put("/{device_id}", response_model=schemas.Device)
async def update_device(
    device_id: int, 
    device_update: schemas.DeviceBase, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    db_device = db.query(schemas.Device).filter(schemas.Device.device_id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Check if user has permission to update this device
    if current_user.is_patient and db_device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update device fields
    update_data = device_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_device, field, value)
    
    db.commit()
    db.refresh(db_device)
    return db_device
