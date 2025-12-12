from typing import List, Optional
from sqlalchemy.orm import Session
from .. import models
import firebase_admin
from firebase_admin import messaging
from firebase_admin import credentials
import os
from ..schemas import schemas

from pathlib import Path

# Initialize Firebase Admin SDK
def init_firebase():
    try:
        # Try to get the default app
        firebase_admin.get_app()
    except ValueError:
        # If it doesn't exist, initialize it
        cred_path = Path(__file__).resolve().parents[2] / "serviceAccountKey.json"
        if not cred_path.exists():
            raise FileNotFoundError(
                "Firebase credentials file not found. "
                "Please download it from Firebase Console and save it as 'firebase-credentials.json' in the project root."
            )
        cred = credentials.Certificate(str(cred_path))
        firebase_admin.initialize_app(cred)

async def send_incident_notification(db: Session, incident: models.Incident):
    """
    Send push notifications to all family members when an incident occurs.
    """
    # Initialize Firebase if not already done
    init_firebase()
    
    # Get the device associated with the incident
    device = db.query(models.Device).filter(
        models.Device.device_id == incident.device_id
    ).first()
    
    if not device:
        print(f"Device not found for incident {incident.incident_id}")
        return
    
    # Get all family members (non-patients) who should be notified
    family_members = db.query(models.User).filter(
        models.User.is_patient == False,
        models.User.fcm_token.isnot(None)
    ).all()
    
    if not family_members:
        print(f"No family members to notify for incident {incident.incident_id}")
        return
    
    # Prepare the message
    title = f"🚨 {str(incident.incident_type).replace('_', ' ').title()} Detected"
    body = f"An incident was detected at {device.location or 'unknown location'}"
    
    if incident.details:
        body += f": {incident.details}"
    
    # Send notifications
    tokens = [user.fcm_token for user in family_members if user.fcm_token]
    
    if not tokens:
        print("No valid FCM tokens found")
        return
    
    try:
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data={
                "incident_id": str(incident.incident_id),
                "type": str(incident.incident_type),
                "device_id": str(incident.device_id),
                "timestamp": incident.timestamp.isoformat(),
                "status": incident.status
            },
            tokens=tokens,
        )
        
        response = messaging.send_multicast(message)
        
        print(f"Successfully sent {response.success_count} notifications")
        if response.failure_count > 0:
            responses = response.responses
            failed_tokens = [
                tokens[i] for i, resp in enumerate(responses) if not resp.success
            ]
            print(f"Failed to send to {len(failed_tokens)} tokens")
            
            # Optionally, you might want to remove invalid FCM tokens from the database
            for token in failed_tokens:
                user = db.query(models.User).filter(
                    models.User.fcm_token == token
                ).first()
                if user:
                    user.fcm_token = None
                    db.commit()
    
    except Exception as e:
        print(f"Error sending notification: {e}")

async def update_fcm_token(user_id: int, fcm_token: str, db: Session):
    """
    Update a user's FCM token for push notifications.
    """
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise ValueError("User not found")
    
    user.fcm_token = fcm_token
    db.commit()
    db.refresh(user)
    
    return user
