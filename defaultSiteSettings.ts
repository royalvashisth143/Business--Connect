import { SiteSettings } from '../types';
import { CATEGORIES_DATA } from './mockSeedData';

export const THEME_PRESETS = [
  {
    id: 'emerald',
    name: 'Emerald Bharat (Default)',
    primaryColor: '#16834A',
    primaryColorDark: '#0D5F38',
    accentColor: '#F59E0B',
    previewBg: 'bg-emerald-600',
    description: 'Fresh Indian enterprise emerald green'
  },
  {
    id: 'navy',
    name: 'Bharat Navy & Blue',
    primaryColor: '#1E40AF',
    primaryColorDark: '#172554',
    accentColor: '#38BDF8',
    previewBg: 'bg-blue-700',
    description: 'Corporate B2B trust & industrial navy'
  },
  {
    id: 'saffron',
    name: 'Royal Saffron & Amber',
    primaryColor: '#D97706',
    primaryColorDark: '#92400E',
    accentColor: '#FBBF24',
    previewBg: 'bg-amber-600',
    description: 'Warm auspicious Indian trade gold'
  },
  {
    id: 'ruby',
    name: 'Crimson Ruby & Rose',
    primaryColor: '#BE123C',
    primaryColorDark: '#881337',
    accentColor: '#FB7185',
    previewBg: 'bg-rose-700',
    description: 'Bold vibrant wholesale marketplace'
  },
  {
    id: 'teal',
    name: 'Industrial Teal & Cyan',
    primaryColor: '#0F766E',
    primaryColorDark: '#134E4A',
    accentColor: '#2DD4BF',
    previewBg: 'bg-teal-700',
    description: 'Modern clean supply chain engineering'
  },
  {
    id: 'violet',
    name: 'Vibrant Violet & Indigo',
    primaryColor: '#6D28D9',
    primaryColorDark: '#4C1D95',
    accentColor: '#A78BFA',
    previewBg: 'bg-purple-700',
    description: 'High-tech modern digital commerce'
  },
  {
    id: 'slate',
    name: 'Executive Slate & Charcoal',
    primaryColor: '#334155',
    primaryColorDark: '#0F172A',
    accentColor: '#64748B',
    previewBg: 'bg-slate-700',
    description: 'Minimalist enterprise executive look'
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  branding: {
    siteName: 'BUSINESS CONNECT',
    siteNameHighlight: 'CONNECT',
    logoInitial: 'BC',
    tagline: 'India B2B & B2C Hub',
    headerBadgeText: 'GST & MSME Verified Ecosystem',
    headerNotice: "India's integrated B2B wholesale portal, enterprise directory & direct retail marketplace",
    currencySymbol: '₹',
    helplinePhone: '+91 1800 200 4567',
    supportEmail: 'contact@businessconnect.in',
    supportWhatsApp: '+91 98200 12345',
    headquartersCity: 'Mumbai & New Delhi, India',
    announcementTickerText: '🎉 Bharat MSME Expo 2026 Live: Verified Suppliers offering 10% Extra Wholesale Margin on Bulk Orders',
    showAnnouncementTicker: true,
  },
  theme: {
    primaryColor: '#16834A',
    primaryColorDark: '#0D5F38',
    accentColor: '#F59E0B',
    borderRadius: 'rounded-xl',
    presetName: 'Emerald Bharat (Default)',
  },
  hero: {
    badgeText: 'India’s #1 Verified Business Sourcing & MSME Marketplace',
    headlineStart: 'Connect Directly with',
    headlineHighlight: 'Verified Indian',
    headlineEnd: 'Manufacturers & Suppliers',
    subheadline: 'Zero middleman margins. Sourcing for 10 Lakh+ registered MSMEs across India with GST verification, real-time RFQs, and secure wholesale orders.',
    stat1Value: '10 Lakh+',
    stat1Label: 'Registered Businesses',
    stat2Value: '50,000+',
    stat2Label: 'Verified Suppliers',
    stat3Value: '₹500 Cr+',
    stat3Label: 'RFQs Closed',
    stat4Value: '99.8%',
    stat4Label: 'GST Verified',
  },
  modules: {
    enableB2BMarketplace: true,
    enableB2CMarketplace: true,
    enableDirectory: true,
    enableRfqBoard: true,
    enableGeolocationDiscovery: true,
    enableTrendingProducts: true,
    enableVerifiedSuppliers: true,
    enableFaqSection: true,
  },
  categories: CATEGORIES_DATA
};
