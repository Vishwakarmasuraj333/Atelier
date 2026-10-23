'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  const inWishlist = isInWishlist(product.id);
  const images = product.images || [];

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product.id, selectedVariantId, quantity);
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#17151A]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFF9F3] rounded-3xl border border-[#E8CFA8]/60 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-[#641C32] hover:text-white text-[#17151A] transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-6 bg-white flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-50">
              {images[activeImageIndex]?.url && (
                <Image
                  src={images[activeImageIndex].url}
                  alt={product.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-16 relative rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#641C32]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#B83B5E] tracking-widest">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-[#17151A]">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <h3 className="font-serif text-xl font-normal text-[#17151A] mt-1.5 leading-snug">
                {product.name}
              </h3>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl font-bold font-serif text-[#641C32]">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#17151A]/70 mt-3 line-clamp-3 leading-relaxed">
                {product.shortDesc || product.description}
              </p>
            </div>

            {/* Variant selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E8CFA8]/30">
                <label className="text-xs font-bold text-[#17151A] uppercase tracking-wider block">
                  Select Specification
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                        selectedVariantId === variant.id
                          ? 'bg-[#641C32] text-[#FFF9F3] border-[#641C32] shadow-xs'
                          : 'bg-white border-[#E8CFA8] text-[#17151A] hover:bg-[#F4F1EF]'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock <= 0}
                  className="flex-1 py-3 bg-[#641C32] hover:bg-[#491424] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isAdding ? 'Adding...' : 'Add to Bag'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-2xl border border-[#E8CFA8] transition-colors ${
                    inWishlist ? 'bg-[#B83B5E] text-white' : 'bg-white text-[#17151A] hover:bg-[#641C32] hover:text-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#641C32] hover:underline block pt-1"
              >
                View Full Product Specifications &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
