# ⚡ DevFlow SaaS

A modern, agile project management and developer workflow platform. Designed for teams to seamlessly collaborate, manage tasks, and organize sprints, all under a single customizable workspace.

---

## 🔗 Live Demo
> **Live Site:** [DevFlow](https://devflow-saas-coral.vercel.app/dashboard)  
> **API Server:** [Backend](https://devflow-saas.onrender.com)

---

## 🛠️ Tech Stack
This application is built using the **MERN** stack (PostgreSQL instead of MongoDB), providing a robust, highly-relational backend architecture paired with a blazing-fast React frontend.

**Frontend (`/client`)**
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Dark Theme, Glassmorphism)
- **State Management:** Zustand
- **Routing:** React Router v7
- **Auth:** `@react-oauth/google` for bridging Google Identity.

**Backend (`/server`)**
- **Framework:** Node.js + Express
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL (Neon.tech equivalent)
- **Authentication:** JWT (JSON Web Tokens), Bcrypt hashing
- **Email Verification:** NodeMailer (for OTP registration flows)

---

## ✨ Features
1. **Advanced Authentication Setup:** 
   - Sign in seamlessly with **Google OAuth 2.0**.
   - Native account creation secured by **OTP Email Verification**.
2. **Organization Management:**
   - Create private Team Organizations.
   - Invite users and assign specific RBAC (Role-Based Access Control) permissions.
3. **Projects & Task Management:**
   - Create endless projects within an organization.
   - Kanban-style Task structure (`TODO`, `IN_PROGRESS`, `DONE`).
   - Assign tasks to teammates with Priority metrics (`LOW`, `MEDIUM`, `HIGH`).
4. **Real-time Collaboration:**
   - Discussion feed allowing teammates to drop comments on tasks instantly.
5. **Interactive Dashboard:**
   - Analytics overview of active sprints and personal tasks.

---

## 💻 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Rahul6206/devflow-saas.git
cd devflow-saas
```

### 2. Set up the Backend
```bash
cd server
npm install
```
**Configure your `server/.env`:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/devflow"

# JWT Config
ACCESS_TOKEN_SECRET="your_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_secret"

# OAuth & Email
GOOGLE_CLIENT_ID="your_google_client_id"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Frontend Link
CLIENT_URL="http://localhost:5173"
```
**Migrate DB and Start:**
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Set up the Frontend
```bash
cd ../client
npm install
```
**Configure your `client/.env`:**
```env
VITE_API_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="your_google_client_id"
```
**Start the React App:**
```bash
npm run dev
```

---

## 🚀 Deployment Guide
- **Database:** Hosted on [Neon.tech](https://neon.tech/) (Free Serverless Postgres).
- **Backend:** Configured for [Render.com](https://render.com/). Build command: `npm run build`, Start command: `npm start`.
- **Frontend:** Configured for [Vercel](https://vercel.com). Just connect GitHub and deploy automatically!

---

*Built with passion. Feel free to fork, star, or submit pull requests!*