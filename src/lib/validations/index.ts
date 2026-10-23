import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDesc: z.string().optional(),
  sku: z.string().min(2, 'SKU is required'),
  brand: z.string().default('Atelier'),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  costPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  lowStockThreshold: z.coerce.number().int().default(5),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.string().optional(),
  images: z.array(
    z.object({
      url: z.string().url('Invalid image URL'),
      alt: z.string().optional(),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number().default(0),
    })
  ).min(1, 'At least one product image is required'),
  variants: z.array(
    z.object({
      sku: z.string(),
      title: z.string(),
      color: z.string().optional().nullable(),
      colorHex: z.string().optional().nullable(),
      size: z.string().optional().nullable(),
      price: z.coerce.number().optional().nullable(),
      stock: z.coerce.number().int().nonnegative().default(0),
    })
  ).optional().default([]),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const CouponSchema = z.object({
  code: z.string().min(2, 'Coupon code is required').toUpperCase(),
  description: z.string().optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discountValue: z.coerce.number().positive('Discount value must be greater than 0'),
  minOrderAmount: z.coerce.number().nonnegative().default(0),
  maxDiscountAmount: z.coerce.number().positive().optional().nullable(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  perUserLimit: z.coerce.number().int().positive().default(1),
  isActive: z.boolean().default(true),
});

export const ReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(2, 'Title is required'),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

export const BannerSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional().nullable(),
  image: z.string().url('Invalid image URL'),
  mobileImage: z.string().url().optional().nullable(),
  ctaText: z.string().default('Explore Collection'),
  ctaUrl: z.string().default('/products'),
  position: z.string().default('HERO'),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().default('United States'),
  paymentMethod: z.enum(['RAZORPAY', 'COD']).default('COD'),
  couponCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional().nullable(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ).min(1, 'Cart cannot be empty'),
});
