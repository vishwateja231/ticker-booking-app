from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    event_id: int
    seat_number: int

class BookingResponse(BaseModel):
    id: int
    event_id: int
    seat_number: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
