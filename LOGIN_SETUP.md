# File Management System - Login Setup Guide

## 🚀 Complete Login System Implementation

This project now has a fully functional authentication system with both backend (Node.js + JWT) and frontend (HTML/CSS/JS).

## 📋 Features

- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes and middleware
- ✅ Password reset interface
- ✅ Responsive design
- ✅ Modern UI with animations

## 🛠️ Installation & Setup

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

This will install:
- express - Web framework
- mysql2 - Database driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - Cross-origin resource sharing
- express-validator - Input validation

#### Configure Environment
Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fms_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Set Up Database
1. Create the database:
```sql
CREATE DATABASE fms_db;
USE fms_db;
```

2. Run the SQL scripts:
```bash
# Run the main database schema
mysql -u root -p fms_db < database/fms_db.sql

# Create users table
mysql -u root -p fms_db < database/users_table.sql

# Create companies table (if needed)
mysql -u root -p fms_db < database/companies_table.sql
```

#### Start the Backend Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Frontend Setup

The frontend is pure HTML/CSS/JavaScript - no build process required!

#### Update API URL (if needed)
If your backend runs on a different port, update the API URL in:
`frontend/assets/js/api.js`

```javascript
const API_URL = 'http://localhost:5000/api';
```

#### Serve the Frontend
You can use any static file server:

**Option 1: VS Code Live Server Extension**
- Install "Live Server" extension in VS Code
- Right-click on `frontend/index.html` → "Open with Live Server"

**Option 2: Python HTTP Server**
```bash
cd frontend
python -m http.server 3000
```

**Option 3: Node.js HTTP Server**
```bash
npm install -g http-server
cd frontend
http-server -p 3000
```

Visit `http://localhost:3000/pages/login.html`

## 🔐 Default Credentials

After setting up the database, you can use these test accounts:

**Admin Account:**
- Email: `admin@fms.com`
- Password: `admin123`

**User Account:**
- Email: `user@fms.com`
- Password: `admin123`

⚠️ **Important:** Change these passwords immediately after first login!

## 📁 Project Structure

```
fms-file-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Database connection
│   │   │   └── env.js            # Environment config
│   │   ├── controllers/
│   │   │   └── auth.controller.js # Authentication logic
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification
│   │   │   └── roleCheck.js      # Role-based access
│   │   ├── models/
│   │   │   └── User.js           # User model
│   │   ├── routes/
│   │   │   ├── auth.routes.js    # Auth endpoints
│   │   │   └── api.routes.js     # API router
│   │   └── app.js                # Express app setup
│   ├── server.js                 # Server entry point
│   ├── package.json              # Dependencies
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── assets/
│   │   └── js/
│   │       ├── api.js            # API client
│   │       └── auth-utils.js     # Auth utilities
│   └── pages/
│       ├── login.html            # Login page
│       ├── register.html         # Registration page
│       ├── reset.html            # Password reset
│       └── dashboard.html        # User dashboard
│
└── database/
    ├── fms_db.sql                # Main database schema
    └── users_table.sql           # Users table setup
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/password` - Update password (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Health Check
- `GET /api/health` - Check API status

## 🎨 Frontend Pages

1. **Login Page** (`/pages/login.html`)
   - Email/password login
   - Link to registration
   - Link to password reset
   - Auto-redirect if already logged in

2. **Register Page** (`/pages/register.html`)
   - User registration form
   - Password strength indicator
   - Email validation
   - Role selection (User/Admin)

3. **Reset Password** (`/pages/reset.html`)
   - Password reset interface
   - Email validation

4. **Dashboard** (`/pages/dashboard.html`)
   - User information display
   - Quick actions
   - Stats overview
   - Logout functionality

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected API routes
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration

## 🚨 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database `fms_db` exists

### CORS Error
- Update `CORS_ORIGIN` in `.env`
- Ensure frontend and backend URLs match

### Login Failed
- Check if users table has data
- Verify password is hashed correctly
- Check browser console for errors

### Token Issues
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Verify token expiration

## 📝 Development Notes

### Adding New Protected Routes
```javascript
const auth = require('../middleware/auth');

router.get('/protected', auth, (req, res) => {
  // req.user contains authenticated user data
  res.json({ user: req.user });
});
```

### Checking User Role in Frontend
```javascript
if (auth.isAdmin()) {
  // Show admin features
}

if (auth.hasRole('user')) {
  // Show user features
}
```

### Making Authenticated API Calls
```javascript
// Token is automatically added from localStorage
const data = await api.get('/protected-endpoint');
```

## 🎯 Next Steps

1. Implement email verification
2. Add password reset functionality (requires email service)
3. Implement refresh tokens
4. Add two-factor authentication
5. Set up session management
6. Add audit logging
7. Implement rate limiting

## 📞 Support

For issues or questions, please check the API documentation in `/docs/API_Documentation.md`

## 🎉 You're All Set!

Your login system is now fully configured and ready to use. Start the backend server, open the frontend, and begin managing files securely!
