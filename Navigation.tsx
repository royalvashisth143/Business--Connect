import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Grid, 
  Package, 
  ShoppingBag, 
  Building, 
  Factory, 
  Truck, 
  Wrench, 
  FileCheck2, 
  LayoutDashboard 
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeView, setActiveView, t, activeRole, setSelectedCategory } = useApp();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'categories', label: t('categories'), icon: Grid },
    { id: 'b2b', label: t('b2bWholesale'), icon: Package, badge: 'MOQ' },
    { id: 'b2c', label: t('b2cShopping'), icon: ShoppingBag, badge: 'Retail' },
    { id: 'directory', label: t('directory'), icon: Building },
    { id: 'manufacturers', label: t('manufacturers'), icon: Factory },
    { id: 'suppliers', label: t('suppliers'), icon: Truck },
    { id: 'services', label: t('localServices'), icon: Wrench },
    { id: 'rfq-board', label: t('postRequirement'), icon: FileCheck2 },
    { 
      id: 'dashboard', 
      label: activeRole === 'super_admin' ? 'Super Admin' : t('dashboard'), 
      icon: LayoutDashboard,
      highlight: true
    },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'manufacturers') {
      setSelectedCategory('');
      setActiveView('directory');
    } else if (id === 'suppliers') {
      setSelectedCategory('');
      setActiveView('directory');
    } else if (id === 'services') {
      setSelectedCategory('Local Business Services');
      setActiveView('directory');
    } else if (id === 'categories') {
      setActiveView('home');
      // scroll to category section
      const el = document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveView(id);
    }
  };

  return (
    <nav className="bg-[#FFFFFF] dark:bg-[#141C17] border-b border-[#E2E8E4] dark:border-[#24332A] overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 py-1.5 whitespace-nowrap min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || 
              (item.id === 'directory' && activeView === 'directory');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : item.highlight
                    ? 'text-[#16834A] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#16834A] hover:bg-[#F5F8F6] dark:hover:bg-[#18221C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-[#16834A]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
