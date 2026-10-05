import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, ArrowRight, Truck } from 'lucide-react';

export interface CartItem {
  cartItemId: string;
  title: string;
  subtitle: string;
  price: number;
  weightGrams: number;
  quantity: number;
  image?: string;
  customDetails?: string[];
}

interface OrderReceipt {
  orderNumber: string;
  timestamp: string;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'cod' | 'card';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 85;
const COLD_PACK_SHIPPING_FEE = 12;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = items.length === 0 ? 0 : qualifiesFreeShipping ? 0 : COLD_PACK_SHIPPING_FEE;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete all recipient verification fields for cold-chain delivery.');
      return;
    }

    setFormError('');
    const newReceipt: OrderReceipt = {
      orderNumber: `MV-${Math.floor(1040 + Math.random() * 8900)}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...items],
      subtotal,
      shipping,
      total,
    };

    setReceipt(newReceipt);
    onClearCart();
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setReceipt(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1C1613]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-md bg-[#FBFBF9] h-full flex flex-col justify-between border-l border-[#1C1613]/15 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <div className="px-6 py-4 bg-[#F4F1EA] border-b border-[#1C1613]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#8C4A27]" />
            <h2 className="font-display text-xl font-semibold text-[#1C1613]">
              {step === 'cart' && 'Your Tasting Bag'}
              {step === 'checkout' && 'Cold-Chain Dispatch & Payment'}
              {step === 'confirmed' && 'Order Verification'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 text-[#6E6259] hover:text-[#1C1613] transition-colors cursor-pointer"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar (when in cart/checkout) */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-3 bg-[#F4F1EA]/50 border-b border-[#1C1613]/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#3D332D] inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8C4A27]" />
                {qualifiesFreeShipping ? (
                  <span className="font-medium text-[#2E5A36]">
                    Complimentary Express Cold-Pack Shipping Unlocked
                  </span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="font-mono-tabular text-[#1C1613]">
                      ${amountToFreeShipping.toFixed(2)}
                    </strong>{' '}
                    for complimentary cold-pack delivery
                  </span>
                )}
              </span>
              <span className="font-mono-tabular text-[#6E6259]">
                ${FREE_SHIPPING_THRESHOLD}
              </span>
            </div>
            <div className="mt-2 h-1 w-full bg-[#1C1613]/10 overflow-hidden">
              <div
                className="h-full bg-[#8C4A27] transition-transform duration-150 origin-left"
                style={{
                  transform: `scaleX(${Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD)})`,
                }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-[#6E6259]/50 mb-3 stroke-[1.25]" />
                  <p className="font-display text-xl text-[#1C1613]">
                    Your Tasting Bag is Empty
                  </p>
                  <p className="text-xs text-[#6E6259] mt-1 max-w-xs leading-relaxed">
                    Explore our single-origin harvest bars or compose a custom 9-piece linen
                    coffret.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 px-5 py-2.5 bg-[#231712] text-[#FBFBF9] text-xs font-semibold hover:bg-[#8C4A27] transition-colors cursor-pointer"
                  >
                    Explore Confections
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#1C1613]/10">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-[#1C1613]">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#6E6259] mt-0.5">{item.subtitle}</p>
                          {item.customDetails && item.customDetails.length > 0 && (
                            <ul className="mt-2 space-y-0.5 text-[11px] text-[#3D332D] bg-[#F4F1EA] p-2.5 border border-[#1C1613]/8">
                              {item.customDetails.map((line, i) => (
                                <li key={i} className="truncate">
                                  {line}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="text-sm font-semibold font-mono-tabular text-[#1C1613] shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#1C1613]/20 bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            className="p-1.5 text-[#1C1613] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-mono-tabular font-medium text-[#1C1613]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="p-1.5 text-[#1C1613] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-xs text-[#6E6259] hover:text-[#9E2A2B] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-verification-form" onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-xs text-[#8C4A27] hover:underline cursor-pointer mb-3 inline-block"
                >
                  ← Return to itemized bag
                </button>
                <h3 className="text-xs font-semibold text-[#1C1613]">
                  Payment Method & Terms
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 text-left border text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#8C4A27] bg-[#8C4A27]/8 text-[#1C1613] font-semibold'
                        : 'border-[#1C1613]/15 bg-white text-[#6E6259]'
                    }`}
                  >
                    <span className="block">Cash on Delivery</span>
                    <span className="text-[11px] font-normal text-[#6E6259] mt-0.5 block">
                      Pay courier upon arrival
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 text-left border text-xs transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#8C4A27] bg-[#8C4A27]/8 text-[#1C1613] font-semibold'
                        : 'border-[#1C1613]/15 bg-white text-[#6E6259]'
                    }`}
                  >
                    <span className="block">Atelier Invoice / Card</span>
                    <span className="text-[11px] font-normal text-[#6E6259] mt-0.5 block">
                      Direct settlement
                    </span>
                  </button>
                </div>
              </div>

              {/* Payment Terms Notice */}
              <div className="p-3.5 bg-[#F4F1EA] border border-[#1C1613]/10 text-xs text-[#3D332D] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#1C1613]">
                  <span>Total Due ({paymentMethod === 'cod' ? 'Cash on Delivery' : 'Direct'}):</span>
                  <span className="font-mono-tabular">${total.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-[#6E6259] leading-relaxed">
                  Orders over ${FREE_SHIPPING_THRESHOLD} include complimentary insulated eutectic
                  cold-pack shipping. Please provide recipient contact details for courier handoff.
                </p>
              </div>

              {/* Customer Verification Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#1C1613] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Camille Laurent"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1613] mb-1">
                    Mobile Phone (For Cold-Chain Courier Notice) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] font-mono-tabular focus:outline-none focus:border-[#8C4A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1613] mb-1">
                    Street Address & Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="18 Rue de la République, Apt 4B"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1613] mb-1">
                    Postal Code & City *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="69002 Lyon"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#1C1613]/20 text-[#1C1613] focus:outline-none focus:border-[#8C4A27]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-[#9E2A2B] font-medium">{formError}</p>
              )}
            </form>
          )}

          {step === 'confirmed' && receipt && (
            <div className="space-y-6">
              <div className="p-5 bg-[#F4F1EA] border border-[#2E5A36]/30">
                <div className="flex items-center gap-2 text-[#2E5A36] font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Order #{receipt.orderNumber} Confirmed — Preparing Shipment</span>
                </div>
                <p className="mt-2 text-xs text-[#3D332D] leading-relaxed">
                  Our chocolatiers are sealing your selection in insulated thermal packaging.
                  Courier dispatch notification will be sent to{' '}
                  <span className="font-mono-tabular font-medium text-[#1C1613]">
                    {receipt.phone}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-2 text-xs border-b border-[#1C1613]/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-[#6E6259]">Recipient:</span>
                  <span className="font-medium text-[#1C1613]">{receipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6259]">Destination:</span>
                  <span className="font-medium text-[#1C1613] text-right">
                    {receipt.address}, {receipt.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E6259]">Settlement:</span>
                  <span className="font-medium text-[#1C1613]">
                    {receipt.paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : 'Direct Atelier Settlement'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#1C1613] mb-2.5">
                  Receipt Summary ({receipt.timestamp})
                </h4>
                <ul className="space-y-2 text-xs divide-y divide-[#1C1613]/8">
                  {receipt.items.map((item) => (
                    <li key={item.cartItemId} className="pt-2 first:pt-0 flex justify-between gap-2">
                      <span className="text-[#3D332D]">
                        {item.quantity}× {item.title}
                      </span>
                      <span className="font-mono-tabular font-medium text-[#1C1613] shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-[#1C1613]/15 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6E6259]">
                    <span>Subtotal</span>
                    <span className="font-mono-tabular">${receipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6E6259]">
                    <span>Cold-Chain Express Delivery</span>
                    <span className="font-mono-tabular">
                      {receipt.shipping === 0 ? 'Complimentary' : `$${receipt.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#1C1613] pt-1">
                    <span>Total</span>
                    <span className="font-mono-tabular">${receipt.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 bg-[#F4F1EA] border-t border-[#1C1613]/12 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6E6259]">
                <span>Subtotal</span>
                <span className="font-mono-tabular text-[#1C1613] font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#6E6259]">
                <span>Cold-Pack Express Shipping</span>
                <span className="font-mono-tabular text-[#1C1613] font-medium">
                  {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1C1613] pt-2 border-t border-[#1C1613]/10">
                <span>Total</span>
                <span className="font-mono-tabular">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-5 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Proceed to Verification & Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-verification-form"
                className="w-full py-3 px-5 bg-[#8C4A27] hover:bg-[#231712] text-[#FBFBF9] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Confirm Order · ${total.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6 bg-[#F4F1EA] border-t border-[#1C1613]/12">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 px-5 bg-[#231712] hover:bg-[#8C4A27] text-[#FBFBF9] text-xs font-semibold transition-colors cursor-pointer"
            >
              Continue Exploring Maison Valrône
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
