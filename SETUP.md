# Travel Tots - Setup Guide

## Quick Start

Follow these steps to get the Travel Tots website up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Generate Prisma client and set up database:

```bash
npx prisma generate
npx prisma db push
```

This will create a SQLite database at `prisma/dev.db`.

### 3. Configure Environment

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email Configuration (Optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Travel Tots <noreply@traveltots.es>"

# Application
APP_URL="http://localhost:3000"
```

### 4. Seed Initial Data

Seed the database with sample categories, products, and an admin user:

```bash
npx tsx scripts/seed.ts
```

Or manually create an admin user:

```bash
npx tsx scripts/create-admin.ts
```

**Default admin credentials:**
- Username: `admin`
- Password: `admin123`

**Important:** Change these credentials immediately in production!

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Open Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push
```

## File Structure

```
TravelTots/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── products/        # Product endpoints
│   │   ├── orders/          # Order endpoints
│   │   ├── admin/           # Admin endpoints
│   │   └── availability/    # Stock availability endpoint
│   ├── admin/               # Admin dashboard pages
│   │   ├── login/           # Admin login
│   │   └── dashboard/       # Admin dashboard
│   ├── products/            # Product pages
│   ├── cart/                # Shopping cart
│   ├── bundles/             # Product bundles
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Navigation.tsx       # Site navigation
│   ├── Footer.tsx           # Site footer
│   ├── ProductCard.tsx      # Product card component
│   └── OrderForm.tsx        # Order form component
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client instance
│   ├── auth.ts             # Authentication helpers
│   ├── email.ts            # Email functionality
│   └── utils.ts            # General utilities
├── prisma/                  # Database configuration
│   └── schema.prisma        # Database schema
├── public/                  # Static files
│   └── products/            # Product images
├── scripts/                 # Utility scripts
│   ├── seed.ts             # Database seeding
│   └── create-admin.ts     # Admin user creation
└── .env.local              # Environment variables (not in git)
```

## Key Features

### Customer Features

1. **Product Catalog** (`/products`)
   - Browse all products
   - Filter by category
   - View product details

2. **Product Details** (`/products/[slug]`)
   - View full product information
   - Check availability for rental dates
   - Add to cart

3. **Booking Process** (`/cart`)
   - Enter rental dates
   - Provide customer details
   - Submit order request

4. **Order Confirmation** (`/order-confirmation`)
   - Confirmation page
   - Order reference number
   - Email confirmation sent

### Admin Features

1. **Login** (`/admin/login`)
   - Secure admin authentication
   - Local session storage

2. **Dashboard** (`/admin/dashboard`)
   - Key metrics overview
   - Pending orders count
   - Stock alerts
   - Quick access to management pages

3. **Order Management** (`/admin/orders` - to be implemented)
   - View all orders
   - Update order status
   - View customer details

4. **Product Management** (`/admin/products` - to be implemented)
   - Add/edit/delete products
   - Manage stock levels
   - Upload product images

5. **Calendar View** (`/admin/calendar` - to be implemented)
   - Daily delivery schedule
   - Collection reminders
   - Visual calendar interface

## Stock Management

The system automatically tracks stock availability:

1. **When an order is placed:**
   - Stock blocks are created for each item
   - Blocks cover the rental period
   - Stock counts are calculated in real-time

2. **Checking availability:**
   - System counts overlapping stock blocks
   - Shows available units for selected dates
   - Allows orders even if stock unavailable

3. **Order cancellation/completion:**
   - Stock blocks are removed
   - Stock immediately becomes available
   - System updates automatically

## Email Configuration

To enable email notifications:

1. **Gmail SMTP** (for development):
   - Create an App Password in Google Account settings
   - Use this password in `SMTP_PASSWORD`

2. **Production** (recommended services):
   - SendGrid
   - Mailgun
   - AWS SES
   - Resend

Configure the appropriate SMTP settings in your environment variables.

## Database Schema

Key models:

- **Product**: Rental items with categories, pricing, and stock
- **Order**: Customer rental requests with contact details
- **StockBlock**: Tracks product availability during rentals
- **Category**: Product organization
- **Admin**: Admin users with authentication
- **Page**: Static content pages

## Security Notes

- Admin passwords are hashed using bcrypt
- Sessions are stored in localStorage (consider implementing proper session management)
- 2FA is supported in the schema but requires implementation
- Always use HTTPS in production
- Change default admin credentials immediately
- Use strong NEXTAUTH_SECRET in production

## Troubleshooting

### Database Issues

```bash
# Reset database (development only)
rm -rf prisma/dev.db prisma/dev.db-journal
npx prisma db push
npx tsx scripts/seed.ts
```

### Email Not Working

- Check SMTP credentials
- Verify port 587 is not blocked
- Use App Password for Gmail
- Check spam folder
- Email is optional for basic functionality

### Build Errors

```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Production Deployment

1. Choose a hosting platform (Vercel recommended)
2. Set up PostgreSQL or MySQL database
3. Configure production environment variables
4. Update `DATABASE_URL` to production database
5. Run migrations: `npx prisma migrate deploy`
6. Create admin user via script or Prisma Studio
7. Deploy!

## Support

For issues or questions:
- Check the README.md
- Review Prisma documentation
- Contact: info@traveltots.es

