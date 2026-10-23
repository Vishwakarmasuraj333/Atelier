import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CheckoutSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isAdminView = searchParams.get('admin') === 'true' && user.role === 'ADMIN';
    const status = searchParams.get('status');

    const where: any = {};
    if (!isAdminView) {
      where.userId = user.id;
    }
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, brand: true },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
        payment: true,
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const data = CheckoutSchema.parse(body);

    // Calculate subtotal from real database prices
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
          variants: true,
        },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product not available` },
          { status: 400 }
        );
      }

      let price = product.price;
      let title = product.name;
      let stock = product.stock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          price = variant.price || product.price;
          title = `${product.name} (${variant.title})`;
          stock = variant.stock;
        }
      }

      if (stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${title}". Only ${stock} units remaining.` },
          { status: 400 }
        );
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        title,
        price,
        quantity: item.quantity,
        total: itemTotal,
        image: product.images[0]?.url || '',
      });
    }

    // Coupon discount verification
    let discount = 0;
    let couponRecord = null;

    if (data.couponCode) {
      couponRecord = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (couponRecord && couponRecord.isActive && subtotal >= couponRecord.minOrderAmount) {
        if (couponRecord.discountType === 'PERCENTAGE') {
          discount = (subtotal * couponRecord.discountValue) / 100;
          if (couponRecord.maxDiscountAmount && discount > couponRecord.maxDiscountAmount) {
            discount = couponRecord.maxDiscountAmount;
          }
        } else {
          discount = Math.min(couponRecord.discountValue, subtotal);
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100; // 8% luxury sales tax
    const shippingFee = discountedSubtotal > 300 ? 0 : 35; // Free shipping over $300
    const grandTotal = Math.round((discountedSubtotal + tax + shippingFee) * 100) / 100;

    // Determine customer or auto create customer for guest checkout
    let finalUserId = user?.id;
    if (!finalUserId) {
      let guestUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });

      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            email: data.email.toLowerCase(),
            name: data.fullName,
            passwordHash: 'guest_guest_no_login_needed',
            phone: data.phone,
            role: 'CUSTOMER',
          },
        });
      }
      finalUserId = guestUser.id;
    }

    // Save or update address
    const address = await prisma.address.create({
      data: {
        userId: finalUserId,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
      },
    });

    const orderNumber = `ATL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order with Transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: finalUserId,
          status: 'PENDING',
          paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          paymentMethod: data.paymentMethod,
          subtotal,
          discount,
          tax,
          shippingFee,
          grandTotal,
          couponCode: data.couponCode || null,
          notes: data.notes || null,
          shippingAddressId: address.id,
          addressSnapshot: JSON.stringify(address),
          items: {
            create: validatedItems,
          },
          statusHistory: {
            create: [
              {
                status: 'PENDING',
                comment: `Order placed via ${data.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Secure Checkout'}.`,
              },
            ],
          },
          payment: {
            create: {
              provider: data.paymentMethod,
              amount: grandTotal,
              currency: 'USD',
              status: 'PENDING',
            },
          },
        },
        include: {
          items: true,
          payment: true,
        },
      });

      // Update coupon usage
      if (couponRecord) {
        await tx.coupon.update({
          where: { id: couponRecord.id },
          data: { usedCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId: couponRecord.id,
            userId: finalUserId,
            orderId: newOrder.id,
            discountAmount: discount,
          },
        });
      }

      // Decrement stock and write inventory logs
      for (const item of data.items) {
        if (item.variantId) {
          const v = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });

          await tx.inventoryLog.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              quantityChange: -item.quantity,
              previousStock: v.stock + item.quantity,
              newStock: v.stock,
              reason: 'ORDER_FULFILLMENT',
              notes: `Order #${orderNumber}`,
            },
          });
        }

        const p = await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            quantityChange: -item.quantity,
            previousStock: p.stock + item.quantity,
            newStock: p.stock,
            reason: 'ORDER_FULFILLMENT',
            notes: `Order #${orderNumber}`,
          },
        });
      }

      // Clear user's cart if any
      if (user) {
        const userCart = await tx.cart.findUnique({ where: { userId: user.id } });
        if (userCart) {
          await tx.cartItem.deleteMany({ where: { cartId: userCart.id } });
        }
      }

      // Dispatch Admin Notification
      await tx.notification.create({
        data: {
          type: 'ORDER_CREATED',
          title: `New Order #${orderNumber}`,
          message: `${data.fullName} placed an order for $${grandTotal.toFixed(2)} (${data.paymentMethod})`,
          link: `/admin/orders`,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to place order' }, { status: 400 });
  }
}
