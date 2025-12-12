
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import schemas
from ..services import auth
from .. import models


router = APIRouter(tags=["devices"])


@router.post("/", response_model=schemas.Device, status_code=status.HTTP_201_CREATED)
async def create_device(
    device: schemas.DeviceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_device = db.query(models.Device).filter(models.Device.device_mac == device.device_mac).first()
    if db_device:
        raise HTTPException(status_code=400, detail="Device with this MAC already registered")

    patient = db.query(models.User).filter(
        models.User.user_id == device.patient_user_id,
        models.User.is_patient.is_(True),
    ).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Patient not found")

    new_device = models.Device(
        device_mac=device.device_mac,
        location=device.location,
        patient_user_id=device.patient_user_id,
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device


@router.get("/", response_model=List[schemas.Device])
async def read_devices(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    query = db.query(models.Device)
    if current_user.is_patient:
        query = query.filter(models.Device.patient_user_id == current_user.user_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{device_id}", response_model=schemas.Device)
async def read_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")

    if current_user.is_patient and db_device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return db_device


@router.put("/{device_id}", response_model=schemas.Device)
async def update_device(
    device_id: int,
    device_update: schemas.DeviceBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")

    if current_user.is_patient and db_device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = device_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_device, field, value)

    db.commit()
    db.refresh(db_device)
    return db_device
