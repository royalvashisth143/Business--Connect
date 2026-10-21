import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductItem } from '../../types';
import { CATEGORIES_DATA } from '../../data/mockSeedData';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  FileText, 
  Eye, 
  ShieldCheck, 
  Package, 
  Tag, 
  Layers, 
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface ProductMarketplacePageProps {
  initialMode?: 'b2b' | 'b2c';
}

export const ProductMarketplacePage: React.FC<ProductMarketplacePageProps> = ({ initialMode = 'b2b' }) => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    addToCart, 
    setSelectedProductDetail, 
    setIsPostRfqModalOpen,
    topSearchQueries,
    logSearch,
    logCategoryClick,
    selectedCity
  } = useApp();

  const [mode, setMode] = useState<'b2b' | 'b2c'>(initialMode);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState(searchQuery);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // B2B vs B2C filter
      if (mode === 'b2b' && !p.isWholesale) return false;
      if (mode === 'b2c' && !p.isRetail) return false;

      // Category filter
      if (selectedCategory && p.category !== selectedCategory) return false;

      // In stock
      if (inStockOnly && p.stockQuantity <= 0) return false;

      // Price limit
      const price = mode === 'b2b' ? p.wholesalePrice : p.retailPrice;
      if (price > maxPrice) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesBiz = p.businessName.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesBiz && !matchesCat && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = mode === 'b2b' ? a.wholesalePrice : a.retailPrice;
      const priceB = mode === 'b2b' ? b.wholesalePrice : b.retailPrice;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, mode, selectedCategory, inStockOnly, maxPrice, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F8F6] dark:bg-[#101713] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Mode Switcher */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#16834A] font-semibold">
                {mode === 'b2b' ? 'B2B Wholesale Portal' : 'B2C Retail Shopping'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {mode === 'b2b' ? 'Wholesale Industrial & Raw Material Sourcing' : 'Direct-to-Consumer Retail Marketplace'}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {mode === 'b2b' 
                ? 'Source in bulk with factory tiered pricing, verified GSTIN suppliers, and direct RFQ quotes.' 
                : 'Purchase factory-direct authentic Indian products with fast doorstep courier delivery.'}
            </p>
          </div>

          {/* Mode Pill Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs shrink-0">
            <button
              onClick={() => setMode('b2b')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                mode === 'b2b'
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#16834A]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>B2B Wholesale (MOQ)</span>
            </button>
            <button
              onClick={() => setMode('b2c')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                mode === 'b2c'
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#16834A]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>B2C Retail Shopping</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-4`}>
            <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>Product Filters</span>
                </div>
                {(selectedCategory || searchQuery || maxPrice < 1000000 || inStockOnly) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchQuery('');
                      setMaxPrice(1000000);
                      setInStockOnly(false);
                    }}
                    className="text-[11px] font-semibold text-[#16834A] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* In-Stock Toggle */}
              <div className="mb-5">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 cursor-pointer">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Ready Stock Available
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-[#16834A] rounded-sm focus:ring-[#16834A] cursor-pointer"
                  />
                </label>
              </div>

              {/* Price Cap Slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  <span>Max Price (₹)</span>
                  <span className="text-[#16834A] font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1000000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#16834A] cursor-pointer"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer truncate ${
                      selectedCategory === ''
                        ? 'bg-[#16834A] text-white font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES_DATA.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer truncate ${
                        selectedCategory === c.name
                          ? 'bg-[#16834A] text-white font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      title={c.name}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <main className="md:col-span-3 space-y-4">
            
            {/* Top Bar with Search & Sort */}
            <div className="bg-white dark:bg-[#18221C] rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              
              {/* In-page Product Search */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = localSearchInput.trim();
                  setSearchQuery(q);
                  const count = products.filter(p => 
                    p.name.toLowerCase().includes(q.toLowerCase()) || 
                    p.category.toLowerCase().includes(q.toLowerCase()) ||
                    p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
                  ).length;
                  if (q) {
                    logSearch(q, count, selectedCategory, selectedCity);
                  }
                }}
                className="flex items-center gap-2 flex-1 max-w-sm bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, models..."
                  value={localSearchInput}
                  onChange={(e) => {
                    setLocalSearchInput(e.target.value);
                    if (!e.target.value) setSearchQuery('');
                  }}
                  className="w-full text-xs bg-transparent focus:outline-hidden text-[#18231D] dark:text-[#F0F4F1] placeholder:text-gray-400"
                />
                {localSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearchInput('');
                      setSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </form>

              <div className="flex items-center gap-3 text-xs">
                <div className="text-xs font-semibold text-gray-500">
                  <span className="font-extrabold text-[#16834A]">{filteredProducts.length}</span> Products
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs font-bold text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Cards */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => {
                  return (
                    <div
                      key={p.id}
                      className="group bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          {mode === 'b2b' ? (
                            <span className="bg-[#0D5F38] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              MOQ: {p.moq} {p.priceUnit}s
                            </span>
                          ) : (
                            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                              In Stock: {p.stockQuantity}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedProductDetail(p)}
                          className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-white/90 dark:bg-[#18221C]/90 text-[#18231D] dark:text-[#F0F4F1] hover:text-[#16834A] transition shadow-md backdrop-blur-xs cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-semibold text-[#16834A] mb-1">
                            {p.category}
                          </div>

                          <h3 
                            onClick={() => setSelectedProductDetail(p)}
                            className="font-bold text-xs sm:text-sm text-[#18231D] dark:text-[#F0F4F1] line-clamp-2 hover:text-[#16834A] cursor-pointer"
                          >
                            {p.name}
                          </h3>

                          <div className="mt-1 text-[11px] text-gray-500 truncate">
                            {p.businessName}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] text-gray-400 font-semibold uppercase">
                              {mode === 'b2b' ? 'Wholesale Price' : 'Retail Price'}
                            </div>
                            <div className="text-base font-extrabold text-[#16834A]">
                              ₹{mode === 'b2b' ? p.wholesalePrice.toLocaleString('en-IN') : p.retailPrice.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-gray-500"> / {p.priceUnit}</span>
                            </div>
                          </div>

                          {mode === 'b2b' ? (
                            <button
                              onClick={() => setIsPostRfqModalOpen(true)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] shadow-xs transition cursor-pointer"
                            >
                              Get Quote
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(p, 1, false)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] shadow-xs transition flex items-center gap-1 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                  <Package className="w-7 h-7" />
                </div>
                
                <div>
                  <h3 className="text-base font-extrabold text-[#18231D] dark:text-[#F0F4F1]">
                    {searchQuery ? `No products found for "${searchQuery}"` : 'No products found matching filters'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                    {searchQuery 
                      ? 'This search has been logged to our Unmet Demand database for verified manufacturer onboarding. You can post a direct buying RFQ to receive competitive wholesale bids.'
                      : 'Try broadening your search term or adjusting category and price filters.'}
                  </p>
                </div>

                {searchQuery && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-md mx-auto text-xs text-emerald-900 dark:text-emerald-300 space-y-2">
                    <div className="font-bold">Need this product manufactured or supplied?</div>
                    <button
                      onClick={() => setIsPostRfqModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      Post Buy RFQ for "{searchQuery}"
                    </button>
                  </div>
                )}

                {/* Popular Discovery Alternatives */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 max-w-lg mx-auto">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Popular Indian Product Searches
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {topSearchQueries.slice(0, 6).map(ts => (
                      <button
                        key={ts.query}
                        onClick={() => {
                          setLocalSearchInput(ts.query);
                          setSearchQuery(ts.query);
                          if (ts.category) setSelectedCategory(ts.category);
                          logSearch(ts.query, ts.avgResults, ts.category, selectedCity);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-[#101713] hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-[#16834A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition cursor-pointer"
                      >
                        {ts.query}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchQuery('');
                      setLocalSearchInput('');
                      setMaxPrice(1000000);
                      setInStockOnly(false);
                    }}
                    className="px-5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
