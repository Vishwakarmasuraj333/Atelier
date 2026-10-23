'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Loader2,
  Box,
  Send,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) {
        setProduct(null);
        return;
      }
      const data = await res.json();
      setProduct(data.product);
      setRelatedProducts(data.relatedProducts || []);
      if (data.product?.variants?.length > 0) {
        setSelectedVariantId(data.product.variants[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F3]">
        <Loader2 className="w-10 h-10 text-[#641C32] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#17151A]/60 mt-3 font-medium">
          Loading Haute Masterpiece...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F3] text-center p-6 space-y-4">
        <h2 className="font-serif text-3xl text-[#17151A]">Masterpiece Not Found</h2>
        <p className="text-xs text-[#17151A]/60 max-w-sm">
          The item you are searching for may have been archived or is part of a previous collection.
        </p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[#641C32] text-white text-xs font-bold uppercase tracking-wider rounded-2xl"
        >
          Explore Active Collection
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const currentVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const effectivePrice = currentVariant?.price || product.price;
  const availableStock = currentVariant ? currentVariant.stock : product.stock;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product.id, selectedVariantId, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, selectedVariantId, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/account/login');
      return;
    }

    setIsSubmittingReview(true);
    setReviewSuccessMsg('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewSuccessMsg('Your review has been verified and published.');
        setReviewTitle('');
        setReviewComment('');
        fetchProduct();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#17151A]/60 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#641C32]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#641C32]">Catalog</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-[#641C32]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#17151A] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Top Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14">
          {/* Left Gallery Images */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Magnified View */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-[#E8CFA8]/40 shadow-md">
              {product.images?.[activeImageIndex]?.url && (
                <Image
                  src={product.images[activeImageIndex].url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-all duration-500 hover:scale-105"
                />
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-[#641C32] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md">
                    Haute Edition
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Swatches */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#641C32] shadow-md scale-102'
                        : 'border-[#E8CFA8]/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Purchase Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#B83B5E] tracking-[0.25em]">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-[#17151A]">{product.rating.toFixed(1)}</span>
                  <span className="text-[#17151A]/50 text-xs">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal text-[#17151A] leading-tight">
                {product.name}
              </h1>

              {/* SKU & Availability Badge */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-[#17151A]/50">SKU: {currentVariant?.sku || product.sku}</span>
                <span className="text-gray-300">•</span>
                {availableStock > 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({availableStock} available)
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold">Sold Out</span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8CFA8]/40 shadow-xs flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#641C32]">
                  {formatPrice(effectivePrice)}
                </span>
                {product.comparePrice && product.comparePrice > effectivePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#17151A]/60 font-medium">Taxes included</span>
            </div>

            {/* Variants Matrix (Colors & Sizes) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#17151A] block">
                  Select Size & Color Edition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                        selectedVariantId === v.id
                          ? 'border-[#641C32] bg-[#641C32]/5 text-[#641C32] font-bold shadow-xs'
                          : 'border-[#E8CFA8] bg-white text-[#17151A] hover:bg-[#F4F1EF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {v.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.title}</span>
                      </div>
                      <span className="text-[10px] opacity-60 font-normal">
                        {v.stock > 0 ? `${v.stock} left` : 'Out'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E8CFA8] rounded-2xl bg-white px-3 py-2.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#17151A]/60 hover:text-[#641C32] px-2 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#17151A]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    className="text-[#17151A]/60 hover:text-[#641C32] px-2 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || availableStock <= 0}
                  className="flex-1 py-3.5 bg-[#641C32] hover:bg-[#491424] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Adding to Bag...' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-2xl border border-[#E8CFA8] transition-colors shadow-xs ${
                    inWishlist ? 'bg-[#B83B5E] text-white' : 'bg-white text-[#17151A] hover:bg-[#641C32] hover:text-white'
                  }`}
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={availableStock <= 0}
                className="w-full py-3.5 bg-[#17151A] hover:bg-[#2A2630] text-[#FFF9F3] text-xs font-bold uppercase tracking-widest rounded-2xl shadow-md transition-all"
              >
                Instant VIP Checkout
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="pt-4 border-t border-[#E8CFA8]/40 space-y-3 text-xs text-[#17151A]/80">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#641C32]" />
                <span>Complimentary insured priority courier with signature delivery.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#641C32]" />
                <span>Individually numbered certificate of authenticity included.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#641C32]" />
                <span>30-day effortless concierge return collection.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications, Care and Reviews */}
        <div className="mt-16 pt-10 border-t border-[#E8CFA8]/40">
          <div className="flex border-b border-[#E8CFA8]/40 gap-8">
            {[
              { id: 'desc', label: 'Artisanal Description' },
              { id: 'specs', label: 'Material & Dimensions' },
              { id: 'shipping', label: 'VIP Delivery & Care' },
              { id: 'reviews', label: `Client Reviews (${product.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#641C32]'
                    : 'text-[#17151A]/50 hover:text-[#17151A]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#641C32]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#17151A]/80 leading-relaxed font-light">
                <p>{product.description}</p>
                {product.tags && (
                  <div className="pt-4 flex flex-wrap gap-2">
                    {product.tags.split(',').map((t: string) => (
                      <span key={t} className="px-3 py-1 bg-white border border-[#E8CFA8] rounded-full text-[11px] text-[#17151A]">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl bg-white rounded-2xl border border-[#E8CFA8]/40 p-6 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#17151A]/60">Brand / House</span>
                  <span className="font-bold text-[#17151A]">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#17151A]/60">Model Master SKU</span>
                  <span className="font-mono text-[#17151A]">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-[#17151A]/60">Category Domain</span>
                  <span className="font-medium text-[#17151A]">{product.category?.name || 'Haute Couture'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#17151A]/60">Origin</span>
                  <span className="font-medium text-[#17151A]">Handmade in Italy & Switzerland</span>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#17151A]/80 leading-relaxed">
                <p>
                  Every order from Atelier Éclat is prepared in our climate-controlled private vault, enveloped in archival acid-free tissue and presented in an embossed linen-bound keepsake box.
                </p>
                <p>
                  Orders over $300 receive complimentary express courier dispatch within 24 hours. A tracking link with live delivery courier updates will be generated upon dispatch.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-10">
                {/* Submit Review Form */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E8CFA8]/40 shadow-xs max-w-2xl">
                  <h3 className="font-serif text-lg font-medium text-[#17151A] mb-4">
                    Leave a Verified Patron Review
                  </h3>
                  {reviewSuccessMsg && (
                    <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" /> {reviewSuccessMsg}
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Your Rating
                      </label>
                      <div className="flex gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setReviewRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g., Unsurpassed tactile luxury and drape"
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#17151A] block mb-1">
                        Commentary
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience regarding material quality, fit, or packaging..."
                        className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#E8CFA8] rounded-xl text-xs outline-none focus:border-[#641C32]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 bg-[#641C32] hover:bg-[#B83B5E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 max-w-3xl">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev: any) => (
                      <div key={rev.id} className="bg-white p-6 rounded-2xl border border-[#E8CFA8]/30 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#17151A]">{rev.user.name}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                                Verified Client
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-[#17151A]">{rev.title}</h4>
                        <p className="text-xs text-[#17151A]/70 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#17151A]/60 italic">
                      Be the first connoisseur to review this masterpiece.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8CFA8]/40">
            <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#17151A] mb-8">
              Complementary Masterpieces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
