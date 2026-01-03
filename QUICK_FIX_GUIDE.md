# 🔧 Quick Fix: "Failed to fetch" Error

## Problem
Your registration page shows "Failed to fetch" - the frontend cannot connect to the backend.

## ✅ Solution (Step-by-Step)

### Step 1: Setup Database
Open MySQL and run these commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS fms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE fms_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    company_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify table was created
SHOW TABLES;
DESCRIBE users;
```

### Step 2: Update .env File
Your `.env` file is already updated! Just change the DB_PASSWORD if you have one:

```env
DB_PASSWORD=your_mysql_password_here
```

### Step 3: Install Backend Dependencies
Open Command Prompt in your project folder:

```cmd
cd backend
npm install
```

### Step 4: Start Backend Server
```cmd
npm start
```

You should see:
```
🚀 Server running on port 5000
✓ Database connected successfully
```

### Step 5: Test the Connection
Open a NEW Command Prompt window and test:

```cmd
curl http://localhost:5000/api/health
```

OR open this URL in your browser:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "FMS API is running",
  "timestamp": "..."
}
```

### Step 6: Try Registration Again
1. Make sure backend is running (from Step 4)
2. Refresh your registration page
3. Fill in the form
4. Click "Create Account"

## 🎯 Troubleshooting

### Error: "Cannot connect to database"
```cmd
# Check if MySQL is running
mysql -u root -p

# If it works, update your .env with the correct password
```

### Error: "Port 5000 is already in use"
```cmd
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <pid_number> /F

# Or change the port in .env to 5001
PORT=5001
```

### Error: Still "Failed to fetch"
1. Check if backend is running: `http://localhost:5000/api/health`
2. Check browser console (F12) for errors
3. Make sure you're not using HTTPS for localhost
4. Disable any ad blockers or VPN

## 📋 Quick Checklist
- [ ] MySQL is installed and running
- [ ] Database `fms_db` exists
- [ ] Table `users` exists
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server is running (`npm start`)
- [ ] Can access http://localhost:5000/api/health
- [ ] Browser shows registration page correctly

Once all are checked, registration will work! ✅
