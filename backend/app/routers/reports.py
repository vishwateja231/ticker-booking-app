from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.future import select
from app.routers import deps
from app.database.session import get_db
from app.models.booking import Booking
from app.models.event import Event
from app.models.user import User

router = APIRouter()

@router.get("/dashboard-stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    # Total Users
    users_res = await db.execute(select(func.count(User.id)))
    total_users = users_res.scalar()
    
    # Total Events
    events_res = await db.execute(select(func.count(Event.id)))
    total_events = events_res.scalar()
    
    # Total Bookings
    bookings_res = await db.execute(select(func.count(Booking.id)))
    total_bookings = bookings_res.scalar()
    
    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_bookings": total_bookings
    }

@router.get("/event-bookings")
async def get_event_bookings_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    # Bookings per event
    result = await db.execute(
        select(Event.name, func.count(Booking.id).label("count"))
        .join(Booking, Event.id == Booking.event_id)
        .group_by(Event.name)
    )
    return [{"event_name": row.name, "bookings": row.count} for row in result.all()]
