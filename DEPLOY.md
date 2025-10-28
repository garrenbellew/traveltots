# Deployment Guide - Travel Tots

This guide will walk you through deploying the Travel Tots website to GitHub and Render.com.

## Step 1: Push to GitHub

### Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it `TravelTots`
5. Set it to **Private** (if you want)
6. **Don't** initialize with README, .gitignore, or license
7. Click "Create repository"

### Push Your Code

Run these commands in your terminal:

```bash
cd /Users/gbellew/TravelTots

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/TravelTots.git

# Rename main branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

You may be asked for your GitHub credentials. Use a Personal Access Token if prompted.

## Step 2: Deploy on Render.com

### Create a Render Account

1. Go to [Render.com](https://render.com) and sign up/sign in
2. You can use your GitHub account for easy integration

### Connect Repository

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub account if you haven't already
3. Select the "TravelTots" repository
4. Click "Connect"

### Configure the Service

Render should auto-detect Next.js. Configure as follows:

**Build Settings:**
- **Environment**: Node
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`

**Environment Variables:**
Add these in the Environment section:

```
DATABASE_URL=file:./prisma/dev.db
NODE_ENV=production
```

### Deploy

1. Click "Create Web Service"
2. Render will start building your application
3. This will take a few minutes
4. Once complete, your site will be live at `https://your-app.onrender.com`

## Important Notes

### Database Migration

For the initial deployment, you may need to:
1. SSH into your Render service (if available)
2. Run: `npx prisma db push`
3. Run: `npx prisma generate`

Or add this to your build command:
```bash
npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
```

### Admin Account

After deployment, you'll need to create an admin account:
1. SSH into Render or use the shell feature
2. Run the seed script or create admin manually

## Troubleshooting

### Build Errors
- Check that all dependencies are listed in `package.json`
- Ensure Prisma is properly configured
- Check the build logs in Render dashboard

### Database Issues
- SQLite on Render may have limitations
- Consider upgrading to PostgreSQL (free tier available on Render)
- Update `DATABASE_URL` in environment variables if using PostgreSQL

### Environment Variables
Make sure all required environment variables are set in Render dashboard.

## Updating Your Site

After making changes:
1. Push to GitHub: `git push`
2. Render will automatically detect changes and redeploy
3. Monitor deployment in the Render dashboard

## Next Steps

After successful deployment:
1. Set up a custom domain (optional)
2. Configure SSL (automatic on Render)
3. Set up automated backups
4. Monitor performance in Render dashboard

