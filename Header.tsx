import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES, CATEGORIES_DATA } from '../../data/mockSeedData';
import { UserRole } from '../../types';
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Globe, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  User, 
  LogOut, 
  Crosshair, 
  Briefcase,
  Layers,
  Check,
  TrendingUp,
  Palette,
  Cloud,
  Menu,
  X,
  Sparkles,
  Megaphone
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t, 
    selectedCity, 
    setSelectedCity, 
    detectLocation, 
    isLocating,
    currentUser, 
    activeRole, 
    switchDemoRole, 
    logout, 
    cartCount, 
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setActiveView,
    setIsAuthModalOpen,
    setIsPostRfqModalOpen,
    addBusiness,
    logSearch,
    logCategoryClick,
    topSearchQueries,
    businesses,
    products,
    siteSettings,
    setIsCustomizerOpen,
    setIsRenderDeployModalOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMobileCityOpen, setIsMobileCityOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNewBusinessQuickModal, setIsNewBusinessQuickModal] = useState(false);
  const [quickBizName, setQuickBizName] = useState('');
  const [quickBizCategory, setQuickBizCategory] = useState(siteSettings.categories[0]?.name || 'Industrial Machinery & Equipment');
  const [quickBizPhone, setQuickBizPhone] = useState('');
  const [quickBizGstin, setQuickBizGstin] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    // Compute result count to accurately record zero-result vs positive searches
    let count = 0;
    if (query) {
      const bizMatches = businesses.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.category.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query)
      ).length;
      const prodMatches = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      ).length;
      count = bizMatches + prodMatches;
    } else {
      count = businesses.length;
    }

    if (query) {
      logSearch(searchQuery, count, selectedCategory, selectedCity);
    }

    setIsSearchFocused(false);
    if (activeRole !== 'super_admin') {
      setActiveView('directory');
    }
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'seller', label: 'Seller (Manufacturer)', desc: 'Products, CRM Leads, Catalogues' },
    { role: 'supplier', label: 'Supplier (Industrial)', desc: 'Bulk MOQs, RFQ Bidding, Wholesale' },
    { role: 'buyer', label: 'Corporate Buyer', desc: 'Post RFQs, Compare Quotes' },
    { role: 'customer', label: 'Retail Customer', desc: 'Shop B2C, Cart, Track Orders' },
    { role: 'super_admin', label: 'Super Admin', desc: 'Full System Control, Analytics, Moderation' },
    { role: 'admin', label: 'Moderator Admin', desc: 'Listing Verifications & Reviews' },
  ];

  const handleQuickAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBizName) return;
    addBusiness({
      name: quickBizName,
      category: quickBizCategory,
      phone: quickBizPhone || '+91 98000 00000',
      gstin: quickBizGstin,
      city: selectedCity === 'All India' ? 'Mumbai' : selectedCity.split(',')[0],
      state: selectedCity === 'All India' ? 'Maharashtra' : selectedCity.split(',')[1]?.trim() || 'Maharashtra',
    });
    setIsNewBusinessQuickModal(false);
    setQuickBizName('');
    setQuickBizPhone('');
    setQuickBizGstin('');
    alert('Business registered successfully! View in directory or manage in your Seller Dashboard.');
    setActiveView('directory');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] dark:bg-[#18221C] border-b border-[#E2E8E4] dark:border-[#24332A] shadow-xs">
      {/* Top Banner Notice: Indian MSME & GST verification indicator */}
      <div className="bg-[#0D5F38] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold bg-[#16834A] px-2 py-0.5 rounded-full text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> GST & MSME Verified Ecosystem
          </span>
          <span className="hidden sm:inline text-white/90">
            India's integrated B2B wholesale portal, enterprise directory & direct retail marketplace
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          {/* Quick Demo Role Switcher Bar */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-2.5 py-0.5 rounded transition font-medium"
            >
              <Briefcase className="w-3 h-3 text-emerald-300" />
              <span>Role: <strong className="capitalize text-emerald-200">{activeRole.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1 w-72 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  Switch Role (Instant Test Mode)
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchDemoRole(r.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F8F6] dark:hover:bg-[#101713] transition ${
                      activeRole === r.role ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A] font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{r.desc}</div>
                    </div>
                    {activeRole === r.role && <Check className="w-4 h-4 text-[#16834A]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 hover:text-emerald-200 transition font-medium cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 hover:text-emerald-200 transition font-medium cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16834A] to-[#0D5F38] flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">BC</span>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-[#18231D] dark:text-[#F0F4F1] flex items-center gap-1.5">
                <span>BUSINESS</span>
                <span className="text-[#16834A]">CONNECT</span>
                <span className="w-2 h-2 rounded-full bg-[#16834A] animate-pulse"></span>
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                India B2B & B2C Hub
              </div>
            </div>
          </button>

          {/* Universal Search Bar with Location and Category */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-[#16834A]/30 focus-within:border-[#16834A] rounded-xl bg-white dark:bg-[#101713] transition shadow-xs"
          >
            {/* City Selector */}
            <div className="relative border-r border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-[#16834A] transition shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-[#16834A]" />
                <span className="max-w-[100px] truncate">{selectedCity.split(',')[0]}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isCityOpen && (
                <div 
                  className="absolute left-0 mt-1 w-56 bg-white dark:bg-[#18221C] rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 py-1 z-50"
                  onMouseLeave={() => setIsCityOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase">Select City</span>
                    <button
                      type="button"
                      onClick={() => {
                        detectLocation();
                        setIsCityOpen(false);
                      }}
                      className="text-[11px] text-[#16834A] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                      {isLocating ? 'Locating...' : 'Auto Detect'}
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {INDIAN_CITIES.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F5F8F6] dark:hover:bg-[#101713] transition ${
                          selectedCity === city ? 'font-bold text-[#16834A]' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-transparent border-none text-gray-600 dark:text-gray-400 px-2 py-2 focus:outline-hidden max-w-[130px] truncate cursor-pointer"
            >
              <option value="">{t('allCategories')}</option>
              {CATEGORIES_DATA.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Input & Suggestions Dropdown Wrapper */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-transparent text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden placeholder:text-gray-400"
              />

              {/* Autocomplete & Trending Searches Dropdown */}
              {isSearchFocused && (
                <div 
                  className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#18221C] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-3 z-50 animate-in fade-in zoom-in-95"
                  onMouseDown={(e) => e.preventDefault()} // prevent input blur before click
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-[#16834A]">
                      <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setIsSearchFocused(false)} 
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1">
                    {topSearchQueries.slice(0, 5).map(sq => (
                      <button
                        key={sq.query}
                        type="button"
                        onClick={() => {
                          setSearchQuery(sq.query);
                          setIsSearchFocused(false);
                          logSearch(sq.query, sq.avgResults, sq.category);
                          setActiveView('directory');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#F5F8F6] dark:hover:bg-[#101713] flex items-center justify-between transition group"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-3 h-3 text-gray-400 group-hover:text-[#16834A]" />
                          <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-[#16834A]">
                            {sq.query}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {sq.count} searches
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-500">
                    <span>Press Enter to search all Indian suppliers</span>
                    <span className="font-semibold text-emerald-600">Tracked Live</span>
                  </div>
                </div>
              )}
            </div>

            {/* Search Submit */}
            <button
              type="submit"
              className="bg-[#16834A] hover:bg-[#0D5F38] text-white p-2.5 rounded-r-[10px] transition cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action CTAs & Account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Post RFQ Button */}
            <button
              onClick={() => setIsPostRfqModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A] border border-[#16834A]/30 hover:bg-emerald-100 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('postRequirement')}</span>
            </button>

            {/* List Your Business Button */}
            <button
              onClick={() => setIsNewBusinessQuickModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#16834A] text-white hover:bg-[#0D5F38] shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('listYourBusiness')}</span>
            </button>

            {/* Cart Icon Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#101713] transition cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-[#16834A] transition cursor-pointer bg-white dark:bg-[#101713]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#16834A]/10 text-[#16834A] font-bold text-xs flex items-center justify-center">
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold leading-tight truncate max-w-[110px] text-[#18231D] dark:text-[#F0F4F1]">
                      {currentUser.displayName.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-[#16834A] font-semibold capitalize">
                      {activeRole.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18221C] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-2 z-50"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="text-xs font-bold text-[#18231D] dark:text-[#F0F4F1] truncate">
                        {currentUser.displayName}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {currentUser.email}
                      </div>
                      {currentUser.companyName && (
                        <div className="mt-1 text-[11px] font-medium text-[#16834A] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {currentUser.companyName}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-[#F5F8F6] dark:hover:bg-[#101713] text-gray-700 dark:text-gray-300 transition"
                    >
                      <Layers className="w-4 h-4 text-[#16834A]" />
                      <span>{activeRole === 'super_admin' ? 'Super Admin Panel' : 'My Dashboard & Orders'}</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#16834A] text-white hover:bg-[#0D5F38] transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center border border-[#16834A]/40 rounded-lg bg-white dark:bg-[#101713] overflow-hidden">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-transparent text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden"
            />
            <button type="submit" className="bg-[#16834A] text-white p-2">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Business Register Modal */}
      {isNewBusinessQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#18221C] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#16834A] flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#18231D] dark:text-[#F0F4F1]">
                  List Your Business on Business Connect
                </h3>
              </div>
              <button 
                onClick={() => setIsNewBusinessQuickModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddBusiness} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Company / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omkar Fabricators & CNC Engg"
                  value={quickBizName}
                  onChange={(e) => setQuickBizName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Industry Category *
                </label>
                <select
                  value={quickBizCategory}
                  onChange={(e) => setQuickBizCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                >
                  {CATEGORIES_DATA.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Contact / WhatsApp No. *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={quickBizPhone}
                    onChange={(e) => setQuickBizPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="27AAACB2234K1ZV"
                    value={quickBizGstin}
                    onChange={(e) => setQuickBizGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300">
                ✓ Free instant verified listing in India’s leading B2B directory.<br/>
                ✓ Get a digital catalogue with your unique QR code.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewBusinessQuickModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#16834A] hover:bg-[#0D5F38] rounded-lg shadow-sm transition cursor-pointer"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
