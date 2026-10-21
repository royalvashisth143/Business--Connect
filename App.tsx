import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { TrendingProducts } from './components/home/TrendingProducts';
import { VerifiedSuppliersSection } from './components/home/VerifiedSuppliersSection';
import { NearbyDiscoverySection } from './components/home/NearbyDiscoverySection';
import { HowItWorksAndFaq } from './components/home/HowItWorksAndFaq';
import { DirectoryPage } from './components/directory/DirectoryPage';
import { BusinessDetailModal } from './components/directory/BusinessDetailModal';
import { ProductMarketplacePage } from './components/marketplace/ProductMarketplacePage';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { RFQBoardPage } from './components/rfq/RFQBoardPage';
import { PostRFQModal } from './components/rfq/PostRFQModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { DashboardRouter } from './components/dashboards/DashboardRouter';
import { AuthModal } from './components/modals/AuthModal';
import { AddProductModal } from './components/modals/AddProductModal';
import { ClaimModal } from './components/modals/ClaimModal';
import { QRModal } from './components/modals/QRModal';

const MainAppContent: React.FC = () => {
  const { activeView } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6] dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] transition-colors duration-200">
      {/* Sticky Main Header */}
      <Header />

      {/* Navigation Sub-bar */}
      <Navigation />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <CategoryGrid />
            <TrendingProducts />
            <VerifiedSuppliersSection />
            <NearbyDiscoverySection />
            <HowItWorksAndFaq />
          </>
        )}

        {activeView === 'directory' && <DirectoryPage />}
        {activeView === 'b2b' && <ProductMarketplacePage initialMode="b2b" />}
        {activeView === 'b2c' && <ProductMarketplacePage initialMode="b2c" />}
        {activeView === 'rfq-board' && <RFQBoardPage />}
        {activeView === 'dashboard' && <DashboardRouter />}
      </main>

      {/* SEO & Directory Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <BusinessDetailModal />
      <ProductDetailModal />
      <PostRFQModal />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <AuthModal />
      <AddProductModal />
      <ClaimModal />
      <QRModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
