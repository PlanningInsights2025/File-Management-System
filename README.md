# 📁 File Management System (FMS)

A comprehensive file management system with secure authentication, file tracking, and movement history.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login system with role-based access control
- 📄 **File Management** - Create, track, and manage files with QR codes and barcodes
- 🔄 **Movement Tracking** - Track file movements and maintain audit logs
- 🏢 **Company Management** - Multi-company support with segregated data
- 📊 **Reports** - Generate comprehensive reports and analytics
- 📱 **Mobile Support** - Responsive design for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- A modern web browser

### Installation

#### Windows
```bash
# Run the setup script
setup.bat
```

#### Linux/Mac
```bash
# Make the script executable
chmod +x setup.sh
# Run setup
./setup.sh
```

#### Manual Setup
```bash
# Install backend dependencies
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Then start the server
npm start
```

### Database Setup
```sql
# Create database
CREATE DATABASE fms_db;

# Import schema
mysql -u root -p fms_db < database/fms_db.sql
mysql -u root -p fms_db < database/users_table.sql
mysql -u root -p fms_db < database/companies_table.sql
```

### Access the Application
1. Start the backend server: `cd backend && npm start`
2. Open `frontend/pages/login.html` in your browser
3. Login with default credentials:
   - Email: `admin@fms.com`
   - Password: `admin123`

## 📖 Documentation

- **[Login Setup Guide](LOGIN_SETUP.md)** - Complete authentication setup instructions
- **[API Documentation](docs/API_Documentation.md)** - API endpoints and usage
- **[User Manual](docs/User_Manual.md)** - How to use the system
- **[Company Management Guide](docs/Company_Management_Guide.md)** - Managing companies

## 🏗️ Project Structure

```
fms-file-management-system/
├── backend/              # Node.js backend server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & validation
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   └── server.js         # Server entry point
│
├── frontend/             # Frontend web application
│   ├── assets/          # CSS, JS, images
│   └── pages/           # HTML pages
│
├── database/            # SQL scripts
└── docs/               # Documentation
```

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- SQL injection prevention
- XSS protection
- Role-based access control

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcrypt.js

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Files
- `GET /api/files` - Get all files
- `POST /api/files` - Create new file
- `GET /api/files/:id` - Get file details
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `GET /api/companies/:id` - Get company details

### Movements
- `GET /api/movements` - Get movement history
- `POST /api/movements` - Record movement

## 🎯 Default User Roles

- **Admin** - Full system access, user management
- **User** - File creation and tracking

## 🐛 Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

**Login Not Working:**
- Clear browser cache/localStorage
- Verify backend server is running
- Check console for errors

**CORS Issues:**
- Update `CORS_ORIGIN` in `.env`
- Ensure frontend and backend URLs match

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review the setup guide in `LOGIN_SETUP.md`
3. Check browser console for errors
4. Verify backend logs

## 🎉 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for efficient file management**
