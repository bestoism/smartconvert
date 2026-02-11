import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Load file .env
load_dotenv()

# 2. Ambil URL dari .env, fallback ke sqlite lokal jika tidak ada
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./crm.db")

# 3. Penyesuaian Protokol untuk PostgreSQL (PENTING)
# Supabase/Heroku sering memberikan URL berawalan 'postgres://'
# SQLAlchemy versi terbaru mewajibkan 'postgresql://' agar driver bisa terbaca
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 4. Konfigurasi Engine
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    # Config khusus SQLite (wajib check_same_thread=False untuk FastAPI)
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # Config khusus PostgreSQL (Supabase / Neon)
    # Kita tidak perlu check_same_thread untuk Postgres
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 5. Dependency untuk mendapatkan session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()