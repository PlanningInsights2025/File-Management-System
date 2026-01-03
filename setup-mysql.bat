@echo off
echo ============================================
echo MySQL Database Setup for FMS
echo ============================================
echo.
echo This will create the database and users table.
echo You'll be prompted for your MySQL root password.
echo.
pause

echo.
echo Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fms_db;"

if errorlevel 1 (
    echo.
    echo ERROR: Could not create database!
    echo Please make sure:
    echo 1. MySQL is installed and running
    echo 2. You entered the correct password
    pause
    exit /b 1
)

echo.
echo Creating users table...
mysql -u root -p fms_db < "%~dp0setup-database.sql"

if errorlevel 1 (
    echo.
    echo ERROR: Could not create table!
    pause
    exit /b 1
)

echo.
echo ============================================
echo SUCCESS! Database setup complete!
echo ============================================
echo.
echo Now update your backend\.env file with:
echo DB_PASSWORD=your_mysql_password
echo.
echo Then restart the backend server.
echo.
pause
