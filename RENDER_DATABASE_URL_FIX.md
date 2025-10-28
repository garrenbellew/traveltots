# How to Fix DATABASE_URL in Render

## The Problem
Your DATABASE_URL is set to `file:./prisma/dev.db` (SQLite) but it needs to be a PostgreSQL connection string.

## Solution

### Step 1: Get Your PostgreSQL Connection String
1. In the Render dashboard, look for a service called **"travel-tots-db"** (your PostgreSQL database)
2. Click on it
3. Go to the **"Info"** tab
4. You'll see **"Internal Database URL"** - this is what you need!
5. It will look like: `postgresql://username:password@dpg-xxxxx-a/traveltots`

### Step 2: Update the Environment Variable
1. Go back to your **"travel-tots"** web service
2. Go to **"Environment"** (in the left sidebar)
3. Find **`DATABASE_URL`** in the list
4. Click on it to edit
5. Delete the old value (`file:./prisma/dev.db`)
6. Paste the PostgreSQL connection string from Step 1
7. Click **"Save Changes"**

### Step 3: Deploy
1. Go to **"Manual Deploy"**
2. Click **"Deploy latest commit"**
3. Wait for it to deploy

### Step 4: Verify
After deployment, you should be able to log in with:
- **Username:** `admin`
- **Password:** `admin`

## Alternative: If No Database Service Exists

If you don't see a "travel-tots-db" service, you need to create it:

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Name it: `travel-tots-db`
4. Plan: Free
5. Click **"Create Database"**
6. Wait for it to be ready
7. Then follow Step 1 above to get the connection string

