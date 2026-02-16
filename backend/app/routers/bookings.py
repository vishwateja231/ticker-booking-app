from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.routers import deps
from app.database.session import get_db
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.user import User
from app.services.booking_service import BookingService
from sqlalchemy.future import select
from app.models.booking import Booking, BookingStatus

router = APIRouter()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Book a ticket for an event.
    """
    return await BookingService.create_booking(db, booking_in, current_user.id, current_user.email)

@router.get("/event/{event_id}/seats", response_model=List[int])
async def get_booked_seats(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Booking.seat_number)
        .where(
            Booking.event_id == event_id,
            Booking.status == BookingStatus.CONFIRMED.value
        )
    )
    return result.scalars().all()

@router.get("/", response_model=List[BookingResponse])
async def read_bookings(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Retrieve bookings. Admins see all, Users see their own.
    """
    if current_user.is_admin:
         return await BookingService.get_all_bookings(db)
    else:
         return await BookingService.get_user_bookings(db, current_user.id)
