# 🔗 How to Connect Backend for User Data Storage & Login

## Current System Architecture

Your File Management System now uses a **Backend Authentication System** (not Firebase):

```
Frontend (HTML/JS) ←→ Backend API (Node.js) ←→ MySQL Database
```

## ✅ Step-by-Step Setup Guide

### 1. **Backend Server Setup**

#### Install Dependencies
```bash
cd backend
npm install
```

#### Create Environment File
Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fms_db

# JWT Secret (Change this!)
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 2. **Database Setup**

#### Create Database
```sql
CREATE DATABASE fms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fms_db;
```

#### Run SQL Scripts
```bash
# Windows
mysql -u root -p fms_db < database\users_table.sql

# Linux/Mac
mysql -u root -p fms_db < database/users_table.sql
```

### 3. **Start Backend Server**

```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 5000
📍 Environment: development
🌐 API: http://localhost:5000/api

✓ Database connected successfully
✓ Server is ready to accept connections
```

### 4. **Test Backend Connection**

Open `frontend/test-connection.html` in your browser and click "Test Backend Connection"

OR test manually:
```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

### 5. **How the System Works**

#### A. **User Registration Flow**

```javascript
// Frontend sends registration data
const response = await authAPI.register({
    username: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
});

// Backend:
// 1. Validates input data
// 2. Hashes password with bcrypt
// 3. Stores user in MySQL database
// 4. Returns JWT token + user data

// Frontend stores token and user data
auth.login(response.token, response.user);
```

#### B. **User Login Flow**

```javascript
// Frontend sends login credentials
const response = await authAPI.login('admin@fms.com', 'admin123');

// Backend:
// 1. Finds user by email in database
// 2. Compares password with stored hash
// 3. Generates JWT token
// 4. Returns token + user data

// Frontend stores in localStorage
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
```

#### C. **Fetching Protected Data**

```javascript
// Frontend makes authenticated request
const profile = await authAPI.getProfile();

// API client automatically adds token
headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}

// Backend verifies token and returns user data
```

## 📡 How Data is Stored

### User Data Storage

```
MySQL Database (fms_db)
└── users table
    ├── id (auto increment)
    ├── username
    ├── email (unique)
    ├── password (hashed with bcrypt)
    ├── role (user/admin)
    ├── company_id
    ├── created_at
    └── updated_at
```

### Session Storage (Client-side)

```
Browser localStorage
├── token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
└── user: {"id":1,"username":"Admin","email":"admin@fms.com","role":"admin"}
```

## 🔑 Authentication Flow Diagram

```
┌─────────────┐                ┌─────────────┐                ┌──────────┐
│   Browser   │                │   Backend   │                │  MySQL   │
│  (Frontend) │                │   (API)     │                │   DB     │
└──────┬──────┘                └──────┬──────┘                └─────┬────┘
       │                              │                              │
       │ POST /api/auth/login         │                              │
       │ {email, password}            │                              │
       ├─────────────────────────────>│                              │
       │                              │                              │
       │                              │ SELECT * FROM users          │
       │                              │ WHERE email = ?              │
       │                              ├─────────────────────────────>│
       │                              │                              │
       │                              │<─────────────────────────────┤
       │                              │  User data returned          │
       │                              │                              │
       │                              │ Compare passwords            │
       │                              │ Generate JWT token           │
       │                              │                              │
       │<─────────────────────────────┤                              │
       │ {token, user}                │                              │
       │                              │                              │
       │ Store in localStorage        │                              │
       │                              │                              │
```

## 🧪 Testing the Connection

### Using Test Page
1. Open `frontend/test-connection.html`
2. Click each test button in order:
   - ✅ Test Backend Connection
   - ✅ Test Registration
   - ✅ Test Login
   - ✅ Get Profile

### Using Browser Console
```javascript
// Test login
const result = await authAPI.login('admin@fms.com', 'admin123');
console.log(result);

// Check if authenticated
console.log('Authenticated:', auth.isAuthenticated());

// Get current user
console.log('User:', auth.getUser());
```

## 📋 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/password` | Update password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Example Requests

#### Register
```javascript
await authAPI.register({
    username: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
});
```

#### Login
```javascript
const response = await authAPI.login('john@example.com', 'password123');
// Returns: { token, user }
```

#### Get Profile
```javascript
const profile = await authAPI.getProfile();
// Returns: { user }
```

## 🔧 Troubleshooting

### Backend Not Starting
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (Windows)
taskkill /PID <pid> /F
```

### Database Connection Error
```
✓ Verify MySQL is running
✓ Check database name exists: fms_db
✓ Verify credentials in .env file
✓ Test connection: mysql -u root -p
```

### CORS Error
```javascript
// Update backend/src/app.js
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
}));
```

### Login Not Working
```
1. Check backend is running (http://localhost:5000/api/health)
2. Verify users exist in database: SELECT * FROM users;
3. Check browser console for errors
4. Verify API_URL in frontend/assets/js/api.js
```

## 🎯 Default Test Credentials

```
Admin Account:
Email: admin@fms.com
Password: admin123

User Account:
Email: user@fms.com
Password: admin123
```

## 📁 Key Files

```
Frontend Files:
├── frontend/assets/js/api.js          # API client (handles requests)
├── frontend/assets/js/auth-utils.js   # Auth utilities (login/logout)
├── frontend/pages/login.html          # Login page
├── frontend/pages/register.html       # Registration page
└── frontend/test-connection.html      # Connection test page

Backend Files:
├── backend/src/controllers/auth.controller.js  # Login logic
├── backend/src/models/User.js                  # User database model
├── backend/src/middleware/auth.js              # Token verification
├── backend/src/routes/auth.routes.js           # Auth endpoints
└── backend/.env                                # Configuration

Database:
└── database/users_table.sql           # User table schema
```

## ✅ Quick Verification Checklist

- [ ] MySQL server is running
- [ ] Database `fms_db` exists
- [ ] Users table created
- [ ] Backend `.env` file configured
- [ ] Backend server running on port 5000
- [ ] Can access http://localhost:5000/api/health
- [ ] Frontend can connect to backend
- [ ] Login works successfully
- [ ] Token stored in localStorage
- [ ] Protected routes work with token

## 🎉 You're All Set!

Your backend authentication system is now properly connected and ready to:
- ✅ Store user data in MySQL database
- ✅ Handle user registration
- ✅ Process login requests
- ✅ Manage user sessions with JWT tokens
- ✅ Protect routes with authentication
- ✅ Fetch and update user data

Start the backend, open the login page, and test it out! 🚀
