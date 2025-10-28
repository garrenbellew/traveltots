# Render.com Deployment Configuration

## Current Issue
The render.yaml file is not being used automatically by Render. You need to manually configure the service settings in the Render dashboard.

## Manual Configuration Steps

### 1. Database Service
In your Render dashboard, you should see a service called "travel-tots-db" (PostgreSQL database).
- If it doesn't exist, create it:
  - Click "New +"
  - Select "PostgreSQL"
  - Name: `travel-tots-db`
  - Plan: Free

### 2. Web Service Configuration
Go to your "travel-tots" web service and update these settings:

#### Build Command
```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma && npm install && npx prisma generate && npm run build
```

#### Start Command
```bash
npx prisma db push --skip-generate --accept-data-loss && node scripts/init-db.js && npm start
```

**Important:** Make sure to:
1. Click "Save Changes" after updating
2. Then manually deploy the latest commit

#### Environment Variables
- `DATABASE_URL` - should be automatically set from the database service
- `NODE_ENV` = `production`
- `PRISMA_GENERATE_DATAPROXY` = `false`

### 3. Connect Database
Make sure your web service is connected to the PostgreSQL database:
- In the web service settings, find "Connections"
- Add the "travel-tots-db" database
- This sets the `DATABASE_URL` environment variable

### 4. Manual Deploy
After updating settings:
1. Go to "Manual Deploy" 
2. Select "Deploy latest commit"
3. Watch the build logs

## What to Look For in Build Logs

After deploying, you should see in the logs:
```
provider = "postgresql"
```

If you see this, the deployment is using PostgreSQL correctly!

## Admin Login Credentials
- **Username:** `admin`
- **Password:** `admin`

