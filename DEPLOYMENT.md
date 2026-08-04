# OneStop AI — Production Deployment Guide

This guide provides step-by-step instructions for deploying the **OneStop AI (Career-CompassAI)** platform to production cloud services:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL
- **AI Services**: Google Gemini / OpenAI API

---

## 🏗️ Architecture Summary

```
+---------------------+          HTTPS API          +-----------------------+
|  Vercel (Frontend)  | --------------------------> |   Render (Backend)    |
|  React 18 + Vite    |                             |  FastAPI + Gunicorn   |
+---------------------+                             +-----------+-----------+
                                                                |
                                             +------------------+------------------+
                                             |                                     |
                                   +---------v---------+                 +---------v---------+
                                   |  Neon PostgreSQL  |                 | Google Gemini API |
                                   |  (Database)       |                 | (AI Intelligence) |
                                   +-------------------+                 +-------------------+
```

---

## 1. Database Setup (Neon PostgreSQL)

1. Sign up / Log in to [Neon.tech](https://neon.tech).
2. Create a new project: `career-compassai-db`.
3. Copy your connection string under **Database Details**:
   ```
   postgresql://<user>:<password>@ep-xyz-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. This connection URL will be used for the `DATABASE_URL` environment variable on Render.

---

## 2. Backend Deployment (Render)

### Option A: Using Render Blueprint (Recommended)
1. Push this repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect `backend/render.yaml`.
6. Fill in the environment variables when prompted:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `SECRET_KEY`: Long random string for JWT encryption
   - `FRONTEND_URL`: Your production Vercel URL (e.g. `https://career-compassai.vercel.app`)
   - `CORS_ORIGINS`: Comma-separated allowed URLs (e.g. `https://career-compassai.vercel.app,http://localhost:5173`)
   - `GEMINI_API_KEY` or `OPENAI_API_KEY`: Your AI API key

### Option B: Manual Web Service Setup
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT app.main:app`
- **Health Check Path**: `/api/health`

---

## 3. Frontend Deployment (Vercel)

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `Career-CompassAI` GitHub repository.
4. Set the **Framework Preset** to **Vite**.
5. Set the **Root Directory** to `frontend`.
6. Add Environment Variable:
   - `VITE_API_URL`: `https://career-compassai-backend.onrender.com` (Your live Render backend URL)
7. Click **Deploy**.

Vercel will automatically build the React app and deploy it to a global CDN. The included `frontend/vercel.json` ensures client-side routes (like `/dashboard`, `/assessment`, `/progress`) reload seamlessly without 404 errors.

---

## 4. Environment Variables Reference

### Backend (`.env`)
```env
APP_NAME="OneStop AI"
APP_VERSION="1.9.0"
DEBUG=false

# Database
DATABASE_URL="postgresql://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require"

# Auth
SECRET_KEY="your-super-secret-jwt-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# CORS
FRONTEND_URL="https://career-compassai.vercel.app"
CORS_ORIGINS="https://career-compassai.vercel.app,http://localhost:5173"

# AI Service
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="https://career-compassai-backend.onrender.com"
```

---

## 5. Post-Deployment Verification Checklist

- [ ] Health Check: Open `https://your-backend.onrender.com/api/health` — should return `{"status": "healthy"}`
- [ ] Swagger Docs: Open `https://your-backend.onrender.com/docs`
- [ ] User Auth: Register a new user on the production Vercel URL
- [ ] Career Assessment: Complete an assessment and verify score calculation & DB storage
- [ ] AI Recommendations: Generate recommendations and check API responses
- [ ] Admin Portal: Verify admin route protection and user management
