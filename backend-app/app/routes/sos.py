from fastapi import APIRouter, Depends, HTTPException
from app.models import SOSAlert, User
from app.schemas import SOSCreate
from app.database import db
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

async def send_sms_alert(phone: str, message: str):
    """Send SMS alert (mock implementation)"""
    print(f"[SMS ALERT to {phone}]: {message}")
    # In production, integrate with Twilio, TextLocal, etc.
    return True

async def send_email_alert(email: str, subject: str, message: str):
    """Send email alert"""
    try:
        sender_email = os.getenv("SMTP_EMAIL")
        sender_password = os.getenv("SMTP_PASSWORD")
        
        if not sender_email or not sender_password:
            print(f"[EMAIL ALERT to {email}]: {subject} - {message}")
            return True
        
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = email
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

@router.post("/trigger")
async def trigger_sos(
    sos_data: SOSCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Trigger SOS alert and notify emergency contacts
    """
    
    # Create SOS alert in database
    sos_alert = SOSAlert(
        user_id=str(current_user.id),
        lat=sos_data.lat,
        lng=sos_data.lng,
        message=sos_data.message
    )
    
    result = await db.db.sos_alerts.insert_one(sos_alert.dict(by_alias=True))
    sos_id = str(result.inserted_id)
    
    # Get user's emergency contacts
    user = await db.db.users.find_one({"_id": current_user.id})
    contacts = user.get("emergency_contacts", [])
    
    # Create alert message
    map_link = f"https://maps.google.com/?q={sos_data.lat},{sos_data.lng}"
    alert_message = f"""
🚨 EMERGENCY ALERT - SHAKTI APP 🚨

{current_user.name or 'User'} is in danger and has triggered an SOS alert.

Live Location: {map_link}
Coordinates: {sos_data.lat}, {sos_data.lng}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Message: {sos_data.message or 'No additional message provided'}

Please check on them immediately and contact local authorities if needed.
"""
    
    # Notify emergency contacts
    notified_contacts = []
    for contact in contacts:
        # Send SMS
        if contact.get("phone"):
            await send_sms_alert(contact["phone"], alert_message)
        
        # Send email (if available)
        if contact.get("email"):
            await send_email_alert(
                contact["email"],
                "🚨 EMERGENCY: SOS Alert from SHAKTI App",
                alert_message
            )
        
        notified_contacts.append(contact.get("name", "Unknown"))
    
    # Notify authorities (mock - integrate with real API)
    await notify_authorities(sos_data.lat, sos_data.lng, current_user)
    
    return {
        "success": True,
        "sos_id": sos_id,
        "message": "SOS alert triggered successfully",
        "notified_contacts": notified_contacts,
        "map_link": map_link
    }

@router.get("/history")
async def get_sos_history(
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    """
    Get user's SOS alert history
    """
    alerts = await db.db.sos_alerts.find(
        {"user_id": str(current_user.id)}
    ).sort("timestamp", -1).limit(limit).to_list(limit)
    
    return {
        "alerts": [
            {
                "id": str(alert["_id"]),
                "lat": alert["lat"],
                "lng": alert["lng"],
                "timestamp": alert["timestamp"],
                "status": alert.get("status", "active")
            }
            for alert in alerts
        ]
    }

async def notify_authorities(lat: float, lng: float, user: User):
    """Notify local authorities (mock implementation)"""
    # In production, integrate with local police/emergency APIs
    print(f"[AUTHORITY ALERT]: SOS at {lat}, {lng} for user {user.email}")
    
    # This would call actual emergency services API
    # Example: India emergency number 112 API
    return True
