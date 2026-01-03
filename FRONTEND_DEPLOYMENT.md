# Frontend Deployment Steps for Render

## **STEP 1: Update Backend URL in Frontend**

### 1.1 What's your backend URL?
Copy your backend URL from Render dashboard. It should look like:
```
https://fms-backend-xxxx.onrender.com
```

### 1.2 Update config.js file
Open `frontend/assets/js/config.js` and replace:
```javascript
const API_BASE_URL = 'YOUR_BACKEND_URL_HERE';
```

With your actual URL:
```javascript
const API_BASE_URL = 'https://fms-backend-xxxx.onrender.com';
```

---

## **STEP 2: Commit Changes to GitHub**

```bash
cd c:\Users\rewal\Downloads\fms-file-management-systemne\fms-file-management-system

git add .
git commit -m "Update backend URL for production"
git push origin main
```

---

## **STEP 3: Deploy Frontend on Render**

### 3.1 Create Static Site
1. Go to https://render.com/dashboard
2. Click **"New +"** button (top right)
3. Select **"Static Site"**

### 3.2 Connect Repository
1. Click **"Connect a repository"**
2. If not connected, click **"Configure account"** → Select your GitHub account
3. Find and select your repository: `fms-file-management-system`
4. Click **"Connect"**

### 3.3 Configure Static Site
Fill in these details:

**Name:** `fms-frontend` (or any name you prefer)

**Branch:** `main`

**Root Directory:** `frontend`

**Build Command:** Leave EMPTY or put: `echo "Static site - no build needed"`

**Publish Directory:** `.` (just a dot - means current directory)

**Auto-Deploy:** Yes (keep checked)

### 3.4 Click "Create Static Site"
Wait 2-3 minutes for deployment to complete.

### 3.5 Get Your Frontend URL
Once deployed, you'll see:
```
https://fms-frontend-xxxx.onrender.com
```

**Copy this URL!**

---

## **STEP 4: Update Backend CORS Settings**

### 4.1 Go to Backend Service
1. Go to Render dashboard
2. Click on your backend service (`fms-backend`)
3. Click **"Environment"** in left sidebar

### 4.2 Update CORS_ORIGIN
1. Find the `CORS_ORIGIN` variable
2. Click **"Edit"**
3. Change value to your frontend URL:
   ```
   https://fms-frontend-xxxx.onrender.com
   ```
4. Click **"Save Changes"**

The backend will automatically redeploy (takes 2-3 minutes).

---

## **STEP 5: Test Your Deployed Application**

### 5.1 Open Frontend URL
Go to: `https://fms-frontend-xxxx.onrender.com`

### 5.2 Test Registration
1. Click on "Register" or go to `/pages/register.html`
2. Create a new account
3. Check if registration works

### 5.3 Test Login
1. Login with your registered account
2. Should redirect to dashboard

### 5.4 Test Dashboard
1. Check if dashboard loads
2. Verify user name shows correctly
3. Check if navigation works

---

## **STEP 6: Troubleshooting**

### Problem: "Failed to fetch" or CORS errors
**Solution:**
- Check if backend URL in `config.js` is correct
- Verify CORS_ORIGIN in backend matches your frontend URL
- Make sure backend service is running (check Render dashboard)

### Problem: Backend is slow or timing out
**Reason:** Free tier spins down after 15 minutes of inactivity
**Solution:** 
- First request takes 30-60 seconds to wake up
- Wait and try again
- Consider upgrading to paid tier ($7/month) for always-on service

### Problem: White screen or nothing loads
**Solution:**
- Check browser console (F12) for errors
- Verify all files are in correct directories
- Check if static site build was successful in Render logs

### Problem: Firebase auth not working
**Solution:**
- Verify Firebase configuration in `firebase.js`
- Check Firebase console for any issues
- Ensure Firebase project is active

---

## **STEP 7: Optional - Custom Domain**

### 7.1 For Frontend (Static Site)
1. Go to your Static Site in Render
2. Click **"Settings"**
3. Scroll to **"Custom Domain"**
4. Click **"Add Custom Domain"**
5. Enter your domain: `www.yourdomain.com`
6. Follow DNS configuration instructions
7. Add CNAME record to your domain DNS:
   ```
   CNAME: www → fms-frontend-xxxx.onrender.com
   ```

### 7.2 For Backend (Optional)
1. Go to your Web Service in Render
2. Settings → Custom Domain
3. Add: `api.yourdomain.com`
4. Add CNAME record:
   ```
   CNAME: api → fms-backend-xxxx.onrender.com
   ```
5. Update frontend `config.js` to use `https://api.yourdomain.com`

---

## **Summary - Your Live URLs**

After deployment, you'll have:

✅ **Frontend:** `https://fms-frontend-xxxx.onrender.com`
✅ **Backend API:** `https://fms-backend-xxxx.onrender.com`
✅ **Database:** PostgreSQL on Render (internal)

---

## **Important Notes**

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - PostgreSQL database expires after 90 days
   
2. **Security:**
   - Never commit API keys or secrets to GitHub
   - Use environment variables for sensitive data
   - Firebase credentials are public (by design) but protected by Firebase rules

3. **Performance:**
   - Free tier is fine for testing/demo
   - For production, consider paid tier ($7/month per service)
   - Set up monitoring and alerts

4. **Backups:**
   - Export your database regularly
   - Keep local backup of Firebase data
   - Version control everything in GitHub

---

## **Next Steps After Deployment**

1. ✅ Test all features thoroughly
2. ✅ Set up error monitoring (Sentry, LogRocket)
3. ✅ Configure database backups
4. ✅ Add custom domain (optional)
5. ✅ Set up CI/CD for automatic deployments
6. ✅ Monitor performance and logs
7. ✅ Plan for scaling (if needed)

---

**Need help?** Check the logs in Render dashboard or ask me!
