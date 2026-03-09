# 🌟 Sappura - Artificial Jewellery E-Commerce Platform

Modern, feature-rich e-commerce platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion** for smooth animations.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design** - Fully responsive across all devices
- **Smooth Animations** - Powered by Framer Motion
- **Interactive Components** - Engaging user experience
- **Clean & Professional** - Modern design aesthetic

### 🛍️ E-Commerce Features
- **Product Collections** - Browse by category
- **Shopping Cart** - Add, remove, update quantities
- **State Management** - Zustand for cart persistence
- **Product Filters** - Easy navigation
- **Wishlist Support** - Save favorite items
- **Search Functionality** - Quick product search

### 🚀 Performance
- **Next.js 14** - Latest features with App Router
- **Server Components** - Optimized rendering
- **Image Optimization** - Fast page loads
- **Code Splitting** - Efficient bundling

### 🎯 User Features
- Free shipping on orders over PKR 3,000
- Cash on Delivery (COD) available
- Secure shopping experience
- Customer reviews integration
- 24/7 customer support

## 📁 Project Structure

```
Sappura-react/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles
│   │   ├── collections/         # Collections pages
│   │   └── cart/                # Shopping cart
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   └── Footer.tsx       # Footer component
│   │   └── home/
│   │       ├── Hero.tsx         # Hero section
│   │       ├── FeaturedCollections.tsx
│   │       ├── BestSellers.tsx  # Best selling products
│   │       ├── Features.tsx     # Service features
│   │       └── Reviews.tsx      # Customer reviews
│   └── store/
│       └── cartStore.ts         # Zustand cart state
├── public/
│   └── images/                  # Static images
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory:**
   ```bash
   cd "c:\My Web Sites\Sappura\Sappura-react"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: '#B66A00',  // Main brand color
    light: '#E6B97D',
    dark: '#8B5000',
  },
  secondary: {
    DEFAULT: '#E6E6E6',
    dark: '#D4D4D4',
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
- Hero section with CTA
- Featured collections grid
- Best selling products
- Service features
- Customer reviews

### Collections (/collections)
- All collection categories
- Product count per category
- Quick navigation

### Shopping Cart (/cart)
- Cart items management
- Quantity controls
- Order summary
- Free shipping calculator
- Checkout flow

## 🔧 Environment Variables

Create a `.env.local` file (if needed):

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🎯 Key Features Implementation

### Shopping Cart
- Persistent cart using Zustand + localStorage
- Add/remove items
- Update quantities
- Real-time price calculation
- Free shipping threshold

### Animations
- Page transitions with Framer Motion
- Hover effects on cards
- Scroll animations
- Loading states

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Hamburger menu for mobile
- Touch-friendly UI

## 📈 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Product filtering & sorting
- [ ] Product search
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Review system
- [ ] Multi-language support

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
