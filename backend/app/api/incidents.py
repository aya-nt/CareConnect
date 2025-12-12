
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..schemas import schemas
from ..services import auth
from ..services.notification import send_incident_notification
from .. import models


router = APIRouter(tags=["incidents"])


@router.post("/", response_model=schemas.Incident, status_code=status.HTTP_201_CREATED)
async def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.device_mac == incident.device_mac).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    db_incident = models.Incident(
        incident_type=models.IncidentType(incident.incident_type),
        details=incident.details,
        device_id=device.device_id,
        status="PENDING",
    )

    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)

    await send_incident_notification(db, db_incident)
    return db_incident


@router.get("/", response_model=List[schemas.Incident])
async def read_incidents(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    device_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    query = db.query(models.Incident)

    if status:
        query = query.filter(models.Incident.status == status.upper())

    if device_id is not None:
        device = db.query(models.Device).filter(models.Device.device_id == device_id).first()
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")

        if current_user.is_patient and device.patient_user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")

        query = query.filter(models.Incident.device_id == device_id)

    if current_user.is_patient:
        query = query.join(models.Device).filter(models.Device.patient_user_id == current_user.user_id)

    return query.order_by(models.Incident.timestamp.desc()).offset(skip).limit(limit).all()


@router.get("/{incident_id}", response_model=schemas.Incident)
async def read_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_incident = db.query(models.Incident).filter(models.Incident.incident_id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    device = db.query(models.Device).filter(models.Device.device_id == db_incident.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    if current_user.is_patient and device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return db_incident


@router.put("/{incident_id}/resolve", response_model=schemas.Incident)
async def resolve_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_incident = db.query(models.Incident).filter(models.Incident.incident_id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    device = db.query(models.Device).filter(models.Device.device_id == db_incident.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    if current_user.is_patient and device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    db_incident.status = "RESOLVED"
    db_incident.resolved_by_user_id = current_user.user_id

    db.commit()
    db.refresh(db_incident)
    return db_incident
