import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { ChocolateProduct, ProductVariant } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: ChocolateProduct | null;
  onClose: () => void;
  onAddToCart: (product: ChocolateProduct, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product || !selectedVariant) return null;

  const handleBuy = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1613]/65 backdrop-blur-xs p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FBFBF9] border border-[#1C1613]/15 rounded-none md:rounded-md overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1C1613]/10 bg-[#F4F1EA]">
          <div className="flex items-center gap-2 text-xs text-[#6E6259]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.origin}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{product.cacaoPercentage}% Cacao</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#1C1613]/70 hover:text-[#1C1613] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8C4A27]"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Split Content: Sticky Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Column: Visual Gallery & Origin Specs */}
          <div className="lg:col-span-6 p-6 md:p-8 bg-[#F4F1EA]/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1C1613]/10">
            <div>
              <div className="aspect-4/3 w-full overflow-hidden bg-[#E9E4DA] border border-[#1C1613]/8">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  objectPosition={product.imagePosition}
                  fallbackTitle={product.name}
                  fallbackSubtitle={product.origin}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sensory Tasting Architecture */}
              <div className="mt-6 pt-6 border-t border-[#1C1613]/10">
                <h4 className="text-xs font-semibold text-[#1C1613] mb-3">
                  Sensory Tasting Profile
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Cacao Intensity', score: product.tastingMetrics.bitterness },
                    { label: 'Fruit Acidity', score: product.tastingMetrics.fruitAcidity },
                    { label: 'Roast Depth', score: product.tastingMetrics.roastDepth },
                    { label: 'Sweetness', score: product.tastingMetrics.sweetness },
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#6E6259]">{metric.label}</span>
                        <span className="font-mono-tabular text-[#1C1613]">
                          {metric.score}/5
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1C1613]/10 overflow-hidden">
                        <div
                          className="h-full bg-[#8C4A27] transition-transform duration-150 origin-left"
                          style={{ transform: `scaleX(${metric.score / 5})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traceability & Batch Telemetry */}
            <div className="mt-6 pt-6 border-t border-[#1C1613]/10 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block text-[#6E6259]">Fermentation</span>
                <span className="font-mono-tabular font-medium text-[#1C1613] mt-0.5 block">
                  {product.fermentationDays} Days Box
                </span>
              </div>
              <div>
                <span className="block text-[#6E6259]">Granite Conche</span>
                <span className="font-mono-tabular font-medium text-[#1C1613] mt-0.5 block">
                  {product.conchingHours} Hours
                </span>
              </div>
              <div>
                <span className="block text-[#6E6259]">Elevation</span>
                <span className="font-mono-tabular font-medium text-[#1C1613] mt-0.5 block">
                  {product.estateElevation}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Kicker & Title */}
              {product.kickerTag && (
                <p className="text-xs font-medium text-[#8C4A27] mb-1">
                  {product.kickerTag}
                </p>
              )}
              <h2
                id="pdp-modal-title"
                className="font-display text-2xl md:text-3xl font-semibold text-[#1C1613] tracking-tight"
              >
                {product.name}
              </h2>

              {/* Price & Availability Row */}
              <div className="mt-3 flex items-baseline justify-between pb-5 border-b border-[#1C1613]/10">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold font-mono-tabular text-[#1C1613]">
                    ${(selectedVariant.price * quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-[#6E6259] font-mono-tabular">
                    (${selectedVariant.price.toFixed(2)} / {selectedVariant.weightGrams}g)
                  </span>
                </div>
                <span className="text-xs text-[#2E5A36] font-medium">
                  In Stock · Ships Cold-Packed
                </span>
              </div>

              {/* Tasting Notes & Description */}
              <div className="mt-5">
                <p className="text-xs text-[#6E6259]">
                  Tasting Notes:{' '}
                  <span className="text-[#1C1613] font-medium">{product.shortNotes}</span>
                </p>
                <p className="mt-3 text-sm text-[#3D332D] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variant Selector */}
              <div className="mt-6">
                <label className="block text-xs font-semibold text-[#1C1613] mb-2">
                  Select Format & Weight
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between px-4 py-2.5 text-left text-xs border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#8C4A27] bg-[#8C4A27]/8 text-[#1C1613] font-semibold'
                            : 'border-[#1C1613]/15 bg-white text-[#3D332D] hover:border-[#1C1613]/35'
                        }`}
                      >
                        <span className="whitespace-nowrap truncate">{variant.label}</span>
                        <span className="font-mono-tabular ml-3 shrink-0">
                          ${variant.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/*Quantity & Primary CTA */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center border border-[#1C1613]/20 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-[#1C1613] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-mono-tabular font-medium text-[#1C1613]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-[#1C1613] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuy}
                  className="flex-1 py-2.5 px-5 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Tasting Bag</span>
                    </>
                  ) : (
                    <span>
                      Add to Bag · ${(selectedVariant.price * quantity).toFixed(2)}
                    </span>
                  )}
                </button>
              </div>

              {/* Sommelier Pairings & Ingredients */}
              <div className="mt-6 pt-5 border-t border-[#1C1613]/10 space-y-3 text-xs">
                <div>
                  <span className="text-[#6E6259]">Sommelier Pairings: </span>
                  <span className="text-[#1C1613] font-medium">
                    {product.pairings.join(' · ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#6E6259]">Ingredients: </span>
                  <span className="text-[#3D332D]">{product.ingredients}</span>
                </div>
                <div>
                  <span className="text-[#6E6259]">Allergen Notice: </span>
                  <span className="text-[#3D332D]">{product.allergens}</span>
                </div>
              </div>
            </div>

            {/* Cold Chain Guarantee Footer */}
            <div className="mt-6 pt-4 border-t border-[#1C1613]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6259]">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8C4A27]" />
                Insulated Eutectic Cold-Pack Included
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C4A27]" />
                100% Direct-Trade Cacao Traceability
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
