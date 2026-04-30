# 🚀 Taskly - Team Task Manager

Taskly is a premium, full-stack task management application designed for modern teams. It features a robust **Role-Based Access Control (RBAC)** system, project management, real-time task tracking, and a sleek, responsive UI with **Dark/Light mode** support.

---

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based auth with password hashing using Bcrypt.
- 👥 **Role-Based Access Control**:
  - **Admin**: Full control over projects, team members, and task assignments.
  - **Member**: Access to personal tasks and status tracking.
- 📁 **Project Management**: Create and organize tasks by projects.
- 📊 **Dynamic Dashboard**:
  - Track tasks by status (Pending, In Progress, Completed).
  - 🔥 **Overdue Alerts**: Automatic detection of tasks past their deadline.
- 🌓 **Premium Dark Mode**: Seamless toggle between light and dark themes (Tailwind CSS v4).
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop.
- 🚂 **Railway Ready**: Configured for instant deployment as a single unified app.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide React Icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Deployment**: Railway / Render / Vercel.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed on your machine.
- A MongoDB Atlas connection string.

### 2. Environment Setup
Create a `.env` file in the `backend` folder:
```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 3. Installation

**Install all dependencies:**
```bash
npm run install-all
```

### 4. Database Seeding (Create Admin)
Before logging in, you must create the main administrator:
```bash
cd backend
node seedAdmin.js
```
*Default Credentials:*
- **Email**: `administrator@taskly.com`
- **Password**: `Navdivsa.,123%`

### 5. Running the App

**Start Backend:**
```bash
cd backend
node server.js
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🚂 Deployment to Railway

This project is configured to run as a single app on Railway.

1. Push this repository to GitHub.
2. Connect the repo to Railway.
3. Add your environment variables (`MONGO_URL`, `JWT_SECRET`) in the Railway dashboard.
4. Railway will automatically run the build script and deploy the app.

---

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
