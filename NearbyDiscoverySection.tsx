import React from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES } from '../../data/mockSeedData';
import { 
  MapPin, 
  Building, 
  ArrowRight, 
  Crosshair, 
  CheckCircle2, 
  Phone 
} from 'lucide-react';

export const NearbyDiscoverySection: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    businesses, 
    setSelectedBusinessDetail, 
    setActiveView, 
    detectLocation, 
    isLocating, 
    t 
  } = useApp();

  // Filter businesses matching selected city, or all if 'All India'
  const cityFiltered = businesses.filter(b => {
    if (selectedCity === 'All India') return true;
    const cityName = selectedCity.split(',')[0].trim().toLowerCase();
    return b.city.toLowerCase().includes(cityName) || b.state.toLowerCase().includes(cityName);
  });

  return (
    <section className="py-12 bg-[#F5F8F6] dark:bg-[#141C17] border-b border-[#E2E8E4] dark:border-[#24332A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Hyperlocal & Industrial Zone Discovery
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('nearbyBusinesses')}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('nearbyBusinessesSub')}
            </p>
          </div>

          <button
            onClick={detectLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 text-[#16834A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-xs transition cursor-pointer shrink-0"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS...' : 'Use My Exact Location'}</span>
          </button>
        </div>

        {/* City Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {INDIAN_CITIES.slice(0, 10).map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'bg-white dark:bg-[#18221C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-[#16834A]'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Businesses in this region */}
        {cityFiltered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cityFiltered.slice(0, 6).map((biz) => (
              <div
                key={biz.id}
                onClick={() => setSelectedBusinessDetail(biz)}
                className="bg-white dark:bg-[#18221C] rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-[#16834A] hover:shadow-md transition cursor-pointer flex items-start gap-3.5"
              >
                <img
                  src={biz.logo}
                  alt={biz.name}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 dark:border-gray-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-[#16834A]">
                      {biz.businessType}
                    </span>
                    {biz.isVerified && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-[#18231D] dark:text-[#F0F4F1] truncate">
                    {biz.name}
                  </h4>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#16834A] shrink-0" />
                    <span className="truncate">{biz.locality}, {biz.city}</span>
                  </p>

                  <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1 font-medium">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>{biz.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <Building className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1]">
              No listings registered yet in {selectedCity}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Be the first business owner to establish an official verified presence in this location.
            </p>
            <button
              onClick={() => setSelectedCity('All India')}
              className="mt-4 px-4 py-2 text-xs font-bold text-[#16834A] border border-[#16834A] rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
            >
              Browse All India Listings
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
