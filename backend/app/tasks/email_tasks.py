from app.core.celery_app import celery_app
import time

@celery_app.task
def send_booking_email(email: str, event_id: int, seat_number: int):
    # Simulate email sending
    print(f"Sending email to {email} for Event {event_id} Seat {seat_number}...")
    time.sleep(2) # Simulate delay
    print(f"Email sent to {email} successfully!")
    return f"Email sent to {email}"
