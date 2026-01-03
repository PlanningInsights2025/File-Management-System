#!/bin/bash

echo "================================================"
echo "File Management System - Quick Setup"
echo "================================================"
echo ""

echo "[1/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"

echo ""
echo "[2/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

echo ""
echo "[3/4] Checking for .env file..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "IMPORTANT: Please edit backend/.env and update:"
    echo "  - Database credentials"
    echo "  - JWT secret key"
    echo ""
else
    echo "✓ .env file exists"
fi

cd ..

echo ""
echo "[4/4] Setup complete!"
echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo "1. Configure your database in backend/.env"
echo "2. Run the SQL scripts in /database folder"
echo "3. Start the backend: cd backend && npm start"
echo "4. Open frontend/pages/login.html in a browser"
echo ""
echo "Default credentials:"
echo "  Email: admin@fms.com"
echo "  Password: admin123"
echo ""
echo "For detailed instructions, see LOGIN_SETUP.md"
echo "================================================"
