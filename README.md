# LessTaxi - Backend (Task Management API)

This is the backend service for the LessTaxi Trello-like task management application. It provides a RESTful API to manage the platform's data, user authentication, and role-based permissions.

## 🚀 Deployment Information

- **Frontend Application:** [https://task-manager-frontend-eight-plum.vercel.app/](https://task-manager-frontend-eight-plum.vercel.app/)
- **Backend API Base URL:** [https://task-manager-backend-btlc.vercel.app/api](https://task-manager-backend-btlc.vercel.app/api)

## 📋 Project Overview

This assignment is a full-stack Trello-like task management application. It features a task board with three status columns (To Do, Doing, Done) and drag-and-drop functionality for moving tasks. 

**Core Features Implemented:**
- **User Roles & Permissions**: Two distinct roles:
  - **Normal Users**: Register, log in, create tasks, assign unassigned tasks to themselves, and manage their own tasks.
  - **Administrators**: Seeded via database scripts. Can view all users and tasks, manage assignments across the entire system, and reassign tasks between any users.
- **Task Management**: Tasks include title, description, status, creator, assigned user, and timestamps.
- **Drag-and-Drop Board**: Seamless task movement between columns persisting across reloads.
- **Security**: Robust role-based access control, securely hashed passwords (bcrypt), and stateless JWT authentication.

## 💻 Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5) - For handling routing and RESTful APIs.
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) (`jsonwebtoken`)
- **Security & Password Hashing**: `bcryptjs`
- **Environment Management**: `dotenv`
- **CORS**: `cors` module for frontend communication.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18 or newer)
- MongoDB (local or Atlas cluster)

### 2. Installation
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the `backend` directory. Required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: Do not commit the `.env` file to version control.)*

### 4. Database Seeding (Crucial for Admin Access)
Administrators cannot be created through normal registration. You must seed the database to create the admin account:
```bash
npm run seed
```
This will create:
- **Admin Email:** `admin@gmail.com`
- **Admin Password:** `Admin@123`
- (And additional normal users for testing)

### 5. Running the Server
**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

