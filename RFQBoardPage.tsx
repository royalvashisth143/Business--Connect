import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RFQRequirement } from '../../types';
import { CATEGORIES_DATA } from '../../data/mockSeedData';
import { QuotationModal } from './QuotationModal';
import { 
  FileCheck2, 
  MapPin, 
  Calendar, 
  Clock, 
  Send, 
  PlusCircle, 
  CheckCircle, 
  Building,
  Filter,
  DollarSign
} from 'lucide-react';

export const RFQBoardPage: React.FC = () => {
  const { 
    rfqs, 
    quotations, 
    setIsPostRfqModalOpen, 
    currentUser, 
    selectedCity 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<RFQRequirement | null>(null);
  const [viewQuotesRfqId, setViewQuotesRfqId] = useState<string | null>(null);

  const filteredRfqs = rfqs.filter(r => {
    if (selectedCategory && r.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F8F6] dark:bg-[#101713] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-[#16834A] font-semibold">Bulk Procurement RFQ Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              Live Buyer Requirements & Request For Quotations (RFQ)
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Direct procurement needs from corporate buyers, infrastructure projects, and wholesale distributors across India.
            </p>
          </div>

          <button
            onClick={() => setIsPostRfqModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-extrabold text-xs shadow-lg transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Buying RFQ (Free)</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === ''
                ? 'bg-[#16834A] text-white shadow-xs'
                : 'bg-white dark:bg-[#18221C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
            }`}
          >
            All Sectors ({rfqs.length})
          </button>
          {CATEGORIES_DATA.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedCategory === c.name
                  ? 'bg-[#16834A] text-white shadow-xs'
                  : 'bg-white dark:bg-[#18221C] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* RFQ List Grid */}
        <div className="space-y-4">
          {filteredRfqs.map((rfq) => {
            const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id);
            const isViewingQuotes = viewQuotesRfqId === rfq.id;

            return (
              <div
                key={rfq.id}
                className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-xs hover:border-[#16834A] transition"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] uppercase">
                        {rfq.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rfq.urgency === 'Immediate' 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        Urgency: {rfq.urgency}
                      </span>
                      <span className="text-xs text-gray-400">
                        Posted {new Date(rfq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#18231D] dark:text-[#F0F4F1] leading-snug">
                      {rfq.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {rfq.description}
                    </p>

                    {/* Meta info tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Required Qty:</span>
                        <strong className="text-gray-900 dark:text-gray-100">{rfq.quantity} {rfq.unit}s</strong>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16834A]" />
                        <span>Delivery to: <strong className="text-gray-900 dark:text-gray-100">{rfq.deliveryCity}, {rfq.deliveryState}</strong></span>
                      </div>

                      {rfq.targetBudget && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">Buyer Budget:</span>
                          <strong className="text-[#16834A]">₹{rfq.targetBudget.toLocaleString('en-IN')}</strong>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Needed by: {rfq.expectedDeliveryDate}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-2">
                      <span>Buyer: {rfq.buyerName}</span>
                      <span>•</span>
                      <span>Quotes Received: <strong className="text-[#16834A]">{rfqQuotes.length}</strong></span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:w-44">
                    <button
                      onClick={() => setSelectedRfqForQuote(rfq)}
                      className="px-4 py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Quote</span>
                    </button>

                    {rfqQuotes.length > 0 && (
                      <button
                        onClick={() => setViewQuotesRfqId(isViewingQuotes ? null : rfq.id)}
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition cursor-pointer text-center"
                      >
                        {isViewingQuotes ? 'Hide Quotes' : `View ${rfqQuotes.length} Quotes`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Received Quotes Drawer */}
                {isViewingQuotes && (
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-in fade-in">
                    <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider">
                      Submitted Quotations ({rfqQuotes.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rfqQuotes.map(q => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 dark:text-gray-200">
                              {q.supplierBusinessName}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              {q.supplierCity}
                            </span>
                          </div>

                          <div className="text-base font-extrabold text-[#16834A]">
                            ₹{q.unitPrice.toLocaleString('en-IN')}
                            <span className="text-xs font-normal text-gray-500"> / {rfq.unit}</span>
                          </div>

                          <div className="text-[11px] text-gray-500 space-y-0.5">
                            <div>Total Estimate: <strong>₹{q.totalEstimate.toLocaleString('en-IN')}</strong></div>
                            <div>Dispatch in: <strong>{q.deliveryDays} Days</strong></div>
                            <div>Terms: {q.shippingTerms}</div>
                          </div>

                          {q.notes && (
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 italic pt-1 border-t border-gray-200/60 dark:border-gray-800">
                              "{q.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Quotation Submission Modal */}
      {selectedRfqForQuote && (
        <QuotationModal
          rfq={selectedRfqForQuote}
          onClose={() => setSelectedRfqForQuote(null)}
        />
      )}

    </div>
  );
};
