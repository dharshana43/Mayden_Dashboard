# Mayden Dashboard

A full-stack web application with user authentication and a per-user dashboard.

## Features

-> User Signup and Login
-> Passwords stored securely using hashing (bcrypt)
-> Token-based authentication (JWT)
-> Dashboard displaying policy, corporate, employee, and member data
- >Each logged-in user sees only their own data

## Tech Stack

Frontend:React (Vite), React Router, Axios
Backend:Node.js (built-in http module), MySQL
Database:MySQL



# Project Structure

mayden-project folder has:
- backend folder (server.js, db.js, package.json)
- frontend folder (src folder has App.jsx, App.css, and a pages folder with Login.jsx, Signup.jsx, Dashboard.jsx)
- schema.sql file

# Setup Instructions

### 1. Database
Run `schema.sql` in MySQL to create the database and tables.

### 2. Backend

cd backend
npm install
npm start

Runs on `http://localhost:5000`

### 3. Frontend

cd frontend
npm install
npm run dev

Runs on `http://localhost:5173`

## API Endpoints

POST /api/signup - creates a new user
POST /api/login - logs in and returns a token
GET /api/dashboard - returns dashboard data for the logged in user (needs token)