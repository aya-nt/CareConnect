from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from . import auth
from ..schemas import schemas

from .database import get_db
from .services.notification import send_incident_notification

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.post("/", response_model=schemas.Incident, status_code=status.HTTP_201_CREATED)
async def create_incident(
    incident: schemas.IncidentCreate, 
    db: Session = Depends(get_db)
):
    # Find the device by MAC address
    device = db.query(schemas.Device).filter(
        schemas.Device.device_mac == incident.device_mac
    ).first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Create the incident
    db_incident = schemas.Incident(
        incident_type=incident.incident_type,
        details=incident.details,
        device_id=device.device_id,
        status="PENDING"
    )
    
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    
    # Send notifications to family members
    await send_incident_notification(db, db_incident)
    
    return db_incident

@router.get("/", response_model=List[schemas.Incident])
async def read_incidents(
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    device_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    query = db.query(schemas.Incident)
    
    # Filter by status if provided
    if status:
        query = query.filter(schemas.Incident.status == status.upper())
    
    # Filter by device_id if provided
    if device_id:
        # Check if user has access to this device
        device = db.query(schemas.Device).filter(
            schemas.Device.device_id == device_id
        ).first()
        
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
            
        if current_user.is_patient and device.patient_user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
            
        query = query.filter(schemas.Incident.device_id == device_id)
    
    # For patients, only show their own incidents
    if current_user.is_patient:
        query = query.join(schemas.Device).filter(
            schemas.Device.patient_user_id == current_user.user_id
        )
    
    incidents = query.order_by(schemas.Incident.timestamp.desc())\
                    .offset(skip).limit(limit).all()
    
    return incidents

@router.get("/{incident_id}", response_model=schemas.Incident)
async def read_incident(
    incident_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    db_incident = db.query(schemas.Incident).filter(
        schemas.Incident.incident_id == incident_id
    ).first()
    
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Check if user has access to this incident
    device = db.query(schemas.Device).filter(
        schemas.Device.device_id == db_incident.device_id
    ).first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
        
    if current_user.is_patient and device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_incident

@router.put("/{incident_id}/resolve", response_model=schemas.Incident)
async def resolve_incident(
    incident_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    db_incident = db.query(schemas.Incident).filter(
        schemas.Incident.incident_id == incident_id
    ).first()
    
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Check if user has permission to resolve this incident
    device = db.query(schemas.Device).filter(
        schemas.Device.device_id == db_incident.device_id
    ).first()
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # Only the patient or their family members can resolve incidents
    if current_user.is_patient and device.patient_user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update incident status
    db_incident.status = "RESOLVED"
    db_incident.resolved_by_user_id = current_user.user_id
    
    db.commit()
    db.refresh(db_incident)
    
    return db_incident
