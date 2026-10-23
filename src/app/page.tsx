import React from 'react';
import prisma from '@/lib/prisma';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { TrendingProducts } from '@/components/home/TrendingProducts';
import { ThreeDShowcase } from '@/components/home/ThreeDShowcase';
import { FlashSale } from '@/components/home/FlashSale';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { BrandHeritage } from '@/components/home/BrandHeritage';
import { InstagramGallery } from '@/components/home/InstagramGallery';

// Force dynamic so real database updates are always reflected
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [banners, categories, products] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true, position: 'HERO' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  const flashProduct = products.find((p) => p.slug === 'chronographe-imperial-rose-gold-timepiece') || products[0];

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Cinematic Slider */}
      <HeroSlider initialBanners={banners} />

      {/* 2. Featured Category Cards */}
      <FeaturedCategories categories={categories} />

      {/* 3. Trending & Featured Products */}
      <TrendingProducts products={products} />

      {/* 4. Interactive 3D Showcase (Three.js WebGL) */}
      <ThreeDShowcase />

      {/* 5. Limited Window Flash Sale */}
      {flashProduct && <FlashSale product={flashProduct} />}

      {/* 6. Brand Heritage & Craftsmanship */}
      <BrandHeritage />

      {/* 7. Client Verified Reviews */}
      <CustomerReviews />

      {/* 8. Instagram Social Lookbook */}
      <InstagramGallery />
    </div>
  );
}
