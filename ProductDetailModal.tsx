import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductItem } from '../../types';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Building, 
  MapPin, 
  CheckCircle2, 
  FileText,
  Package,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductDetail, 
    setSelectedProductDetail, 
    addToCart, 
    setSelectedBusinessDetail, 
    businesses, 
    setIsPostRfqModalOpen 
  } = useApp();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [isWholesaleSelection, setIsWholesaleSelection] = useState(false);

  if (!selectedProductDetail) return null;
  const prod = selectedProductDetail;

  const supplierBiz = businesses.find(b => b.id === prod.businessId);

  const activeUnitPrice = isWholesaleSelection ? prod.wholesalePrice : prod.retailPrice;
  const currentTotal = activeUnitPrice * purchaseQty;

  const handleWhatsappEnquiry = () => {
    const phone = supplierBiz?.whatsapp || '919820144552';
    const text = encodeURIComponent(`Hello ${prod.businessName}, I would like to enquire about purchasing "${prod.name}" (SKU: ${prod.sku}). Required quantity: ${purchaseQty} ${prod.priceUnit}s.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(prod, purchaseQty, isWholesaleSelection);
    setSelectedProductDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-[#141C17]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] uppercase">
              {prod.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">SKU: {prod.sku}</span>
          </div>

          <button
            onClick={() => setSelectedProductDetail(null)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Images Gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 h-72 sm:h-80 w-full mb-3">
                <img
                  src={prod.images[selectedImgIndex] || prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {prod.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {prod.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImgIndex(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                        selectedImgIndex === i ? 'border-[#16834A]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Trust Badges */}
              <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-100 dark:border-gray-800 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                  <span>GSTIN Verified Supplier & Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#16834A]" />
                  <span>Pan-India Dispatch Timeline: {prod.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16834A]" />
                  <span>Country of Origin: {prod.originCountry}</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Order Controls */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Brand: <strong className="text-gray-800 dark:text-gray-200">{prod.brand}</strong>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] leading-snug">
                  {prod.name}
                </h2>

                {/* Supplier link */}
                <div 
                  onClick={() => {
                    if (supplierBiz) {
                      setSelectedProductDetail(null);
                      setSelectedBusinessDetail(supplierBiz);
                    }
                  }}
                  className="mt-2 text-xs text-[#16834A] font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{prod.businessName}</span>
                </div>

                {/* Price Display Card */}
                <div className="mt-4 p-4 rounded-2xl bg-[#F5F8F6] dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-3">
                  {/* Option Switcher: Wholesale vs Retail */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setIsWholesaleSelection(false);
                        setPurchaseQty(1);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                        !isWholesaleSelection ? 'bg-[#16834A] text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Retail Unit Price
                    </button>
                    <button
                      onClick={() => {
                        setIsWholesaleSelection(true);
                        setPurchaseQty(prod.moq);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                        isWholesaleSelection ? 'bg-[#16834A] text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Wholesale (MOQ: {prod.moq})
                    </button>
                  </div>

                  <div>
                    <div className="text-[11px] text-gray-400 uppercase font-semibold">
                      {isWholesaleSelection ? 'Wholesale Price per Unit' : 'Retail Price'}
                    </div>
                    <div className="text-2xl font-black text-[#16834A] flex items-baseline gap-2">
                      ₹{activeUnitPrice.toLocaleString('en-IN')}
                      <span className="text-xs text-gray-500 font-normal">/ {prod.priceUnit} + GST</span>
                    </div>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-800">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Quantity ({prod.priceUnit}s):
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPurchaseQty(prev => Math.max(isWholesaleSelection ? prod.moq : 1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-[#18221C] border border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:border-[#16834A]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={isWholesaleSelection ? prod.moq : 1}
                        value={purchaseQty}
                        onChange={(e) => setPurchaseQty(Math.max(isWholesaleSelection ? prod.moq : 1, Number(e.target.value)))}
                        className="w-16 text-center font-bold text-xs py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1]"
                      />
                      <button
                        onClick={() => setPurchaseQty(prev => prev + 1)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-[#18221C] border border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:border-[#16834A]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Computed Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                    <span className="font-semibold text-gray-500">Subtotal:</span>
                    <span className="font-extrabold text-[#16834A] text-base">
                      ₹{currentTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart & Checkout (₹{currentTotal.toLocaleString('en-IN')})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleWhatsappEnquiry}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Enquiry</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProductDetail(null);
                        setIsPostRfqModalOpen(true);
                      }}
                      className="py-2.5 rounded-xl border border-[#16834A] text-[#16834A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Request Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Technical Specifications Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] mb-3">
              Technical Specifications & Datasheet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(prod.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-100 dark:border-gray-800/80 flex justify-between"
                >
                  <span className="text-gray-500">{key}:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-6">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] mb-2">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {prod.description}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
