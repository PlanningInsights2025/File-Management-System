@echo off
echo ============================================
echo SIMPLE FIX - Run Backend Without Database
echo ============================================
echo.
echo This will temporarily run the backend without
echo requiring MySQL database connection.
echo.
pause

cd backend

echo.
echo Starting backend server...
echo.
set DB_HOST=
set DB_USER=
set DB_PASSWORD=
set DB_NAME=

node server.js

pause
