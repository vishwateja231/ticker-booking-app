import smtplib
from datetime import datetime
from app.core.config import settings

def send_booking_email(to_email: str, event_name: str, seat_number: int, booking_id: int, event_date: str):
    sender = "TicketBooker <noreply@ticketbooker.com>"
    recipients = [to_email]
    
    # Add Admin to recipients
    if settings.ADMIN_EMAIL:
        recipients.append(settings.ADMIN_EMAIL)

    username = settings.MAILTRAP_USERNAME
    password = settings.MAILTRAP_PASSWORD
    host = "sandbox.smtp.mailtrap.io"
    port = 2525

    if not username or not password:
        print("❌ Mailtrap credentials missing in .env")
        return False

    message = f"""\
Subject: Ticket Confirmation - {event_name}
To: {to_email}
From: {sender}

Hello,

Your booking has been successfully confirmed.

Booking Details:
-------------------------------------
Booking ID : {booking_id}
Event      : {event_name}
Seat       : {seat_number}
Date & Time: {event_date}
Booked On  : {datetime.now().strftime("%d %b %Y, %I:%M %p")}
-------------------------------------

Please carry this confirmation email at the time of entry.

Thank you for using TicketBooker!

Best regards,
TicketBooker Team
"""

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(username, password)
            server.sendmail(sender, recipients, message)
        print(f"✅ Email sent to {to_email} and {settings.ADMIN_EMAIL}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False
