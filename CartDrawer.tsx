import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck,
  Package
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal,
    cartCount 
  } = useApp();

  if (!isCartOpen) return null;

  // Approximate 12% blended GST for standard industrial & apparel orders
  const gstAmount = Math.round(cartSubtotal * 0.12);
  const shippingCharge = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 150;
  const grandTotal = cartSubtotal + gstAmount + shippingCharge;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#18221C] h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-200"
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#141C17]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#16834A] flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#18231D] dark:text-[#F0F4F1]">
                Shopping Cart ({cartCount} Items)
              </h3>
              <span className="text-[10px] text-gray-400">Direct From Indian Verified Sellers</span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.isWholesaleOrder}`}
                  className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-[#101713] flex gap-3 relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Seller: {item.product.businessName}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs font-extrabold text-[#16834A]">
                        ₹{itemTotal.toLocaleString('en-IN')}
                        <span className="text-[10px] text-gray-400 font-normal"> (₹{item.unitPrice}/{item.product.priceUnit})</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#16834A] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-[#16834A] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <h4 className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1]">
                Your cart is empty
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Explore our wholesale and retail catalog to add verified products from Indian manufacturers.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18221C] space-y-3">
            
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (Applicable Tax):</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Courier Shipping:</span>
                <span className="font-bold text-emerald-600">
                  {shippingCharge === 0 ? 'FREE (Order > ₹2,000)' : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-sm font-extrabold text-[#18231D] dark:text-[#F0F4F1]">
                <span>Grand Total:</span>
                <span className="text-[#16834A] text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834A]" />
              <span>Safe & Secure Indian Payment Gateway (UPI / Card / NetBanking)</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout (₹{grandTotal.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
