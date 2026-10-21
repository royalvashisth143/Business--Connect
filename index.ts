export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'seller' 
  | 'supplier' 
  | 'buyer' 
  | 'business_owner' 
  | 'customer' 
  | 'support_staff';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  roles: UserRole[];
  activeRole: UserRole;
  businessId?: string;
  companyName?: string;
  city?: string;
  state?: string;
  gstin?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export type BusinessType = 
  | 'Manufacturer' 
  | 'Wholesaler' 
  | 'Distributor' 
  | 'Retailer' 
  | 'Service Provider';

export interface BusinessListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description: string;
  logo: string;
  bannerImage?: string;
  gallery: string[];
  ownerUid?: string;
  businessType: BusinessType;
  establishedYear: number;
  gstin?: string;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  address: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  serviceAreas?: string[];
  certifications?: string[];
  openingHours?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory?: string;
  brand: string;
  model?: string;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  sellerId: string;
  businessId: string;
  businessName: string;
  wholesalePrice: number;
  retailPrice: number;
  moq: number; // Minimum Order Quantity
  priceUnit: string; // e.g., 'Piece', 'Meter', 'Kg', 'Ton', 'Box'
  stockQuantity: number;
  isWholesale: boolean;
  isRetail: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  deliveryTime: string;
  originCountry: string;
  status: 'active' | 'pending' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RFQRequirement {
  id: string;
  buyerUid: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  targetBudget?: number;
  deliveryCity: string;
  deliveryState: string;
  expectedDeliveryDate: string;
  urgency: 'Immediate' | 'Within 15 Days' | 'Within 1 Month' | 'Flexible';
  status: 'Open' | 'Quotes Received' | 'Closed' | 'Awarded';
  createdAt: string;
  quotationCount?: number;
}

export interface SupplierQuotation {
  id: string;
  rfqId: string;
  rfqTitle: string;
  supplierUid: string;
  supplierBusinessName: string;
  supplierCity: string;
  unitPrice: number;
  moq: number;
  totalEstimate: number;
  deliveryDays: number;
  shippingTerms: string;
  validityDays: number;
  notes: string;
  status: 'Submitted' | 'Accepted' | 'Rejected' | 'Negotiating';
  createdAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Quoted' | 'Negotiating' | 'Won' | 'Lost';

export interface LeadItem {
  id: string;
  businessId: string;
  sellerUid: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerCity: string;
  productTitle: string;
  quantity: string;
  budget?: number;
  source: 'Directory' | 'Product Page' | 'WhatsApp' | 'RFQ';
  status: LeadStatus;
  notes: string;
  followUpDate?: string;
  createdAt: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  unitPrice: number;
  isWholesaleOrder?: boolean;
}

export interface OrderItem {
  id: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    businessId: string;
    businessName: string;
  }[];
  subtotal: number;
  gstAmount: number;
  shippingCharge: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface BusinessReview {
  id: string;
  businessId: string;
  authorUid?: string;
  authorName: string;
  authorCity?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface BusinessClaimRequest {
  id: string;
  businessId: string;
  businessName: string;
  applicantUid: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  gstin: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface SearchLog {
  id: string;
  query: string;
  category: string;
  city: string;
  resultCount: number;
  isZeroResult: boolean;
  userRole: string;
  timestamp: string;
}

export interface TopSearchMetric {
  query: string;
  count: number;
  avgResults: number;
  lastSearched: string;
  category?: string;
}

export interface ZeroResultMetric {
  query: string;
  count: number;
  category?: string;
  city?: string;
  lastSearched: string;
}

export interface CategoryPopularityMetric {
  category: string;
  searchCount: number;
  clickCount: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  count: string;
  image: string;
  subcategories: string[];
}

export interface SiteBrandingConfig {
  siteName: string;
  siteNameHighlight: string;
  logoInitial: string;
  tagline: string;
  headerBadgeText: string;
  headerNotice: string;
  currencySymbol: string;
  helplinePhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  headquartersCity: string;
  announcementTickerText: string;
  showAnnouncementTicker: boolean;
}

export interface SiteThemeConfig {
  primaryColor: string;
  primaryColorDark: string;
  accentColor: string;
  borderRadius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  presetName: string;
}

export interface SiteHeroConfig {
  badgeText: string;
  headlineStart: string;
  headlineHighlight: string;
  headlineEnd: string;
  subheadline: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
}

export interface SiteModulesConfig {
  enableB2BMarketplace: boolean;
  enableB2CMarketplace: boolean;
  enableDirectory: boolean;
  enableRfqBoard: boolean;
  enableGeolocationDiscovery: boolean;
  enableTrendingProducts: boolean;
  enableVerifiedSuppliers: boolean;
  enableFaqSection: boolean;
}

export interface SiteSettings {
  branding: SiteBrandingConfig;
  theme: SiteThemeConfig;
  hero: SiteHeroConfig;
  modules: SiteModulesConfig;
  categories: CategoryItem[];
}

