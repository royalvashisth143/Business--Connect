import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  UserRole, 
  UserProfile, 
  BusinessListing, 
  ProductItem, 
  RFQRequirement, 
  SupplierQuotation, 
  LeadItem, 
  OrderItem, 
  BusinessReview, 
  BusinessClaimRequest, 
  CartItem,
  SearchLog,
  TopSearchMetric,
  ZeroResultMetric,
  CategoryPopularityMetric,
  SiteSettings,
  CategoryItem
} from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSiteSettings';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_PRODUCTS, 
  INITIAL_RFQS, 
  INITIAL_QUOTATIONS, 
  INITIAL_LEADS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS,
  INDIAN_CITIES 
} from '../data/mockSeedData';
import { translations, Language } from '../data/translations';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  INITIAL_SEARCH_LOGS, 
  INITIAL_CATEGORY_CLICKS, 
  recordSearchLog, 
  computeTopQueries, 
  computeZeroResultQueries, 
  computeCategoryPopularity 
} from '../lib/searchAnalytics';

interface AppContextType {
  // Theme & Language
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Location
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  detectLocation: () => void;
  isLocating: boolean;

  // Auth & Roles
  currentUser: UserProfile | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, isWholesale?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Navigation / View State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBusinessDetail: BusinessListing | null;
  setSelectedBusinessDetail: (b: BusinessListing | null) => void;
  selectedProductDetail: ProductItem | null;
  setSelectedProductDetail: (p: ProductItem | null) => void;
  
  // Data items
  businesses: BusinessListing[];
  products: ProductItem[];
  rfqs: RFQRequirement[];
  quotations: SupplierQuotation[];
  leads: LeadItem[];
  orders: OrderItem[];
  reviews: BusinessReview[];
  claims: BusinessClaimRequest[];
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Actions
  addBusiness: (b: Partial<BusinessListing>) => void;
  updateBusiness: (id: string, updates: Partial<BusinessListing>) => void;
  deleteBusiness: (id: string) => void;
  toggleBusinessVerification: (id: string) => void;
  toggleBusinessFeatured: (id: string) => void;

  addProduct: (p: Partial<ProductItem>) => void;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  addRFQ: (r: Partial<RFQRequirement>) => void;
  addQuotation: (q: Partial<SupplierQuotation>) => void;
  updateQuotationStatus: (id: string, status: SupplierQuotation['status']) => void;

  addLead: (l: Partial<LeadItem>) => void;
  updateLeadStatus: (id: string, status: LeadItem['status'], notes?: string) => void;

  createOrder: (order: Omit<OrderItem, 'id' | 'createdAt'>) => OrderItem;
  addReview: (r: Partial<BusinessReview>) => void;
  submitClaim: (c: Partial<BusinessClaimRequest>) => void;
  reviewClaim: (id: string, status: 'Approved' | 'Rejected') => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPostRfqModalOpen: boolean;
  setIsPostRfqModalOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  isClaimModalOpen: boolean;
  setIsClaimModalOpen: (open: boolean) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  qrBusiness: BusinessListing | null;
  setQrBusiness: (b: BusinessListing | null) => void;

  // Search Analytics & Logging Utility
  searchLogs: SearchLog[];
  categoryClicks: Record<string, number>;
  logSearch: (query: string, resultCount: number, category?: string, city?: string) => void;
  logCategoryClick: (category: string) => void;
  topSearchQueries: TopSearchMetric[];
  zeroResultQueries: ZeroResultMetric[];
  categoryPopularity: CategoryPopularityMetric[];
  clearSearchLogs: () => void;
  broadcastRfqFromDemand: (query: string, category?: string, city?: string) => RFQRequirement;
  addSeedBusinessForDemand: (query: string, category?: string, city?: string) => BusinessListing;

  // Site Customization & Dynamic Engine
  siteSettings: SiteSettings;
  updateSiteSettings: (updater: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => void;
  resetSiteSettings: () => void;
  addCategory: (category: CategoryItem) => void;
  updateCategory: (id: string, updated: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  isRenderDeployModalOpen: boolean;
  setIsRenderDeployModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bc_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('bc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('bc_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bc_lang', lang);
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Location
  const [selectedCity, setSelectedCity] = useState<string>('All India');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please select a city manually.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        // Approximate to major Indian industrial cities
        if (latitude > 18 && latitude < 19.5 && longitude > 72.5 && longitude < 73.5) {
          setSelectedCity('Mumbai, Maharashtra');
        } else if (latitude > 28 && latitude < 29 && longitude > 76.5 && longitude < 77.8) {
          setSelectedCity('Delhi NCR, Delhi');
        } else if (latitude > 12.5 && latitude < 13.5 && longitude > 77 && longitude < 78) {
          setSelectedCity('Bengaluru, Karnataka');
        } else if (latitude > 20.8 && latitude < 21.6 && longitude > 72.4 && longitude < 73.2) {
          setSelectedCity('Surat, Gujarat');
        } else if (latitude > 18.2 && latitude < 18.9 && longitude > 73.5 && longitude < 74.2) {
          setSelectedCity('Pune, Maharashtra');
        } else {
          setSelectedCity('All India');
        }
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // User & Roles
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default logged in as demo verified seller for immediate exploration
    return {
      uid: 'demo-seller-1',
      email: 'sales@bharatprecisionforge.in',
      displayName: 'Bharat Precision Forge (Seller)',
      phoneNumber: '+91 98201 44552',
      roles: ['seller', 'supplier', 'buyer'],
      activeRole: 'seller',
      businessId: 'biz-1',
      companyName: 'Bharat Precision Forge & CNC Ltd',
      city: 'Pune',
      state: 'Maharashtra',
      gstin: '27AAACB2234K1ZV',
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: '2023-01-15T10:00:00Z'
    };
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.activeRole || 'seller';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bc_user');
    }
  }, [currentUser]);

  // Firebase auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setCurrentUser(prev => {
          if (prev && prev.uid === fbUser.uid) return prev;
          return {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Business User',
            roles: ['buyer', 'seller', 'customer'],
            activeRole: 'buyer',
            avatarUrl: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString()
          };
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        const u: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Google User',
          roles: ['buyer', 'customer', 'seller'],
          activeRole: 'buyer',
          avatarUrl: result.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(u);
        setActiveRole('buyer');
      }
    } catch (err) {
      console.warn('Google Sign-in popup cancelled or offline fallback:', err);
      // Keep state safe
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // offline
    }
    setCurrentUser(null);
    setActiveRole('buyer');
  };

  // Demo Role Switcher
  const switchDemoRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'super_admin') {
      setCurrentUser({
        uid: 'super-admin-root',
        email: 'superadmin@businessconnect.in',
        displayName: 'Platform Super Administrator',
        roles: ['super_admin', 'admin'],
        activeRole: 'super_admin',
        city: 'New Delhi',
        state: 'Delhi',
        createdAt: '2022-01-01T00:00:00Z'
      });
    } else if (role === 'admin') {
      setCurrentUser({
        uid: 'admin-listing-mgr',
        email: 'moderator@businessconnect.in',
        displayName: 'Moderation Admin (Listings & Reviews)',
        roles: ['admin'],
        activeRole: 'admin',
        city: 'Mumbai',
        state: 'Maharashtra',
        createdAt: '2023-01-01T00:00:00Z'
      });
    } else if (role === 'seller') {
      setCurrentUser({
        uid: 'demo-seller-1',
        email: 'sales@bharatprecisionforge.in',
        displayName: 'Bharat Precision Forge (Seller)',
        phoneNumber: '+91 98201 44552',
        roles: ['seller', 'supplier'],
        activeRole: 'seller',
        businessId: 'biz-1',
        companyName: 'Bharat Precision Forge & CNC Ltd',
        city: 'Pune',
        state: 'Maharashtra',
        gstin: '27AAACB2234K1ZV',
        isVerified: true,
        createdAt: '2023-01-15T10:00:00Z'
      });
    } else if (role === 'supplier') {
      setCurrentUser({
        uid: 'demo-supplier-1',
        email: 'connect@zenithsolar.in',
        displayName: 'Zenith Solar (Industrial Supplier)',
        phoneNumber: '+91 97412 88901',
        roles: ['supplier', 'seller'],
        activeRole: 'supplier',
        businessId: 'biz-3',
        companyName: 'Zenith Solar & Power Inverters',
        city: 'Bengaluru',
        state: 'Karnataka',
        gstin: '29AABCZ5512N1Z4',
        isVerified: true,
        createdAt: '2023-04-12T10:00:00Z'
      });
    } else if (role === 'buyer') {
      setCurrentUser({
        uid: 'buyer-user-1',
        email: 'vikram.s@apexinfra.com',
        displayName: 'Vikram Singhania (Apex Infra Buyer)',
        phoneNumber: '+91 98200 11223',
        roles: ['buyer'],
        activeRole: 'buyer',
        companyName: 'Apex Infrastructure Projects Ltd',
        city: 'Bengaluru',
        state: 'Karnataka',
        createdAt: '2024-02-10T10:00:00Z'
      });
    } else {
      setCurrentUser({
        uid: 'cust-demo-1',
        email: 'rohit.kulkarni@gmail.com',
        displayName: 'Rohit Kulkarni (Retail Customer)',
        phoneNumber: '+91 98220 77112',
        roles: ['customer'],
        activeRole: 'customer',
        city: 'Pune',
        state: 'Maharashtra',
        createdAt: '2024-05-15T10:00:00Z'
      });
    }
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bc_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bc_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductItem, quantity = 1, isWholesale = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.isWholesaleOrder === isWholesale);
      const unitPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.isWholesaleOrder === isWholesale
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, unitPrice, isWholesaleOrder: isWholesale }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Active View & Navigation
  const [activeView, setActiveView] = useState<string>('home'); // 'home' | 'directory' | 'b2b' | 'b2c' | 'rfq' | 'dashboard' | 'business-detail' | 'product-detail'
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBusinessDetail, setSelectedBusinessDetail] = useState<BusinessListing | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);

  // Data collections (persistent in localStorage with fallback to rich Indian seed records)
  const [businesses, setBusinesses] = useState<BusinessListing[]>(() => {
    const saved = localStorage.getItem('bc_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('bc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [rfqs, setRfqs] = useState<RFQRequirement[]>(() => {
    const saved = localStorage.getItem('bc_rfqs');
    return saved ? JSON.parse(saved) : INITIAL_RFQS;
  });

  const [quotations, setQuotations] = useState<SupplierQuotation[]>(() => {
    const saved = localStorage.getItem('bc_quotations');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    const saved = localStorage.getItem('bc_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('bc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<BusinessReview[]>(() => {
    const saved = localStorage.getItem('bc_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [claims, setClaims] = useState<BusinessClaimRequest[]>(() => {
    const saved = localStorage.getItem('bc_claims');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('bc_favorites');
    return saved ? JSON.parse(saved) : ['biz-1', 'prod-2'];
  });

  const [searchLogs, setSearchLogs] = useState<SearchLog[]>(() => {
    const saved = localStorage.getItem('bc_search_logs');
    return saved ? JSON.parse(saved) : INITIAL_SEARCH_LOGS;
  });

  const [categoryClicks, setCategoryClicks] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('bc_cat_clicks');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORY_CLICKS;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('bc_businesses', JSON.stringify(businesses)); }, [businesses]);
  useEffect(() => { localStorage.setItem('bc_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('bc_rfqs', JSON.stringify(rfqs)); }, [rfqs]);
  useEffect(() => { localStorage.setItem('bc_quotations', JSON.stringify(quotations)); }, [quotations]);
  useEffect(() => { localStorage.setItem('bc_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('bc_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('bc_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('bc_claims', JSON.stringify(claims)); }, [claims]);
  useEffect(() => { localStorage.setItem('bc_favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('bc_search_logs', JSON.stringify(searchLogs)); }, [searchLogs]);
  useEffect(() => { localStorage.setItem('bc_cat_clicks', JSON.stringify(categoryClicks)); }, [categoryClicks]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostRfqModalOpen, setIsPostRfqModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrBusiness, setQrBusiness] = useState<BusinessListing | null>(null);

  // Business Actions
  const addBusiness = (b: Partial<BusinessListing>) => {
    const newBiz: BusinessListing = {
      id: `biz-${Date.now()}`,
      name: b.name || 'New Enterprise',
      slug: (b.name || 'new-enterprise').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: b.category || 'Industrial Machinery & Equipment',
      subcategory: b.subcategory || 'General',
      description: b.description || '',
      logo: b.logo || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80',
      bannerImage: b.bannerImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      gallery: b.gallery || [],
      ownerUid: currentUser?.uid || 'guest-user',
      businessType: b.businessType || 'Manufacturer',
      establishedYear: b.establishedYear || new Date().getFullYear(),
      gstin: b.gstin || '',
      isVerified: Boolean(b.gstin),
      isFeatured: false,
      rating: 5.0,
      reviewCount: 1,
      phone: b.phone || '+91 98000 00000',
      whatsapp: (b.whatsapp || b.phone || '').replace(/[^0-9]/g, ''),
      email: b.email || currentUser?.email || 'contact@business.in',
      website: b.website || '',
      address: b.address || '',
      locality: b.locality || 'Industrial Area',
      city: b.city || 'Mumbai',
      district: b.district || b.city || 'Mumbai',
      state: b.state || 'Maharashtra',
      pincode: b.pincode || '400001',
      lat: 19.0760,
      lng: 72.8777,
      serviceAreas: ['All India'],
      certifications: b.certifications || ['MSME Registered'],
      openingHours: b.openingHours || 'Mon - Sat: 9:00 AM - 7:00 PM',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBusinesses(prev => [newBiz, ...prev]);
  };

  const updateBusiness = (id: string, updates: Partial<BusinessListing>) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b));
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const toggleBusinessVerification = (id: string) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, isVerified: !b.isVerified } : b));
  };

  const toggleBusinessFeatured = (id: string) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, isFeatured: !b.isFeatured } : b));
  };

  // Product Actions
  const addProduct = (p: Partial<ProductItem>) => {
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: p.name || 'New Product',
      slug: (p.name || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: p.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: p.category || 'Industrial Machinery & Equipment',
      subcategory: p.subcategory || 'Machinery',
      brand: p.brand || currentUser?.companyName || 'IndoTech',
      description: p.description || '',
      specifications: p.specifications || { 'Country of Origin': 'India', 'Warranty': '1 Year' },
      images: p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      sellerId: currentUser?.uid || 'seller-1',
      businessId: currentUser?.businessId || 'biz-1',
      businessName: currentUser?.companyName || 'Bharat Precision Forge & CNC Ltd',
      wholesalePrice: Number(p.wholesalePrice) || 1000,
      retailPrice: Number(p.retailPrice) || 1250,
      moq: Number(p.moq) || 5,
      priceUnit: p.priceUnit || 'Piece',
      stockQuantity: Number(p.stockQuantity) || 100,
      isWholesale: p.isWholesale ?? true,
      isRetail: p.isRetail ?? true,
      isApproved: true,
      isFeatured: false,
      deliveryTime: p.deliveryTime || '3-5 Days',
      originCountry: 'India',
      status: 'active',
      tags: p.tags || ['Made in India', 'Quality Assured'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // RFQ Actions
  const addRFQ = (r: Partial<RFQRequirement>) => {
    const newRfq: RFQRequirement = {
      id: `rfq-${Date.now()}`,
      buyerUid: currentUser?.uid || 'guest-buyer',
      buyerName: r.buyerName || currentUser?.displayName || 'Indian Buyer',
      buyerPhone: r.buyerPhone || currentUser?.phoneNumber || '+91 98000 12345',
      buyerEmail: r.buyerEmail || currentUser?.email || 'buyer@enterprise.in',
      title: r.title || 'Bulk Requirement',
      category: r.category || 'Industrial Machinery & Equipment',
      description: r.description || '',
      quantity: Number(r.quantity) || 100,
      unit: r.unit || 'Piece',
      targetBudget: Number(r.targetBudget) || undefined,
      deliveryCity: r.deliveryCity || selectedCity.split(',')[0] || 'Mumbai',
      deliveryState: r.deliveryState || 'Maharashtra',
      expectedDeliveryDate: r.expectedDeliveryDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      urgency: r.urgency || 'Immediate',
      status: 'Open',
      createdAt: new Date().toISOString(),
      quotationCount: 0
    };
    setRfqs(prev => [newRfq, ...prev]);
  };

  const addQuotation = (q: Partial<SupplierQuotation>) => {
    const newQuote: SupplierQuotation = {
      id: `quote-${Date.now()}`,
      rfqId: q.rfqId || '',
      rfqTitle: q.rfqTitle || '',
      supplierUid: currentUser?.uid || 'supplier-1',
      supplierBusinessName: currentUser?.companyName || 'Verified Supplier',
      supplierCity: currentUser?.city || 'Pune',
      unitPrice: Number(q.unitPrice) || 500,
      moq: Number(q.moq) || 10,
      totalEstimate: Number(q.totalEstimate) || 5000,
      deliveryDays: Number(q.deliveryDays) || 5,
      shippingTerms: q.shippingTerms || 'Standard transit with GST invoice',
      validityDays: Number(q.validityDays) || 15,
      notes: q.notes || 'Immediate dispatch available from factory stock.',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };
    setQuotations(prev => [newQuote, ...prev]);

    // Update quotation count on RFQ
    if (q.rfqId) {
      setRfqs(prev => prev.map(r => r.id === q.rfqId ? { ...r, quotationCount: (r.quotationCount || 0) + 1, status: 'Quotes Received' } : r));
    }
  };

  const updateQuotationStatus = (id: string, status: SupplierQuotation['status']) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  // Lead CRM Actions
  const addLead = (l: Partial<LeadItem>) => {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      businessId: l.businessId || 'biz-1',
      sellerUid: l.sellerUid || 'demo-seller-1',
      buyerName: l.buyerName || 'Prospective Client',
      buyerPhone: l.buyerPhone || '+91 98000 00000',
      buyerEmail: l.buyerEmail || 'buyer@client.in',
      buyerCity: l.buyerCity || selectedCity.split(',')[0] || 'Delhi',
      productTitle: l.productTitle || 'General Enquiry',
      quantity: l.quantity || '1 Lot',
      budget: l.budget,
      source: l.source || 'Product Page',
      status: 'New',
      notes: l.notes || 'Enquiry received via Business Connect.',
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadItem['status'], notes?: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes: notes !== undefined ? notes : l.notes } : l));
  };

  // Order Actions
  const createOrder = (orderData: Omit<OrderItem, 'id' | 'createdAt'>): OrderItem => {
    const newOrder: OrderItem = {
      ...orderData,
      id: `BC-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'Confirmed'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Reviews & Claims
  const addReview = (r: Partial<BusinessReview>) => {
    const newRev: BusinessReview = {
      id: `rev-${Date.now()}`,
      businessId: r.businessId || '',
      authorUid: currentUser?.uid,
      authorName: r.authorName || currentUser?.displayName || 'Verified Buyer',
      authorCity: r.authorCity || currentUser?.city || 'India',
      rating: r.rating || 5,
      comment: r.comment || 'Great service and authentic quality!',
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate business average rating
    if (r.businessId) {
      setBusinesses(prev => prev.map(b => {
        if (b.id === r.businessId) {
          const count = b.reviewCount + 1;
          const avg = ((b.rating * b.reviewCount) + (r.rating || 5)) / count;
          return { ...b, reviewCount: count, rating: Math.round(avg * 10) / 10 };
        }
        return b;
      }));
    }
  };

  const submitClaim = (c: Partial<BusinessClaimRequest>) => {
    const newClaim: BusinessClaimRequest = {
      id: `claim-${Date.now()}`,
      businessId: c.businessId || '',
      businessName: c.businessName || '',
      applicantUid: currentUser?.uid || 'user-claim',
      applicantName: c.applicantName || currentUser?.displayName || 'Applicant',
      applicantPhone: c.applicantPhone || currentUser?.phoneNumber || '+91 99999 99999',
      applicantEmail: c.applicantEmail || currentUser?.email || 'applicant@company.in',
      gstin: c.gstin || '',
      notes: c.notes || 'Ownership claim submitted with valid GSTIN documentation.',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setClaims(prev => [newClaim, ...prev]);
  };

  const reviewClaim = (id: string, status: 'Approved' | 'Rejected') => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (status === 'Approved') {
      const claim = claims.find(c => c.id === id);
      if (claim) {
        setBusinesses(prev => prev.map(b => b.id === claim.businessId ? { ...b, ownerUid: claim.applicantUid, isVerified: true } : b));
      }
    }
  };

  // Search Logging & Analytics Methods
  const logSearch = (query: string, resultCount: number, category?: string, city?: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const isZero = resultCount === 0;
    const newLogItem: SearchLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      query: trimmed,
      category: category || selectedCategory || 'All Categories',
      city: city || selectedCity,
      resultCount,
      isZeroResult: isZero,
      userRole: activeRole,
      timestamp: new Date().toISOString(),
    };
    setSearchLogs(prev => [newLogItem, ...prev.slice(0, 199)]);
    recordSearchLog(newLogItem).catch(e => console.warn('Background search log persist notice:', e));
  };

  const logCategoryClick = (categoryName: string) => {
    if (!categoryName) return;
    setCategoryClicks(prev => ({
      ...prev,
      [categoryName]: (prev[categoryName] || 0) + 1
    }));
  };

  const clearSearchLogs = () => {
    setSearchLogs([]);
    localStorage.removeItem('bc_search_logs');
  };

  const broadcastRfqFromDemand = (queryStr: string, category?: string, city?: string): RFQRequirement => {
    const cityName = city ? city.split(',')[0].trim() : 'Mumbai';
    const stateName = city ? city.split(',')[1]?.trim() || 'Maharashtra' : 'Maharashtra';
    const categoryName = category || 'Industrial Machinery & Equipment';

    const newRfq: RFQRequirement = {
      id: `rfq-demand-${Date.now()}`,
      buyerUid: currentUser?.uid || 'buyer-system',
      buyerName: currentUser?.displayName || 'National Procurement Desk',
      buyerPhone: currentUser?.phoneNumber || '+91 98110 55443',
      buyerEmail: currentUser?.email || 'procurement@businessconnect.in',
      title: `Bulk Procurement for ${queryStr.trim()}`,
      category: categoryName,
      description: `Commercial requirement triggered from high-intent buyer discovery on BUSINESS CONNECT for "${queryStr.trim()}". Seeking verified Indian manufacturers and wholesale distributors offering ISO compliance, fast dispatch to ${cityName}, ${stateName}, and competitive pricing.`,
      quantity: 50,
      unit: 'Units',
      targetBudget: 250000,
      deliveryCity: cityName,
      deliveryState: stateName,
      expectedDeliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      urgency: 'Within 15 Days',
      status: 'Open',
      createdAt: new Date().toISOString(),
      quotationCount: 0
    };

    setRfqs(prev => [newRfq, ...prev]);

    // Update log state so that subsequent search for this term returns positive result
    logSearch(queryStr, 1, categoryName, city || 'All India');

    return newRfq;
  };

  const addSeedBusinessForDemand = (queryStr: string, category?: string, city?: string): BusinessListing => {
    const cleanTerm = queryStr.trim();
    const capitalized = cleanTerm.charAt(0).toUpperCase() + cleanTerm.slice(1);
    const cityName = city ? city.split(',')[0].trim() : 'Pune';
    const stateName = city ? city.split(',')[1]?.trim() || 'Maharashtra' : 'Maharashtra';
    const categoryName = category || 'Industrial Machinery & Equipment';

    const newBiz: BusinessListing = {
      id: `biz-demand-${Date.now()}`,
      name: `${capitalized} Manufacturing Co. India`,
      slug: `${cleanTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-mfg-india`,
      category: categoryName,
      subcategory: cleanTerm,
      description: `Authorized manufacturer, exporter, and direct supplier of ${cleanTerm} based in ${cityName}, ${stateName}. Specializing in bulk industrial orders, custom OEM fabrication, and doorstep dispatch across all Indian states.`,
      logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
      ],
      ownerUid: currentUser?.uid || 'admin-seed',
      businessType: 'Manufacturer',
      establishedYear: 2018,
      gstin: `27AAACB${Math.floor(1000 + Math.random() * 9000)}K1ZV`,
      isVerified: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 8,
      phone: '+91 98200 11223',
      whatsapp: '919820011223',
      email: `sales@${cleanTerm.toLowerCase().replace(/[^a-z0-9]+/g, '')}india.com`,
      website: `https://www.${cleanTerm.toLowerCase().replace(/[^a-z0-9]+/g, '')}india.com`,
      address: `Plot 44, Phase II, MIDC Industrial Hub`,
      locality: `MIDC Industrial Area`,
      city: cityName,
      district: cityName,
      state: stateName,
      pincode: '411019',
      lat: 18.5204,
      lng: 73.8567,
      serviceAreas: ['All India', 'Export'],
      certifications: ['ISO 9001:2015', 'MSME Registered', 'Make In India Certified'],
      openingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBusinesses(prev => [newBiz, ...prev]);

    // Also add a matching product
    const newProd: ProductItem = {
      id: `prod-demand-${Date.now()}`,
      name: `${capitalized} - Industrial Grade Model X`,
      slug: `${cleanTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-model-x`,
      sku: `SKU-${cleanTerm.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      category: categoryName,
      subcategory: cleanTerm,
      brand: `${capitalized} India`,
      description: `High precision ${cleanTerm} fabricated using premium raw materials. Designed for high efficiency and heavy duty continuous operations.`,
      specifications: {
        'Compliance': 'ISO 9001:2015 / BIS',
        'Warranty': '24 Months Comprehensive',
        'Dispatch Lead Time': '3-5 Working Days',
        'Origin': 'Made in India'
      },
      images: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
      ],
      sellerId: newBiz.id,
      businessId: newBiz.id,
      businessName: newBiz.name,
      wholesalePrice: 45000,
      retailPrice: 52000,
      moq: 1,
      priceUnit: 'Unit',
      stockQuantity: 15,
      isWholesale: true,
      isRetail: true,
      isApproved: true,
      isFeatured: true,
      deliveryTime: '3-5 Days',
      originCountry: 'India',
      status: 'active',
      tags: [cleanTerm.toLowerCase(), 'industrial', 'verified manufacturer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);

    // Update log state
    logSearch(queryStr, 2, categoryName, city || 'All India');

    return newBiz;
  };

  // Site Settings & Dynamic Customization State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('bc_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          branding: { ...DEFAULT_SITE_SETTINGS.branding, ...parsed.branding },
          theme: { ...DEFAULT_SITE_SETTINGS.theme, ...parsed.theme },
          hero: { ...DEFAULT_SITE_SETTINGS.hero, ...parsed.hero },
          modules: { ...DEFAULT_SITE_SETTINGS.modules, ...parsed.modules },
          categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_SITE_SETTINGS.categories,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved site settings', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isRenderDeployModalOpen, setIsRenderDeployModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bc_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // Inject dynamic brand styles reactively for real-time live preview
  useEffect(() => {
    let styleEl = document.getElementById('dynamic-brand-styles') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-brand-styles';
      document.head.appendChild(styleEl);
    }
    const pc = siteSettings.theme.primaryColor;
    const pcd = siteSettings.theme.primaryColorDark;
    const ac = siteSettings.theme.accentColor;
    styleEl.innerHTML = `
      :root {
        --brand-primary: ${pc};
        --brand-dark: ${pcd};
        --brand-accent: ${ac};
      }
      .bg-\\[\\#16834A\\] { background-color: ${pc} !important; }
      .bg-\\[\\#0D5F38\\] { background-color: ${pcd} !important; }
      .text-\\[\\#16834A\\] { color: ${pc} !important; }
      .text-emerald-800 { color: ${pc} !important; }
      .border-\\[\\#16834A\\] { border-color: ${pc} !important; }
      .border-\\[\\#16834A\\]\\/30 { border-color: ${pc}4d !important; }
      .border-\\[\\#16834A\\]\\/40 { border-color: ${pc}66 !important; }
      .from-\\[\\#16834A\\] { --tw-gradient-from: ${pc} !important; }
      .to-\\[\\#0D5F38\\] { --tw-gradient-to: ${pcd} !important; }
      .hover\\:bg-\\[\\#0D5F38\\]:hover { background-color: ${pcd} !important; }
      .hover\\:text-\\[\\#16834A\\]:hover { color: ${pc} !important; }
      .focus-within\\:border-\\[\\#16834A\\]:focus-within { border-color: ${pc} !important; }
      .focus\\:border-\\[\\#16834A\\]:focus { border-color: ${pc} !important; }
    `;
  }, [siteSettings.theme]);

  const updateSiteSettings = (updater: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => {
    if (typeof updater === 'function') {
      setSiteSettings(updater);
    } else {
      setSiteSettings(prev => ({
        ...prev,
        ...updater,
        branding: updater.branding ? { ...prev.branding, ...updater.branding } : prev.branding,
        theme: updater.theme ? { ...prev.theme, ...updater.theme } : prev.theme,
        hero: updater.hero ? { ...prev.hero, ...updater.hero } : prev.hero,
        modules: updater.modules ? { ...prev.modules, ...updater.modules } : prev.modules,
        categories: updater.categories || prev.categories,
      }));
    }
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    localStorage.removeItem('bc_site_settings');
  };

  const addCategory = (category: CategoryItem) => {
    setSiteSettings(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    setSiteSettings(prev => ({
      ...prev,
      categories: prev.categories.map(cat => cat.id === id ? { ...cat, ...updated } : cat)
    }));
  };

  const deleteCategory = (id: string) => {
    setSiteSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== id)
    }));
  };

  const topSearchQueries = useMemo(() => computeTopQueries(searchLogs, 15), [searchLogs]);
  const zeroResultQueries = useMemo(() => computeZeroResultQueries(searchLogs, 15), [searchLogs]);
  const categoryPopularity = useMemo(() => computeCategoryPopularity(searchLogs, categoryClicks), [searchLogs, categoryClicks]);

  return (
    <AppContext.Provider
      value={{
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
        setActiveRole,
        loginWithGoogle,
        logout,
        switchDemoRole,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBusinessDetail,
        setSelectedBusinessDetail,
        selectedProductDetail,
        setSelectedProductDetail,
        businesses,
        products,
        rfqs,
        quotations,
        leads,
        orders,
        reviews,
        claims,
        favorites,
        toggleFavorite,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        toggleBusinessVerification,
        toggleBusinessFeatured,
        addProduct,
        updateProduct,
        deleteProduct,
        addRFQ,
        addQuotation,
        updateQuotationStatus,
        addLead,
        updateLeadStatus,
        createOrder,
        addReview,
        submitClaim,
        reviewClaim,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPostRfqModalOpen,
        setIsPostRfqModalOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isClaimModalOpen,
        setIsClaimModalOpen,
        isQrModalOpen,
        setIsQrModalOpen,
        qrBusiness,
        setQrBusiness,
        searchLogs,
        categoryClicks,
        logSearch,
        logCategoryClick,
        topSearchQueries,
        zeroResultQueries,
        categoryPopularity,
        clearSearchLogs,
        broadcastRfqFromDemand,
        addSeedBusinessForDemand,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isRenderDeployModalOpen,
        setIsRenderDeployModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
