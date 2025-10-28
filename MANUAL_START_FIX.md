# Manual Start Command Configuration

Since Render isn't using the render.yaml file automatically, you need to manually set the start command in the Render dashboard.

## Steps to Fix

1. Go to your **"travel-tots"** web service in Render dashboard
2. Look for **"Settings"** or **"Environment"** in the left sidebar
3. Find **"Start Command"** or **"Run Command"**
4. Replace whatever is there with this:

```bash
echo "=== Creating database tables ===" && npx prisma db push --skip-generate --accept-data-loss && echo "=== Initializing admin user ===" && node scripts/init-db.js && echo "=== Starting server ===" && npm start
```

5. Click **"Save"**
6. Go to **"Manual Deploy"**
7. Click **"Deploy latest commit"**

## What This Does

- Creates all database tables (Admin, Product, Order, etc.)
- Creates an admin user with:
  - Username: `admin`
  - Password: `admin`
- Starts the server

After deployment completes, you should be able to login at:
https://traveltots-1vx7.onrender.com/admin/login

