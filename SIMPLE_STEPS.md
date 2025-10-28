# Simple Steps to Fix Your Render Deployment

## 1. Create PostgreSQL Database
1. Click **"New +"** button (top right in Render dashboard)
2. Select **"PostgreSQL"** 
3. Name: `travel-tots-db`
4. Plan: **Free**
5. Click **"Create Database"**
6. Wait ~2 minutes for it to be ready

## 2. Get Database Connection String
1. Once database is ready, click on it
2. Click **"Info"** tab
3. Copy the **"Internal Database URL"** - it looks like:
   `postgresql://username:pass@dpg-xxxxx-a/traveltots`

## 3. Update Your Web Service
1. Go back to your **"travel-tots"** web service
2. Click **"Environment"** (left sidebar)
3. Click **"Add Environment Variable"** or find existing `DATABASE_URL`
4. Key: `DATABASE_URL`
5. Value: Paste the PostgreSQL connection string from step 2
6. Click **"Save Changes"**

## 4. Deploy
1. Click **"Manual Deploy"** (in your web service)
2. Click **"Deploy latest commit"**
3. Wait for it to deploy

## 5. Test Login
1. After deployment is live
2. Go to: https://traveltots-1vx7.onrender.com/admin/login
3. Username: `admin`
4. Password: `admin`

## Summary
The only thing you need to do is:
- Create a PostgreSQL database
- Copy its connection string
- Paste it into the DATABASE_URL environment variable
- Deploy

That's it! The app will automatically create the admin user when it starts.

