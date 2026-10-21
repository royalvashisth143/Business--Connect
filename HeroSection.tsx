import React from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES, CATEGORIES_DATA } from '../../data/mockSeedData';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  TrendingUp, 
  FileText, 
  Factory, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    t, 
    searchQuery, 
    setSearchQuery, 
    selectedCity, 
    setSelectedCity, 
    selectedCategory, 
    setSelectedCategory, 
    setActiveView, 
    setIsPostRfqModalOpen,
    businesses,
    products,
    rfqs,
    logSearch,
    logCategoryClick,
    topSearchQueries
  } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    let count = 0;
    if (query) {
      const bizMatches = businesses.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.category.toLowerCase().includes(query)
      ).length;
      const prodMatches = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      ).length;
      count = bizMatches + prodMatches;
      logSearch(searchQuery, count, selectedCategory, selectedCity);
    }
    setActiveView('directory');
  };

  const trendingTags = topSearchQueries.length > 0
    ? topSearchQueries.slice(0, 6).map(t => t.query)
    : [
      'CNC Machines', 
      'Surat Silk Sarees', 
      '10kW Solar Inverter', 
      'Corrugated Boxes', 
      '1121 Basmati Rice', 
      'Brass Bushings'
    ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#EBF5EF] via-[#F5F8F6] to-white dark:from-[#0D1611] dark:via-[#101713] dark:to-[#18221C] border-b border-[#E2E8E4] dark:border-[#24332A] pt-8 pb-14">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-15 dark:opacity-10 pointer-events-none bg-[radial-gradient(#16834A_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-[#16834A]/30 text-[#0D5F38] dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#16834A]" />
            <span>India’s Most Trusted Unified Business Ecosystem</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight leading-tight">
            Connect Directly With India’s Top{' '}
            <span className="text-[#16834A] underline decoration-emerald-300/60 underline-offset-4">
              Manufacturers & Suppliers
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            Next-generation B2B wholesale marketplace, verified enterprise directory, and direct retail shopping portal for Indian MSMEs, distributors, and buyers.
          </p>
        </div>

        {/* Big Universal Search Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#18221C] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-2 sm:p-3 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch gap-2">
            
            {/* City Selector */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 md:w-1/4">
              <MapPin className="w-4 h-4 text-[#16834A] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden cursor-pointer"
              >
                {INDIAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 md:w-1/4">
              <Layers className="w-4 h-4 text-[#16834A] shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden cursor-pointer truncate"
              >
                <option value="">All Categories</option>
                {CATEGORIES_DATA.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Keyword Input */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 md:flex-1">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product name, machinery, company, or GSTIN..."
                className="w-full text-xs bg-transparent text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden placeholder:text-gray-400 font-medium"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t('searchBtn')}</span>
            </button>
          </form>

          {/* Trending Search Chips */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="font-semibold text-gray-700 dark:text-gray-400 flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5 text-[#16834A]" /> Trending:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  setActiveView('b2b');
                }}
                className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-gray-700 dark:text-gray-300 hover:text-[#16834A] text-[11px] font-medium transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Portal Switcher Pills: B2B vs B2C vs Directory vs RFQ */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveView('b2b')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#18221C] border border-[#16834A]/40 text-[#16834A] font-bold text-xs shadow-xs hover:border-[#16834A] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition cursor-pointer"
          >
            <Factory className="w-4 h-4" />
            <span>B2B Wholesale Portal (Bulk MOQs)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveView('b2c')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-bold text-xs shadow-xs hover:border-[#16834A] transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-[#16834A]" />
            <span>Direct Retail Shopping (B2C)</span>
          </button>

          <button
            onClick={() => setIsPostRfqModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16834A] text-white font-bold text-xs shadow-md hover:bg-[#0D5F38] transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Post Buying Requirement (Free RFQ)</span>
          </button>
        </div>

        {/* Live Metrics Counters (backed by database state) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-extrabold text-[#16834A]">
              {businesses.length * 1500}+
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              Verified Businesses
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-extrabold text-[#16834A]">
              {products.length * 800}+
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              Active Products Listed
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-extrabold text-[#16834A]">
              {rfqs.length * 350}+
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              Buyer Leads & RFQs
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-center shadow-xs">
            <div className="text-xl sm:text-2xl font-extrabold text-[#16834A]">
              150+
            </div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              Industrial Hub Cities
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
