from celery import shared_task
from app.services.email_service import send_booking_email
import asyncio

@shared_task
def send_booking_confirmation_email_task(to_email: str, event_name: str, seat_number: int, booking_id: int, event_date: str):
    """
    Celery task to send booking confirmation email.
    """
    return send_booking_email(to_email, event_name, seat_number, booking_id, event_date)
