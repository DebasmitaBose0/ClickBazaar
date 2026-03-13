# Click Bazaar

A premium e-commerce web application built with React, TypeScript, and the Gemini AI API. Click Bazaar features a curated catalog of 20 products across 15 categories with an elegant, modern UI.

## Features

- **Product Catalog** — Browse 20 curated products across 15 categories (Grocery, Fashion, Mobile, Electronics, Beauty, Home, and more)
- **Category Filtering & Search** — Filter products by category tabs and search by name
- **Quick View** — Hover-to-preview product details without leaving the page
- **Cart & Checkout** — Full shopping flow with shipping address form and order confirmation
- **Wishlist** — Save favourite products with localStorage persistence
- **Live Order Tracking** — Visual shipment timeline with courier and destination info
- **User Profiles** — Curator profile with total spend, acquisition count, and preferences
- **Order History** — View past purchases with status and details
- **AI-Powered Descriptions** — Generate product descriptions via Google Gemini AI
- **Smart Recommendations** — AI-suggested complementary products based on cart contents
- **Admin Dashboard** — Session logs, user registry, and order ledger (login with `admin@clickbazaar.com`)
- **Responsive Design** — Mobile-friendly with adaptive navigation and layouts

## Tech Stack

- **React 19** + **TypeScript 5.8**
- **Vite 6** — Dev server and build tool
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library
- **Recharts** — Dashboard charts
- **Google Gemini AI** (`gemini-3-flash-preview`) — AI product descriptions and recommendations
- **Plus Jakarta Sans** — Typography via Google Fonts

## Product Categories

Grocery · Fashion · Mobile · Electronics · Beauty · Home · Men's Wear · Men's Watches · Women's Wear · Women's Watches · Shoes · Luxury · Wellness · Gadgets · Accessories

## Local Assets

Product images are sourced from Unsplash, with the following served locally from `public/images/`:

| File | Usage |
|---|---|
| `bohemian-loom-rug.jpg` | Bohemian Loom Rug product image |
| `hero1.jpg` | Hero slider |
| `hero2.jpg` | Hero slider |
| `hero3.jpg` | Hero slider |
| `hero4.png` | Hero slider |

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```

   npm install
   ```
   
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   ```

   
   npm run dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
