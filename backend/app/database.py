from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()  # Tải các biến môi trường từ file .env

# Lấy URL từ biến môi trường
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/ui_analyzer_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency để inject session vào các API endpoint
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()