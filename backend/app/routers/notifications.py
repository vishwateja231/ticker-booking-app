from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.routers import deps
from app.database.session import get_db
from app.models.booking import Booking
from app.models.user import User

router = APIRouter()

@router.get("/")
async def get_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Simple "Notification" = Recent bookings for the user
    # Ideally should be a separate Notification table, but user asked for "basic notification mechanism"
    # "Booking confirmation stored in DB" -> Using Bookings table as source of truth.
    
    result = await db.execute(
        select(Booking)
        .where(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .limit(5)
    )
    bookings = result.scalars().all()
    
    return [
        {
            "id": b.id,
            "message": f"Booking Confirmed! Seat {b.seat_number} for Event ID {b.event_id}",
            "created_at": b.created_at
        }
        for b in bookings
    ]
