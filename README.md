# 🧭 Career-CompassAI (OneStop AI)

**Your Personalized Career & Education Advisor**

An AI-powered platform that helps students discover careers, create personalized learning roadmaps, improve resumes, and receive education guidance — all from one place.

---

## 🚀 Problem

Students rely on scattered sources (YouTube, blogs, coaching institutes) for career guidance, leading to confusion and inconsistent advice. There's no single platform offering **personalized, AI-driven recommendations** based on a student's interests, skills, and goals.

## 💡 Solution

Career-CompassAI centralizes career guidance by combining:
- 🎯 AI-powered career assessments
- 📚 Personalized learning roadmaps
- 📝 Resume analysis & feedback
- 🤖 AI career chatbot
- 📊 Progress tracking dashboard

---

## 🛠️ Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| **Frontend**   | React, TypeScript, Tailwind CSS, shadcn/ui       |
| **Backend**    | FastAPI (Python), SQLAlchemy, Alembic             |
| **Database**   | PostgreSQL (Neon)                                 |
| **AI**         | OpenAI API                                        |
| **Auth**       | JWT + Google OAuth                                |
| **Storage**    | Cloudinary                                        |
| **Deployment** | Vercel (Frontend), Render (Backend)               |

---

## 📁 Project Structure

```
Career-CompassAI/
├── frontend/          # React + TypeScript + Tailwind
├── backend/           # FastAPI + SQLAlchemy
├── docs/              # Project documentation
│   ├── prd.md
│   ├── Architecture.md
│   ├── Rules.md
│   ├── phases.md
│   └── design.md
└── README.md
```

---

## 🎯 Target Users

- 🎓 High School Students (Class 9–12)
- 🧑‍🎓 Undergraduate Students
- 👨‍💼 Final-Year Students
- 💼 Working Professionals
- 👨‍👩‍👧 Parents

---

## 📋 Core Features (MVP)

- [x] Project Planning & Documentation
- [ ] Authentication (Register, Login, Google OAuth)
- [ ] User Profile Management
- [ ] Career Assessment Engine
- [ ] AI Recommendation Engine
- [ ] Learning Roadmap Generator
- [ ] Student Dashboard
- [ ] Resume Analyzer
- [ ] AI Career Chatbot
- [ ] Course & Certification Recommendations
- [ ] Progress Tracking
- [ ] Admin Panel

---

## 🏗️ Development Phases

| Phase | Description                  | Status      |
|-------|------------------------------|-------------|
| 0     | Project Planning             | ✅ Complete |
| 1     | UI/UX Design                 | ✅ Complete |
| 2     | Project Setup                | ✅ Complete |
| 3     | Authentication               | ✅ Complete |
| 4     | User Profile                 | ✅ Complete |
| 5     | Career Assessment            | ✅ Complete |
| 6     | AI Recommendation Engine     | ✅ Complete |
| 7     | Learning Roadmap             | ✅ Complete |
| 8     | Dashboard                    | ✅ Complete |
| 9     | Resume Analyzer              | ✅ Complete |
| 10    | AI Chatbot                   | ✅ Complete |
| 11    | Course Recommendations       | ✅ Complete |
| 12    | Progress Tracking            | ✅ Complete |
| 13    | Admin Panel                  | ✅ Complete |
| 14    | Notifications                | ✅ Complete |
| 15    | Testing (90/90 Passed)       | ✅ Complete |
| 16    | Production Deployment        | ✅ Complete |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Setup (Coming in Phase 2)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Career-CompassAI.git
cd Career-CompassAI

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 📄 Documentation

- [Product Requirements (PRD)](./prd.md)
- [System Architecture](./Architecture.md)
- [Development Rules](./Rules.md)
- [Development Phases](./phases.md)
- [Design System](./design.md)

---

## 👤 Author

**Nikhil Ghotankar**

---

## 📜 License

This project is for educational and portfolio purposes.
