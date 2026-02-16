from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.booking import Booking, BookingStatus
from app.models.event import Event
from app.schemas.booking import BookingCreate
from app.core.redis import get_redis_client
from fastapi import HTTPException, status
from app.tasks.email import send_booking_confirmation_email_task

class BookingService:
    @staticmethod
    async def create_booking(db: AsyncSession, booking_in: BookingCreate, user_id: int, user_email: str):
        redis_client = get_redis_client()
        lock_name = f"lock:event:{booking_in.event_id}:seat:{booking_in.seat_number}"

        # 1. Acquire Redis Lock (Prevent Double Booking)
        lock = redis_client.lock(lock_name, timeout=30, blocking_timeout=5)
        
        acquired = lock.acquire(blocking=True)
        if not acquired:
             raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Seat is currently being booked by another user. Please try another seat."
            )
        
        try:
            # 2. Check Event & Seat Availability in DB
            result = await db.execute(select(Event).where(Event.id == booking_in.event_id))
            event = result.scalars().first()
            if not event:
                raise HTTPException(status_code=404, detail="Event not found")

            # Check if seat already taken
            existing_booking = await db.execute(
                select(Booking).where(
                    Booking.event_id == booking_in.event_id,
                    Booking.seat_number == booking_in.seat_number,
                    Booking.status == BookingStatus.CONFIRMED.value
                )
            )
            if existing_booking.scalars().first():
                raise HTTPException(status_code=400, detail="Seat already booked")

            # 3. Create Booking
            booking = Booking(
                user_id=user_id,
                event_id=booking_in.event_id,
                seat_number=booking_in.seat_number,
                status=BookingStatus.CONFIRMED.value
            )
            db.add(booking)
            
            # Update Event available seats
            if event.available_seats > 0:
                event.available_seats -= 1
                db.add(event)
            else:
                 raise HTTPException(status_code=400, detail="Event is sold out")

            await db.commit()
            await db.refresh(booking)

            # 4. Trigger Background Email Task
            # We pass strings/ints because Celery tasks execute separately
            send_booking_confirmation_email_task.delay(
                to_email=user_email,
                event_name=event.name,
                seat_number=booking.seat_number,
                booking_id=booking.id,
                event_date=str(event.date)
            )

            return booking

        finally:
            # 5. Release Lock
            if lock.locked():
                lock.release()

    @staticmethod
    async def get_user_bookings(db: AsyncSession, user_id: int):
        result = await db.execute(select(Booking).where(Booking.user_id == user_id))
        return result.scalars().all()
    
    @staticmethod
    async def get_all_bookings(db: AsyncSession):
         result = await db.execute(select(Booking))
         return result.scalars().all()
