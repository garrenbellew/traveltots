<!-- Last updated: 2025-11-11 -->
# Travel Tots Admin Training Manual

**Welcome!** This guide will help you manage your Travel Tots website easily, even if you're not tech-savvy. Take your time and follow the steps carefully.

---

## Table of Contents

1. [Getting Started - Logging In](#getting-started)
2. [Understanding the Admin Dashboard](#admin-dashboard)
3. [Managing Categories](#managing-categories) ⭐ **Start Here - Create Categories First!**
4. [Managing Products](#managing-products)
5. [Managing Bundles](#managing-bundles)
6. [Managing Orders](#managing-orders)
7. [Viewing the Calendar](#calendar-view)
8. [Managing Customers](#managing-customers)
9. [Viewing Stock Reports](#stock-reports)
10. [Managing Website Pages](#managing-pages)
11. [Managing Customer Reviews (Testimonials)](#testimonials)
12. [Settings & Configuration](#settings)
13. [Troubleshooting](#troubleshooting)

---

## Getting Started {#getting-started}

### How to Log In

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to your website's admin login page (you'll see a URL ending in `/admin/login`)
3. Enter your **username** and **password**
4. Click the **Login** button

**Important:** 
- Never share your login details with anyone
- If you forget your password, contact your website administrator

---

## Understanding the Admin Dashboard {#admin-dashboard}

Once logged in, you'll see the **Admin Dashboard**. This is your control center!

### The Top Navigation Menu

At the top of the page, you'll see several menu items. Here's what each one does:

- **Dashboard** - Overview of your business (orders, products, etc.)
- **Orders** - See and manage all customer orders
- **Products** - Add, edit, or remove rental items
- **Bundles** - Create packages of multiple products
- **Clients** - View your customer list
- **Pages** - Manage website pages (About Us, etc.)
- **Testimonials** - Manage customer reviews
- **Stock Report** - Check inventory levels
- **Calendar** - See deliveries and collections by date
- **Settings** - Configure WhatsApp, pricing, and more

**Tip:** Take a moment to click through each menu to see what's available. Don't worry - you can't break anything just by looking!

---

## Managing Categories {#managing-categories}

**⚠️ IMPORTANT: You MUST create categories BEFORE creating products!** Products need a category to be assigned to.

Categories help organize your products (Car Seats, Travel Cots, Strollers, etc.).

### Adding a Category

1. Click **Products** in the top menu
2. Click the **Categories** tab at the top (you'll see two tabs: "Products" and "Categories")
3. Click **New Category** button
4. Fill in the form:
   - **Category Name*** - What customers will see (e.g., "Car Seats")
   - **Slug*** - URL-friendly version (e.g., "car-seats"). This is usually the same as the name, but lower-case with dashes instead of spaces
   - **Description** - Optional description of what products go in this category
5. Click **Create Category**

**Example Categories:**
- Car Seats (slug: car-seats)
- Travel Cots (slug: travel-cots)
- Strollers (slug: strollers)
- High Chairs (slug: high-chairs)
- Baby Gates (slug: baby-gates)
- Accessories (slug: accessories)

**Tip:** Create all your main categories first, then you can add products to them!

### Editing a Category

1. Go to **Products** → **Categories** tab
2. Find the category you want to edit
3. Click the **Edit** button (pencil icon)
4. Make your changes
5. Click **Update Category**

### Deleting a Category

**⚠️ WARNING: Deleting a category will also DELETE all products in that category!**

**Before deleting a category:**
1. Move all products to a different category first, OR
2. Delete all products in that category if you're sure

**To delete:**
1. Go to **Products** → **Categories** tab
2. Find the category
3. Click **Delete**
4. Confirm the deletion

---

## Managing Products {#managing-products}

Products are the items customers can rent (car seats, strollers, etc.).

**⚠️ Make sure you have created categories FIRST!** You cannot create a product without selecting a category.

### Adding a New Product

1. Click **Products** in the top menu
2. Click the **New Product** button (usually green, with a + icon)
3. Fill in the product form:
   - **Product Name*** - What customers will see (e.g., "Premium Car Seat")
   - **Slug*** - URL-friendly version (e.g., "premium-car-seat"). Leave spaces as hyphens, no special characters
   - **Description*** - Tell customers what this product is and why they need it
   - **Price (€)*** - Weekly rental price (e.g., 40.00)
   - **Category*** - Choose from dropdown (Car Seats, Strollers, etc.)
   - **Total Stock*** - How many of this item you own (e.g., 5)
4. **Upload an Image:**
   - Click the upload area
   - Select a photo from your computer or phone
   - Wait for it to upload (you'll see a checkmark when done)
5. Make sure **Active Product** is checked (so customers can see it)
6. Click **Create Product**

**Important Notes:**
- Fields marked with * are required
- The image is very important - customers want to see what they're renting!
- Stock number should match how many items you actually have

### Editing a Product

1. Go to **Products** menu
2. Find the product you want to edit
3. Click the **Edit** button (usually an icon that looks like a pencil)
4. Make your changes
5. Click **Update Product**

**Editing a Product's Bundles:**

Once a product is created, you can assign it to bundles:
1. Edit the product
2. Scroll down to see **"Assign to Bundles"** section
3. Check the boxes next to bundles where this product should appear
4. If needed, adjust the quantity (how many of this product are in the bundle)
5. Changes save automatically

### Making a Product Inactive (Hiding It)

Instead of deleting, you can hide a product:
1. Edit the product
2. Uncheck **Active Product**
3. Save

Customers won't see it, but it stays in your system.

### Reordering Products

You can change the order in which products appear on your website. This is useful for highlighting popular items or organizing products by priority.

**To Reorder Products:**

1. Go to **Products** in the top menu
2. You'll see a table with all your products
3. At the top, you'll see a dropdown to **Filter by Category** (optional - you can reorder all products or just within a category)
4. In the **Order** column, you'll see up (↑) and down (↓) arrow buttons for each product
5. Click the **↑** button to move a product up in the list
6. Click the **↓** button to move a product down in the list
7. The order updates immediately and will be reflected on your public website

**Tips:**
- Products at the top of the list appear first on your website
- You can filter by category to reorder products within a specific category
- The first product in the list has the up arrow disabled (can't go higher)
- The last product has the down arrow disabled (can't go lower)
- The new order is saved automatically - no need to click a "Save" button

**Example:** If you want your "Premium Car Seat" to appear before "Basic Car Seat", just click the up arrow on "Premium Car Seat" until it's above the basic one.

---


---

## Managing Bundles {#managing-bundles}

Bundles are packages that include multiple products at a discounted price.

### Creating a Bundle

**Step 1: Create the Bundle Name**

1. Click **Bundles** in the top menu
2. Click **New Bundle**
3. Fill in:
   - **Bundle Name*** - e.g., "Baby Essentials Bundle"
   - **Slug*** - e.g., "baby-essentials-bundle"
   - **Description** - Tell customers what's included and why it's a great deal
4. Make sure **Active Bundle** is checked
5. Click **Create Bundle**

**Step 2: Add Products to the Bundle**

**Important:** You need to have products already created before you can add them to bundles!

1. Go to **Products** menu
2. Find a product that should be in your bundle
3. Click **Edit** on that product
4. Scroll down to find the **"Assign to Bundles"** section (only appears when editing an existing product)
5. You'll see a list of all active bundles with checkboxes
6. Check the box next to your bundle name
7. If needed, adjust the quantity (how many of this product in the bundle)
8. The changes save automatically when you check/uncheck boxes
9. Repeat for all products you want in the bundle

**Example:** If your "Baby Essentials Bundle" should have:
- 1x Car Seat
- 1x Travel Cot
- 1x High Chair

You would:
1. Edit Car Seat → Scroll to "Assign to Bundles" → Check "Baby Essentials Bundle" → Set Quantity: 1
2. Edit Travel Cot → Scroll to "Assign to Bundles" → Check "Baby Essentials Bundle" → Set Quantity: 1
3. Edit High Chair → Scroll to "Assign to Bundles" → Check "Baby Essentials Bundle" → Set Quantity: 1

**Tip:** You can assign the same product to multiple bundles if needed!

### Editing or Deleting Bundles

- **Edit:** Go to Bundles → Click Edit → Change name/description → Save
- **Delete:** Click Delete (removes the bundle grouping but doesn't delete products)

**Important:** The bundle discount percentage is set in **Settings** (see Settings section below).

---

## Managing Orders {#managing-orders}

This is where you see all customer booking requests.

### Understanding Order Status

Orders have different statuses:
- **PENDING** - Customer submitted, waiting for you to confirm
- **CONFIRMED** - You've accepted the order
- **DELIVERED** - Items have been delivered to customer
- **COMPLETED** - Items have been collected back from customer
- **CANCELLED** - Order was cancelled

### Viewing an Order

1. Click **Orders** in the top menu
2. You'll see a list of all orders with:
   - Order number
   - Customer name
   - Status
   - Dates
   - Total price
3. Click on an order to see full details

### Updating Order Status

**Confirming an Order:**
1. Open the order
2. Review all details (products, dates, delivery info)
3. Click **"Confirm Order"**
4. Stock will be automatically reserved for the rental dates

**Marking as Delivered:**
1. Open the order
2. Click **"Mark as Delivered"**
3. This records when you delivered the items

**Marking as Completed:**
- Only when you've collected items back from the customer
- Click **"Mark as Completed"**
- Stock becomes available again

**Cancelling an Order:**
1. Open the order
2. Click **"Cancel Order"**
3. Confirm cancellation
4. Stock will be freed up immediately

### Reading Customer Messages

Some customers may send you messages about their order:
1. Open the order
2. Scroll to find the messages section
3. Read the customer's message
4. You can reply directly (they'll see it in their account)

---

## Calendar View {#calendar-view}

The calendar helps you plan your deliveries and collections.

### Viewing the Calendar

1. Click **Calendar** in the top menu
2. You'll see today's schedule by default
3. Use the date picker to view any future date

### What You'll See

- **Deliveries** - Orders to be delivered on this date
- **Collections** - Orders to be collected on this date
- **Stock Warnings** - If you're low on items for specific dates

### Creating a Driving Plan

1. Scroll down to **"Driving Plan"** section
2. See all deliveries and collections in one list
3. Click and drag items to reorder them (for route planning)
4. Click **Print** for a printer-friendly version

**Tip:** This helps you plan your delivery route efficiently!

---

## Managing Customers {#managing-customers}

### Viewing Your Customer List

1. Click **Clients** in the top menu
2. You'll see all customers who have created accounts
3. Each customer shows:
   - Name and contact info
   - When they registered
   - Account status (active or disabled)
   - Their password (to help them if forgotten)

### Disabling a Customer Account

If needed, you can disable a customer:
1. Find the customer in the list
2. Uncheck **Active** or click **Disable**
3. They won't be able to log in until you re-enable them

### Sending Marketing Messages

1. Click **Clients**
2. Use the bulk messaging feature (if available) to send WhatsApp messages to multiple customers

---

## Stock Reports {#stock-reports}

### Checking Stock Levels

1. Click **Stock Report** in the top menu
2. You'll see:
   - All products
   - Total stock you own
   - Available stock (not reserved)
   - Reserved stock (for upcoming orders)

### Understanding Stock Warnings

- **Low Stock** - Running low, consider buying more
- **Negative Stock** - You've overbooked! You need to:
  - Buy more items, OR
  - Move some orders to different dates

### What to Do When Stock is Low

1. Check which dates the stock shortage occurs
2. Plan ahead - buy more items or adjust bookings
3. Update your stock numbers once you have more items

---

## Managing Website Pages {#managing-pages}

You can create custom pages like "About Us" or "Terms & Conditions".

### Creating a New Page

1. Click **Pages** in the top menu
2. Click **Create New Page**
3. Fill in:
   - **Page Title*** - What appears at the top
   - **Slug*** - URL (e.g., "about-us" creates `/about-us` page)
   - **Content** - Write your page content here
   - Add images if needed
4. Click **Create Page**

### Editing or Deleting Pages

- **Edit:** Click Edit → Make changes → Save
- **Delete:** Click Delete (removes page from website)

**Note:** Pages automatically appear in your website navigation menu.

---

## Managing Customer Reviews (Testimonials) {#testimonials}

### Adding a Testimonial

1. Click **Testimonials** in the top menu
2. Click **Add Testimonial**
3. Fill in:
   - **Customer Name** - e.g., "Sarah & Family"
   - **Review Text** - What they said
   - **Rating** - Stars (1-5)
4. Click **Save**

### Editing or Removing Testimonials

- Use the Edit or Delete buttons as needed

---

## Settings & Configuration {#settings}

Settings control important aspects of your business.

### WhatsApp Configuration

1. Click **Settings** → Look for **WhatsApp Configuration**
2. Enter your **WhatsApp Number** (with country code, e.g., +34612345678)
3. Customize your message templates:
   - **Order Confirmed** - Sent when you confirm an order
   - **Order Delivered** - Sent when items are delivered
   - **Order Completed** - Sent when items are collected
   - **Order Cancelled** - Sent if order is cancelled
4. Click **Save Settings**

**Tip:** These messages can include placeholders like {ORDER_NUMBER} and {CUSTOMER_NAME} which will be replaced automatically.

### Pricing Configuration

1. Go to **Settings**
2. Find **Pricing Configuration**
3. Set:
   - **Weekly Price % Increase** - For rentals 8-14 days (e.g., 10%)
   - **Minimum Order Value** - Minimum for accommodation deliveries
   - **Airport Minimum Order** - Minimum for airport deliveries
   - **Bundle Discount %** - Discount applied to bundle products (e.g., 15%)
4. Click **Save**

**How Pricing Works:**
- Products have a **weekly base price**
- 1-7 days = Full weekly price
- 8-14 days = Weekly price + extra days charge (percentage of weekly price)
- 15+ days = Special contact required message

### Popular Categories

1. In Settings, find **Popular Categories**
2. Select up to 3 categories to show on your homepage
3. These will appear as highlighted sections
4. Click **Save**

### Changing Your Admin Password

1. Go to **Settings**
2. Find **Change Password**
3. Enter your current password
4. Enter your new password (twice to confirm)
5. Click **Change Password**

**Security Tip:** Use a strong password with letters, numbers, and symbols.

---

## Troubleshooting {#troubleshooting}

### "I Can't Log In"

- Check you're using the correct username and password
- Make sure Caps Lock is off
- Clear your browser cache and try again
- Contact your website administrator if still stuck

### "I Can't Create a Product - No Categories Available"

- **You need to create categories first!**
- Go to Products → Categories tab
- Create at least one category
- Then go back to Products tab to add your product

### "Product Images Won't Upload"

- Make sure image is less than 5MB
- Try a different image format (JPG, PNG work best)
- Check your internet connection
- Try refreshing the page and uploading again

### "I Can't See My Changes"

- Click the refresh button in your browser (or press F5)
- Clear your browser cache
- Make sure you clicked "Save" or "Update"

### "Stock Numbers Look Wrong"

- Check the **Stock Report** to see what's reserved vs. available
- Remember: Stock is reserved for confirmed orders
- Cancel or complete orders to free up stock

### "Orders Keep Showing as PENDING"

- You need to **confirm** orders manually after reviewing them
- Go to Orders → Click on the order → Click "Confirm Order"

### "I Deleted Something by Mistake"

- **Categories:** ⚠️ Products in deleted categories are also deleted (be very careful!)
- **Products:** Check if product is just inactive (uncheck "Active Product") - inactive products can be reactivated
- **Orders:** Cancelled orders stay in the system but don't affect stock
- **Bundles:** Deleting a bundle doesn't delete the products, it just removes the grouping

### "WhatsApp Messages Aren't Sending"

- Check your WhatsApp number is correct in Settings
- Make sure the number includes country code (e.g., +34 for Spain)
- The system opens WhatsApp with a pre-filled message - this is normal

### "Calendar Shows Wrong Information"

- Make sure orders are confirmed (confirmed orders appear in calendar)
- Check the rental dates on the orders
- Cancelled orders don't show in the calendar

---

## Quick Reference Guide

### Daily Tasks

**Morning Routine:**
1. Check **Orders** - Confirm any new pending orders
2. Check **Calendar** - See today's deliveries/collections
3. Review **Stock Report** - Check for any low stock warnings

**After Delivery:**
1. Mark orders as **Delivered** in Orders menu

**After Collection:**
1. Mark orders as **Completed** in Orders menu

### Weekly Tasks

1. Review **Stock Report** - Plan ahead for busy periods
2. Update **Stock Numbers** if you've purchased new items
3. Check customer **Messages** and respond
4. Review and update **Testimonials**
5. Consider adding new **Categories** or **Products** for seasonal items

### Monthly Tasks

1. Review **Settings** - Update pricing if needed
2. Review your **Categories** - Do you need new ones or should any be removed?
3. Add new **Products** or **Bundles** for seasonal items
4. Update **Website Pages** if information changes

---

## Need Help?

If you're stuck:
1. Check this manual first - your question might be answered here
2. Try refreshing the page
3. Make sure you saved your changes
4. Contact your website administrator for technical support

---

## Important Reminders

✅ **Always** create categories BEFORE creating products  
✅ **Always** confirm orders before marking them as delivered  
✅ **Always** update stock numbers when you buy new items  
✅ **Always** save your changes before leaving a page  
✅ **Never** delete categories with products in them (delete products first!)  
✅ **Remember** to mark orders as completed after collection  
✅ **Remember** to assign products to bundles from the product edit page  

---

**Good luck managing your Travel Tots website! Take it one step at a time, and you'll get the hang of it.** 🎉

