# Render Static Site Configuration

This directory contains the frontend static files.

## Deployment Settings for Render:

- **Build Command**: Leave empty or `echo "Static site"`
- **Publish Directory**: `.` (current directory)
- **Root Directory**: `frontend`

## Files Structure:
```
frontend/
├── index.html (landing page)
├── pages/
│   ├── login.html (entry point)
│   ├── dashboard.html
│   └── ... (other pages)
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── print/
```

## After Deployment:

Your frontend will be available at:
- Production URL: https://your-app-name.onrender.com
- Login page: https://your-app-name.onrender.com/pages/login.html

Note: Update backend API URLs in your JavaScript files before deploying!
