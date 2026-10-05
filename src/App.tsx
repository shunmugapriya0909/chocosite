import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  X,
  ArrowRight,
  Check,
  SlidersHorizontal,
  MapPin,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  PRODUCTS,
  HERO_IMAGE,
  CRAFT_IMAGE,
  ChocolateProduct,
  ProductVariant,
} from './data/products';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TastingBoxBuilder, CustomBoxCartPayload } from './components/TastingBoxBuilder';
import { CartDrawer, CartItem } from './components/CartDrawer';

type CategoryFilter = 'All' | 'Single-Origin Bars' | 'Ganache Bonbons' | 'Artisanal Bark';
type IntensityFilter = 'all' | 'mild' | 'intense';

export default function App() {
  // Promotional top bar dismissible state
  const [promoDismissed, setPromoDismissed] = useState(false);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [intensityFilter, setIntensityFilter] = useState<IntensityFilter>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Product Detail Modal (PDP)
  const [activeProduct, setActiveProduct] = useState<ChocolateProduct | null>(null);

  // Quick-add feedback state per product ID
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Shopping Bag state (seeded with 1 signature bar so user can also test checkout immediately)
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'sambirano-74__sambirano-80g',
      title: 'Sambirano Valley 74% Grand Cru',
      subtitle: '80g Tasting Tablet · Ambanja, Madagascar',
      price: 16,
      weightGrams: 80,
      quantity: 1,
      image: PRODUCTS[0].image,
    },
  ]);

  // Salon Tasting Reservation state
  const [boutiqueLocation, setBoutiqueLocation] = useState<'Lyon — Rue Auguste Comte' | 'Paris — Saint-Germain'>('Lyon — Rue Auguste Comte');
  const [tastingDate, setTastingDate] = useState('2026-10-10');
  const [tastingTime, setTastingTime] = useState('15:30');
  const [guestCount, setGuestCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [reservationCode, setReservationCode] = useState<string | null>(null);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesIntensity =
        intensityFilter === 'all' ||
        (intensityFilter === 'mild' && product.cacaoPercentage < 72) ||
        (intensityFilter === 'intense' && product.cacaoPercentage >= 72);

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.origin.toLowerCase().includes(q) ||
        product.shortNotes.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesIntensity && matchesSearch;
    });
  }, [selectedCategory, intensityFilter, searchQuery]);

  // Add standard product variant to cart
  const handleAddToCart = (
    product: ChocolateProduct,
    variant: ProductVariant,
    quantity: number
  ) => {
    const cartItemId = `${product.id}__${variant.id}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          title: product.name,
          subtitle: `${variant.label} · ${product.origin}`,
          price: variant.price,
          weightGrams: variant.weightGrams,
          quantity,
          image: product.image,
        },
      ];
    });
  };

  // Quick add default variant from card
  const handleQuickAdd = (e: React.MouseEvent, product: ChocolateProduct) => {
    e.stopPropagation();
    const defaultVariant = product.variants[0];
    handleAddToCart(product, defaultVariant, 1);
    setQuickAddedId(product.id);
    setTimeout(() => {
      setQuickAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  // Add custom composed tasting box to cart
  const handleAddCustomBox = (payload: CustomBoxCartPayload) => {
    const summaryLines = payload.pieces.map(
      (entry) => `${entry.count}× ${entry.piece.name} (${entry.piece.originCacao})`
    );
    if (payload.engravingNote) {
      summaryLines.push(`Card: "${payload.engravingNote}"`);
    }

    const customId = `custom-coffret-${payload.boxSize}-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        cartItemId: customId,
        title: `Bespoke ${payload.boxSize}-Piece Linen Coffret`,
        subtitle: `Custom Atelier Selection · ${payload.weightGrams}g`,
        price: payload.price,
        weightGrams: payload.weightGrams,
        quantity: 1,
        customDetails: summaryLines,
      },
    ]);
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    const code = `SALON-${Math.floor(100 + Math.random() * 899)}`;
    setReservationCode(code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1613]">
      {/* Slim Dismissible Promotional Banner (<= 40px, non-sticky for 15% mobile cap compliance) */}
      {!promoDismissed && (
        <div className="h-9 px-4 bg-[#231712] text-[#F4F1EA] flex items-center justify-between text-xs">
          <div className="w-5" aria-hidden="true" />
          <p className="truncate text-center">
            Complimentary insulated cold-pack express delivery on orders above $85 · Autumn 2026 Single-Estate Harvest
          </p>
          <button
            type="button"
            onClick={() => setPromoDismissed(true)}
            className="p-1 text-[#F4F1EA]/70 hover:text-[#F4F1EA] transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss announcement banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand wordmark | 4 nav links | 2 actions) */}
      <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-xs border-b border-[#1C1613]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-2xl font-semibold tracking-tight text-[#1C1613] whitespace-nowrap shrink-0"
          >
            Maison Valrône
          </a>

          {/* Zone 2: 4 Clean text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#3D332D]"
          >
            <a
              href="#collections"
              className="hover:text-[#1C1613] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              Collections
            </a>
            <a
              href="#tasting-box"
              className="hover:text-[#1C1613] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              Tasting Box
            </a>
            <a
              href="#craftsmanship"
              className="hover:text-[#1C1613] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              Sourcing & Craft
            </a>
            <a
              href="#visitation"
              className="hover:text-[#1C1613] underline-offset-4 hover:underline transition-colors whitespace-nowrap"
            >
              Visitation
            </a>
          </nav>

          {/* Zone 3: 2 Primary Actions (Search Toggle & Shopping Bag) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (!searchOpen) {
                  const el = document.getElementById('collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-2 text-[#1C1613] hover:text-[#8C4A27] transition-colors cursor-pointer"
              aria-label="Toggle catalog search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Tasting Bag</span>
              <span className="font-mono-tabular">({totalCartCount})</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* SECTION 1: Storefront Hero */}
        <section className="relative border-b border-[#1C1613]/10 bg-[#F4F1EA]">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left 6 Cols: Editorial Copy & Single Focal Anchor CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E6259]">
                <span>Lyon 2e Atelier</span>
                <span aria-hidden="true">·</span>
                <span>Direct-Trade Micro-Lots</span>
                <span aria-hidden="true">·</span>
                <span>72-Hour Granite Conching</span>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#1C1613] leading-[1.08] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Single-Harvest Cacao, Tempered on Cool Carrara Marble.
              </h1>

              <p className="text-base text-[#3D332D] leading-relaxed max-w-xl">
                We roast, winnow, and stone-grind rare Criollo and Trinitario cacao beans from
                single-family estates in Madagascar, Venezuela, and Peru—preserving their wild fruit
                acidity with zero soy lecithin or vanilla masking.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#collections"
                  className="px-6 py-3 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-semibold transition-colors inline-flex items-center gap-2.5 whitespace-nowrap"
                >
                  <span>Explore 2026 Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#tasting-box"
                  className="px-5 py-3 border border-[#1C1613]/25 hover:border-[#1C1613] text-[#1C1613] text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  Compose Custom Coffret
                </a>
              </div>

              {/* Quiet Unboxed Origin Specs */}
              <div className="pt-6 border-t border-[#1C1613]/10 grid grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="block text-[#6E6259]">Ingredients</span>
                  <span className="font-semibold text-[#1C1613] mt-0.5 block">
                    Two: Cacao & Cane
                  </span>
                </div>
                <div>
                  <span className="block text-[#6E6259]">Roast Profile</span>
                  <span className="font-mono-tabular font-semibold text-[#1C1613] mt-0.5 block">
                    114°C Slow Drum
                  </span>
                </div>
                <div>
                  <span className="block text-[#6E6259]">Cold-Chain Dispatch</span>
                  <span className="font-semibold text-[#1C1613] mt-0.5 block">
                    Insulated Under 18°C
                  </span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: 16:9 Studio Hero Showcase */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden border border-[#1C1613]/12 bg-[#1C1613]">
                <div className="aspect-16/9 w-full">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="Artisanal single-origin dark chocolate bars and hand-tempered ganache bonbons with gold leaf on dark slate"
                    fallbackTitle="Maison Valrône — Grand Cru"
                    fallbackSubtitle="2026 Single-Estate Harvest"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-5 py-3.5 bg-[#1C1613] text-[#F4F1EA] flex items-center justify-between text-xs">
                  <span>Pictured: Collection Solstice & Sambirano 74% Tablet</span>
                  <span className="font-mono-tabular text-[#C28B53]">Lot #2026-09</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Collection Grid */}
        <section id="collections" className="py-16 md:py-24 max-w-7xl mx-auto px-6">
          {/* Header & Interactive Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1C1613]/10">
            <div>
              <p className="text-xs text-[#8C4A27] font-medium">
                01. Current Cellar Releases
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-semibold text-[#1C1613] mt-1 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Single-Origin Tablets & Ganache Coffrets
              </h2>
            </div>

            {/* Interactive Category Tabs (Functional Buttons) */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F1EA] border border-[#1C1613]/10"
                role="tablist"
                aria-label="Filter confections by category"
              >
                {(
                  [
                    'All',
                    'Single-Origin Bars',
                    'Ganache Bonbons',
                    'Artisanal Bark',
                  ] as CategoryFilter[]
                ).map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#1C1613] text-[#FBFBF9]'
                          : 'text-[#3D332D] hover:text-[#1C1613]'
                      }`}
                    >
                      {cat === 'All' ? 'All Confections' : cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Secondary Filter Bar: Cacao Intensity & Search Input */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-[#6E6259] inline-flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C4A27]" />
                Cacao Intensity:
              </span>
              {[
                { id: 'all', label: 'All Percentages' },
                { id: 'mild', label: '66% – 70% Balanced' },
                { id: 'intense', label: '72% – 82% Grand Noir' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntensityFilter(opt.id as IntensityFilter)}
                  className={`px-2.5 py-1 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    intensityFilter === opt.id
                      ? 'text-[#1C1613] font-semibold underline underline-offset-4 decoration-[#8C4A27]'
                      : 'text-[#6E6259] hover:text-[#1C1613]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            {(searchOpen || searchQuery) && (
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#6E6259] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search origin, note (e.g. fig, hazelnut)..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6259] hover:text-[#1C1613] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3-Column Product Grid (Desktop) / 2-Column (Tablet) */}
          {filteredProducts.length === 0 ? (
            <div className="my-12 p-12 bg-[#F4F1EA] border border-[#1C1613]/10 text-center">
              <p className="font-display text-2xl text-[#1C1613]">
                No confections match your current filter criteria.
              </p>
              <p className="text-xs text-[#6E6259] mt-1">
                Try resetting the cacao percentage filter or searching for another tasting note.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setIntensityFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-[#231712] text-[#FBFBF9] text-xs font-medium hover:bg-[#8C4A27] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const defaultVariant = product.variants[0];
                const isQuickAdded = quickAddedId === product.id;

                return (
                  <article
                    key={product.id}
                    onClick={() => setActiveProduct(product)}
                    className="group bg-[#F4F1EA] border border-[#1C1613]/10 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div>
                      {/* 4:3 Product Image Container */}
                      <div className="aspect-4/3 w-full overflow-hidden bg-[#E9E4DA] border-b border-[#1C1613]/8 relative">
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          objectPosition={product.imagePosition}
                          fallbackTitle={product.name}
                          fallbackSubtitle={product.origin}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </div>

                      {/* Card Body: Identical Field Order & Clean Unboxed Metadata */}
                      <div className="p-6">
                        {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                        <div className="flex items-center justify-between gap-2 text-xs text-[#6E6259]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="uppercase tracking-wider">{product.origin}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {product.cacaoPercentage}% Cacao
                            </span>
                          </div>
                          {product.kickerTag && (
                            <span className="text-[#8C4A27] font-medium shrink-0">
                              {product.kickerTag}
                            </span>
                          )}
                        </div>

                        {/* Product Name (16px SemiBold) & Price (15px Tabular) */}
                        <div className="mt-2 flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-semibold text-[#1C1613] group-hover:text-[#8C4A27] transition-colors">
                            {product.name}
                          </h3>
                          <span className="text-[15px] font-mono-tabular font-semibold text-[#1C1613] shrink-0">
                            ${defaultVariant.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Tasting Notes */}
                        <p className="mt-2 text-xs text-[#3D332D] leading-relaxed">
                          {product.shortNotes}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 pb-6 pt-3 border-t border-[#1C1613]/8 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#6E6259] font-mono-tabular truncate">
                        {defaultVariant.label}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProduct(product);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-[#1C1613] hover:text-[#8C4A27] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Tasting Specs
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                            isQuickAdded
                              ? 'bg-[#2E5A36] text-[#FBFBF9]'
                              : 'bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9]'
                          }`}
                        >
                          {isQuickAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <span>Quick Add</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: Interactive Bespoke Tasting Box Builder */}
        <TastingBoxBuilder onAddCustomBoxToCart={handleAddCustomBox} />

        {/* SECTION 4: Story, Craftsmanship & Claim-to-Proof Adjacency */}
        <section
          id="craftsmanship"
          className="py-16 md:py-24 border-t border-[#1C1613]/10 bg-[#FBFBF9]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left 6 Cols: Documentary Tempering Photography */}
              <div className="lg:col-span-6">
                <div className="overflow-hidden border border-[#1C1613]/12 bg-[#1C1613]">
                  <div className="aspect-16/9 w-full">
                    <ResilientImage
                      src={CRAFT_IMAGE}
                      alt="Master chocolatier tempering glossy dark chocolate ribbons on a Carrara marble slab"
                      fallbackTitle="Carrara Marble Tempering"
                      fallbackSubtitle="Lyon 2e Confiserie Workshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-5 py-3 bg-[#F4F1EA] border-t border-[#1C1613]/10 flex items-center justify-between text-xs text-[#6E6259]">
                    <span>Hand-tempering Batch #418 on Carrara marble at 31.8°C</span>
                    <span className="font-mono-tabular text-[#1C1613]">β-V Crystal Form</span>
                  </div>
                </div>
              </div>

              {/* Right 6 Cols: 3-Step Craft Pillars */}
              <div className="lg:col-span-6 space-y-6">
                <p className="text-xs text-[#8C4A27] font-medium">
                  03. Sourcing & Method
                </p>
                <h2
                  className="font-display text-3xl md:text-4xl font-semibold text-[#1C1613] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Unhurried Bean-to-Bar Architecture
                </h2>
                <p className="text-sm text-[#3D332D] leading-relaxed">
                  Industrial chocolate masks inferior cacao with heavy alcalinization, vanilla
                  extract, and soy emulsifiers. At Maison Valrône, every harvest lot is roasted and
                  conched separately to honor the terroir of the soil.
                </p>

                <div className="space-y-5 pt-2">
                  <div className="border-t border-[#1C1613]/10 pt-4">
                    <h3 className="text-base font-semibold text-[#1C1613]">
                      01. Direct-Trade Post-Harvest Fermentation
                    </h3>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      We partner directly with 14 grower cooperatives across Sambirano, Chuao, and
                      Piura, auditing 5-to-7 day laurel-wood box fermentations at the farm gate.
                    </p>
                  </div>

                  <div className="border-t border-[#1C1613]/10 pt-4">
                    <h3 className="text-base font-semibold text-[#1C1613]">
                      02. 72-Hour Granite Wheel Melangeur
                    </h3>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      Roasted nibs are refined under heavy French granite rollers to a 16-micron
                      particle size, volatilizing harsh acetic acids while preserving delicate floral
                      esters.
                    </p>
                  </div>

                  <div className="border-t border-[#1C1613]/10 pt-4">
                    <h3 className="text-base font-semibold text-[#1C1613]">
                      03. Carrara Marble Table Tempering
                    </h3>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      Every ganache shell and tasting tablet is tempered to form stable Beta-V cocoa
                      butter crystals, producing a mirror sheen and clean acoustic snap.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim-to-Proof Adjacency: Quantitative Rigor + Attributable Testimonial */}
            <div className="mt-16 pt-12 border-t border-[#1C1613]/12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-[#F4F1EA] border border-[#1C1613]/10 flex flex-col justify-between">
                  <span className="font-mono-tabular text-2xl md:text-3xl font-semibold text-[#1C1613]">
                    +42%
                  </span>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#1C1613]">
                      Farm-Gate Premium Paid
                    </p>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      Paid directly above Fair Trade commodity baseline across our 2025–2026 harvest
                      contracts.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F1EA] border border-[#1C1613]/10 flex flex-col justify-between">
                  <span className="font-mono-tabular text-2xl md:text-3xl font-semibold text-[#1C1613]">
                    16 μm
                  </span>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#1C1613]">
                      Granite Refinement Fineness
                    </p>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      Achieved over 60 to 80 hours of stone conching for a silk-smooth melt without
                      added lecithin.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F1EA] border border-[#1C1613]/10 flex flex-col justify-between">
                  <span className="font-mono-tabular text-2xl md:text-3xl font-semibold text-[#1C1613]">
                    &lt; 18°C
                  </span>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#1C1613]">
                      48-Hour Thermal Transit
                    </p>
                    <p className="text-xs text-[#6E6259] mt-1 leading-relaxed">
                      Maintained inside recyclable wool-lined boxes with phase-change cold packs
                      year-round.
                    </p>
                  </div>
                </div>
              </div>

              {/* Attributable Testimonial */}
              <blockquote className="lg:col-span-5 p-6 md:p-8 bg-[#231712] text-[#F4F1EA] flex flex-col justify-between">
                <p className="font-display italic text-lg md:text-xl leading-relaxed text-[#FBFBF9]">
                  “Switching our dessert tasting menu to Maison Valrône’s Sambirano 74% and Chuao
                  82% couvetures reduced our added sugar in plated ganaches by 28% while giving our
                  guests extraordinary natural red-fruit complexity.”
                </p>
                <footer className="mt-6 pt-4 border-t border-[#F4F1EA]/15 text-xs">
                  <strong className="block font-semibold text-[#FBFBF9]">
                    Hélène Vasseur
                  </strong>
                  <span className="text-[#C28B53]">
                    Executive Pastry Chef · Restaurant L’Orangerie, Lyon (Two Michelin Stars)
                  </span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* SECTION 5: Salon Visitation & Tasting Reservation */}
        <section
          id="visitation"
          className="py-16 md:py-20 border-t border-[#1C1613]/10 bg-[#F4F1EA]"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 6 Cols: Atelier Addresses & Hours */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs text-[#8C4A27] font-medium">
                  04. Boutiques & Tasting Salons
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#1C1613] mt-1">
                  Visit Our Salons de Dégustation
                </h2>
                <p className="text-sm text-[#6E6259] mt-2 leading-relaxed">
                  Experience warm drinking chocolate poured from copper pots and guided single-origin
                  flights paired with rare oolong teas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-[#FBFBF9] border border-[#1C1613]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1613]">
                    <MapPin className="w-3.5 h-3.5 text-[#8C4A27]" />
                    <span>Lyon Flagship & Roastery</span>
                  </div>
                  <p className="text-xs text-[#3D332D] leading-relaxed">
                    24 Rue Auguste Comte
                    <br />
                    69002 Lyon, France
                  </p>
                  <p className="text-xs text-[#6E6259] flex items-center gap-1.5 pt-1 font-mono-tabular">
                    <Clock className="w-3.5 h-3.5 text-[#8C4A27]" />
                    <span>Tue–Sun · 10:00 – 19:30</span>
                  </p>
                </div>

                <div className="p-5 bg-[#FBFBF9] border border-[#1C1613]/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1613]">
                    <MapPin className="w-3.5 h-3.5 text-[#8C4A27]" />
                    <span>Paris Left Bank Salon</span>
                  </div>
                  <p className="text-xs text-[#3D332D] leading-relaxed">
                    11 Rue du Cherche-Midi
                    <br />
                    75006 Paris, France
                  </p>
                  <p className="text-xs text-[#6E6259] flex items-center gap-1.5 pt-1 font-mono-tabular">
                    <Clock className="w-3.5 h-3.5 text-[#8C4A27]" />
                    <span>Tue–Sun · 10:30 – 20:00</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Interactive Guided Tasting Reservation */}
            <div className="lg:col-span-6 bg-[#FBFBF9] border border-[#1C1613]/12 p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#1C1613]/10">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#1C1613]">
                    Reserve a Sommelier Cacao Flight
                  </h3>
                  <p className="text-xs text-[#6E6259] mt-0.5">
                    45-minute guided tasting of 5 single-estate harvests & 3 pralinés ($28 / guest)
                  </p>
                </div>
                <Calendar className="w-4 h-4 text-[#8C4A27] shrink-0" />
              </div>

              {reservationCode ? (
                <div className="mt-6 p-5 bg-[#F4F1EA] border border-[#2E5A36]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2E5A36]">
                      Tasting Table Reserved
                    </span>
                    <span className="text-xs font-mono-tabular font-semibold text-[#1C1613]">
                      Ref #{reservationCode}
                    </span>
                  </div>
                  <p className="text-xs text-[#3D332D] leading-relaxed">
                    We look forward to welcoming <strong>{guestName}</strong> ({guestCount}{' '}
                    {guestCount === 1 ? 'guest' : 'guests'}) at{' '}
                    <strong>{boutiqueLocation}</strong> on{' '}
                    <span className="font-mono-tabular">{tastingDate}</span> at{' '}
                    <span className="font-mono-tabular">{tastingTime}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setReservationCode(null)}
                    className="text-xs font-medium text-[#8C4A27] hover:underline cursor-pointer"
                  >
                    Modify or book another session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Boutique Salon
                      </label>
                      <select
                        value={boutiqueLocation}
                        onChange={(e) => setBoutiqueLocation(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                      >
                        <option value="Lyon — Rue Auguste Comte">Lyon — Rue Auguste Comte</option>
                        <option value="Paris — Saint-Germain">Paris — Saint-Germain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Party Size
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] font-mono-tabular focus:outline-none focus:border-[#8C4A27]"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest ($28)' : `Guests ($${n * 28})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tastingDate}
                        onChange={(e) => setTastingDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] font-mono-tabular focus:outline-none focus:border-[#8C4A27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Session Time
                      </label>
                      <select
                        value={tastingTime}
                        onChange={(e) => setTastingTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] font-mono-tabular focus:outline-none focus:border-[#8C4A27]"
                      >
                        <option value="11:30">11:30 Morning Harvest Flight</option>
                        <option value="15:30">15:30 Afternoon Salon Flight</option>
                        <option value="17:30">17:30 Evening Grand Cru Flight</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Julien Moreau"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1613] mb-1">
                        Email for Confirmation *
                      </label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="julien@domaine.fr"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-5 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Confirm Tasting Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer (No Ornamental Footer Engines) */}
      <footer className="bg-[#1C1613] text-[#F4F1EA] border-t border-[#1C1613]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="font-display text-2xl font-semibold tracking-tight text-[#FBFBF9]">
              Maison Valrône
            </span>
            <p className="text-xs text-[#F4F1EA]/70 mt-1">
              Artisanal Bean-to-Bar Chocolatier & Confiserie · Established in Lyon
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#F4F1EA]/80">
            <a href="#collections" className="hover:text-[#FBFBF9] transition-colors">
              Single-Origin Bars
            </a>
            <a href="#tasting-box" className="hover:text-[#FBFBF9] transition-colors">
              Bespoke Coffret
            </a>
            <a href="#craftsmanship" className="hover:text-[#FBFBF9] transition-colors">
              Direct-Trade Report
            </a>
            <a href="#visitation" className="hover:text-[#FBFBF9] transition-colors">
              Lyon & Paris Salons
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="hover:text-[#FBFBF9] transition-colors cursor-pointer"
            >
              Tasting Bag ({totalCartCount})
            </button>
          </div>

          <p className="text-xs text-[#F4F1EA]/60 font-mono-tabular">
            © {new Date().getFullYear()} Maison Valrône SAS. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Contiguous Purchase Module Modal (PDP) */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart & Checkout Verification Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
