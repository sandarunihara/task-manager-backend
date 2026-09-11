# LessTaxi - Backend

This is the backend service for the LessTaxi application, providing a RESTful API to manage the platform's data and user authentication.

## Technology Stack

The backend is built with modern, scalable, and robust technologies:

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5) - For handling routing, middleware, and HTTP requests.
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) - NoSQL database for flexible data modeling and object data modeling (ODM) library.
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) (`jsonwebtoken`) for secure, stateless user authentication.
- **Security & Password Hashing**: `bcryptjs` for securely hashing user passwords before storing them in the database.
- **Environment Management**: `dotenv` for managing environment variables.
- **Cross-Origin Resource Sharing**: `cors` to allow cross-origin requests from the frontend application.
- **Development Tools**: `nodemon` for automatically restarting the server during development upon file changes.

## Prerequisites

Before running the backend, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

## Getting Started

### 1. Install Dependencies

Navigate to the `backend` directory and install the required npm packages:

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `backend` directory based on your environment configuration. It should contain at least:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lesstaxi
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Database Seeding (Optional)

If you need to seed the database with initial data (e.g., an admin user), you can run the provided seeder script:

```bash
npm run seed
```

### 4. Running the Server

**Development Mode:**
To run the server with automatic reloads upon code changes:
```bash
npm run dev
```

**Production Mode:**
To start the server normally:
```bash
npm start
```

The backend server should now be running (by default on `http://localhost:5000`).
