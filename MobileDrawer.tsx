import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES } from '../../data/mockSeedData';
import { UserRole } from '../../types';
import { 
  X, 
  Home, 
  Building, 
  Package, 
  ShoppingBag, 
  FileCheck2, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  MapPin, 
  Crosshair, 
  Briefcase, 
  Check, 
  Globe, 
  Moon, 
  Sun, 
  ShoppingCart, 
  LogOut, 
  User, 
  Palette, 
  Cloud, 
  Phone, 
  ShieldCheck, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const { 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    activeView, 
    setActiveView, 
    currentUser, 
    activeRole, 
    switchDemoRole, 
    logout, 
    setIsAuthModalOpen,
    setIsPostRfqModalOpen,
    cartCount, 
    setIsCartOpen,
    selectedCity, 
    setSelectedCity, 
    detectLocation, 
    isLocating,
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    t,
    siteSettings,
    setIsCustomizerOpen,
    setIsRenderDeployModalOpen
  } = useApp();

  const [isRoleSectionOpen, setIsRoleSectionOpen] = useState(false);
  const [isCitySectionOpen, setIsCitySectionOpen] = useState(false);

  if (!isMobileMenuOpen) return null;

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'seller', label: 'Seller (Manufacturer)', desc: 'Products, CRM Leads' },
    { role: 'supplier', label: 'Supplier (Industrial)', desc: 'Bulk MOQs, RFQ Bidding' },
    { role: 'buyer', label: 'Corporate Buyer', desc: 'Post RFQs, Compare Quotes' },
    { role: 'customer', label: 'Retail Customer', desc: 'Shop B2C, Cart, Track Orders' },
    { role: 'super_admin', label: 'Super Admin', desc: 'Full System Control & Customizer' },
    { role: 'admin', label: 'Moderator Admin', desc: 'Listing Verifications' },
  ];

  const handleNav = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#18221C] h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#16834A] to-[#0D5F38] flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              {siteSettings.branding.logoInitial}
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#18231D] dark:text-[#F0F4F1] leading-tight">
                {siteSettings.branding.siteName}
              </div>
              <div className="text-[10px] text-gray-400">
                {siteSettings.branding.tagline}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile / Login status */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#16834A]/10 text-[#16834A] font-bold text-sm flex items-center justify-center">
                  {currentUser.displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#18231D] dark:text-[#F0F4F1] truncate">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-[#16834A] font-semibold capitalize">
                    {activeRole.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#16834A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>{t('login')} / Register Account</span>
            </button>
          )}
        </div>

        {/* Action CTAs (Options that were previously hidden on mobile!) */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              setIsPostRfqModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#16834A] border border-[#16834A]/30 text-center"
          >
            <FileText className="w-4 h-4" />
            <span>Post RFQ</span>
          </button>

          <button
            onClick={() => {
              handleNav('dashboard');
            }}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold bg-[#16834A] text-white text-center shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{activeRole === 'super_admin' ? 'Super Admin' : 'Dashboard'}</span>
          </button>
        </div>

        {/* Quick Config Tools: Live Customizer & Render Deployment */}
        <div className="p-3 mx-4 my-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Site Controls
            </span>
            <span className="text-[9px] bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-bold">
              Dynamic
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setIsCustomizerOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#18221C] text-xs font-bold text-gray-800 dark:text-gray-200 border border-amber-200 dark:border-amber-900 flex items-center justify-center gap-1 hover:bg-amber-100/50 transition cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Theme Studio</span>
            </button>

            <button
              onClick={() => {
                setIsRenderDeployModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="py-1.5 px-2 rounded-lg bg-white dark:bg-[#18221C] text-xs font-bold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>Render Deploy</span>
            </button>
          </div>
        </div>

        {/* City Location Selector (Previously hidden inside desktop search!) */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsCitySectionOpen(!isCitySectionOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#16834A]" />
              <span>Location: <strong className="text-[#16834A]">{selectedCity.split(',')[0]}</strong></span>
            </div>
            <span className="text-[11px] text-gray-400">{isCitySectionOpen ? '▲' : '▼'}</span>
          </button>

          {isCitySectionOpen && (
            <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl space-y-2">
              <button
                type="button"
                onClick={() => {
                  detectLocation();
                  setIsCitySectionOpen(false);
                }}
                className="w-full py-1.5 px-2 text-xs font-bold text-[#16834A] bg-emerald-50 dark:bg-emerald-950/60 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting Location...' : 'Auto Detect My City'}</span>
              </button>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {INDIAN_CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCity(c);
                      setIsCitySectionOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition ${
                      selectedCity === c ? 'bg-[#16834A] text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher (Previously hidden inside desktop header!) */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsRoleSectionOpen(!isRoleSectionOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 py-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Active Role: <strong className="capitalize text-[#16834A]">{activeRole.replace('_', ' ')}</strong></span>
            </div>
            <span className="text-[11px] text-gray-400">{isRoleSectionOpen ? '▲' : '▼'}</span>
          </button>

          {isRoleSectionOpen && (
            <div className="mt-1 space-y-1 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
              {rolesList.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchDemoRole(r.role);
                    setIsRoleSectionOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                    activeRole === r.role ? 'bg-[#16834A] text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>
                    <div>{r.label}</div>
                    <div className={`text-[10px] ${activeRole === r.role ? 'text-white/80' : 'text-gray-400'}`}>{r.desc}</div>
                  </div>
                  {activeRole === r.role && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* All Main Navigation Views */}
        <div className="p-4 space-y-1 border-b border-gray-100 dark:border-gray-800 flex-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Navigation Menu
          </div>

          {[
            { id: 'home', label: t('home'), icon: Home },
            { id: 'directory', label: t('directory'), icon: Building },
            { id: 'b2b', label: 'B2B Wholesale Portal', icon: Package, badge: 'MOQ' },
            { id: 'b2c', label: 'B2C Retail Shopping', icon: ShoppingBag, badge: 'Retail' },
            { id: 'rfq-board', label: t('postRequirement'), icon: FileCheck2 },
            { id: 'dashboard', label: activeRole === 'super_admin' ? 'Super Admin Dashboard' : t('dashboard'), icon: LayoutDashboard },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Drawer Bar: Cart, Language & Theme switch */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300"
            >
              <ShoppingCart className="w-4 h-4 text-[#16834A]" />
              <span>Cart ({cartCount})</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Support Helpline & WhatsApp */}
          <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between text-[11px] text-gray-500">
            <a 
              href={`tel:${siteSettings.branding.helplinePhone}`}
              className="flex items-center gap-1 hover:text-[#16834A]"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>{siteSettings.branding.helplinePhone}</span>
            </a>
            <a 
              href={`https://wa.me/${siteSettings.branding.supportWhatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-600 font-semibold"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
