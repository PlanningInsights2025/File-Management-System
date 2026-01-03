@echo off
echo ================================================
echo Starting File Management System Backend
echo ================================================
echo.

echo Checking if backend is already configured...
if not exist backend\.env (
    echo ERROR: .env file not found!
    echo.
    echo Please create backend\.env with your database credentials:
    echo.
    echo PORT=5000
    echo DB_HOST=localhost
    echo DB_USER=root
    echo DB_PASSWORD=your_password
    echo DB_NAME=fms_db
    echo JWT_SECRET=your-secret-key
    echo.
    pause
    exit /b 1
)

echo Starting backend server...
cd backend
start "FMS Backend Server" cmd /k "npm start"
cd ..

timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo Backend server is starting...
echo ================================================
echo.
echo Backend API: http://localhost:5000/api
echo Health Check: http://localhost:5000/api/health
echo.
echo To test the connection:
echo 1. Open frontend\test-connection.html in your browser
echo 2. Click "Test Backend Connection"
echo.
echo To login:
echo 1. Open frontend\pages\login.html
echo 2. Use: admin@fms.com / admin123
echo.
echo Press Ctrl+C in the backend window to stop the server
echo ================================================
