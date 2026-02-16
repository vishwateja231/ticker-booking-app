from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EventBase(BaseModel):
    name: str
    total_seats: int
    date: datetime

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    name: Optional[str] = None
    total_seats: Optional[int] = None
    date: Optional[datetime] = None

class EventResponse(EventBase):
    id: int
    available_seats: int

    class Config:
        from_attributes = True
