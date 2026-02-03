from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io

from jose import JWTError, jwt

from . import models, schemas, crud
from .database import engine, get_db
from .ml_service import ml_service
from . import auth

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartConvert CRM API",
    description="Backend API with Batch Upload & Prediction Capability",
    version="1.0.0"
)

# --- KONFIGURASI CORS (PENTING BUAT REACT) ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------------

@app.get("/")
def read_root():
    return {"message": "SmartConvert API is running 🚀"}

# =====================================================
# AUTH & JWT DEPENDENCY
# =====================================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

# --- FUNGSI BARU: CEK SIAPA YANG LOGIN ---
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            auth.SECRET_KEY,
            algorithms=[auth.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception

    return user

# =====================================================
# CSV UPLOAD & ML
# =====================================================

@app.post("/api/v1/upload-csv")
async def upload_leads_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=';')
            if df.shape[1] < 2:
                df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=',')
        except:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')), sep=',')

        results = []
        for _, row in df.iterrows():
            lead_data_raw = row.to_dict()

            prediction = ml_service.predict(lead_data_raw)

            lead_data_for_db = {}
            valid_db_columns = models.Lead.__table__.columns.keys()

            for k, v in lead_data_raw.items():
                clean_key = k.replace('.', '_')
                if clean_key in valid_db_columns:
                    lead_data_for_db[clean_key] = v

            saved_lead = crud.create_lead(db, lead_data_for_db, prediction)
            results.append(saved_lead)

        return {
            "status": "success",
            "message": f"Successfully processed {len(results)} leads",
            "sample_data": results[:5]
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

# =====================================================
# LEADS
# =====================================================

@app.get("/api/v1/leads", response_model=List[schemas.LeadResponse])
def read_leads(
    skip: int = 0,
    limit: int = 100,
    sort_by: str = "newest",
    db: Session = Depends(get_db)
):
    return crud.get_leads(db, skip=skip, limit=limit, sort_by=sort_by)


@app.get("/api/v1/leads/{lead_id}", response_model=schemas.LeadResponse)
def read_lead(lead_id: int, db: Session = Depends(get_db)):
    db_lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead_dict = db_lead.__dict__.copy()
    explanation = ml_service.explain_prediction(lead_dict)
    db_lead.explanation = explanation

    return db_lead


@app.put("/api/v1/leads/{lead_id}/notes")
def update_lead_notes(
    lead_id: int,
    notes_data: dict,
    db: Session = Depends(get_db)
):
    db_lead = crud.get_lead_by_id(db, lead_id=lead_id)
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    db_lead.notes = notes_data.get("notes")
    db.commit()
    return {"status": "success", "message": "Note saved"}

# =====================================================
# DASHBOARD
# =====================================================

@app.get("/api/v1/dashboard/stats", response_model=schemas.DashboardStats)
def read_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

# =====================================================
# USER PROFILE (PROTECTED)
# =====================================================

@app.get("/api/v1/user/profile")
def read_user_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_user_profile(db, user_id=current_user.id)


@app.put("/api/v1/user/profile")
def update_profile(
    data: dict,
    db: Session = Depends(get_db)
):
    return crud.update_user_profile(db, data)

# =====================================================
# AUTH
# =====================================================

@app.post("/api/v1/register")
def register_user(user_data: dict, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, username=user_data['username'])
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user_data)


@app.post("/api/v1/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = auth.create_access_token(
        data={"sub": user.username}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Tambahkan di bagian bawah main.py
@app.delete("/api/v1/leads/all")
def clear_leads_database(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    Menghapus seluruh data nasabah (leads) dari database.
    Hanya bisa diakses oleh pengguna terautentikasi.
    """
    success = crud.delete_all_leads(db)
    if not success:
        raise HTTPException(status_code=500, detail="Gagal mengosongkan database")
    
    return {"status": "success", "message": "Seluruh data leads berhasil dihapus"}