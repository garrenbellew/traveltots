# Render.com Deployment - Step-by-Step Guide

## Your Repository URL
```
https://github.com/gbellew_sfemu/traveltots
```

## Step-by-Step Instructions

### 1. Go to Render Dashboard
- Open: https://dashboard.render.com

### 2. Create New Web Service
- Click "New +" button (top right)
- Select "Web Service"

### 3. Connect Your Repository
You have TWO options:

**Option A: Manual Public Repo (Recommended)**
1. Click "Build from a public Git repository"
2. Paste this URL: `https://github.com/gbellew_sfemu/traveltots`
3. Click "Connect"

**Option B: GitHub Integration**
1. Click "Connect account" under "Connect account"
2. Authorize Render to access GitHub
3. Your repositories will appear
4. Select `traveltots`

### 4. Configuration (Should Auto-Fill from render.yaml)
- **Name:** `travel-tots` (or your preferred name)
- **Region:** Choose closest to you (Oregon recommended)
- **Branch:** `main`
- **Runtime:** `Node`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm start`

### 5. Environment Variables
Click "Add Environment Variable" and add these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `NODE_ENV` | `production` |

### 6. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for first deployment

### 7. Important Notes
⚠️ **SQLite Limitation on Render**
- Render's filesystem is ephemeral (data resets on deployment)
- Your database will be recreated on each deploy
- For production, consider upgrading to a PostgreSQL database

### Need Help?
If you encounter errors during deployment, share:
1. The error message from Render logs
2. Which step you're stuck on

