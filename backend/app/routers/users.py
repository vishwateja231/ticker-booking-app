from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.schemas.user import UserCreate, UserResponse
from app.services import user_service
from app.database.session import get_db
from app.routers import deps
from app.models.user import User
from app.core.security import get_password_hash # Added import

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate, # Changed parameter name from user_in to user
    db: AsyncSession = Depends(get_db)
):
    # Modified implementation to use direct DB operations and password hashing
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, is_admin=user.is_admin)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    try:
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    await db.delete(user)
    await db.commit()
    return None

@router.put("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: int,
    is_admin: bool,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_admin_user)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
         raise HTTPException(status_code=400, detail="Cannot change your own role")

    user.is_admin = is_admin
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
):
    return current_user
