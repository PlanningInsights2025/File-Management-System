# Git Commands to Push to GitHub Repository

## Step-by-Step Instructions

### 1. Open Terminal/Command Prompt

Navigate to your project directory:
```bash
cd c:\Users\rewal\Downloads\fms-file-management-systemne\fms-file-management-system
```

### 2. Initialize Git (if not already done)

```bash
git init
```

### 3. Add All Files

```bash
git add .
```

### 4. Commit Your Changes

```bash
git commit -m "Initial commit: Complete FMS project with frontend and backend"
```

### 5. Add Remote Repository

```bash
git remote add origin https://github.com/PlanningInsights2025/File-Management-System.git
```

### 6. Set Main Branch

```bash
git branch -M main
```

### 7. Push to GitHub

```bash
git push -u origin main
```

### If You Get "Repository Already Exists" Error:

If the remote repository already has content, you may need to force push (WARNING: This will overwrite remote content):

```bash
git push -u origin main --force
```

Or pull first and then push:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### If You Need to Authenticate:

GitHub may ask for credentials:
- **Username**: Your GitHub username
- **Password**: Use Personal Access Token (not your GitHub password)

To create a Personal Access Token:
1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with "repo" permissions
3. Copy and use it as password

---

## Quick Reference - One Command at a Time

Copy and paste these commands one by one:

```bash
cd c:\Users\rewal\Downloads\fms-file-management-systemne\fms-file-management-system

git init

git add .

git commit -m "Initial commit: Complete FMS project"

git remote add origin https://github.com/PlanningInsights2025/File-Management-System.git

git branch -M main

git push -u origin main
```

---

## After Successful Push

Your repository will be available at:
https://github.com/PlanningInsights2025/File-Management-System

You can now:
1. ✅ Deploy to Render/Netlify/Vercel
2. ✅ Enable GitHub Pages for frontend
3. ✅ Set up CI/CD workflows
4. ✅ Collaborate with team members

---

## Future Updates

After making changes, use these commands:

```bash
git add .
git commit -m "Describe your changes here"
git push
```
