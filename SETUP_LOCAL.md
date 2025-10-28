# Local Development Setup

For local development, you have two options:

## Option 1: Use SQLite (Simpler)

1. In `prisma/schema.prisma`, change the datasource to:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Create a `.env` file:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   node scripts/setup-local-db.js
   npm run dev
   ```

## Option 2: Use PostgreSQL (Production-like)

1. Install PostgreSQL on your machine

2. Create a database:
   ```bash
   createdb traveltots
   ```

3. Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/traveltots"
   ```

4. Run:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   node scripts/setup-local-db.js
   npm run dev
   ```

**Default admin credentials (apply to both options):**
- Username: `admin`
- Password: `admin`

⚠️ **Note:** The schema is currently set to PostgreSQL for Render deployment. For local SQLite development, you'll need to temporarily change it back to SQLite in `prisma/schema.prisma`.

