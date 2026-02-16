from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services import event_service
from app.database.session import get_db
from app.routers import deps
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[EventResponse])
async def read_events(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    events = await event_service.get_events(db, skip=skip, limit=limit)
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def read_event(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    event = await event_service.get_event(db, event_id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=EventResponse)
async def create_event(
    event: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    return await event_service.create_event(db=db, event=event)

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event: EventUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    updated_event = await event_service.update_event(db, event_id, event)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

@router.delete("/{event_id}", response_model=EventResponse)
async def delete_event(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    deleted_event = await event_service.delete_event(db, event_id)
    if not deleted_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return deleted_event
