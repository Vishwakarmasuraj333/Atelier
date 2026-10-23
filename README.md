# ⚜️ Atelier Éclat — Luxury Haute Couture & Horology E-Commerce

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)

*An ultra-luxury, high-aesthetic e-commerce experience curated for bespoke tailoring, Swiss timepieces, and rare olfactory creations.*

[Live Demo](http://localhost:3000) • [Explore Collection](#-features) • [Quickstart](#-getting-started) • [Architecture](#-tech-stack)

</div>

---

## ✨ Overview

**Atelier Éclat** is a digital flagship designed for the ultra-luxury market. Built with performance, accessibility, and bespoke visual aesthetics in mind, it redefines online haute couture and horology shopping through editorial design, fluid animations, and robust full-stack architecture.

### Key Highlights
- 🏛️ **Editorial Luxury Aesthetic**: Warm alabaster palette (`#FFF9F3`), obsidian velvet accents (`#17151A`), metallic gold ribbons (`#C8A26A`), and serif typography.
- 💎 **Interactive Masterpieces**: 3D interactive viewer, micro-interactions, silky smooth page transitions powered by Framer Motion & Three.js.
- ⚡ **Cutting-Edge Tech Stack**: Next.js 16 App Router, React 19, Tailwind CSS v4, and Prisma ORM.
- 🛡️ **Role-Based Security**: Enterprise-grade JWT auth with encrypted passwords (bcrypt) for both Clients and Administrators.
- 📦 **End-to-End E-Commerce Flow**: Dynamic product catalog with filters, variant selection (size, color, finish), persistent Cart & Wishlist, coupon discount engine, multi-step checkout with Razorpay/COD, order history timeline, and real-time inventory management.
- 👑 **Bespoke Admin Portal**: Executive dashboard with revenue analytics, inventory health, order lifecycle status manager, and customer management.

---

## 🚀 Features

### 🛍️ Client Experience
* **Curated Haute Collections**: Filter by category (Women's Couture, Men's Sartorial, Swiss Horology, Niche Fragrance, Leather Goods, Living Decor).
* **Deep Product Detail Pages**: High-resolution image galleries, dynamic variant selection, real-time stock counters, customer reviews, and editorial craftsmanship notes.
* **Persistent Cart & Wishlist**: Syncs state seamlessly across sessions with drawer animations and instant recalculations.
* **Promo Engine**: Apply coupons (e.g. `LUXE20`, `WELCOME10`, `ATELIER50`) with live discount validation and subtotal updates.
* **Checkout & Payment**: Integrated Razorpay modal & Cash on Delivery (COD) with complete order invoice generation.
* **Client Concierge**: Order history timeline with delivery stage tracking (`PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).

### 👑 Maison Admin Management
* **Executive KPIs**: Real-time Gross Merchandise Value (GMV), order counts, client metrics, and top-performing pieces.
* **Catalog Management**: Add, update, and manage products, multi-tier pricing, and high-res imagery.
* **Order Lifecycle Workflow**: Update fulfillment stages with live status timeline updates.
* **Inventory Alerts**: Low-stock badges and audit logging.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Luxury Design System |
| **Animations & 3D** | [Framer Motion 12](https://www.framer.com/motion/), [Three.js](https://threejs.org/), [Canvas Confetti](https://github.com/catdad/canvas-confetti) |
| **Database & ORM** | [Prisma ORM 6](https://www.prisma.io/) with SQLite (zero-config local) / MySQL ready |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` |
| **Icons & Media** | [Lucide React](https://lucide.dev/), Unsplash Curated Luxury CDN |
| **Payments** | [Razorpay](https://razorpay.com/) & Mock Payment Gateway |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm** / **yarn** / **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/Vishwakarmasuraj333/Atelier.git
cd Atelier
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the provided `.env.example` file to create your local `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
Push the database schema and populate it with seed catalog data:
```bash
# Push Prisma schema to SQLite dev.db
npx prisma db push

# Seed luxury products, categories, coupons, and test accounts
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience Atelier Éclat.

---

## 🔑 Demo Credentials

Pre-configured accounts ready for instant evaluation:

| Portal | Email | Password | Role |
|---|---|---|---|
| **Admin Salon** | `admin@atelier.com` | `admin123` | Master Administrator |
| **Client Account** | `customer@atelier.com` | `customer123` | Verified VIP Client |

*Tip: Quick-fill buttons are available on the Client Sign-In page for 1-click access.*

---

## 📂 Project Architecture

```
atelier-ecommerce/
├── prisma/
│   ├── schema.prisma       # Relational database models (User, Product, Order, Cart, etc.)
│   └── seed.ts             # Rich seed script with 8+ luxury products, categories, coupons
├── public/                 # Static assets, logos, and fonts
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (shop)/         # Public storefront (catalog, product detail, cart, checkout)
│   │   ├── account/        # User authentication & client profile portal
│   │   ├── admin/          # Admin executive portal & inventory management
│   │   ├── api/            # REST API endpoints (auth, cart, orders, products, checkout)
│   │   ├── globals.css     # Luxury CSS design system, gradients & keyframes
│   │   └── layout.tsx      # Root layout with providers
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Header, Footer, Navigation, Luxury Logo
│   │   ├── products/       # Product cards, gallery, variant selector, 3D view
│   │   └── ui/             # Buttons, modals, input elements, badges
│   ├── context/            # Global state (AuthContext, CartContext, WishlistContext)
│   └── lib/                # Prisma client singleton, JWT utils, helper functions
├── .env.example            # Ready-to-use template environment variables
├── package.json
└── tsconfig.json
```

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Crafted with passion for haute horlogerie and digital elegance by <a href="https://github.com/Vishwakarmasuraj333">Vishwakarmasuraj333</a>.</sub>
</div>
