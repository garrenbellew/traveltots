# Product Requirements Document (PRD)
## Travel Tots - Baby Equipment Rental Platform

**Version:** 1.0  
**Date:** December 2024  
**Status:** Active Development

---

## Executive Summary

Travel Tots is a mobile-first web application for renting baby and toddler equipment to families visiting the Murcia region of Spain. The platform enables customers to browse, reserve, and manage rental orders for items like car seats, strollers, and travel cots while providing administrators with comprehensive tools for inventory management, order fulfillment, and customer communication.

---

## 1. Product Overview

### 1.1 Purpose
Provide a convenient, user-friendly platform for renting baby equipment to tourists and visitors in Spain, with a focus on the Murcia/Costa Cálida region.

### 1.2 Target Users
- **Primary:** Families traveling to Spain with babies/toddlers
- **Secondary:** Travel agencies, property managers referring guests
- **Administrators:** Business owners managing inventory and fulfillment

### 1.3 Core Value Proposition
- Eliminate the need to pack/bring essential baby equipment on holiday
- Clean, sanitized, safety-checked equipment ready upon arrival
- Flexible delivery options (airport or accommodation)
- Competitive pricing with multi-day discounts
- Dedicated WhatsApp support for seamless communication

---

## 2. User Personas

### 2.1 Customer Persona
**Sarah & James - UK Parents**
- Ages: 32-35
- 2 children (ages 6 months and 3 years)
- Visit Spain 2-3 times per year
- Pain points: Lugging equipment through airports, rental car space
- Goals: Stress-free arrival, immediate access to essentials
- Tech comfort: High smartphone usage, prefer mobile-first experiences

### 2.2 Admin Persona
**Admin User - Business Owner**
- Manages 50-100 items across 10+ categories
- Handles 20-50 bookings per month during peak season
- Priorities: Quick order processing, accurate inventory, efficient delivery scheduling
- Communication style: Personal, responsive, WhatsApp-based

---

## 3. Functional Requirements

### 3.1 Customer-Facing Features

#### 3.1.1 Product Browsing
**Requirements:**
- View all available products by category
- Filter by category, availability
- Search functionality (future enhancement)
- Product detail pages showing:
  - Images, descriptions, prices
  - Stock availability in real-time
  - Rental duration selector

**Priority:** P0 (Critical)

#### 3.1.2 Shopping Cart
**Requirements:**
- Add multiple products to cart
- View cart at any time
- Update quantities, remove items
- Persistent cart using localStorage
- Cart badge showing item count

**Priority:** P0 (Critical)

#### 3.1.3 Booking & Checkout
**Requirements:**
- Select rental dates (start and end)
- Choose delivery type:
  - All items to accommodation
  - Car seats to airport (with onward journey details)
  - Dual delivery (airport + accommodation)
- Enter customer details:
  - Name, email, phone with country code
  - Address
  - Flight details (optional)
  - Special requests
- Delivery coordination details (context-specific)
- Real-time pricing calculation with automatic discounts
- Minimum order value enforcement
- Terms & conditions acceptance

**Priority:** P0 (Critical)

#### 3.1.4 Customer Accounts
**Requirements:**
- Registration with country code for phone numbers
- Login/logout functionality
- View all orders with status
- Cancel orders (when pending)
- Amend orders (add/remove items)
- Message admin about specific orders
- View order history

**Priority:** P1 (High)

#### 3.1.5 Order Confirmation
**Requirements:**
- Email notification (future: replaced by WhatsApp)
- Shareable order confirmation page
- WhatsApp notification with product images
- Order reference number
- Estimated delivery details

**Priority:** P0 (Critical)

---

### 3.2 Admin Features

#### 3.2.1 Dashboard
**Requirements:**
- Overview statistics:
  - Pending orders count
  - Low stock alerts
  - Out-of-stock items
  - Recent order summary
- Quick access to key functions
- Visual alerts for urgent issues

**Priority:** P1 (High)

#### 3.2.2 Product Management
**Requirements:**
- CRUD operations for products
- Image upload from local device
- Set pricing (daily base rate)
- Configure total stock
- Active/inactive toggle
- Category assignment
- Real-time availability display

**Priority:** P0 (Critical)

#### 3.2.3 Category Management
**Requirements:**
- CRUD operations for categories
- Name, description, active status
- Visual category management

**Priority:** P1 (High)

#### 3.2.4 Order Management
**Requirements:**
- View all orders with status filtering (Pending, Confirmed, Delivered, Completed, Cancelled)
- Update order status workflow:
  1. **PENDING** → **CONFIRMED** (create stock blocks)
  2. **CONFIRMED** → **DELIVERED** (set delivered timestamp)
  3. **DELIVERED** → **COMPLETED** (release stock, order finished)
  4. Any stage → **CANCELLED** (release all stock)
- View customer details including WhatsApp number
- Quick WhatsApp messaging with pre-filled templates
- View customer messages and reply
- Display delivery coordination details
- View all items in order

**Priority:** P0 (Critical)

#### 3.2.5 Calendar View
**Requirements:**
- Visual calendar of active rentals
- Click to view order details
- Filter by date range
- Show delivery and collection dates
- Color-coded by status

**Priority:** P1 (High)

#### 3.2.6 Stock Management
**Requirements:**
- Real-time stock availability (total, reserved, available)
- Low stock report:
  - Products below threshold
  - Out-of-stock items
  - Negative stock alert
  - **Oversold warning** with dates when stock is needed
  - Details of orders causing overselling
- Automatic stock blocking for active orders
- Stock release on order completion/cancellation

**Priority:** P0 (Critical)

#### 3.2.7 Client Management
**Requirements:**
- View all registered customers
- View guest customers (via orders)
- Customer contact information
- Order history per customer
- Send marketing messages (future enhancement)

**Priority:** P1 (High)

#### 3.2.8 Communication Management
**Requirements:**
- View customer messages against orders
- Reply to customer messages
- Pre-configured WhatsApp message templates:
  - Order confirmation
  - Delivery notification
  - Collection notification
  - Cancellation notification
- Customize message templates in settings
- Include order link in messages

**Priority:** P0 (Critical)

#### 3.2.9 Pricing Configuration
**Requirements:**
- Configure discount percentages:
  - Week 1 discount (days 8-14)
  - Week 2 discount (days 15+)
  - Additional day discount (future)
- Set minimum order values:
  - Standard delivery minimum
  - Airport delivery minimum
- Automatic discount application based on rental duration

**Priority:** P0 (Critical)

#### 3.2.10 Content Management (CMS)
**Requirements:**
- Create, edit, delete static pages
- Upload page images
- Set user-friendly URLs (slugs)
- Active/inactive toggle
- Pages appear in main navigation
- Full WYSIWYG editing (future enhancement)

**Priority:** P1 (High)

---

## 4. Technical Architecture

### 4.1 Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (via Prisma ORM)
- **Authentication:** Admin session-based, Customer session-based
- **File Storage:** Local filesystem (`/public/products/`)
- **Communication:** WhatsApp via `wa.me` links

### 4.2 Database Schema

#### Core Models
- **Admin**: Admin users with credentials and WhatsApp settings
- **Category**: Product categories
- **Product**: Rental items with pricing and stock
- **Order**: Customer orders with status workflow
- **OrderItem**: Individual items within an order
- **StockBlock**: Stock reservations for specific date ranges
- **Customer**: Registered customer accounts
- **OrderMessage**: Communication between admin and customers
- **Page**: CMS-managed static pages
- **PricingConfig**: Discount and pricing rules

### 4.3 Key Business Logic

#### Stock Management
- Stock blocks created on order **CONFIRMED**
- Blocks reserved for exact rental date range
- Stock released on **COMPLETED** or **CANCELLED**
- Real-time availability = totalStock - reserved (from active blocks)

#### Order Status Workflow
```
PENDING → CONFIRMED → DELIVERED → COMPLETED
    ↓         ↓           ↓
  CANCELLED (at any stage, releases stock)
```

#### Pricing Calculation
- Base: Daily rate × number of days
- Tier 1 (Days 8-14): Apply week1Discount to additional days
- Tier 2 (Days 15+): Apply week1Discount to days 8-14, week2Discount to day 15+
- Enforce minimum order value based on delivery type
- Automatic discount display in cart

---

## 5. User Interface Requirements

### 5.1 Design System

#### Color Palette
- **Primary Colors:**
  - Vacation Orange (#FF6B35)
  - Vacation Coral (#FF8F65)
  - Vacation Ocean Blue (#2C5F8F)
  - Vacation Sand (#F5E6D3)

#### Typography
- Primary font: Inter
- Headings: Bold, large sizes
- Body: Regular, 16px base

#### Components
- Buttons: Rounded corners, hover effects, soft shadows
- Cards: White background, soft shadows, rounded corners
- Inputs: Rounded borders, focus states
- Navigation: Sticky header, backdrop blur

#### Visual Style
- "Vacation-friendly" aesthetic
- Warm, inviting tones
- Modern, clean layout
- Mobile-first responsive design
- Emojis for friendly communication

### 5.2 Page Structure

#### Public Pages
1. **Homepage** (`/`)
   - Hero section with call-to-action
   - Feature highlights
   - Category showcase
   - Customer account promotion

2. **Products** (`/products`)
   - Product grid with filtering
   - Category navigation
   - Availability indicators

3. **Product Detail** (`/products/[slug]`)
   - Large product images
   - Full description
   - Date selection
   - Add to cart
   - Availability calendar

4. **Shopping Cart** (`/cart`)
   - Review items
   - Order form
   - Delivery options
   - Final pricing

5. **Terms** (`/terms`)
   - Rental terms and conditions

6. **Privacy Policy** (`/privacy`)
   - Data protection policy

7. **Contact** (`/contact`)
   - Contact form

8. **Custom Pages** (`/pages/[slug]`)
   - CMS-managed content

#### Admin Pages
1. **Dashboard** (`/admin/dashboard`)
   - Overview and stats

2. **Orders** (`/admin/orders`)
   - Order list with filters
   - Status management
   - Customer communication

3. **Products** (`/admin/products`)
   - Product and category management

4. **Calendar** (`/admin/calendar`)
   - Visual rental calendar

5. **Stock Report** (`/admin/stock-report`)
   - Low stock alerts
   - Oversold warnings

6. **Clients** (`/admin/clients`)
   - Customer list

7. **Pages** (`/admin/pages`)
   - CMS management

8. **Settings** (`/admin/settings`)
   - WhatsApp configuration
   - Message templates
   - Pricing configuration

#### Customer Pages
1. **Register** (`/customer/register`)
2. **Login** (`/customer/login`)
3. **Dashboard** (`/customer/dashboard`)
   - Order list
   - Amend orders
   - Message admin
   - Cancel orders

---

## 6. Integration Requirements

### 6.1 WhatsApp Integration
- Uses `wa.me` links for direct messaging
- Pre-filled message templates
- Customizable message content
- Order confirmation link included

### 6.2 Payment Integration
- **Current:** On-arrival payment (cash/bank transfer)
- **Future:** Online payment integration (Stripe/PayPal)

---

## 7. Performance Requirements

### 7.1 Load Times
- Page load: < 2 seconds
- API responses: < 500ms
- Image optimization via Next.js Image component

### 7.2 Availability
- 99% uptime target
- Graceful error handling
- Database backup strategy

### 7.3 Scalability
- Current: SQLite for development
- Future: PostgreSQL for production scaling

---

## 8. Security Requirements

### 8.1 Authentication
- Admin: Username/password + 2FA
- Customer: Email/password with bcrypt hashing
- Session management via localStorage

### 8.2 Data Protection
- GDPR-compliant privacy policy
- Secure storage of customer data
- No payment card data storage

### 8.3 Access Control
- Admin routes protected
- Customer routes protected
- Guest checkout available

---

## 9. Testing Requirements

### 9.1 User Testing
- Customer journey testing
- Admin workflow testing
- Mobile device testing

### 9.2 Functional Testing
- Stock management accuracy
- Order status transitions
- Pricing calculations
- WhatsApp integration

### 9.3 Edge Cases
- Oversold scenarios
- Simultaneous bookings
- Stock block conflicts
- Invalid date ranges

---

## 10. Future Enhancements (Roadmap)

### 10.1 Phase 2 (Q1 2025)
- Online payment integration
- Customer reviews and ratings
- Email automation
- Product bundles/packages
- Admin analytics dashboard

### 10.2 Phase 3 (Q2 2025)
- Mobile app (React Native)
- Real-time inventory sync
- Automated WhatsApp API
- Multi-language support
- Social media integration

### 10.3 Phase 4 (Q3-Q4 2025)
- Partner integrations (car rental, hotels)
- Loyalty program
- Referral system
- Inventory forecasting
- Automated reordering alerts

---

## 11. Success Metrics

### 11.1 Business Metrics
- Monthly bookings growth
- Customer retention rate
- Average order value
- Revenue per month

### 11.2 User Experience Metrics
- Booking completion rate
- Time to complete booking
- Mobile vs desktop usage
- Customer satisfaction (via messages)

### 11.3 Operational Metrics
- Order fulfillment time
- Stock turnover rate
- Admin productivity (orders per hour)
- Communication response time

---

## 12. Risk Mitigation

### 12.1 Technical Risks
- **Database corruption:** Implement regular backups
- **Stock calculation errors:** Comprehensive testing
- **Concurrent booking conflicts:** Optimistic locking

### 12.2 Business Risks
- **Overselling:** Real-time alerts and manual review
- **Seasonal demand:** Scalable pricing and promotions
- **Customer communication gaps:** WhatsApp templates

### 12.3 Operational Risks
- **Delivery coordination failures:** Detailed form fields
- **Equipment damage liability:** Terms and conditions
- **Staff turnover:** Documented processes

---

## 13. Launch Checklist

### 13.1 Pre-Launch
- [ ] All core features implemented
- [ ] Database seeded with initial products
- [ ] Admin account created
- [ ] Payment terms defined
- [ ] WhatsApp templates configured
- [ ] Pricing configured
- [ ] Terms & Privacy pages completed
- [ ] Mobile responsiveness verified

### 13.2 Launch
- [ ] Domain configuration
- [ ] SSL certificate installed
- [ ] Database backup strategy
- [ ] Customer support plan
- [ ] Marketing materials ready

### 13.3 Post-Launch
- [ ] Monitor error logs
- [ ] Collect user feedback
- [ ] Track booking metrics
- [ ] Iterate based on usage patterns

---

## Appendix A: Terminology

- **Stock Block:** A reservation of inventory for a specific date range and order
- **Oversold:** When total reserved stock exceeds available stock
- **Delivery Type:** Method of getting equipment to customer (airport vs accommodation)
- **Rental Duration:** The period between rental start and end dates
- **Onward Journey:** How customer travels from airport (car hire, taxi, etc.)
- **Guest Order:** Order placed without customer account
- **Active Stock:** Total stock less any reserved stock blocks

---

## Appendix B: API Endpoints

### Customer APIs
- `POST /api/customer/register` - Customer registration
- `POST /api/customer/login` - Customer login
- `GET /api/customer/orders` - Fetch customer orders
- `POST /api/customer/messages` - Send message to admin
- `POST /api/customer/orders/[id]/cancel` - Cancel order
- `POST /api/customer/orders/[id]/amend` - Amend order

### Order APIs
- `POST /api/orders` - Create new order
- `GET /api/orders` - Fetch orders (admin)
- `GET /api/orders/[id]` - Fetch single order
- `PUT /api/orders/[id]` - Update order status
- `POST /api/availability` - Check product availability

### Product APIs
- `GET /api/products` - Fetch products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `GET /api/products/stocks` - Fetch stock information

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/settings` - Fetch admin settings
- `PUT /api/admin/settings` - Update admin settings
- `PUT /api/admin/pricing` - Update pricing config
- `POST /api/admin/messages` - Admin send message
- `GET /api/admin/customers` - Fetch customer list

---

## Document Control

**Author:** Development Team  
**Last Updated:** December 2024  
**Next Review:** January 2025  
**Version History:**
- v1.0 (Dec 2024): Initial PRD based on implemented features

**Approval:**
- Product Owner: [Pending]
- Tech Lead: [Pending]
- Business Owner: [Pending]

---

**END OF DOCUMENT**

