# FMS Deployment Guide - Render

## Step 1: Prepare Git Repository

### 1.1 Initialize Git (if not already done)
```bash
cd c:\Users\rewal\Downloads\fms-file-management-systemne\fms-file-management-system
git init
git add .
git commit -m "Initial commit - FMS project ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "fms-file-management-system")
3. **DO NOT** initialize with README (we already have files)
4. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/fms-file-management-system.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend (Node.js + Database)

### 2.1 Create Database on Render

**Option A: Use PostgreSQL (Recommended for Render)**

1. Go to https://render.com and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `fms-database`
   - **Database**: `fms_db`
   - **User**: `fms_user`
   - **Region**: Choose closest to you
   - **Instance Type**: Free
4. Click **"Create Database"**
5. **IMPORTANT**: Copy and save these credentials:
   - Internal Database URL
   - External Database URL
   - Host
   - Port
   - Database Name
   - Username
   - Password

**Option B: Use External MySQL (Like PlanetScale, Railway, or Aiven)**

If you prefer MySQL:
1. Go to https://planetscale.com (free tier) or https://railway.app
2. Create a MySQL database
3. Get connection credentials (Host, Port, Username, Password, Database Name)

### 2.2 Import Database Schema

**For PostgreSQL**: Convert your MySQL schema to PostgreSQL:
```sql
-- You'll need to modify the SQL syntax slightly
-- Connect to your PostgreSQL database using the External URL
```

**For MySQL**: Use the existing `database/fms_db.sql` file

### 2.3 Update Backend Code for PostgreSQL (if using PostgreSQL)

You'll need to:
1. Replace `mysql2` with `pg` (PostgreSQL driver)
2. Update `backend/src/config/database.js`

I can help you with this conversion if needed.

### 2.4 Deploy Backend Service

1. Go to Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `fms-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   DB_HOST=<from database credentials>
   DB_USER=<from database credentials>
   DB_PASSWORD=<from database credentials>
   DB_NAME=<from database credentials>
   DB_PORT=<from database credentials>
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=<generate-a-random-secret-key>
   CORS_ORIGIN=*
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy your backend URL**: `https://fms-backend.onrender.com`

---

## Step 3: Deploy Frontend (Static Site)

### 3.1 Update Firebase Configuration (if needed)

Ensure `frontend/assets/js/firebase.js` has correct Firebase credentials.

### 3.2 Update API Endpoints in Frontend

Update all backend API calls in your frontend files to use your Render backend URL:

In files like `frontend/assets/js/*.js`:
```javascript
// Change from
const API_URL = 'http://localhost:5000/api';

// To
const API_URL = 'https://fms-backend.onrender.com/api';
```

### 3.3 Deploy Frontend to Render

**Option 1: Static Site (Recommended)**

1. Go to Render Dashboard → Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `fms-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: Leave empty (or `echo "No build needed"`)
   - **Publish Directory**: `.` (current directory)

4. Click **"Create Static Site"**
5. Wait for deployment
6. **Your frontend URL**: `https://fms-frontend.onrender.com`

**Option 2: Use Netlify or Vercel for Frontend (Alternative)**

Netlify/Vercel are often better for static sites:
- Drag and drop the `frontend` folder to Netlify
- Or connect GitHub repo and set publish directory to `frontend`

---

## Step 4: Update CORS in Backend

1. Go to your backend service on Render
2. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://fms-frontend.onrender.com
   ```
3. Service will auto-redeploy

---

## Step 5: Test Your Deployment

1. Open `https://fms-frontend.onrender.com`
2. Try to register a new user
3. Try to login
4. Test creating a file
5. Check if data is saved in database

---

## Step 6: Configure Custom Domain (Optional)

### For Frontend:
1. Go to your Static Site settings
2. Click "Custom Domains"
3. Add your domain (e.g., `www.yourdomain.com`)
4. Follow DNS configuration instructions

### For Backend:
1. Go to your Web Service settings
2. Add custom domain for API (e.g., `api.yourdomain.com`)

---

## Troubleshooting

### Backend not connecting to database:
- Check environment variables are correct
- Verify database is running
- Check database connection string format

### Frontend can't reach backend:
- Check CORS settings
- Verify backend URL in frontend code
- Check browser console for errors

### Free tier limitations:
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading for production use

---

## Important Notes

1. **Free Tier Spin-Down**: Render free services sleep after 15 mins of inactivity
2. **Database Backups**: Free PostgreSQL on Render expires after 90 days
3. **Environment Variables**: Never commit `.env` files to GitHub
4. **HTTPS**: Render provides free SSL certificates automatically
5. **Logs**: Check logs in Render dashboard for debugging

---

## Cost Estimate

- **Free Tier**:
  - Backend: Free (with spin-down)
  - Database: Free (PostgreSQL - 90 day expiry)
  - Frontend: Free
  
- **Paid Tier** ($7-25/month):
  - Backend: $7/month (no spin-down)
  - Database: $7/month (persistent PostgreSQL)
  - Frontend: Free

---

## Next Steps After Deployment

1. Set up monitoring and logging
2. Configure automated backups for database
3. Set up CI/CD for automatic deployments
4. Add custom domain
5. Configure email service for notifications
6. Set up error tracking (e.g., Sentry)

---

Need help with any step? Let me know!
