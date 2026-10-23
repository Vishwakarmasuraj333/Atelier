import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

async function getOrCreateCart(req: NextRequest) {
  const user = await getCurrentUser();
  const sessionId = req.cookies.get('atelier_cart_session')?.value || `guest_${Math.random().toString(36).substring(2, 15)}`;

  let cart = null;

  if (user) {
    cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
              },
              variant: true,
            },
          },
        },
      });
    }
  } else {
    cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
              },
              variant: true,
            },
          },
        },
      });
    }
  }

  return { cart, sessionId };
}

export async function GET(req: NextRequest) {
  try {
    const { cart, sessionId } = await getOrCreateCart(req);

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    const response = NextResponse.json({
      cart: {
        ...cart,
        subtotal,
        totalItems,
      },
    });

    if (!req.cookies.get('atelier_cart_session')) {
      response.cookies.set('atelier_cart_session', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cart, sessionId } = await getOrCreateCart(req);
    const body = await req.json();
    const { productId, variantId, quantity = 1 } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 });
    }

    // Determine variant and effective price
    let effectivePrice = product.price;
    let availableStock = product.stock;

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        effectivePrice = variant.price || product.price;
        availableStock = variant.stock;
      }
    }

    if (availableStock < quantity) {
      return NextResponse.json({ error: `Only ${availableStock} units available in stock` }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > availableStock) {
        return NextResponse.json({ error: `Cannot add more than ${availableStock} items` }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
          price: effectivePrice,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    const subtotal = updatedCart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const totalItems = updatedCart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const response = NextResponse.json({
      success: true,
      message: 'Item added to luxury cart',
      cart: { ...updatedCart, subtotal, totalItems },
    });

    if (!req.cookies.get('atelier_cart_session')) {
      response.cookies.set('atelier_cart_session', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to add to cart' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { cart } = await getOrCreateCart(req);
    const { itemId, quantity } = await req.json();

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    } else {
      const item = await prisma.cartItem.findFirst({
        where: { id: itemId, cartId: cart.id },
        include: { product: true, variant: true },
      });

      if (!item) {
        return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
      }

      const availableStock = item.variant ? item.variant.stock : item.product.stock;
      if (quantity > availableStock) {
        return NextResponse.json({ error: `Only ${availableStock} items in stock` }, { status: 400 });
      }

      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });

    const subtotal = updatedCart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const totalItems = updatedCart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return NextResponse.json({
      success: true,
      cart: { ...updatedCart, subtotal, totalItems },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update item' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { cart } = await getOrCreateCart(req);
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (itemId) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId, cartId: cart.id },
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete item' }, { status: 400 });
  }
}
