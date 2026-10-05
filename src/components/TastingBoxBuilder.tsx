import React, { useState } from 'react';
import { Plus, Trash2, Check, Sparkles, RotateCcw } from 'lucide-react';
import { BONBON_PALETTE, BonbonPiece } from '../data/products';

export interface CustomBoxCartPayload {
  boxSize: 9 | 16;
  price: number;
  weightGrams: number;
  pieces: { piece: BonbonPiece; count: number }[];
  engravingNote: string;
}

interface TastingBoxBuilderProps {
  onAddCustomBoxToCart: (payload: CustomBoxCartPayload) => void;
}

export const TastingBoxBuilder: React.FC<TastingBoxBuilderProps> = ({
  onAddCustomBoxToCart,
}) => {
  const [boxSize, setBoxSize] = useState<9 | 16>(9);
  const [selectedPieces, setSelectedPieces] = useState<BonbonPiece[]>([
    BONBON_PALETTE[0],
    BONBON_PALETTE[1],
    BONBON_PALETTE[2],
    BONBON_PALETTE[3],
    BONBON_PALETTE[4],
    BONBON_PALETTE[5],
  ]);
  const [engravingNote, setEngravingNote] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const boxPrice = boxSize === 9 ? 36 : 58;
  const boxWeight = boxSize === 9 ? 115 : 205;
  const remainingSlots = boxSize - selectedPieces.length;

  const handleSelectSize = (size: 9 | 16) => {
    setBoxSize(size);
    if (selectedPieces.length > size) {
      setSelectedPieces((prev) => prev.slice(0, size));
    }
  };

  const handleAddPiece = (piece: BonbonPiece) => {
    if (selectedPieces.length >= boxSize) return;
    setSelectedPieces((prev) => [...prev, piece]);
  };

  const handleRemoveSlot = (index: number) => {
    setSelectedPieces((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFillSommelierPreset = (preset: 'dark' | 'praline' | 'balanced') => {
    const filled: BonbonPiece[] = [];
    const pool =
      preset === 'dark'
        ? [BONBON_PALETTE[1], BONBON_PALETTE[3], BONBON_PALETTE[5]]
        : preset === 'praline'
        ? [BONBON_PALETTE[0], BONBON_PALETTE[2], BONBON_PALETTE[4]]
        : BONBON_PALETTE;

    for (let i = 0; i < boxSize; i++) {
      filled.push(pool[i % pool.length]);
    }
    setSelectedPieces(filled);
  };

  const handleAddBoxToBag = () => {
    if (selectedPieces.length < boxSize) return;

    const groupedMap = new Map<string, { piece: BonbonPiece; count: number }>();
    for (const p of selectedPieces) {
      const existing = groupedMap.get(p.id);
      if (existing) {
        existing.count += 1;
      } else {
        groupedMap.set(p.id, { piece: p, count: 1 });
      }
    }

    onAddCustomBoxToCart({
      boxSize,
      price: boxPrice,
      weightGrams: boxWeight,
      pieces: Array.from(groupedMap.values()),
      engravingNote: engravingNote.trim(),
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  const avgCacao =
    selectedPieces.length > 0
      ? Math.round(
          selectedPieces.reduce((acc, item) => acc + item.cacaoPercentage, 0) /
            selectedPieces.length
        )
      : 0;

  return (
    <section
      id="tasting-box"
      className="py-16 md:py-24 border-t border-[#1C1613]/10 bg-[#F4F1EA]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#1C1613]/10">
          <div>
            <p className="text-xs text-[#8C4A27] font-medium">
              02. Bespoke Confiserie Atelier
            </p>
            <h2
              className="font-display text-3xl md:text-4xl font-semibold text-[#1C1613] mt-1 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Compose Your Linen Tasting Coffret
            </h2>
            <p className="text-sm text-[#6E6259] mt-2 max-w-2xl">
              Select individual hand-tempered ganaches and stone-milled pralinés to fill your custom
              keepsake box, or apply a sommelier flight below.
            </p>
          </div>

          {/* Box Size Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-[#E7E2D8] border border-[#1C1613]/10 self-start">
            <button
              type="button"
              onClick={() => handleSelectSize(9)}
              className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                boxSize === 9
                  ? 'bg-[#1C1613] text-[#FBFBF9]'
                  : 'text-[#3D332D] hover:text-[#1C1613]'
              }`}
            >
              9-Piece Box · $36
            </button>
            <button
              type="button"
              onClick={() => handleSelectSize(16)}
              className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                boxSize === 16
                  ? 'bg-[#1C1613] text-[#FBFBF9]'
                  : 'text-[#3D332D] hover:text-[#1C1613]'
              }`}
            >
              16-Piece Salon Box · $58
            </button>
          </div>
        </div>

        {/* Main Interactive Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Cols: Available Bonbon Palette */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#1C1613]">
                Select Bonbons to Add ({selectedPieces.length}/{boxSize} Slots Filled)
              </span>

              {/* Quick Sommelier Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillSommelierPreset('balanced')}
                  className="px-3 py-1.5 text-xs border border-[#1C1613]/15 bg-[#FBFBF9] hover:border-[#8C4A27] text-[#1C1613] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Auto-Fill Balanced Flight
                </button>
                <button
                  type="button"
                  onClick={() => handleFillSommelierPreset('dark')}
                  className="px-3 py-1.5 text-xs border border-[#1C1613]/15 bg-[#FBFBF9] hover:border-[#8C4A27] text-[#1C1613] transition-colors cursor-pointer whitespace-nowrap"
                >
                  70%+ Noir Flight
                </button>
                <button
                  type="button"
                  onClick={() => handleFillSommelierPreset('praline')}
                  className="px-3 py-1.5 text-xs border border-[#1C1613]/15 bg-[#FBFBF9] hover:border-[#8C4A27] text-[#1C1613] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Nut Praliné Flight
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BONBON_PALETTE.map((bonbon) => {
                const countInBox = selectedPieces.filter((p) => p.id === bonbon.id).length;
                const isFull = selectedPieces.length >= boxSize;
                return (
                  <div
                    key={bonbon.id}
                    className="p-4 bg-[#FBFBF9] border border-[#1C1613]/10 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Visual Bonbon Swatch */}
                      <div
                        className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center shadow-xs border-2"
                        style={{
                          backgroundColor: bonbon.colorSwatch,
                          borderColor: bonbon.accentRing,
                        }}
                        aria-hidden="true"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full opacity-80"
                          style={{ backgroundColor: bonbon.accentRing }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#1C1613] truncate">
                            {bonbon.name}
                          </h3>
                          {countInBox > 0 && (
                            <span className="text-xs font-mono-tabular font-semibold text-[#8C4A27] shrink-0">
                              ×{countInBox}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6E6259] mt-0.5">
                          {bonbon.originCacao} · {bonbon.shellType}
                        </p>
                        <p className="text-xs text-[#3D332D] mt-1.5 leading-relaxed">
                          {bonbon.notes}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => handleAddPiece(bonbon)}
                      className={`w-full py-2 px-3 text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        isFull
                          ? 'border-[#1C1613]/10 bg-[#F4F1EA] text-[#6E6259]/60 cursor-not-allowed'
                          : 'border-[#1C1613]/20 bg-white hover:bg-[#231712] hover:text-[#FBFBF9] text-[#1C1613] cursor-pointer'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isFull ? 'Coffret Full' : 'Add Piece to Box'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Visual Coffret Tray & Summary */}
          <div className="lg:col-span-5 bg-[#FBFBF9] border border-[#1C1613]/12 p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#1C1613]/10">
              <div>
                <h3 className="font-display text-xl font-semibold text-[#1C1613]">
                  Your {boxSize}-Piece Linen Coffret
                </h3>
                <p className="text-xs text-[#6E6259] mt-0.5 font-mono-tabular">
                  Net Weight {boxWeight}g · Mean Cacao {avgCacao}%
                </p>
              </div>
              {selectedPieces.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedPieces([])}
                  className="text-xs text-[#6E6259] hover:text-[#1C1613] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Interactive Compartment Grid */}
            <div
              className={`mt-6 grid gap-2.5 p-4 bg-[#F4F1EA] border border-[#1C1613]/15 ${
                boxSize === 9 ? 'grid-cols-3' : 'grid-cols-4'
              }`}
            >
              {Array.from({ length: boxSize }).map((_, idx) => {
                const piece = selectedPieces[idx];
                return (
                  <div
                    key={idx}
                    className="aspect-square bg-[#E9E4DA] border border-[#1C1613]/10 flex flex-col items-center justify-center p-1.5 relative group"
                  >
                    {piece ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(idx)}
                        title={`Remove ${piece.name}`}
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-transform duration-150 group-hover:scale-95"
                          style={{
                            backgroundColor: piece.colorSwatch,
                            borderColor: piece.accentRing,
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#FBFBF9] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] text-[#1C1613] font-medium truncate w-full text-center mt-1">
                          {piece.name.split(' ')[0]}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono-tabular text-[#6E6259]/60">
                        #{idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Optional Wax-Sealed Gift Card Note */}
            <div className="mt-5">
              <label
                htmlFor="coffret-gift-note"
                className="block text-xs font-medium text-[#1C1613] mb-1.5"
              >
                Complimentary Calligraphy Enclosure Card (Optional)
              </label>
              <input
                id="coffret-gift-note"
                type="text"
                maxLength={70}
                value={engravingNote}
                onChange={(e) => setEngravingNote(e.target.value)}
                placeholder="e.g., Joyeux Anniversaire, Élise — Avec amour"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#1C1613]/15 text-[#1C1613] placeholder:text-[#6E6259]/60 focus:outline-none focus:border-[#8C4A27]"
              />
            </div>

            {/* Status & CTA */}
            <div className="mt-6 pt-5 border-t border-[#1C1613]/10">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-[#6E6259]">
                  {remainingSlots === 0
                    ? 'Coffret complete and ready to seal'
                    : `Select ${remainingSlots} more ${
                        remainingSlots === 1 ? 'bonbon' : 'bonbons'
                      } to complete box`}
                </span>
                <span className="text-base font-semibold font-mono-tabular text-[#1C1613]">
                  ${boxPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                disabled={remainingSlots > 0}
                onClick={handleAddBoxToBag}
                className={`w-full py-3 px-5 text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  remainingSlots > 0
                    ? 'bg-[#1C1613]/15 text-[#6E6259] cursor-not-allowed'
                    : 'bg-[#8C4A27] hover:bg-[#231712] text-[#FBFBF9] cursor-pointer'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Custom Coffret Added to Bag</span>
                  </>
                ) : remainingSlots > 0 ? (
                  <span>Add {remainingSlots} More to Complete Coffret</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Add Custom {boxSize}-Piece Coffret · ${boxPrice.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
