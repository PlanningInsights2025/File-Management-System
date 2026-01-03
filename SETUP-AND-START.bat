@echo off
color 0A
echo ========================================
echo   FMS - Complete Setup and Start
echo ========================================
echo.

echo Step 1: Setting up database...
echo ----------------------------------------
echo Please run this SQL command in MySQL:
echo.
echo mysql -u root -p fms_db ^< setup-database.sql
echo.
echo Or manually:
echo 1. Open MySQL Workbench or Command Line
echo 2. Run: CREATE DATABASE fms_db;
echo 3. Import: setup-database.sql
echo.
pause

echo.
echo Step 2: Installing backend dependencies...
echo ----------------------------------------
cd backend
if exist node_modules (
    echo Dependencies already installed.
) else (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Make sure Node.js is installed.
        pause
        exit /b 1
    )
)

echo.
echo Step 3: Checking configuration...
echo ----------------------------------------
if not exist .env (
    echo .env file not found, creating from template...
    copy .env.example .env
)
echo Configuration OK!

cd ..

echo.
echo Step 4: Starting backend server...
echo ----------------------------------------
echo.
echo Backend will start in a new window.
echo Leave it running while using the application.
echo.
start "FMS Backend Server" cmd /k "cd backend && npm start"

timeout /t 5 /nobreak >nul

echo.
echo Step 5: Opening test page...
echo ----------------------------------------
timeout /t 3 /nobreak >nul
start "" "frontend\test-connection.html"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for backend to start (check the new window)
echo 2. Test connection in the browser window
echo 3. Go to: frontend\pages\register.html
echo 4. Create your account!
echo.
echo Default test credentials:
echo Email: admin@fms.com
echo Password: admin123
echo.
echo ========================================
echo.
echo Press any key to open the registration page...
pause >nul

start "" "frontend\pages\register.html"

echo.
echo All done! You can close this window.
echo.
pause
