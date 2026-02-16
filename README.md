# Ticket Booking System - Production Ready

A professional, full-stack Ticket Booking Application built with **FastAPI**, **React**, **PostgreSQL**, **Redis**, and **Celery**.

## 🚀 Features

### **User Portal** (Modern UI)
*   **Landing Page**: "Book Tickets Easily" hero section.
*   **Event Exploration**: Browse trending events with real-time seat availability.
*   **Interactive Booking**: Visual seat map (`Green`=Available, `Gray`=Booked, `Blue`=Selected).
*   **User Dashboard**: View booking history and notifications.
*   **Security**: JWT Authentication.

### **Admin Dashboard** (Enterprise UI)
*   **Analytics**: Overview of total users, active events, and bookings.
*   **Event Management**: Create and manage events.
*   **User Management**: Promote/Demote admins, delete users.
*   **Reports**: Detailed insights into system usage.

### **Backend Architecture**
*   **Performance**: Async SQLAlchemy + Redis Caching.
*   **Concurrency**: **Redis Distributed Lock** prevents double-booking of seats.
*   **Background Tasks**: **Celery** handles email notifications asynchronously.
*   **Emails**: Dynamic HTML emails sent to **User and Admin** via Mailtrap.

## 🛠️ Tech Stack

*   **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Alembic
*   **Frontend**: React 18, Tailwind CSS, Vite
*   **Database**: PostgreSQL (Supabase)
*   **Cache/Message Broker**: Redis
*   **Worker**: Celery
*   **Containerization**: Docker & Docker Compose

## ⚡ Deployment & Setup

### **Option 1: Docker (Recommended)**

1.  **Clone & Configure**:
    ```bash
    cp backend/.env.example backend/.env
    # Edit backend/.env with your credentials (DB, Redis, Mailtrap)
    ```

2.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    *   Frontend: `http://localhost:3000`
    *   Backend: `http://localhost:8000`
    *   Swagger Docs: `http://localhost:8000/docs`

### **Option 2: Local Development**

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Ensure Redis is running locally
python -m uvicorn app.main:app --reload
# Run Celery check README_CELERY.md (if provided) or:
# celery -A app.core.celery_app worker --loglevel=info
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

```
app/
 ├── api/             # Dependencies & Auth overrides
 ├── core/            # Config, Security, Redis, Celery setup
 ├── database/        # DB connection & Base models
 ├── models/          # SQLAlchemy Models
 ├── routers/         # API Endpoints (Auth, Events, Bookings...)
 ├── schemas/         # Pydantic Schemas
 ├── services/        # Business Logic (Booking Service, Email Service)
 ├── tasks/           # Celery Tasks
 └── main.py          # App Entrypoint
```

## 📸 Screenshots

### **Admin Dashboard**
![Admin Dashboard](admin_dashboard.png)

### **User Portal**
![User Portal](user_home.png)

## 🧪 Testing & Demo Guide

### **1. Setup & Migration**
Ensure your database is up to date:
```bash
docker-compose up -d backend
docker-compose exec backend alembic upgrade head
```

### **2. Admin Setup**
1.  **Register a User**: Go to `http://localhost:3000/register`. Email: `admin@ticketbooker.com`, Password: `password123`.
2.  **Promote to Admin**:
    ```bash
    # In a new terminal
    docker-compose exec backend python scripts/promote_admin.py admin@ticketbooker.com
    ```
3.  **Login**: Login as `admin@ticketbooker.com`. You will be redirected to the **Admin Dashboard**.

### **3. User Flow**
1.  **Register a New User**: `user@ticketbooker.com`.
2.  **Login**: You will be redirected to the **Home Page**.
3.  **Book Ticket**: Select an event (created by Admin), choose a Green seat, and confirm.
4.  **Verify**: Check "My Bookings" and your email inbox.

### **4. Concurrency Test**
1.  Open two browsers/incognito windows.
2.  Login as two different users.
3.  Select the **SAME seat** on both.
4.  Click "Confirm" simultaneously.
5.  One will succeed; the other will receive a "Seat locked/taken" error.

## ✅ Security Audit

*   **Credentials**: All sensitive data moved to `.env` (Database, Redis, Mailtrap, JWT Secret).
*   **Auth**: Role-based access control (RBAC) enforced on all sensitive endpoints.
*   **Concurrency**: Redis locks ensure data integrity during high-load booking.

---

**Developed by Senior Full-Stack Engineer**
