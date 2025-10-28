# Travel Tots - Deployment Guide

This guide covers deploying the Travel Tots website to production.

## Prerequisites

- Node.js 18+ installed on your system
- Git repository set up
- Database provider account (recommended: PostgreSQL)
- Email service configured (SendGrid, Mailgun, etc.)
- Domain name configured

## Recommended Hosting: Vercel

Vercel is the easiest platform for deploying Next.js applications.

### Step 1: Prepare Your Code

Ensure all changes are committed to Git:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your Travel Tots repository

### Step 3: Configure Environment Variables

In Vercel dashboard, go to Project Settings > Environment Variables and add:

```env
# Database - Use PostgreSQL in production
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://traveltots.es"
NEXTAUTH_SECRET="generate-strong-random-secret"

# Email Configuration
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="Travel Tots <noreply@traveltots.es>"

# Application
APP_URL="https://traveltots.es"
```

### Step 4: Set Up Production Database

1. Create PostgreSQL database (recommended services):
   - [Supabase](https://supabase.com) (free tier available)
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [AWS RDS](https://aws.amazon.com/rds)

2. Copy the connection string to `DATABASE_URL`

3. Run migrations on production:
   ```bash
   npx prisma migrate deploy
   ```

### Step 5: Generate Prisma Client

In Vercel build settings, the build command automatically runs Prisma generate. Ensure it's included:

```json
"buildCommand": "prisma generate && next build"
```

### Step 6: Create Admin User

After deployment, create the admin user:

1. SSH into your production environment, or
2. Use a database management tool (TablePlus, pgAdmin), or
3. Create a script in Vercel serverless function

Create admin via database:
```bash
npx tsx scripts/create-admin.ts
```

Or manually insert into database using Prisma Studio:
```bash
npx prisma studio
```

### Step 7: Deploy

Click "Deploy" in Vercel. The first deployment may take 5-10 minutes.

### Step 8: Custom Domain

1. In Vercel project settings, add your domain
2. Configure DNS records as instructed by Vercel
3. SSL certificate is automatically provisioned

## Alternative Hosting Options

### DigitalOcean App Platform

1. Create new App from GitHub repo
2. Select Node.js environment
3. Configure environment variables
4. Add PostgreSQL database
5. Deploy

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Add PostgreSQL database (RDS)
5. Deploy

### Self-Hosted (VPS)

For VPS deployment (DigitalOcean, Linode, etc.):

1. **Set up server** (Ubuntu 22.04 recommended):
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Set up database**:
   ```bash
   sudo -u postgres createuser travelltots
   sudo -u postgres createdb travelltots_db
   sudo -u postgres psql -c "ALTER USER travelltots WITH PASSWORD 'secure-password';"
   ```

3. **Clone repository**:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/traveltots.git
   cd travelltots
   ```

4. **Install dependencies**:
   ```bash
   npm install --production
   ```

5. **Set up environment**:
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

6. **Run migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

7. **Build application**:
   ```bash
   npm run build
   ```

8. **Start with PM2**:
   ```bash
   pm2 start npm --name "traveltots" -- start
   pm2 save
   pm2 startup
   ```

9. **Set up Nginx** (reverse proxy):
   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/traveltots`:
   ```nginx
   server {
       listen 80;
       server_name traveltots.es www.traveltots.es;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site and get SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/traveltots /etc/nginx/sites-enabled/
   sudo certbot --nginx -d traveltots.es -d www.traveltots.es
   ```

10. **Restart services**:
    ```bash
    sudo systemctl restart nginx
    pm2 restart travelltots
    ```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Email sending tested
- [ ] Order notifications working
- [ ] Admin login functional
- [ ] Product images uploading
- [ ] Stock tracking working correctly
- [ ] All pages loading correctly
- [ ] Mobile responsiveness verified

## Monitoring and Maintenance

### Set Up Monitoring

Recommended services:
- **Vercel Analytics** (built-in)
- **Sentry** for error tracking
- **Uptime Robot** for availability monitoring

### Regular Tasks

1. **Database Backups**:
   - Set up automatic daily backups
   - Store backups off-site

2. **Security Updates**:
   - Monitor for dependency updates
   - Run `npm audit` regularly
   - Update dependencies monthly

3. **Performance**:
   - Monitor page load times
   - Use Vercel Analytics
   - Optimize images

4. **Content Management**:
   - Update products regularly
   - Respond to customer queries
   - Review order patterns

### Backup Strategy

1. **Database backups**:
   ```bash
   # Daily automated backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Code backups**:
   - Git repository is your backup
   - Regular commits and pushes

3. **File backups**:
   - Product images stored on cloud storage (S3, Cloudinary)
   - Regular sync to backup location

## Troubleshooting Production Issues

### Application Not Starting

```bash
# Check logs
pm2 logs travelltots

# Check PM2 status
pm2 status

# Restart application
pm2 restart travelltots
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database server is accessible
- Verify firewall rules

### Email Not Sending

- Check SMTP credentials
- Verify port 587 is open
- Test with different email provider
- Check spam folder

### Performance Issues

- Enable caching (Next.js caching)
- Optimize images
- Consider CDN for static assets
- Database query optimization

## Scaling Considerations

When traffic grows:

1. **Database**: Upgrade to dedicated PostgreSQL instance
2. **Caching**: Add Redis for session storage
3. **CDN**: Use Cloudflare or AWS CloudFront
4. **Image Storage**: Migrate to cloud storage (S3, Cloudinary)
5. **Load Balancing**: Use multiple app instances

## Security Best Practices

1. ✅ Use HTTPS everywhere (automatic with Vercel)
2. ✅ Change default admin credentials
3. ✅ Use strong `NEXTAUTH_SECRET`
4. ✅ Enable rate limiting on API routes
5. ✅ Regular security updates
6. ✅ Input validation on all forms
7. ✅ Sanitize user inputs
8. ✅ Use parameterized queries (Prisma does this)
9. ✅ Regular backups
10. ✅ Monitor for suspicious activity

## Support

For deployment issues:
- Check application logs
- Review Vercel deployment logs
- Consult Next.js deployment docs
- Contact hosting provider support

Email: info@traveltots.es

