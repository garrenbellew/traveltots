# Travel Tots - Child Essentials Rental Website

A modern, mobile-first rental website for Travel Tots, providing quality baby and toddler equipment hire in Spain.

## Features

- 🛒 **Product Management**: Browse and rent child essentials with real-time stock availability
- 📅 **Calendar View**: Track deliveries and collections with an intuitive calendar interface
- 👥 **Customer Accounts**: Customers can track orders, message admin, and manage their rentals
- 💬 **WhatsApp Integration**: Quick WhatsApp messaging for order confirmations and communication
- 📊 **Admin Dashboard**: Comprehensive admin panel for managing orders, products, and customers
- ⚠️ **Stock Warnings**: Automated alerts for stock shortages
- 🌟 **Customer Testimonials**: Showcase customer reviews and success stories

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: bcrypt for password hashing
- **Deployment**: Render.com

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/TravelTots.git
cd TravelTots
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

4. Seed the database (optional):
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
```

## Deployment on Render.com

1. Push your code to GitHub
2. Connect your repository to Render.com
3. Create a new Web Service
4. Render will automatically detect Next.js and configure the build
5. Set environment variables in Render dashboard
6. Deploy!

### Render.com Configuration

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node

The `render.yaml` file is included for automated deployment.

## Project Structure

```
/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── customer/          # Customer pages
│   ├── api/               # API routes
│   └── products/          # Product pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static files
```

## License

Private - All rights reserved
