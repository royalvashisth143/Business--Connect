import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  MessageCircle, 
  QrCode, 
  ArrowRight,
  Award,
  Calendar,
  Building
} from 'lucide-react';

export const VerifiedSuppliersSection: React.FC = () => {
  const { 
    businesses, 
    setSelectedBusinessDetail, 
    setActiveView, 
    t, 
    setIsQrModalOpen, 
    setQrBusiness 
  } = useApp();

  const verifiedListings = businesses.filter(b => b.isVerified);

  const handleWhatsappEnquiry = (whatsapp: string, businessName: string) => {
    const text = encodeURIComponent(`Hello ${businessName}, I found your company listing on BUSINESS CONNECT and would like to request product catalogue and wholesale pricing.`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section className="py-12 bg-white dark:bg-[#101713] border-b border-[#E2E8E4] dark:border-[#24332A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> High Trust & Compliance
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('verifiedSuppliers')}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('verifiedSuppliersSub')}
            </p>
          </div>
          <button
            onClick={() => setActiveView('directory')}
            className="text-xs font-bold text-[#16834A] hover:text-[#0D5F38] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedListings.slice(0, 6).map((biz) => {
            return (
              <div
                key={biz.id}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#F5F8F6] dark:bg-[#18221C] hover:border-[#16834A] hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Logo, Type & Verified Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={biz.logo}
                        alt={biz.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] uppercase">
                          {biz.businessType}
                        </span>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Estd. {biz.establishedYear}
                        </div>
                      </div>
                    </div>

                    {/* QR Code Action */}
                    <button
                      onClick={() => {
                        setQrBusiness(biz);
                        setIsQrModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-[#101713] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#16834A] hover:border-[#16834A] transition shadow-xs cursor-pointer"
                      title="View Digital Catalogue QR"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Business Name */}
                  <h3 
                    onClick={() => setSelectedBusinessDetail(biz)}
                    className="font-bold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] hover:text-[#16834A] transition cursor-pointer line-clamp-1"
                  >
                    {biz.name}
                  </h3>

                  {/* Rating & Location */}
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating}</span>
                      <span className="text-gray-400 text-[11px] font-normal">({biz.reviewCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#16834A] shrink-0" />
                      <span className="truncate">{biz.city}, {biz.state}</span>
                    </div>
                  </div>

                  {/* GSTIN & Certifications */}
                  <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-[#101713] border border-gray-100 dark:border-gray-800 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16834A]" /> GSTIN:
                      </span>
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{biz.gstin || '27AAACB2234K1ZV'}</span>
                    </div>
                    {biz.certifications && biz.certifications.length > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/80">
                        <span className="text-gray-400">Certifications:</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[170px]">
                          {biz.certifications.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBusinessDetail(biz)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-lg border border-gray-300 dark:border-gray-700 hover:border-[#16834A] text-gray-800 dark:text-gray-200 hover:text-[#16834A] bg-white dark:bg-[#101713] transition text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => handleWhatsappEnquiry(biz.whatsapp, biz.name)}
                    className="py-2 px-3.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Direct WhatsApp Enquiry"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
