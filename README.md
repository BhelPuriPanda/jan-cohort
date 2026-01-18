
# Clarity Jobs - AI-Powered Recruitment Platform

![Clarity Jobs](https://img.shields.io/badge/Status-Active-success)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI Powered](https://img.shields.io/badge/AI-OpenRouter-purple)

**Clarity Jobs** is a state-of-the-art recruitment platform designed to streamline the hiring process for both employers and job seekers. It leverages advanced AI to generate job descriptions and parse resumes with high precision, wrapped in a futuristic, high-performance user interface.

## 🚀 Key Features

### 1. 📄 AI Job Description Generator
*Target Audience: Employers*
- **Instant Generation:** Input basic role details (Title, Skills, Experience) to generate comprehensive JDs in seconds.
- **A/B Testing:** Automatically generates two distinct variants (Variant A & Variant B) to choose the best tone and structure.
- **AI-Powered:** Utilizes Large Language Models (LLMs) via OpenRouter for context-aware and professional content.
- **One-Click Copy:** Easily copy the preferred version to the clipboard.

### 2. 🧠 Intelligent Resume Parser ("Intelligence Vault")
*Target Audience: Job Seekers & Recruiters*
- **Advanced Extraction:** deep parsing of PDF resumes to extract:
  - **Identity:** Name, Email, Phone.
  - **Competency:** Key Skills with relevance scoring.
  - **Experience, Projects, & Education:** Detailed section extraction.
- **Confidence Scoring:** A granular, weighted scoring system (0-100%) that evaluates the completeness and validity of the parsed data.
- **Visual Dashboard:** A futuristic "Vault" interface that visualizes extraction quality and parsed data side-by-side with the document preview.
- **Privacy-First:** Secure file handling with auto-cleanup of uploaded files.

### 3. 💼 Interactive Job Dashboard
- **Smart Filters:** Filter opportunities by Salary Range, Experience Level, Job Type (Remote/Hybrid), and more.
- **Match Score:** Visual "Match Ring" showing how well a job fits the user's profile.
- **Role-Based Views:** Tailored actions for Employers (Post Job/Generate JD) vs. Employees (Apply/Optimize Resume).

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** React Router v7

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express v5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose v9)
- **AI Integration:** OpenRouter SDK
- **File Handling:** Multer + PDF-Parse

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jan-coho.git
cd jan-coho
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend-node
npm install
```

Create a `.env` file in `backend-node/`:
```env
PORT=4001
MONGO_URI=mongodb+srv://<your-mongo-uri>
OPENROUTER_API_KEY=sk-or-v1-...
```

Start the server:
```bash
npm start
# Server runs on http://localhost:4001
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:4001/api
```

Start the development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 📂 Project Structure

```
c:/projects/jan-coho/
├── backend-node/       # Express Server & API
│   ├── src/
│   │   ├── controllers/# Logic for Auth, Jobs, Resume
│   │   ├── models/     # Mongoose Schemas (User, Job)
│   │   ├── routes/     # API Endpoints
│   │   ├── services/   # Business Logic (Parser, AI, Scoring)
│   │   └── index.js    # Entry Point
│   └── package.json
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Main Application Pages
│   │   │   ├── JDGenerator.jsx
│   │   │   ├── ResumeParser.jsx
│   │   │   └── ...
│   │   └── index.css   # Global Styles (Tailwind)
│   └── package.json
│
└── README.md           # Project Documentation
```

## 🔐 Auth & Roles

The platform supports two user roles:
- **Employee:** Can search jobs, parse resumes.
- **Employer:** Can generate JDs, post jobs.

*Note: Role is selected during Signup.*

---

## ✨ Future Roadmap

- [ ] **Direct Apply:** One-click application using parsed resume data.
- [ ] **PDF Export:** Export generated JDs as PDF/Word.
- [ ] **Interview Prep:** AI-generated interview questions based on the JD and Resume.

---

© 2026 Clarity Jobs. Built with ❤️ by the Team ThatsWhatSheCoded.
