from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, users, events, bookings, reports, notifications

app = FastAPI(
    title="Ticket Booking System API",
    description="""
    A production-ready Ticket Booking System API.
    
    ## Features
    * 🔐 **Auth**: JWT-based authentication with Role-Based Access Control (Admin/User).
    * 🎟️ **Events**: Create and manage events (Admin only).
    * 🎫 **Bookings**: Book tickets with **Redis-based concurrency locking**.
    * 📧 **Notifications**: Async email notifications via **Celery** & **Mailtrap**.
    
    ## Tech Stack
    * Python (FastAPI)
    * PostgreSQL (Supabase) / SQLAlchemy Async
    * Redis & Celery
    """,
    version="1.0.0",
    contact={
        "name": "WhySostack",
        "url": "https://github.com/WhySostack",
        "email": "support@ticketbooker.com",
    },
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1}
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    from app.core.redis import get_redis_client
    try:
        redis = get_redis_client()
        await redis.ping()
        print("✅ Connected to Redis successfully!")
    except Exception as e:
        print(f"❌ Failed to connect to Redis: {e}")

@app.get("/")
def root():
    return {"message": "Welcome to Ticket Booking API"}

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(events.router, prefix=f"{settings.API_V1_STR}/events", tags=["events"])
app.include_router(bookings.router, prefix=f"{settings.API_V1_STR}/bookings", tags=["bookings"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["reports"])
app.include_router(notifications.router, prefix=f"{settings.API_V1_STR}/notifications", tags=["notifications"])

