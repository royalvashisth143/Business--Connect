import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessListing } from '../../types';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Calendar, 
  QrCode, 
  Building, 
  Package, 
  Send, 
  Flag, 
  Share2,
  CheckCircle2
} from 'lucide-react';

export const BusinessDetailModal: React.FC = () => {
  const { 
    selectedBusinessDetail, 
    setSelectedBusinessDetail, 
    products, 
    setSelectedProductDetail, 
    reviews, 
    addReview, 
    setQrBusiness, 
    setIsQrModalOpen, 
    setIsClaimModalOpen,
    currentUser,
    addLead
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalogue' | 'about' | 'reviews' | 'contact'>('catalogue');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryText, setEnquiryText] = useState('');
  const [enquiryQuantity, setEnquiryQuantity] = useState('100 Pieces');

  if (!selectedBusinessDetail) return null;
  const biz = selectedBusinessDetail;

  const bizProducts = products.filter(p => p.businessId === biz.id);
  const bizReviews = reviews.filter(r => r.businessId === biz.id);

  const handleWhatsappEnquiry = (productName?: string) => {
    const text = encodeURIComponent(`Hello ${biz.name}, I am interested in ${productName || 'your products'} on BUSINESS CONNECT. Please provide wholesale quotation and technical datasheet.`);
    window.open(`https://wa.me/${biz.whatsapp}?text=${text}`, '_blank');
  };

  const handleSendLeadEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      businessId: biz.id,
      sellerUid: biz.ownerUid || 'seller-1',
      buyerName: currentUser?.displayName || 'Prospective Indian Buyer',
      buyerPhone: currentUser?.phoneNumber || '+91 98000 00000',
      buyerEmail: currentUser?.email || 'buyer@enterprise.in',
      buyerCity: currentUser?.city || 'Mumbai',
      productTitle: enquiryText || `${biz.category} Bulk Order`,
      quantity: enquiryQuantity,
      source: 'Directory',
      notes: `Direct portal enquiry: "${enquiryText || 'Catalogue and quote requested.'}"`
    });
    setEnquirySuccess(true);
    setTimeout(() => setEnquirySuccess(false), 4000);
    setEnquiryText('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    addReview({
      businessId: biz.id,
      rating: newReviewRating,
      comment: newReviewComment,
    });
    setNewReviewComment('');
    alert('Thank you! Your verified business review has been published.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header Cover Banner */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden shrink-0">
          <img
            src={biz.bannerImage || biz.gallery[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
            alt={biz.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30"></div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedBusinessDetail(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Business Meta on Cover */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <img
                src={biz.logo}
                alt={biz.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-[#18221C] shadow-lg bg-white shrink-0"
              />
              <div className="text-white">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16834A] text-white uppercase">
                    {biz.businessType}
                  </span>
                  {biz.isVerified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> GSTIN Verified
                    </span>
                  )}
                  <span className="text-[11px] text-white/80">Estd. {biz.establishedYear}</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight drop-shadow-sm">
                  {biz.name}
                </h2>
                <div className="text-xs text-white/90 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{biz.city}, {biz.state}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{biz.rating}</span>
                    <span className="text-white/70 font-normal">({biz.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setQrBusiness(biz);
                  setIsQrModalOpen(true);
                }}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition cursor-pointer"
                title="View Catalogue QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleWhatsappEnquiry()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 flex items-center space-x-6 text-xs font-bold overflow-x-auto shrink-0 bg-gray-50/50 dark:bg-[#141C17]">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'catalogue' ? 'border-[#16834A] text-[#16834A]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalogue ({bizProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'about' ? 'border-[#16834A] text-[#16834A]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>About & Certifications</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'border-[#16834A] text-[#16834A]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({bizReviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'contact' ? 'border-[#16834A] text-[#16834A]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Contact & Map Location</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PRODUCT CATALOGUE */}
          {activeTab === 'catalogue' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
                  Official Products & Wholesale Catalogues
                </h3>
                <span className="text-xs text-gray-500">
                  Direct Factory Prices in INR (₹)
                </span>
              </div>

              {bizProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bizProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#101713] flex gap-3 hover:border-[#16834A] transition"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                        onClick={() => setSelectedProductDetail(prod)}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#16834A]">
                            MOQ: {prod.moq} {prod.priceUnit}s
                          </span>
                          <h4 
                            onClick={() => setSelectedProductDetail(prod)}
                            className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1] line-clamp-1 hover:text-[#16834A] cursor-pointer"
                          >
                            {prod.name}
                          </h4>
                          <div className="text-xs font-extrabold text-[#16834A] mt-1">
                            ₹{prod.wholesalePrice.toLocaleString('en-IN')}
                            <span className="text-[10px] text-gray-500 font-normal"> / {prod.priceUnit}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => setSelectedProductDetail(prod)}
                            className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#16834A] underline cursor-pointer"
                          >
                            Specs
                          </button>
                          <button
                            onClick={() => handleWhatsappEnquiry(prod.name)}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <MessageCircle className="w-3 h-3" /> Get Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-[#101713] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    No individual catalog items uploaded yet. Send a direct enquiry below to request full PDF catalogue.
                  </p>
                </div>
              )}

              {/* Instant Direct RFQ / Lead Enquiry Form */}
              <div className="mt-8 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-[#16834A]" />
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#0D5F38] dark:text-emerald-300">
                    Send Direct Bulk Enquiry to {biz.name}
                  </h4>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-4">
                  Your request is logged directly in the seller's CRM dashboard and sent via instant SMS/WhatsApp notification.
                </p>

                {enquirySuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your quotation enquiry has been sent to the sales team successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSendLeadEnquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Required Product or Specification *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 50 Sets CK6150 Lathe or Custom Turning parts"
                        value={enquiryText}
                        onChange={(e) => setEnquiryText(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Quantity & Delivery City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500 Pieces, delivery to Pune"
                        value={enquiryQuantity}
                        onChange={(e) => setEnquiryQuantity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Quotation Request</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & CERTIFICATIONS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] mb-2">
                  Company Overview
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {biz.description}
                </p>
              </div>

              {/* Compliance & Verification Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                    <span>Legal & GSTIN Compliance</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>GSTIN: <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{biz.gstin || '27AAACB2234K1ZV'}</span></div>
                    <div>Entity Type: <span className="font-semibold text-gray-800 dark:text-gray-200">{biz.businessType}</span></div>
                    <div>Jurisdiction: <span className="font-semibold text-gray-800 dark:text-gray-200">{biz.state}, India</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#16834A]" />
                    <span>Operating & Factory Hours</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>Hours: <span className="font-semibold text-gray-800 dark:text-gray-200">{biz.openingHours || 'Mon - Sat: 9:00 AM - 7:00 PM'}</span></div>
                    <div>Coverage: <span className="font-semibold text-gray-800 dark:text-gray-200">Pan-India & Global Freight</span></div>
                  </div>
                </div>
              </div>

              {/* Claim Listing CTA */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Flag className="w-4 h-4" /> Are you the owner of this enterprise?
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-400 mt-0.5">
                    Claim this business listing with your GSTIN documents to update catalog items and receive verified RFQ leads.
                  </p>
                </div>
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer shrink-0"
                >
                  Claim Listing
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
                    Customer & Buyer Ratings
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {biz.rating} out of 5 ({biz.reviewCount} total reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {bizReviews.length > 0 ? (
                  bizReviews.map(r => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1]">
                          {r.authorName} {r.authorCity ? `(${r.authorCity})` : ''}
                        </div>
                        <div className="flex text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        "{r.comment}"
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2">
                        Verified Indian Buyer • {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No reviews submitted yet for this listing.</p>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101713] border border-gray-200 dark:border-gray-800">
                <h4 className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1] mb-2">
                  Write a Verified Review
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setNewReviewRating(st)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${st <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={3}
                    placeholder="Share your business experience regarding lead time, build quality, and packaging..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    Publish Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & MAP */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Direct Contact Points
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#16834A]" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{biz.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">+{biz.whatsapp} (WhatsApp Business)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#16834A]" />
                      <span>{biz.email}</span>
                    </div>
                    {biz.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#16834A]" />
                        <a href={biz.website} target="_blank" rel="noreferrer" className="text-[#16834A] hover:underline">
                          {biz.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Factory & Plant Address
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{biz.address}</div>
                    <div>Locality: {biz.locality}</div>
                    <div>City & District: {biz.city}, {biz.district}</div>
                    <div>State: {biz.state} - {biz.pincode}</div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                      Coordinates: {biz.lat.toFixed(4)}° N, {biz.lng.toFixed(4)}° E
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Canvas Representation */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 h-52 bg-emerald-950/20 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#16834A_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-[#16834A] text-white flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs text-gray-800 dark:text-gray-200">
                    {biz.name}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {biz.address}, {biz.city}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18221C] flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16834A]" />
            <span>Escrow Protected Inquiries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWhatsappEnquiry()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </button>
            <button
              onClick={() => setSelectedBusinessDetail(null)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
