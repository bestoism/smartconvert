# SmartConvert CRM
**Enterprise-Grade Predictive Lead Scoring & Operational Intelligence System**

## Executive Summary
SmartConvert CRM is an advanced, AI-driven Customer Relationship Management platform engineered specifically for the banking and financial sector. It transforms raw marketing and demographic data into actionable operational directives. By utilizing high-performance Machine Learning algorithms, the system predicts the conversion probability of potential leads for term deposit campaigns, effectively eliminating guesswork and optimizing resource allocation for sales departments.

## Core Capabilities

* **Predictive Lead Validation:** Powered by a highly tuned XGBoost Classifier (v2.0) that evaluates client demographics, economic indicators, and historical campaign data to categorize leads into High, Medium, and Low potential.
* **Explainable AI (XAI):** Integrates SHAP (SHapley Additive exPlanations) to provide complete algorithmic transparency. It reveals the exact micro and macro factors influencing every AI decision, allowing sales representatives to tailor their conversations.
* **Dynamic What-If Simulator:** A real-time sandbox environment for strategic managers to adjust economic parameters (e.g., Euribor 3M, Employment Rates) and observe predicted shifts in conversion probabilities instantly.
* **Batch Processing & Bulk Operations:** Built to handle enterprise data loads. Users can upload bulk CSV files for automated data cleaning, normalization, and instantaneous ML inference.
* **Executive Analytics Dashboard:** Offers a comprehensive, high-level overview of campaign performance, workforce activity logs, conversion tracking, and systemic health monitoring.

## System Architecture

SmartConvert is built on a decoupled, modern architecture designed for scalability, security, and high performance.

**Frontend Environment:**
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Data Visualization:** Recharts
* **State Management & Fetching:** Axios with Interceptor-based Auth Handling

**Backend Infrastructure:**
* **Gateway & API:** FastAPI (High-Performance Python framework)
* **ORM & Database:** SQLAlchemy interfacing with PostgreSQL (or local SQLite for development)
* **Authentication:** JSON Web Tokens (JWT) with Bcrypt password hashing
* **Server:** Uvicorn (ASGI)

**Machine Learning Engine:**
* **Algorithm:** XGBoost (Extreme Gradient Boosting)
* **Interpretability:** SHAP Kernels
* **Data Integrity:** The model is explicitly engineered to mitigate Data Leakage (e.g., exclusion of post-facto features such as call duration) to ensure strict predictive validity.

## Security & Compliance
Security is embedded at the core of the infrastructure:
* **Authorization:** Stateless JWT architecture with automatic session expiration.
* **Data Protection:** Passwords and sensitive credentials are encrypted using industry-standard Bcrypt algorithms.
* **Route Protection:** Middleware implementation across both frontend and backend to restrict unauthorized data access and enforce Role-Based constraints.

## Directory Structure

```text
SmartConvert-Next/
├── backend/
│   ├── app/
│   │   ├── auth.py          # JWT & Security Logic
│   │   ├── crud.py          # Database Operations & Queries
│   │   ├── main.py          # API Gateway & Endpoints
│   │   ├── ml_service.py    # XGBoost & SHAP Inference Engine
│   │   ├── models.py        # SQLAlchemy Data Models
│   │   └── schemas.py       # Pydantic Validation Schemas
│   ├── ml_assets/           # Serialized Model (.pkl) & Feature Mapping (.json)
│   ├── requirements.txt     # Python Dependencies
│   └── Dockerfile           # Containerization configuration
├── frontend/
│   ├── app/                 # Next.js Application Router
│   ├── components/          # Reusable UI Architecture
│   ├── lib/                 # Global Utilities & API Config
│   ├── package.json         # Node.js Dependencies
│   └── tsconfig.json        # TypeScript Configuration
└── .github/workflows/       # CI/CD & Automated Infrastructure Maintenance
```

## Installation & Deployment

### Prerequisites
* Python 3.11+
* Node.js 18+ (npm, yarn, or pnpm)
* PostgreSQL (Optional, defaults to SQLite for immediate local testing)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```
4. Set up environment variables (`.env` file in the `backend` directory):
   ```env
   SECRET_KEY=your_secure_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   DATABASE_URL=sqlite:///./crm.db
   ```
5. Initialize the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env.local` file in the `frontend` directory):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Launch the development server:
   ```bash
   npm run dev
   ```
5. Access the interface via `http://localhost:3000`.

## Docker Support
The backend is fully containerized for production deployment. The provided `Dockerfile` leverages the official Python 3.11 image, ensuring a secure, non-root user environment suitable for cloud platforms (e.g., AWS, GCP, or Hugging Face Spaces).

## Technical Documentation
Detailed operational manuals and API documentation are integrated directly into the application. Once deployed, navigate to the `/documentation` route within the platform to review systemic structures, RESTful API endpoints, and Machine Learning configurations.

## License
Proprietary Software. All rights reserved.

---
**Developed and Architected by Ryan Besto Saragih**
