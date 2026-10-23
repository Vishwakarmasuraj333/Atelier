'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { user } = useAuth();
  const { toggleWishlist, refreshWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    fetchWishlist();
  };

  const handleMoveToCart = async (product: any) => {
    await addToCart(product.id);
    await handleRemove(product.id);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9F3] flex flex-col items-center justify-center p-6 text-center">
        <Heart className="w-12 h-12 text-[#B83B5E] mb-4" />
        <h2 className="font-serif text-3xl text-[#17151A]">Your Wishlist Awaits</h2>
        <p className="text-xs text-[#17151A]/60 mt-2 mb-6 max-w-sm">
          Please log in or create a patron profile to preserve and synchronize your saved pieces.
        </p>
        <Link
          href="/account/login"
          className="px-8 py-3.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg transition-all"
        >
          Sign In to Maison
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF9F3]">
        <Loader2 className="w-8 h-8 text-[#641C32] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#17151A]/60 mt-2">Loading saved pieces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 mb-8 border-b border-[#E8CFA8]/40">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641C32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Desires</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#17151A] font-normal mt-1">
            Saved Masterpieces ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8CFA8]/40 p-8 space-y-4">
            <Heart className="w-12 h-12 text-[#E8CFA8] mx-auto" />
            <h3 className="font-serif text-2xl text-[#17151A]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#17151A]/60 max-w-md mx-auto">
              Save your favorite silk gowns, horology timepieces, and leather pieces as you browse.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3.5 bg-[#641C32] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-md"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const product = item.product;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E8CFA8]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] bg-gray-50 block">
                    {product.images[0]?.url && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#B83B5E] tracking-wider">
                      {product.brand}
                    </span>
                    <h3 className="font-serif text-sm font-medium text-[#17151A] line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="font-serif text-base font-bold text-[#641C32]">
                      {formatPrice(product.price)}
                    </p>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-2.5 border border-[#E8CFA8] text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
