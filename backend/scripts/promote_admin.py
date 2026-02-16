import asyncio
import sys
import os

# Add the backend directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.future import select
from app.database.session import AsyncSessionLocal
from app.models.user import User

async def promote_to_admin(email: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print(f"❌ User with email '{email}' not found.")
            return
            
        if user.is_admin:
            print(f"✅ User '{email}' is already an admin.")
            return

        user.is_admin = True
        await db.commit()
        await db.refresh(user)
        print(f"✅ Successfully promoted '{email}' to ADMIN.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/promote_admin.py <email>")
        sys.exit(1)
        
    email = sys.argv[1]
    
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(promote_to_admin(email))
