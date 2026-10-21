import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductItem } from '../../types';
import { 
  ShoppingCart, 
  FileText, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Package,
  Sparkles
} from 'lucide-react';

export const TrendingProducts: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProductDetail, 
    setActiveView, 
    t, 
    setIsPostRfqModalOpen 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wholesale' | 'retail'>('wholesale');

  const filteredProducts = products.filter(p => 
    activeTab === 'wholesale' ? p.isWholesale : p.isRetail
  );

  return (
    <section className="py-12 bg-[#F5F8F6] dark:bg-[#141C17] border-b border-[#E2E8E4] dark:border-[#24332A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Wholesale / Retail Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Direct From Factories & Mills
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {activeTab === 'wholesale' ? t('trendingWholesale') : t('retailMarketplace')}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {activeTab === 'wholesale' ? t('trendingWholesaleSub') : t('retailMarketplaceSub')}
            </p>
          </div>

          {/* Toggle pill buttons */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wholesale'
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#16834A]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>B2B Wholesale (MOQ)</span>
            </button>

            <button
              onClick={() => setActiveTab('retail')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'retail'
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#16834A]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>B2C Retail Shopping</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => {
            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* MOQ or Retail Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {activeTab === 'wholesale' ? (
                      <span className="bg-[#0D5F38] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        MOQ: {product.moq} {product.priceUnit}s
                      </span>
                    ) : (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Ready to Ship
                      </span>
                    )}

                    <span className="bg-white/95 dark:bg-[#101713]/90 text-gray-800 dark:text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16834A]" /> GST Verified
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => setSelectedProductDetail(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/90 dark:bg-[#18221C]/90 text-[#18231D] dark:text-[#F0F4F1] hover:bg-white hover:text-[#16834A] transition shadow-md backdrop-blur-xs cursor-pointer"
                    title="Quick View Specifications"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category tag */}
                    <div className="text-[11px] font-semibold text-[#16834A] mb-1">
                      {product.category}
                    </div>

                    {/* Product Title */}
                    <h3 
                      onClick={() => setSelectedProductDetail(product)}
                      className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1] line-clamp-2 hover:text-[#16834A] transition cursor-pointer"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Supplier Name & Location */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                        {product.businessName}
                      </span>
                    </div>

                    {/* Specifications teaser */}
                    <div className="mt-3 bg-gray-50 dark:bg-[#101713] rounded-lg p-2 text-[11px] text-gray-600 dark:text-gray-400 space-y-0.5 border border-gray-100 dark:border-gray-800/60">
                      {Object.entries(product.specifications).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-gray-400">{k}:</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-gray-400 font-semibold uppercase">
                        {activeTab === 'wholesale' ? 'Wholesale Price' : 'Retail Price'}
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-[#16834A]">
                        ₹{activeTab === 'wholesale' ? product.wholesalePrice.toLocaleString('en-IN') : product.retailPrice.toLocaleString('en-IN')}
                        <span className="text-[11px] font-normal text-gray-500"> / {product.priceUnit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab === 'wholesale' ? (
                        <button
                          onClick={() => setIsPostRfqModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Get Quote</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product, 1, false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] shadow-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveView(activeTab === 'wholesale' ? 'b2b' : 'b2c')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-[#18221C] border border-[#16834A] text-[#16834A] font-bold text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition shadow-xs cursor-pointer"
          >
            <span>Explore All {activeTab === 'wholesale' ? 'Wholesale Products' : 'Retail Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
