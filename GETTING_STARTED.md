# Travel Tots - Getting Started

Welcome to the Travel Tots website project! This guide will help you get up and running quickly.

## What is Travel Tots?

Travel Tots is a rental website for child essentials located in Los Alcázares, Spain. It allows families traveling from overseas to rent car seats, travel cots, prams, and other baby equipment without needing to pack bulky items.

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, Tailwind CSS, and more.

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database and apply schema
npx prisma db push
```

This creates a SQLite database at `prisma/dev.db` and sets up all the necessary tables.

### 3. Seed Initial Data

```bash
npx tsx scripts/seed.ts
```

This populates the database with:
- Product categories
- Sample products (car seats, travel cots, strollers)
- Admin user (username: `admin`, password: `admin123`)
- Static pages

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website!

## What You Can Do Now

### As a Customer

1. Browse products at `/products`
2. View product details and check availability
3. Add items to cart and create a booking request
4. Receive email confirmation

### As an Admin

1. Login at `/admin/login` with:
   - Username: `admin`
   - Password: `admin123`
2. View dashboard with key metrics
3. Access order management (basic UI)
4. Manage products and stock

## Project Structure

```
TravelTots/
├── app/                    # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── admin/             # Admin dashboard
│   └── products/          # Product catalog
├── components/             # Reusable React components
├── lib/                   # Utilities (auth, email, database)
├── prisma/                # Database schema
├── scripts/               # Setup and seed scripts
└── public/                # Static files (images, etc.)
```

## Key Features

### ✅ Working Features

- **Product Catalog**: Browse and filter products by category
- **Stock Availability**: Real-time availability checking based on rental dates
- **Order System**: Customer booking requests with email notifications
- **Admin Dashboard**: Basic admin interface with statistics
- **Email Notifications**: Order confirmations and admin alerts
- **Mobile Responsive**: Works on all devices

### 🔨 Coming Soon

- Full admin CRUD for orders and products
- Calendar view for deliveries
- Advanced stock management
- Customer accounts
- Payment integration
- Multi-language support (Spanish)

## Common Tasks

### View Database

```bash
npx prisma studio
```

Opens a web interface to view and edit your database.

### Create New Admin User

```bash
npx tsx scripts/create-admin.ts
```

### Reset Database

```bash
# Delete database
rm prisma/dev.db prisma/dev.db-journal

# Recreate and seed
npx prisma db push
npx tsx scripts/seed.ts
```

### Build for Production

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

Create `.env.local` file with:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-in-production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="Travel Tots <noreply@traveltots.es>"
APP_URL="http://localhost:3000"
```

### Email Setup (Optional)

For email notifications to work:

1. For Gmail: Create an "App Password" in your Google Account settings
2. Or use a service like SendGrid, Mailgun, or Resend
3. Update SMTP settings in `.env.local`

## Next Steps

1. **Customize Content**: Edit pages in `app/` directory
2. **Add Products**: Use Prisma Studio or create an admin interface
3. **Upload Images**: Add product images to `public/products/`
4. **Configure Email**: Set up SMTP for notifications
5. **Deploy**: Follow instructions in `DEPLOYMENT.md`

## Documentation

- **README.md** - Overview and features
- **SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_STATUS.md** - Current implementation status

## Troubleshooting

### Database Issues

```bash
npx prisma generate
npx prisma db push
```

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
npm run build
# Check error messages
```

### Email Not Working

Email is optional for basic functionality. Configure SMTP settings in `.env.local` to enable.

## Getting Help

- Review existing documentation
- Check Next.js documentation: https://nextjs.org/docs
- Check Prisma documentation: https://www.prisma.io/docs
- Email: info@traveltots.es

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check for errors

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema changes
npm run db:studio    # Open database GUI

# Other
npx tsx scripts/seed.ts          # Seed database
npx tsx scripts/create-admin.ts  # Create admin
```

## Architecture Overview

**Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS  
**Backend**: Next.js API Routes  
**Database**: SQLite (dev), PostgreSQL (production)  
**ORM**: Prisma  
**Authentication**: Custom admin auth with 2FA support  
**Email**: Nodemailer  

## Contributing

This is a working website ready for customization. Key areas to extend:

1. Admin management pages (orders, products, calendar)
2. 2FA implementation
3. Customer account system
4. Payment integration
5. Multi-language support
6. Advanced features

Happy coding! 🚀

