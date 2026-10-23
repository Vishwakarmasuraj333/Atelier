import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Atelier Éclat...');

  // Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.storeSetting.deleteMany();

  console.log('🧹 Cleaned existing database tables');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@atelier.com',
      passwordHash: adminPassword,
      name: 'Victoria Vance',
      role: 'ADMIN',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@atelier.com',
      passwordHash: customerPassword,
      name: 'Alexander Wright',
      role: 'CUSTOMER',
      phone: '+1 (555) 782-9912',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'elena.rostova@atelier.com',
      passwordHash: customerPassword,
      name: 'Elena Rostova',
      role: 'CUSTOMER',
      phone: '+1 (555) 441-8890',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('👤 Created Admin and Customer accounts');

  // 2. Saved Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Alexander Wright',
      phone: '+1 (555) 782-9912',
      street: '742 Evergreen Promenade, Suite 400',
      city: 'Beverly Hills',
      state: 'California',
      postalCode: '90210',
      country: 'United States',
      isDefault: true,
    },
  });

  // 3. Categories
  const catWomen = await prisma.category.create({
    data: {
      name: 'Women',
      slug: 'women',
      description: 'Haute couture, silk evening gowns, cashmere essentials and bespoke silhouettes.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 1,
    },
  });

  const catMen = await prisma.category.create({
    data: {
      name: 'Men',
      slug: 'men',
      description: 'Hand-tailored wool blazers, Italian merino knits, and refined wardrobe foundations.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 2,
    },
  });

  const catWatches = await prisma.category.create({
    data: {
      name: 'Electronics & Watches',
      slug: 'electronics-watches',
      description: 'Swiss horology timepieces, artisanal acoustic audio, and titanium smart accessories.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 3,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: 'Beauty & Fragrance',
      slug: 'beauty',
      description: 'Niche eau de parfum, rare botanical elixirs, and restorative night serums.',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 4,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'Home & Living',
      slug: 'home',
      description: 'Sculptural stoneware, travertine accents, and Belgian linen home aesthetics.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 5,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Handcrafted full-grain leather bags, gold vermeil jewelry, and artisanal scarves.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 6,
    },
  });

  const catShoes = await prisma.category.create({
    data: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Goodyear-welted oxford shoes, calfskin ankle boots, and sculptured stiletto heels.',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 7,
    },
  });

  console.log('🏷️ Created 7 Main Luxury Categories');

  // 4. Products Data
  const productsData = [
    {
      name: 'Bespoke Double-Breasted Wool Coat',
      slug: 'bespoke-double-breasted-wool-coat',
      shortDesc: 'Crafted from virgin Italian melton wool with horn buttons and structured lapels.',
      description: 'The archetype of enduring elegance. Cut in a tailored double-breasted profile from heavy virgin Italian wool, this overcoat delivers exceptional thermal insulation with an unmistakable drape. Finished with engraved horn buttons, satin cupro lining, and deep welt pockets.',
      sku: 'ATL-MEN-001',
      brand: 'Atelier Sartorial',
      categoryId: catMen.id,
      price: 890,
      comparePrice: 1150,
      costPrice: 420,
      stock: 18,
      lowStockThreshold: 4,
      isFeatured: true,
      tags: 'Men, Coat, Wool, Luxury, Winter, Outerwear',
      rating: 4.9,
      reviewCount: 28,
      images: [
        { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80', alt: 'Model wearing Charcoal Double-Breasted Wool Coat', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80', alt: 'Coat fabric and lapel details', isPrimary: false, sortOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80', alt: 'Full length lifestyle profile', isPrimary: false, sortOrder: 2 },
      ],
      variants: [
        { sku: 'ATL-MEN-001-CH-38', title: 'Deep Charcoal / 38R', color: 'Charcoal', colorHex: '#1F2421', size: '38R', price: 890, stock: 6 },
        { sku: 'ATL-MEN-001-CH-40', title: 'Deep Charcoal / 40R', color: 'Charcoal', colorHex: '#1F2421', size: '40R', price: 890, stock: 7 },
        { sku: 'ATL-MEN-001-CH-42', title: 'Deep Charcoal / 42R', color: 'Charcoal', colorHex: '#1F2421', size: '42R', price: 890, stock: 5 },
        { sku: 'ATL-MEN-001-BG-40', title: 'Burgundy / 40R', color: 'Burgundy', colorHex: '#641C32', size: '40R', price: 890, stock: 4 },
      ],
    },
    {
      name: 'Aura Silk Charmeuse Bias-Cut Gown',
      slug: 'aura-silk-charmeuse-bias-cut-gown',
      shortDesc: 'Pure 100% 22-momme mulberry silk with fluid drape and delicate open back.',
      description: 'Luminous and effortlessly feminine. The Aura Gown is precision bias-cut from 22-momme mulberry silk charmeuse that skims the silhouette before cascading to a pooled hem. Designed with slender crossover back straps and hand-rolled seam finishes.',
      sku: 'ATL-WOM-001',
      brand: 'Maison Éclat',
      categoryId: catWomen.id,
      price: 740,
      comparePrice: 920,
      costPrice: 310,
      stock: 12,
      lowStockThreshold: 3,
      isFeatured: true,
      tags: 'Women, Dress, Silk, Evening, Champagne, Wedding',
      rating: 5.0,
      reviewCount: 42,
      images: [
        { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80', alt: 'Champagne Silk Evening Gown front view', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80', alt: 'Silk fabric fluid drape close-up', isPrimary: false, sortOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80', alt: 'Studio model portrait in Aura Gown', isPrimary: false, sortOrder: 2 },
      ],
      variants: [
        { sku: 'ATL-WOM-001-CH-XS', title: 'Champagne / XS', color: 'Champagne', colorHex: '#E8CFA8', size: 'XS', price: 740, stock: 3 },
        { sku: 'ATL-WOM-001-CH-S', title: 'Champagne / S', color: 'Champagne', colorHex: '#E8CFA8', size: 'S', price: 740, stock: 4 },
        { sku: 'ATL-WOM-001-CH-M', title: 'Champagne / M', color: 'Champagne', colorHex: '#E8CFA8', size: 'M', price: 740, stock: 3 },
        { sku: 'ATL-WOM-001-RO-S', title: 'Muted Rose / S', color: 'Rose', colorHex: '#B83B5E', size: 'S', price: 740, stock: 2 },
      ],
    },
    {
      name: 'Chronographe Imperial Rose Gold Timepiece',
      slug: 'chronographe-imperial-rose-gold-timepiece',
      shortDesc: 'Automated 72-hour power reserve with sunburst dial and alligator strap.',
      description: 'Exquisite Swiss horology meets contemporary luxury. Housed in an 18k rose gold coated 41mm case, the Chronographe Imperial features a dual-register movement with sapphire crystal exhibition caseback, sunburst champagne dial, and hand-stitched Tuscan calf leather strap.',
      sku: 'ATL-WAT-001',
      brand: 'Horlogerie Royale',
      categoryId: catWatches.id,
      price: 2450,
      comparePrice: 2890,
      costPrice: 1100,
      stock: 8,
      lowStockThreshold: 2,
      isFeatured: true,
      tags: 'Watches, Swiss, Automatic, Rose Gold, Chronograph, Luxury',
      rating: 4.95,
      reviewCount: 19,
      images: [
        { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80', alt: 'Imperial Chronograph watch face in rose gold', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80', alt: 'Side profile and bezel detail', isPrimary: false, sortOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', alt: 'Watch worn on wrist in natural daylight', isPrimary: false, sortOrder: 2 },
      ],
      variants: [
        { sku: 'ATL-WAT-001-RG-41', title: '18k Rose Gold / 41mm', color: 'Rose Gold', colorHex: '#B76E79', size: '41mm', price: 2450, stock: 5 },
        { sku: 'ATL-WAT-001-SS-41', title: 'Brushed Steel / 41mm', color: 'Silver', colorHex: '#C0C0C0', size: '41mm', price: 2150, stock: 3 },
      ],
    },
    {
      name: 'Nuit Velours Extrait de Parfum (100ml)',
      slug: 'nuit-velours-extrait-de-parfum',
      shortDesc: 'Black truffle, Damask rose, warm smoked oud, and bourbon vanilla.',
      description: 'An intoxicating sensory voyage into midnight Paris. Nuit Velours opens with velvety saffron and rare Bulgarian damask rose before unfolding into intoxicating smoked Cambodian oud, dark ambergris, and aged bourbon vanilla. Boasts exceptional 24-hour sillage.',
      sku: 'ATL-BEA-001',
      brand: 'Parfums d’Or',
      categoryId: catBeauty.id,
      price: 320,
      comparePrice: 380,
      costPrice: 95,
      stock: 35,
      lowStockThreshold: 8,
      isFeatured: true,
      tags: 'Perfume, Fragrance, Oud, Rose, Extrait, Niche',
      rating: 4.88,
      reviewCount: 56,
      images: [
        { url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80', alt: 'Nuit Velours heavy crystal flacon', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80', alt: 'Gold atomizer and velvet packaging', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { sku: 'ATL-BEA-001-100ML', title: '100ml Extrait', color: 'Amber Gold', colorHex: '#FFBF00', size: '100ml', price: 320, stock: 25 },
        { sku: 'ATL-BEA-001-50ML', title: '50ml Extrait', color: 'Amber Gold', colorHex: '#FFBF00', size: '50ml', price: 195, stock: 10 },
      ],
    },
    {
      name: 'Saddle Leather Sculpted Tote Bag',
      slug: 'saddle-leather-sculpted-tote-bag',
      shortDesc: 'Full-grain French calfskin with hand-burnished edges and gold hardware.',
      description: 'The pinnacle of leather craftsmanship. Sculpted from vegetable-tanned French calfskin with seamless reinforced base construction. Features a suede-lined interior with dedicated laptop pocket, magnetic clasp closure, and detachable shoulder strap.',
      sku: 'ATL-ACC-001',
      brand: 'Maison Éclat',
      categoryId: catAccessories.id,
      price: 680,
      comparePrice: 850,
      costPrice: 260,
      stock: 14,
      lowStockThreshold: 3,
      isFeatured: true,
      tags: 'Bags, Leather, Handbag, Luxury, Burgundy, Tote',
      rating: 4.92,
      reviewCount: 31,
      images: [
        { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80', alt: 'Burgundy Saddle Leather Tote', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80', alt: 'Gold lock detail and leather grain', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { sku: 'ATL-ACC-001-BG', title: 'Burgundy Crimson', color: 'Burgundy', colorHex: '#641C32', size: 'One Size', price: 680, stock: 8 },
        { sku: 'ATL-ACC-001-CH', title: 'Cognac Saddle', color: 'Cognac', colorHex: '#9E4717', size: 'One Size', price: 680, stock: 6 },
      ],
    },
    {
      name: 'Monolith Travertine Sculptural Table Lamp',
      slug: 'monolith-travertine-sculptural-table-lamp',
      shortDesc: 'Hand-carved solid Roman travertine with linen shade and brass dimmer.',
      description: 'Where sculpture meets ambient luminescence. Honed from an unlacquered block of Roman travertine stone, each Monolith lamp features organic vein patterns that make every piece unique. Topped with a woven oatmeal linen drum shade and warm brass rotary dimmer.',
      sku: 'ATL-HOM-001',
      brand: 'Studio Mineral',
      categoryId: catHome.id,
      price: 520,
      comparePrice: 650,
      costPrice: 200,
      stock: 9,
      lowStockThreshold: 2,
      isFeatured: false,
      tags: 'Home, Decor, Lighting, Travertine, Modern, Lamp',
      rating: 4.79,
      reviewCount: 15,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80', alt: 'Travertine table lamp illuminated on sideboard', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', alt: 'Stone texture and brass rotary switch', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { sku: 'ATL-HOM-001-IV', title: 'Ivory Travertine', color: 'Ivory', colorHex: '#FFF9F3', size: 'Medium (18in)', price: 520, stock: 9 },
      ],
    },
    {
      name: 'Milano Goodyear-Welted Oxford Shoes',
      slug: 'milano-goodyear-welted-oxford-shoes',
      shortDesc: 'Hand-burnished Italian crust calf leather with oak bark tanned leather soles.',
      description: 'Masterfully built on a refined chiseled last. Constructed using traditional Goodyear welting that ensures durability and effortless resoleability. Finished with a rich hand-burnished patina that deepens with wear.',
      sku: 'ATL-SHO-001',
      brand: 'Atelier Sartorial',
      categoryId: catShoes.id,
      price: 590,
      comparePrice: 720,
      costPrice: 240,
      stock: 16,
      lowStockThreshold: 4,
      isFeatured: false,
      tags: 'Shoes, Oxford, Leather, Men, Formal, Handmade',
      rating: 4.96,
      reviewCount: 22,
      images: [
        { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80', alt: 'Burnished brown oxford shoes pair', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80', alt: 'Stitching and sole construction detail', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { sku: 'ATL-SHO-001-BR-41', title: 'Burnished Chestnut / EU 41', color: 'Chestnut', colorHex: '#4A2E18', size: 'EU 41', price: 590, stock: 4 },
        { sku: 'ATL-SHO-001-BR-42', title: 'Burnished Chestnut / EU 42', color: 'Chestnut', colorHex: '#4A2E18', size: 'EU 42', price: 590, stock: 6 },
        { sku: 'ATL-SHO-001-BR-43', title: 'Burnished Chestnut / EU 43', color: 'Chestnut', colorHex: '#4A2E18', size: 'EU 43', price: 590, stock: 4 },
        { sku: 'ATL-SHO-001-BK-42', title: 'Obsidian Black / EU 42', color: 'Black', colorHex: '#17151A', size: 'EU 42', price: 590, stock: 2 },
      ],
    },
    {
      name: 'Cashmere Ribbed Turtleneck Sweater',
      slug: 'cashmere-ribbed-turtleneck-sweater',
      shortDesc: '100% 4-ply Mongolian cashmere with ribbed cuffs and relaxed fit.',
      description: 'Envelop yourself in supreme softness. Spun from long-staple Grade-A Mongolian cashmere fibers that resist pilling and provide unparalleled thermal comfort without weight. Designed with a generous ribbed rollneck and dropped shoulders.',
      sku: 'ATL-WOM-002',
      brand: 'Maison Éclat',
      categoryId: catWomen.id,
      price: 460,
      comparePrice: 580,
      costPrice: 180,
      stock: 22,
      lowStockThreshold: 5,
      isFeatured: true,
      tags: 'Women, Knitwear, Cashmere, Sweater, Winter, Ivory',
      rating: 4.85,
      reviewCount: 37,
      images: [
        { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80', alt: 'Ivory ribbed cashmere sweater worn by model', isPrimary: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80', alt: 'Cashmere texture close up', isPrimary: false, sortOrder: 1 },
      ],
      variants: [
        { sku: 'ATL-WOM-002-IV-S', title: 'Warm Ivory / S', color: 'Ivory', colorHex: '#FFF9F3', size: 'S', price: 460, stock: 8 },
        { sku: 'ATL-WOM-002-IV-M', title: 'Warm Ivory / M', color: 'Ivory', colorHex: '#FFF9F3', size: 'M', price: 460, stock: 9 },
        { sku: 'ATL-WOM-002-IV-L', title: 'Warm Ivory / L', color: 'Ivory', colorHex: '#FFF9F3', size: 'L', price: 460, stock: 5 },
      ],
    },
  ];

  for (const prod of productsData) {
    const { images, variants, ...productFields } = prod;
    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
    });

    // Create Initial Inventory Log
    await prisma.inventoryLog.create({
      data: {
        productId: createdProduct.id,
        quantityChange: productFields.stock,
        previousStock: 0,
        newStock: productFields.stock,
        reason: 'INITIAL_STOCK',
        notes: 'Initial inventory seeding for store launch',
        createdBy: 'admin@atelier.com',
      },
    });

    // Create Sample Reviews for each product
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'Exceptional craftsmanship and bespoke feel',
        comment: 'Exceeded all expectations. The tactile quality, packaging, and attention to detail reflect true haute luxury.',
        isApproved: true,
        isVerifiedPurchase: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customer2.id,
        rating: 5,
        title: 'Timeless piece, worth every penny',
        comment: 'The drape and materials are second to none. Delivered in a pristine linen dustbag within 48 hours.',
        isApproved: true,
        isVerifiedPurchase: true,
      },
    });
  }

  console.log(`✨ Seeded ${productsData.length} Luxury Products with Variants, Images & Reviews`);

  // 5. Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'DEFINE YOUR EVERYDAY',
        subtitle: 'Bespoke silhouettes, rare materials, and timeless design curated for the modern connoisseur.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
        ctaText: 'EXPLORE COLLECTION',
        ctaUrl: '/products',
        position: 'HERO',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'THE SUMMER SILK EDIT',
        subtitle: 'Effortless fluid dresses and fine gauge Italian knits for warm summer evenings.',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1920&q=80',
        ctaText: 'SHOP WOMEN',
        ctaUrl: '/products?category=women',
        position: 'HERO',
        sortOrder: 2,
        isActive: true,
      },
      {
        title: 'HAUTE HORLOGERIE',
        subtitle: 'Swiss precision movements housed in hand-finished rose gold cases.',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
        ctaText: 'DISCOVER TIMEPIECES',
        ctaUrl: '/products?category=electronics-watches',
        position: 'HERO',
        sortOrder: 3,
        isActive: true,
      },
      {
        title: 'ARTISANAL LUXURY MEETS SUSTAINABLE CRAFT',
        subtitle: 'Every garment is numbered and produced in limited runs to ensure unmatched exclusivity.',
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1920&q=80',
        ctaText: 'READ OUR HERITAGE',
        ctaUrl: '/products',
        position: 'EDITORIAL',
        sortOrder: 1,
        isActive: true,
      },
    ],
  });

  console.log('🖼️ Created Homepage Banners');

  // 6. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'LUXE20',
        description: '20% off luxury orders above $500',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscountAmount: 300,
        usageLimit: 100,
        usedCount: 14,
        isActive: true,
      },
      {
        code: 'WELCOME10',
        description: '10% off your inaugural purchase',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 100,
        maxDiscountAmount: 150,
        usageLimit: 500,
        usedCount: 42,
        isActive: true,
      },
      {
        code: 'ATELIER50',
        description: '$50 off luxury accessories and perfumes',
        discountType: 'FIXED',
        discountValue: 50,
        minOrderAmount: 250,
        usageLimit: 50,
        usedCount: 8,
        isActive: true,
      },
    ],
  });

  console.log('🎟️ Created Coupons (LUXE20, WELCOME10, ATELIER50)');

  // 7. Seed Sample Orders for Analytics & History
  const firstProduct = await prisma.product.findFirst({ where: { slug: 'bespoke-double-breasted-wool-coat' } });
  const secondProduct = await prisma.product.findFirst({ where: { slug: 'aura-silk-charmeuse-bias-cut-gown' } });

  if (firstProduct && secondProduct) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'ATL-2026-98124',
        userId: customer.id,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'RAZORPAY',
        subtotal: 890,
        discount: 0,
        tax: 71.2,
        shippingFee: 0,
        grandTotal: 961.2,
        shippingAddressId: address1.id,
        trackingNumber: 'ATELIER-FEDEX-92837492',
        notes: 'Please leave in concierge reception.',
        addressSnapshot: JSON.stringify(address1),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        items: {
          create: [
            {
              productId: firstProduct.id,
              title: firstProduct.name,
              price: 890,
              quantity: 1,
              total: 890,
              image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
            },
          ],
        },
        statusHistory: {
          create: [
            { status: 'PENDING', comment: 'Order placed by client.' },
            { status: 'CONFIRMED', comment: 'Payment verified via Razorpay.' },
            { status: 'PROCESSING', comment: 'Garment inspected and hand-packaged.' },
            { status: 'SHIPPED', comment: 'Handed to FedEx Express Priority.' },
            { status: 'DELIVERED', comment: 'Delivered and signed by client.' },
          ],
        },
        payment: {
          create: {
            provider: 'RAZORPAY',
            razorpayOrderId: 'order_Nx8294719283',
            razorpayPaymentId: 'pay_Nx8294719283_succ',
            razorpaySignature: 'sig_mock_signature_verified_091823',
            amount: 961.2,
            currency: 'USD',
            status: 'PAID',
          },
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: 'ATL-2026-98125',
        userId: customer2.id,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        paymentMethod: 'RAZORPAY',
        subtotal: 740,
        discount: 74, // WELCOME10
        couponCode: 'WELCOME10',
        tax: 53.28,
        shippingFee: 0,
        grandTotal: 719.28,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday
        items: {
          create: [
            {
              productId: secondProduct.id,
              title: secondProduct.name,
              price: 740,
              quantity: 1,
              total: 740,
              image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
            },
          ],
        },
        statusHistory: {
          create: [
            { status: 'PENDING', comment: 'Order placed by client.' },
            { status: 'CONFIRMED', comment: 'Payment verified via Razorpay.' },
            { status: 'PROCESSING', comment: 'Artisans packaging garment with silk ribbons.' },
          ],
        },
        payment: {
          create: {
            provider: 'RAZORPAY',
            razorpayOrderId: 'order_Kx1192847192',
            razorpayPaymentId: 'pay_Kx1192847192_succ',
            razorpaySignature: 'sig_mock_signature_verified_123984',
            amount: 719.28,
            currency: 'USD',
            status: 'PAID',
          },
        },
      },
    });
  }

  // 8. Notifications
  await prisma.notification.createMany({
    data: [
      {
        type: 'ORDER_CREATED',
        title: 'New High-Value Order',
        message: 'Alexander Wright placed Order #ATL-2026-98124 for $961.20',
        link: '/admin/orders',
      },
      {
        type: 'LOW_STOCK',
        title: 'Inventory Alert',
        message: 'Monolith Travertine Table Lamp is down to 2 units remaining in stock.',
        link: '/admin/inventory',
      },
      {
        type: 'NEW_REVIEW',
        title: '5-Star Review Received',
        message: 'Elena Rostova left a glowing 5-star review for Aura Silk Charmeuse Bias-Cut Gown.',
        link: '/admin/reviews',
      },
    ],
  });

  // 9. Store Settings
  await prisma.storeSetting.createMany({
    data: [
      { key: 'STORE_NAME', value: 'Atelier Éclat', group: 'GENERAL' },
      { key: 'STORE_TAGLINE', value: 'High Luxury Fashion & Horology', group: 'GENERAL' },
      { key: 'CURRENCY', value: 'USD', group: 'PAYMENT' },
      { key: 'TAX_RATE', value: '8.0', group: 'PAYMENT' },
      { key: 'FREE_SHIPPING_THRESHOLD', value: '300', group: 'SHIPPING' },
      { key: 'CONTACT_EMAIL', value: 'concierge@atelier-eclat.com', group: 'GENERAL' },
      { key: 'SUPPORT_PHONE', value: '+1 (800) 892-LUXE', group: 'GENERAL' },
    ],
  });

  // 10. Audit Log
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'SYSTEM_INITIALIZATION',
      entity: 'Store',
      entityId: 'global',
      details: JSON.stringify({ message: 'Atelier Éclat database seeded with luxury catalog and settings' }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Database successfully seeded with 100% complete real relational data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
