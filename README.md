# Project BLNC - Luxury Streetwear E-commerce

A minimal luxury streetwear e-commerce front-end built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for hero scroll effects and transitions
- **Product Management**: Local product data with categories (Hoodies, Pants, T-Shirts)
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Image Galleries**: Product and model view tabs with thumbnails
- **Responsive Design**: Mobile-first approach with beautiful breakpoints
- **Clean UI**: Monochrome aesthetic with editorial fashion vibes

## 📁 Project Structure

```
projectblnc/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with CartProvider
│   │   ├── page.tsx              # Home page with hero
│   │   ├── globals.css           # Global styles
│   │   ├── products/
│   │   │   ├── page.tsx          # Products listing with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Product detail page
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   ├── news/
│   │   │   └── page.tsx          # News page
│   │   └── not-found.tsx         # 404 page
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation bar with cart icon
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Hero.tsx              # Animated hero section
│   │   ├── CartDrawer.tsx        # Slide-over cart panel
│   │   ├── ProductCard.tsx       # Product card component
│   │   ├── ProductGrid.tsx       # Product grid layout
│   │   ├── CategoryTabs.tsx      # Category filter tabs
│   │   ├── ImageGallery.tsx      # Product image gallery
│   │   └── AddToCartButton.tsx   # Add to cart with size selector
│   ├── context/
│   │   └── CartContext.tsx       # Cart state management
│   └── data/
│       └── products.ts           # Product data (3 hoodies, 2 pants, 2 t-shirts)
├── public/
│   ├── hero/
│   │   └── hero.jpg              # ⚠️ ADD THIS: Hero background image
│   ├── products/
│   │   ├── hoodies/
│   │   │   ├── hoodie-01/        # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │   │   ├── hoodie-02/        # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │   │   └── hoodie-03/        # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │   ├── pants/
│   │   │   ├── pant-01/          # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │   │   └── pant-02/          # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │   └── tshirts/
│   │       ├── tshirt-01/        # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   │       └── tshirt-02/        # ⚠️ ADD: 01.jpg, 02.jpg, 03.jpg
│   └── models/
│       ├── hoodies/
│       │   ├── hoodie-01/        # ⚠️ ADD: 01.jpg, 02.jpg
│       │   ├── hoodie-02/        # ⚠️ ADD: 01.jpg, 02.jpg
│       │   └── hoodie-03/        # ⚠️ ADD: 01.jpg, 02.jpg
│       ├── pants/
│       │   ├── pant-01/          # ⚠️ ADD: 01.jpg, 02.jpg
│       │   └── pant-02/          # ⚠️ ADD: 01.jpg, 02.jpg
│       └── tshirts/
│           ├── tshirt-01/        # ⚠️ ADD: 01.jpg, 02.jpg
│           └── tshirt-02/        # ⚠️ ADD: 01.jpg, 02.jpg
└── package.json
```

## 🎨 Design Philosophy

- **Monochrome Aesthetic**: Clean black and white with subtle grays
- **Typography**: Large, bold headlines with smaller muted subtext
- **Spacing**: Generous whitespace for a premium feel
- **Animations**: Subtle scroll effects on hero (scale, fade, parallax)
- **Editorial Vibe**: Fashion-forward, minimal, luxurious

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add Images**:
   Create the folder structure in `/public` as shown above and add your images. The hero image should be placed at `/public/hero/hero.jpg`.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📸 Image Requirements

### Hero Image
- **Path**: `/public/hero/hero.jpg`
- **Size**: 1920x1080 or larger (will be displayed full-viewport)
- **Style**: High-quality fashion/lifestyle image

### Product Images
- **Format**: `.jpg` or `.png`
- **Size**: 800x800 or larger (square aspect ratio recommended)
- **Naming**: `01.jpg`, `02.jpg`, `03.jpg` (3 images per product)

### Model Images
- **Format**: `.jpg` or `.png`
- **Size**: 800x800 or larger
- **Naming**: `01.jpg`, `02.jpg` (2 images per product)

## 🎯 Key Features Explained

### Hero Section
- Full-viewport parallax background
- Scroll-triggered scale and fade effects
- Text positioned at bottom left
- Scroll indicator with animation

### Product Catalog
- 7 products total: 3 hoodies, 2 pants, 2 t-shirts
- Category filtering on `/products` page
- Each product has dedicated detail page at `/products/[slug]`

### Shopping Cart
- Add to cart with size selection
- Quantity controls (+/-)
- Remove items
- Persistent storage (localStorage)
- Slide-over drawer with smooth animations

### Responsive Design
- Mobile: Single column, stacked navigation
- Tablet: 2-column product grid
- Desktop: 3-column product grid
- All components adapt gracefully

## 🚢 Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
1. Push code to GitHub
2. Import project in Vercel
3. Deploy (Vercel auto-detects Next.js)

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Products
Edit `src/data/products.ts` to modify product details, add new products, or change categories.

### Typography
Change the font in `src/app/layout.tsx` (currently using Inter).

## 📝 Notes

- **No Backend**: This is a front-end only implementation. Cart data is stored in localStorage.
- **No Payment**: Checkout button is UI-only. Integrate Stripe or similar for real payments.
- **Static Generation**: Product pages use `generateStaticParams` for optimal performance.
- **Image Optimization**: Next.js automatically optimizes all images.

## 🔧 Tech Stack

- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **Animation**: Framer Motion 11.15.0
- **Icons**: Lucide React 0.469.0
- **Font**: Inter (via next/font)

## 📄 License

This is a custom project. All rights reserved.

---

Built with ❤️ for Project BLNC
