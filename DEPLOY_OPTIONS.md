# Deployment Options (Private Repository)

Your repository is under Salesforce-EMU SSO and cannot be made public.
Here are your deployment options:

## Option 1: Static Export (Simplest - No Server Needed)

Export your website as static files and host anywhere:

```bash
# 1. Build the site
npm run build

# 2. Export to static files
npx next export

# 3. Upload the 'out' folder to:
#    - GitHub Pages
#    - Netlify
#    - Your own web hosting (cPanel, FTP, etc.)
```

**Pros:** Free, works anywhere
**Cons:** No admin backend, no dynamic features

## Option 2: Self-Hosted (Full Features)

Run on your own server or VPS:

**Required:**
- Server/VPS (DigitalOcean, AWS, etc.)
- Domain name
- SSH access

**Steps:**
```bash
# On your server:
git clone https://github.com/gbellew_sfemu/traveltots.git
cd traveltots
npm install
npx prisma generate
npx prisma db push
npm run build
npm start
```

## Option 3: Buy a Hosting Plan

Services that support private repos:
- **Netlify** ($19/month for private repos)
- **Railway.app** ($5/month)
- **Heroku** ($7/month)

## Option 4: Keep It Local

For now, run it on your local machine and use ngrok to share:

```bash
npm run dev
# In another terminal:
ngrok http 3000
```

This gives you a public URL for testing.

## Recommended: Netlify Private Deploys

1. Sign up at netlify.com
2. Choose "Add new site" → "Deploy manually"
3. You'll get instructions for deploying with CLI

Would you like help with any specific option?

