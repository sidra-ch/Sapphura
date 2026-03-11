# 🌟 Sappura - Artificial Jewellery E-Commerce Platform

Modern, feature-rich e-commerce platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** for smooth animations.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design** - Fully responsive across all devices
- **Smooth Animations** - Powered by Framer Motion
- **Interactive Components** - Engaging user experience
- **Clean & Professional** - Modern design aesthetic

### 🛍️ E-Commerce Features
- **Product Collections** - Browse by category with dynamic Cloudinary media
- **Shopping Cart** - Add, remove, update quantities with persistent state
- **Wishlist** - Save and manage favourite items (authenticated users)
- **Product Search** - Full-text search across products
- **Product Filters** - Filter by category, price, and availability
- **Coupon / Discount Codes** - Apply coupons at checkout
- **Customer Reviews** - Product review system

### 🔐 Authentication & Security
- **JWT Authentication** - HTTP-only secure cookies, 7-day expiration
- **Admin Panel** - Role-based access (Admin / Manager / Staff)
- **Customer Accounts** - OTP-based login for store customers
- **Password Reset** - Email-based forgot-password flow
- **Rate Limiting** - Brute-force protection on auth endpoints
- **Input Validation** - Zod schemas on all API routes

### 💳 Payments
- **Cash on Delivery (COD)** - Default payment method
- **Stripe** - Online card payments with webhook support
- **EasyPaisa** - Local mobile wallet payments
- **JazzCash** - Local mobile wallet payments
- **Visa / MasterCard** - Merchant account integration

### 📦 Order Management
- **Order Creation & Tracking** - Full order lifecycle (Pending → Delivered)
- **Invoice Generation** - PDF invoices via jsPDF
- **Email Notifications** - Order confirmation emails via Gmail/Nodemailer

### 🖼️ Media & Content
- **Cloudinary Integration** - Cloud-based image & video management
- **Dynamic Banners** - Configurable homepage banners
- **Marketing Campaigns** - Promotional campaign management

### 🛠️ Admin Dashboard
- **Product Management** - Create, edit, delete products with media upload
- **Order Management** - View and update order statuses
- **Coupon Management** - Create and manage discount codes
- **Shipping Rules** - Configure shipping costs and thresholds
- **Analytics** - Basic sales and traffic analytics
- **Campaign Management** - Manage promotional campaigns

### 🚀 Performance
- **Next.js 14** - Latest features with App Router
- **Server Components** - Optimized rendering
- **Image Optimization** - Next.js + Cloudinary for fast page loads
- **Code Splitting** - Efficient bundling

## 📁 Project Structure

```
Sapphura/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── admin/              # Admin dashboard (login, products, orders, etc.)
│   │   ├── account/            # Customer account page
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── collections/        # Product collections
│   │   ├── faq/                # FAQ page
│   │   ├── order-confirmation/ # Order confirmation page
│   │   ├── payment/            # Payment processing page
│   │   ├── policies/           # Terms & policies pages
│   │   ├── products/           # Product listing & detail pages
│   │   ├── reset-password/     # Password reset page
│   │   ├── search/             # Search results page
│   │   ├── wishlist/           # Wishlist page
│   │   └── api/                # API routes
│   │       ├── auth/           # Login, register, logout, session, password reset
│   │       ├── admin/          # Admin-only endpoints
│   │       ├── banners/        # Banner management
│   │       ├── campaigns/      # Campaign management
│   │       ├── categories/     # Category endpoints
│   │       ├── cloudinary/     # Cloudinary media API
│   │       ├── collections/    # Collections API
│   │       ├── contact/        # Contact form submission
│   │       ├── coupons/        # Coupon validation
│   │       ├── newsletter/     # Newsletter subscription
│   │       ├── orders/         # Order creation & management
│   │       ├── products/       # Product CRUD
│   │       ├── reviews/        # Product reviews
│   │       ├── search/         # Product search
│   │       ├── shipping-rules/ # Shipping configuration
│   │       ├── store/auth/     # Customer OTP authentication
│   │       ├── stripe/         # Stripe checkout & webhooks
│   │       ├── upload/         # Media upload
│   │       └── wishlist/       # Wishlist management
│   ├── components/
│   │   ├── layout/             # Header, Footer, AppShell
│   │   ├── home/               # Homepage sections (Hero, FeaturedProducts, etc.)
│   │   ├── admin/              # Admin UI components
│   │   ├── cart/               # Cart components
│   │   ├── marketing/          # Banner & campaign components
│   │   ├── navigation/         # Navigation components
│   │   ├── product/            # Product card & detail components
│   │   └── ui/                 # Shared UI components
│   ├── hooks/
│   │   ├── useCoupon.ts        # Coupon state hook
│   │   ├── useDebounce.ts      # Debounce utility hook
│   │   └── useWishlist.ts      # Wishlist state hook
│   ├── lib/
│   │   ├── auth-utils.ts       # JWT & bcrypt helpers
│   │   ├── cloudinary.ts       # Cloudinary client
│   │   ├── email-service.ts    # Nodemailer email sending
│   │   ├── invoice-generator.ts# PDF invoice generation
│   │   ├── middleware.ts       # Auth middleware
│   │   ├── payment-gateways.ts # Payment gateway configs
│   │   ├── prisma.ts           # Prisma database client
│   │   ├── rate-limit.ts       # Rate limiting utility
│   │   └── validation.ts       # Zod validation schemas
│   ├── store/
│   │   ├── cartStore.ts        # Zustand cart state
│   │   ├── couponStore.ts      # Zustand coupon state
│   │   └── wishlistStore.ts    # Zustand wishlist state
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── scripts/                    # Utility scripts (seed, cleanup, etc.)
├── .env.example                # Environment variable template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Media:** Cloudinary
- **Payments:** Stripe, EasyPaisa, JazzCash
- **Auth:** JWT + bcryptjs
- **Validation:** Zod
- **Email:** Nodemailer (Gmail)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios / SWR

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository and navigate to the project directory:**
   ```bash
   git clone <repo-url>
   cd Sapphura
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and fill in all required values (see [Environment Variables](#-environment-variables) below).

4. **Set up the database:**
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

5. **Create the admin user:**
   ```bash
   npm run db:create-admin
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

7. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📦 Available Scripts

```bash
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run ESLint
npm run db:generate            # Generate Prisma client
npm run db:seed                # Seed database with sample products
npm run db:seed-cloudinary     # Seed products from Cloudinary
npm run db:studio              # Open Prisma Studio
npm run db:create-admin        # Create the initial admin user
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  navy: {
    DEFAULT: '#0A1A3A',  // Background
    light: '#122852',
    dark: '#061229',
  },
  primary: {
    DEFAULT: '#B66A00',  // Main brand color
    light: '#E6B97D',
    dark: '#8B5000',
  },
  accent: '#108474',     // Accent color
}
```

### Fonts
The project uses **Open Sans** from Google Fonts. Change in `src/app/layout.tsx`:

```typescript
import { Open_Sans } from 'next/font/google'
```

## 📱 Pages Overview

### Homepage (/)
- Hero section with dynamic Cloudinary banners
- Featured products grid
- Best sellers section
- New arrivals
- Customer reviews
- Newsletter signup

### Products (/products)
- Product listing with filters
- Individual product detail pages with media gallery

### Collections (/collections)
- All collection categories
- Product count per category

### Shopping Cart (/cart)
- Cart items management
- Quantity controls
- Coupon code application
- Order summary with free shipping calculator

### Checkout (/checkout)
- Shipping address form
- Payment method selection (COD, Stripe, EasyPaisa, JazzCash)

### Admin Dashboard (/admin)
- Login at `/admin/login`
- Products, Orders, Coupons, Shipping, Campaigns management

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```env
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:your_secure_password_here@localhost:5432/Sappuradb

# JWT & Session Secrets
JWT_SECRET=replace_with_a_long_random_secret
PAYMENT_SESSION_SECRET=replace_with_a_long_random_secret

# Admin Setup
ALLOW_ADMIN_REGISTRATION=false
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_strong_password
ADMIN_NAME=Admin User

# Cloudinary (Media)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key

# Email (Gmail + App Password)
GMAIL_USER=you@example.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# EasyPaisa
EASYPAISA_ACCOUNT_NUMBER=03XXXXXXXXX
EASYPAISA_MERCHANT_ID=EP-SANDBOX-001

# JazzCash
JAZZCASH_ACCOUNT_NUMBER=03XXXXXXXXX
JAZZCASH_MERCHANT_ID=JC-SANDBOX-001

# Visa
VISA_MERCHANT_ACCOUNT=4111XXXXXXXXXXXX
VISA_MERCHANT_ID=VISA-SANDBOX-001

# MasterCard
MASTERCARD_MERCHANT_ACCOUNT=5555XXXXXXXXXXXX
MASTERCARD_MERCHANT_ID=MC-SANDBOX-001
```

## 🤝 Contributing

This is a custom project. For any modifications or improvements, please contact the development team.

## 📄 License

Private project - All rights reserved.

## 👥 Credits

**Developed by:** Senior Developer Team
**Design:** Modern E-Commerce UI/UX


## 📞 Support

For support or queries:
- Email: info@sappura.pk
- Phone: 03320924951
- Location: 6th road Rawalpindi, Pakistan

---

**Built with ❤️ in Pakistan** 🇵🇰

