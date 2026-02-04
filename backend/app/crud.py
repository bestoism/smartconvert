from sqlalchemy.orm import Session
from sqlalchemy import func, case
from . import models, schemas
from datetime import datetime
from . import auth
from typing import List

# 1. Simpan Lead Baru ke Database
def create_lead(db: Session, lead_data: dict, prediction: dict):
    db_lead = models.Lead(
        **lead_data, 
        prediction_score=prediction.get("score"),
        prediction_label=prediction.get("label")
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

# 2. Ambil List Leads (Dengan Logika Filtering, Pagination, & Total Count)
def get_leads(db: Session, skip: int = 0, limit: int = 100, sort_by: str = "newest", 
              job: str = None, min_age: int = None, max_age: int = None, 
              min_score: float = None):
    
    query = db.query(models.Lead)
    
    # Terapkan Filter
    if job:
        query = query.filter(models.Lead.job == job)
    if min_age is not None:
        query = query.filter(models.Lead.age >= min_age)
    if max_age is not None:
        query = query.filter(models.Lead.age <= max_age)
    if min_score is not None:
        query = query.filter(models.Lead.prediction_score >= min_score)

    # Hitung TOTAL hasil filter
    filtered_count = query.count()

    # Terapkan Sorting
    if sort_by == "score_high":
        query = query.order_by(models.Lead.prediction_score.desc())
    elif sort_by == "score_low":
        query = query.order_by(models.Lead.prediction_score.asc())
    elif sort_by == "oldest":
        query = query.order_by(models.Lead.id.asc())
    else:
        query = query.order_by(models.Lead.id.desc())
        
    data = query.offset(skip).limit(limit).all()

    return filtered_count, data 

# 3. Ambil Detail Satu Lead
def get_lead_by_id(db: Session, lead_id: int):
    return db.query(models.Lead).filter(models.Lead.id == lead_id).first()

# 4. Bulk Actions (Penyebutan in_ langsung pada kolom)
def bulk_delete_leads(db: Session, lead_ids: List[int]):
    try:
        db.query(models.Lead).filter(models.Lead.id.in_(lead_ids)).delete(synchronize_session=False)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        return False

def bulk_update_status(db: Session, lead_ids: List[int], new_status: str):
    try:
        db.query(models.Lead).filter(models.Lead.id.in_(lead_ids)).update(
            {"status": new_status, "updated_at": func.now()}, 
            synchronize_session=False
        )
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        return False

def get_dashboard_stats(db: Session):
    total = db.query(models.Lead).count()
    
    # Handle DB Kosong agar tidak Error 500 di Frontend
    if total == 0:
        return {
            "total_leads": 0, "high_potential": 0, "medium_potential": 0, "low_potential": 0,
            "conversion_rate_estimate": 0.0, "age_dist": [], "score_dist": [],
            "marital_dist": [], "edu_dist": [], "job_dist": [], "econ_dist": []
        }

    # Age Grouping
    age_groups = db.query(
        case(
            (models.Lead.age <= 25, '18-25'),
            (models.Lead.age <= 35, '26-35'),
            (models.Lead.age <= 45, '36-45'),
            (models.Lead.age <= 55, '46-55'),
            (models.Lead.age <= 65, '56-65'),
            else_='65+'
        ).label('age_range'),
        func.count(models.Lead.id)
    ).group_by('age_range').all()

    # Score Distribution
    score_dist = db.query(
        case(
            (models.Lead.prediction_score <= 0.2, '0-20'),
            (models.Lead.prediction_score <= 0.4, '21-40'),
            (models.Lead.prediction_score <= 0.6, '41-60'),
            (models.Lead.prediction_score <= 0.8, '61-80'),
            else_='81-100'
        ).label('score_range'),
        func.count(models.Lead.id)
    ).group_by('score_range').all()

    marital_data = db.query(models.Lead.marital, func.count(models.Lead.id)).group_by(models.Lead.marital).all()
    edu_data = db.query(models.Lead.education, func.count(models.Lead.id)).group_by(models.Lead.education).all()
    
    economy_data = db.query(
        case(
            (models.Lead.euribor3m <= 1.5, 'Low Interest'),
            (models.Lead.euribor3m <= 4.0, 'Medium Interest'),
            else_='High Interest'
        ).label('econ_type'),
        func.count(models.Lead.id)
    ).group_by('econ_type').all()

    job_data = db.query(models.Lead.job, func.count(models.Lead.id)).group_by(models.Lead.job).all()

    return {
        "total_leads": total,
        "high_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count(),
        "medium_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "Medium Potential").count(),
        "low_potential": db.query(models.Lead).filter(models.Lead.prediction_label == "Low Potential").count(),
        "conversion_rate_estimate": round((db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count() / total * 100), 2) if total > 0 else 0,
        "age_dist": [{"name": i[0], "value": i[1]} for i in age_groups],
        "score_dist": [{"name": i[0], "value": i[1]} for i in score_dist],
        "marital_dist": [{"name": i[0], "value": i[1]} for i in marital_data],
        "edu_dist": [{"name": i[0], "value": i[1]} for i in edu_data],
        "job_dist": [{"name": i[0], "value": i[1]} for i in job_data],
        "econ_dist": [{"name": i[0], "value": i[1]} for i in economy_data]
    }
    
def get_user_profile(db: Session, user_id: int):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    
    if not profile:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        profile = models.UserProfile(
            user_id=user_id,
            name=user.username,
            role="Junior Sales",
            email=f"{user.username}@bank-asah.co.id",
            id_emp=f"SLS-{user_id}"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    total_leads = db.query(models.Lead).count()
    high_leads = db.query(models.Lead).filter(models.Lead.prediction_label == "High Potential").count()
    first_lead = db.query(models.Lead).order_by(models.Lead.created_at.asc()).first()
    active_days = (datetime.now() - first_lead.created_at).days + 1 if first_lead else 0
    recent_leads = db.query(models.Lead).order_by(models.Lead.updated_at.desc()).limit(5).all()
    
    activities = []
    for lead in recent_leads:
        is_updated = lead.updated_at > lead.created_at
        action = "Updated status/notes for" if is_updated else "Added to database"
        activities.append({
            "lead_id": lead.id,
            "time": lead.updated_at.strftime("%Y-%m-%d %H:%M"),
            "content": f"{action} Nasabah-{lead.id}"
        })

    return {
        "id": profile.id,
        "name": profile.name,
        "role": profile.role,
        "email": profile.email,
        "id_emp": profile.id_emp,
        "monthly_target": profile.monthly_target,
        "joined_date": profile.joined_date.strftime("%d %B %Y"),
        "active_days": active_days,
        "stats": {
            "leads_processed": total_leads,
            "conversion_rate": round((high_leads / total_leads * 100), 1) if total_leads > 0 else 0,
            "current_progress": high_leads
        },
        "recent_activities": activities
    }

# PERBAIKAN: Menambahkan user_id agar yang terupdate adalah akun yang sedang login
def update_user_profile(db: Session, user_id: int, data: dict):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    
    if profile:
        allowed_fields = ["name", "role", "email", "id_emp", "monthly_target"]
        for key, value in data.items():
            if key in allowed_fields:
                setattr(profile, key, value)
        db.commit()
        db.refresh(profile)
    return profile

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user_data: dict):
    hashed_pwd = auth.get_password_hash(user_data['password'])
    db_user = models.User(username=user_data['username'], hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    db_profile = models.UserProfile(
        user_id=db_user.id, 
        name=db_user.username,
        role="Junior Sales",
        email=f"{db_user.username}@bank-asah.co.id",
        id_emp=f"SLS-{db_user.id}"
    )
    db.add(db_profile)
    db.commit()
    return db_user

def delete_all_leads(db: Session):
    try:
        db.query(models.Lead).delete()
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False