import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessListing, BusinessType } from '../../types';
import { INDIAN_CITIES, CATEGORIES_DATA } from '../../data/mockSeedData';
import { 
  Search, 
  MapPin, 
  Filter, 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Phone, 
  QrCode, 
  Eye, 
  Flag, 
  CheckCircle2, 
  Building, 
  Grid, 
  List, 
  Map, 
  SlidersHorizontal,
  X
} from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const { 
    businesses, 
    selectedCity, 
    setSelectedCity, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    setSelectedBusinessDetail, 
    setQrBusiness, 
    setIsQrModalOpen, 
    setIsClaimModalOpen,
    favorites,
    toggleFavorite,
    setIsPostRfqModalOpen,
    topSearchQueries,
    logSearch,
    t 
  } = useApp();

  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const businessTypes: (BusinessType | 'All')[] = [
    'All',
    'Manufacturer',
    'Wholesaler',
    'Distributor',
    'Retailer',
    'Service Provider'
  ];

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      // Category filter
      if (selectedCategory && b.category !== selectedCategory) return false;

      // City filter
      if (selectedCity !== 'All India') {
        const cityKey = selectedCity.split(',')[0].trim().toLowerCase();
        if (!b.city.toLowerCase().includes(cityKey) && !b.state.toLowerCase().includes(cityKey)) {
          return false;
        }
      }

      // Verified filter
      if (verifiedOnly && !b.isVerified) return false;

      // Type filter
      if (selectedType !== 'All' && b.businessType !== selectedType) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesDesc = b.description.toLowerCase().includes(q);
        const matchesCity = b.city.toLowerCase().includes(q);
        const matchesCat = b.category.toLowerCase().includes(q);
        const matchesGstin = b.gstin?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCity && !matchesCat && !matchesGstin) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.establishedYear - a.establishedYear;
      return a.name.localeCompare(b.name);
    });
  }, [businesses, selectedCategory, selectedCity, verifiedOnly, selectedType, searchQuery, sortBy]);

  const handleWhatsappEnquiry = (whatsapp: string, businessName: string) => {
    const text = encodeURIComponent(`Hello ${businessName}, I discovered your business profile on BUSINESS CONNECT. Please share your wholesale catalogue and quotation process.`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F8F6] dark:bg-[#101713] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#16834A] font-semibold">Indian Business Directory</span>
              {selectedCity !== 'All India' && (
                <>
                  <span>/</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedCity}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              Verified Business Directory & Supplier Database
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredBusinesses.length} registered enterprises and manufacturing units across India
            </p>
          </div>

          {/* View Toggles & Mobile Filter Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#16834A]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center p-1 bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#16834A] text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#16834A] text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewMode === 'map' ? 'bg-[#16834A] text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="Interactive Map View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar Filters + Main Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Filter Sidebar Desktop */}
          <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-4`}>
            <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                <div className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#16834A]" />
                  <span>Filter Listings</span>
                </div>
                {(selectedCategory || selectedCity !== 'All India' || verifiedOnly || selectedType !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedCity('All India');
                      setVerifiedOnly(false);
                      setSelectedType('All');
                      setSearchQuery('');
                    }}
                    className="text-[11px] font-semibold text-[#16834A] hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Verified Only Toggle */}
              <div className="mb-5">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 cursor-pointer">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16834A]" /> GSTIN Verified Only
                  </span>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-[#16834A] rounded-sm focus:ring-[#16834A] cursor-pointer"
                  />
                </label>
              </div>

              {/* City Selection */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Location (State / City)
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden cursor-pointer"
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Business Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Business Entity Type
                </label>
                <div className="space-y-1">
                  {businessTypes.map(tOption => (
                    <button
                      key={tOption}
                      onClick={() => setSelectedType(tOption)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                        selectedType === tOption
                          ? 'bg-[#16834A] text-white font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{tOption}</span>
                      {selectedType === tOption && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Categories */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Industry Category
                </label>
                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer truncate ${
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
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer truncate ${
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

          {/* Main Results View */}
          <main className="md:col-span-3 space-y-4">
            
            {/* Sort & Filter Bar */}
            <div className="bg-white dark:bg-[#18221C] rounded-xl border border-gray-200 dark:border-gray-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Found <span className="font-extrabold text-[#16834A]">{filteredBusinesses.length}</span> Verified Listings
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs font-bold text-[#18231D] dark:text-[#F0F4F1] focus:outline-hidden cursor-pointer"
                >
                  <option value="rating">Top Rated (Stars)</option>
                  <option value="newest">Established Year</option>
                  <option value="name">Company Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Map Mode Display */}
            {viewMode === 'map' && (
              <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#16834A]" />
                    <span>Regional Map Locator (Industrial Corridors)</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Centering on {selectedCity}</span>
                </div>

                {/* Styled Map Canvas Representation */}
                <div className="relative h-72 w-full rounded-xl overflow-hidden bg-emerald-950/20 border border-emerald-900/40 p-4 flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#16834A_1px,transparent_1px)] [background-size:20px_20px]"></div>

                  {/* Pins representing Indian Hubs */}
                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredBusinesses.slice(0, 6).map((b, i) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBusinessDetail(b)}
                        className="p-2.5 rounded-lg bg-white/95 dark:bg-[#18221C]/95 backdrop-blur-md border border-[#16834A]/40 shadow-md hover:scale-102 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#16834A] truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{b.city}</span>
                        </div>
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate mt-0.5">
                          {b.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {b.locality} • {b.businessType}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 text-right">
                    <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-xs font-mono">
                      Location Discovery: Lat {filteredBusinesses[0]?.lat || 19.0760}, Lng {filteredBusinesses[0]?.lng || 72.8777}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* List or Grid Cards */}
            {filteredBusinesses.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
                {filteredBusinesses.map((biz) => {
                  return (
                    <div
                      key={biz.id}
                      className={`group bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#16834A] hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between ${
                        viewMode === 'list' ? 'sm:flex-row sm:items-center sm:gap-6' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {/* Header: Logo, Name, Badges */}
                        <div className="flex items-start gap-3 mb-2.5">
                          <img
                            src={biz.logo}
                            alt={biz.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] uppercase">
                                {biz.businessType}
                              </span>
                              {biz.isVerified && (
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-[#16834A]" /> GSTIN Verified
                                </span>
                              )}
                              <span className="text-[10px] text-gray-500">
                                Estd. {biz.establishedYear}
                              </span>
                            </div>

                            <h3 
                              onClick={() => setSelectedBusinessDetail(biz)}
                              className="font-bold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] hover:text-[#16834A] transition cursor-pointer truncate"
                            >
                              {biz.name}
                            </h3>
                          </div>
                        </div>

                        {/* Location, Rating, GSTIN */}
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 mt-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#16834A] shrink-0" />
                            <span className="truncate">{biz.address}, {biz.city}, {biz.state} - {biz.pincode}</span>
                          </div>

                          <div className="flex items-center gap-3 pt-0.5">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{biz.rating}</span>
                              <span className="text-gray-400 text-[11px] font-normal">({biz.reviewCount})</span>
                            </div>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300">
                              GSTIN: {biz.gstin || '27AAACB2234K1ZV'}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {biz.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className={`mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 ${
                        viewMode === 'list' ? 'sm:mt-0 sm:pt-0 sm:border-t-0 sm:flex-col sm:items-stretch sm:w-44 shrink-0' : ''
                      }`}>
                        <button
                          onClick={() => setSelectedBusinessDetail(biz)}
                          className="flex-1 py-2 px-3 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#16834A] text-gray-800 dark:text-gray-200 hover:text-[#16834A] bg-white dark:bg-[#101713] transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>

                        <button
                          onClick={() => handleWhatsappEnquiry(biz.whatsapp, biz.name)}
                          className="py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => {
                            setQrBusiness(biz);
                            setIsQrModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#16834A] transition cursor-pointer"
                          title="Catalogue QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200 dark:border-amber-800">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-[#18231D] dark:text-[#F0F4F1]">
                  {searchQuery ? `No listings found for "${searchQuery}"` : 'No businesses found matching selected filters'}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                  {searchQuery 
                    ? `This zero-result search has been recorded in the platform's Unmet Demand registry for our Super Admin team to onboard matching verified Indian manufacturers.` 
                    : 'Try adjusting the filters or clearing the search query to view all Indian manufacturers and suppliers.'}
                </p>

                {searchQuery && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 max-w-md mx-auto text-xs text-emerald-900 dark:text-emerald-300">
                    <span className="font-bold">Need this item urgently?</span> Post a free Buying RFQ and verified factories will bid with direct wholesale quotations.
                  </div>
                )}

                {/* Popular Discovery Alternatives */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 max-w-lg mx-auto">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Popular Indian Business Directory Searches
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {topSearchQueries.slice(0, 6).map(ts => (
                      <button
                        key={ts.query}
                        onClick={() => {
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

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setIsPostRfqModalOpen(true)}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#16834A] hover:bg-[#0D5F38] rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Post Buy RFQ for "{searchQuery}"
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedCity('All India');
                      setVerifiedOnly(false);
                      setSelectedType('All');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition cursor-pointer"
                  >
                    Clear All Filters
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
