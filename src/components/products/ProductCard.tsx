'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    comparePrice?: number | null;
    stock: number;
    rating: number;
    reviewCount: number;
    isFeatured?: boolean;
    images: { url: string; alt?: string | null }[];
    category?: { name: string; slug: string };
    variants?: { id: string; title: string; colorHex?: string | null; stock: number }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images[1]?.url || primaryImage;

  const discountPercent =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product.id);
    setIsAdding(false);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white rounded-2xl border border-[#E8CFA8]/30 overflow-hidden hover:border-[#641C32]/40 hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Media Container */}
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F1EF]">
          <Image
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent && (
              <span className="px-2.5 py-1 bg-[#641C32] text-[#FFF9F3] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2.5 py-1 bg-[#E8CFA8] text-[#17151A] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
                Haute Choice
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="px-2.5 py-1 bg-amber-700 text-[#FFF9F3] text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
                Only {product.stock} Left
              </span>
            )}
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                inWishlist
                  ? 'bg-[#B83B5E] text-white shadow-md'
                  : 'bg-white/80 text-[#17151A] hover:bg-[#641C32] hover:text-white shadow-xs'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white/80 backdrop-blur-md text-[#17151A] hover:bg-[#641C32] hover:text-white shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Quick Look"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add To Cart Bar */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#17151A]/80 via-[#17151A]/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock <= 0}
              className="w-full py-2.5 bg-[#FFF9F3] hover:bg-[#641C32] text-[#17151A] hover:text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock <= 0 ? 'Sold Out' : isAdding ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
        </Link>

        {/* Details Container */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-2 bg-white">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-wider font-bold text-[#B83B5E]">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-xs text-[#17151A]">{product.rating.toFixed(1)}</span>
                <span className="text-[#17151A]/40 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block mt-1">
              <h3 className="font-serif text-sm font-medium text-[#17151A] group-hover:text-[#641C32] line-clamp-1 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Color Variants indicator if available */}
          {product.variants && product.variants.some((v) => v.colorHex) && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.variants
                .filter((v) => v.colorHex)
                .slice(0, 4)
                .map((v) => (
                  <span
                    key={v.id}
                    className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                    style={{ backgroundColor: v.colorHex || '#ccc' }}
                    title={v.title}
                  />
                ))}
              {product.variants.filter((v) => v.colorHex).length > 4 && (
                <span className="text-[10px] text-gray-400">+{product.variants.length - 4}</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="text-sm font-bold text-[#641C32] font-serif">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
