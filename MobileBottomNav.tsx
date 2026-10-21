import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Building, 
  Package, 
  FileText, 
  Menu, 
  ShoppingCart,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    setIsMobileMenuOpen, 
    setIsPostRfqModalOpen,
    cartCount,
    isMobileMenuOpen
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141C17]/95 backdrop-blur-md border-t border-[#E2E8E4] dark:border-[#24332A] shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-14 items-center px-1">
        
        {/* 1. Home */}
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeView === 'home'
              ? 'text-[#16834A] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Directory */}
        <button
          onClick={() => setActiveView('directory')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeView === 'directory'
              ? 'text-[#16834A] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Building className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Directory</span>
        </button>

        {/* 3. Post RFQ Button (Center Highlight CTA) */}
        <button
          onClick={() => setIsPostRfqModalOpen(true)}
          className="flex flex-col items-center justify-center h-full group"
        >
          <div className="w-9 h-9 rounded-full bg-[#16834A] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold text-[#16834A] mt-0.5">Post RFQ</span>
        </button>

        {/* 4. Products B2B / B2C */}
        <button
          onClick={() => setActiveView('b2b')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeView === 'b2b' || activeView === 'b2c'
              ? 'text-[#16834A] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Wholesale</span>
        </button>

        {/* 5. More / Menu Drawer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`relative flex flex-col items-center justify-center h-full transition ${
            isMobileMenuOpen
              ? 'text-[#16834A] font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <div className="relative">
            <Menu className="w-4 h-4 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Menu & All</span>
        </button>

      </div>
    </nav>
  );
};
