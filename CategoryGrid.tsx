import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA } from '../../data/mockSeedData';
import { 
  Cog, 
  Shirt, 
  Cpu, 
  FlaskConical, 
  Building2, 
  Package, 
  Wheat, 
  Wrench,
  ArrowRight 
} from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setActiveView, t, language, logCategoryClick } = useApp();

  const iconMap: Record<string, React.ElementType> = {
    Cog,
    Shirt,
    Cpu,
    FlaskConical,
    Building2,
    Package,
    Wheat,
    Wrench,
  };

  const handleCategorySelect = (categoryName: string) => {
    logCategoryClick(categoryName);
    setSelectedCategory(categoryName);
    setActiveView('b2b');
  };

  return (
    <section id="categories-section" className="py-12 bg-white dark:bg-[#101713] border-b border-[#E2E8E4] dark:border-[#24332A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider mb-1">
              Top Industrial Sectors
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('popularCategories')}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('popularCategoriesSub')}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('');
              setActiveView('b2b');
            }}
            className="text-xs font-bold text-[#16834A] hover:text-[#0D5F38] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Cog;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#F5F8F6] dark:bg-[#18221C] hover:border-[#16834A] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Floating Icon badge */}
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-white/90 dark:bg-[#18221C]/90 backdrop-blur-xs flex items-center justify-center text-[#16834A] shadow-xs">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Listings Count Badge */}
                  <div className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {cat.count}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#18231D] dark:text-[#F0F4F1] group-hover:text-[#16834A] transition">
                      {language === 'hi' ? cat.nameHi : cat.name}
                    </h3>

                    {/* Subcategories preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {cat.subcategories.slice(0, 3).map((sub, i) => (
                        <span 
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#101713] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-[#16834A] font-semibold">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
