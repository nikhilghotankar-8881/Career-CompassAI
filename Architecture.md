# Architecture.md

# OneStop AI - Personalized Career & Education Advisor

Version: 1.0

---

# 1. System Architecture

The application follows a modern three-tier architecture with AI integration.

                    +----------------------+
                    |      React Frontend  |
                    |  (Web Application)   |
                    +----------+-----------+
                               |
                         REST API (HTTPS)
                               |
                    +----------v-----------+
                    |    FastAPI Backend   |
                    | Authentication       |
                    | Business Logic       |
                    | Recommendation API   |
                    +----------+-----------+
                               |
        +----------------------+----------------------+
        |                                             |
+-------v--------+                           +---------v--------+
| PostgreSQL DB  |                           |   AI Services    |
| Users          |                           | OpenAI API       |
| Skills         |                           | Career Advisor   |
| Roadmaps       |                           | Resume Analysis  |
| Assessments    |                           | Chat Assistant   |
+----------------+                           +------------------+

                               |
                    +----------v-----------+
                    | Cloud Storage (S3 /  |
                    | Cloudinary)          |
                    +----------------------+

---

# 2. Application Flow

User opens website

↓

Login / Register

↓

Create User Profile

↓

Complete Career Assessment

↓

Recommendation Engine

↓

Personalized Career Suggestions

↓

Learning Roadmap

↓

Dashboard

↓

AI Career Chat

↓

Resume Review

↓

Track Progress

↓

Apply Learning Plan

---

# 3. Request Flow

Client (React)

↓

API Request

↓

FastAPI Router

↓

Controller

↓

Service Layer

↓

Database / AI API

↓

Response

↓

Frontend UI

---

# 4. Project Architecture

Frontend
│
├── Pages
├── Components
├── Layouts
├── Hooks
├── Services
├── Context
├── Routes
└── Utilities

↓

Backend

├── API
├── Authentication
├── Business Logic
├── Recommendation Engine
├── AI Module
├── Database Layer
└── File Storage

↓

Database

Users

Profiles

Assessments

Recommendations

Roadmaps

Courses

Resumes

Progress

---

# 5. Folder Structure

career-advisor/

├── frontend/
│
│   ├── public/
│   ├── src/
│   │
│   ├── assets/
│   ├── components/
│   │      ├── common/
│   │      ├── ui/
│   │      ├── dashboard/
│   │      └── career/
│   │
│   ├── pages/
│   │      ├── Home/
│   │      ├── Login/
│   │      ├── Register/
│   │      ├── Dashboard/
│   │      ├── Assessment/
│   │      ├── Roadmap/
│   │      ├── Resume/
│   │      └── Chat/
│   │
│   ├── hooks/
│   ├── services/
│   ├── routes/
│   ├── context/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
└── package.json

------------------------------------------------------

backend/

├── app/
│
├── api/
│      ├── auth.py
│      ├── users.py
│      ├── assessments.py
│      ├── recommendations.py
│      ├── roadmap.py
│      ├── resume.py
│      └── chatbot.py
│
├── core/
│      ├── config.py
│      ├── security.py
│      └── dependencies.py
│
├── database/
│      ├── connection.py
│      ├── models.py
│      └── migrations/
│
├── schemas/
│
├── services/
│      ├── ai_service.py
│      ├── recommendation_service.py
│      ├── roadmap_service.py
│      ├── resume_service.py
│      └── auth_service.py
│
├── utils/
│
├── uploads/
│
├── main.py
│
└── requirements.txt

------------------------------------------------------

docs/

├── PRD.md
├── architecture.md
├── database.md
├── api.md
├── roadmap.md
└── wireframes.md

------------------------------------------------------

README.md

---

# 6. Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Query

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication

---

## Database

- PostgreSQL

---

## AI

- OpenAI API
- Embedding Model
- Prompt Engineering

---

## Authentication

- JWT
- OAuth (Google Login)
- Password Hashing (bcrypt)

---

## Storage

- AWS S3 / Cloudinary

---

## Deployment

Frontend
- Vercel

Backend
- Render

Database
- Neon PostgreSQL

---

# 7. Core Modules

Authentication Module

User Profile Module

Career Assessment Module

Recommendation Engine

Learning Roadmap Module

Dashboard Module

Resume Review Module

AI Chat Module

Progress Tracker

Admin Panel

---

# 8. API Communication

React Frontend

↓

Axios Client

↓

REST API

↓

FastAPI

↓

Service Layer

↓

Database

↓

JSON Response

↓

React UI

---

# 9. Security

- JWT Authentication
- Password Hashing
- HTTPS Communication
- Role-Based Authorization
- Input Validation
- SQL Injection Protection
- XSS Protection
- CORS Configuration

---

# 10. Scalability

The application is designed using a modular architecture.

Each module can be extended independently without affecting other modules.

Future improvements:

- Microservices
- Redis Cache
- Docker
- Kubernetes
- CI/CD Pipeline
- Event Queue
- AI Recommendation Microservice

---

# 11. Future Architecture

Current

Frontend

↓

Backend

↓

Database

↓

OpenAI

Future

Frontend

↓

API Gateway

↓

Microservices

↓

Redis Cache

↓

PostgreSQL

↓

Vector Database

↓

LLM Service

↓

Analytics Engine

↓

Notification Service

---

# 12. Development Principles

- Clean Architecture
- SOLID Principles
- DRY (Don't Repeat Yourself)
- Modular Design
- Reusable Components
- Separation of Concerns
- RESTful API Design
- Secure Authentication
- Scalable Folder Structure

---

# 13. Version

Architecture Version : 1.0

Status : Planning Phase

Author : Nikhil Ghotankar