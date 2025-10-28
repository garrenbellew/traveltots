# How to Fix Render.com GitHub Connection

If Render can't see your repositories, follow these steps:

## Option 1: Authorize Render in GitHub

1. Go to https://github.com/settings/applications
2. Find "Render" in the OAuth Apps list
3. Click "Authorize" or "Grant" if it's not already connected

## Option 2: Connect via Render Dashboard

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. If you see "Connect GitHub" or "Authorize GitHub", click it
4. You'll be redirected to GitHub to authorize Render
5. Make sure to check the box to "Grant access to repositories"
6. Return to Render and your repos should appear

## Option 3: Manual Repository URL

If the above doesn't work:

1. In Render, when creating the service, look for "Build from public Git repository"
2. Enter your repository URL: `https://github.com/gbellew_sfemu/traveltots`
3. This will automatically detect it's a Next.js app

## Option 4: Check GitHub Repository Access

1. Go to https://github.com/settings/installations
2. Find "Render" in the list
3. Click "Configure"
4. Make sure "Private and public repositories" is selected
5. Click "Save"

## Quick Check

Your repository URL should be:
- GitHub: https://github.com/gbellew_sfemu/traveltots
- Public: If it's private, you need to authorize Render to access private repos

