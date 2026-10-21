import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RFQRequirement } from '../../types';
import { X, Send, ShieldCheck, DollarSign, Clock, Truck } from 'lucide-react';

interface QuotationModalProps {
  rfq: RFQRequirement | null;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ rfq, onClose }) => {
  const { addQuotation, currentUser } = useApp();

  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [moq, setMoq] = useState<number>(rfq?.quantity ? Math.min(10, rfq.quantity) : 10);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [shippingTerms, setShippingTerms] = useState('FOR Destination with transit insurance and GST invoice');
  const [validityDays, setValidityDays] = useState<number>(14);
  const [notes, setNotes] = useState('Immediate mill dispatch with test certificate and quality guarantee included.');

  if (!rfq) return null;

  const totalEstimate = unitPrice * (rfq.quantity || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unitPrice <= 0) {
      alert('Please enter a valid unit quotation price in INR (₹).');
      return;
    }

    addQuotation({
      rfqId: rfq.id,
      rfqTitle: rfq.title,
      supplierUid: currentUser?.uid || 'supplier-1',
      supplierBusinessName: currentUser?.companyName || currentUser?.displayName || 'Bharat Precision Forge & CNC Ltd',
      supplierCity: currentUser?.city || 'Pune',
      unitPrice,
      moq,
      totalEstimate,
      deliveryDays,
      shippingTerms,
      validityDays,
      notes,
    });

    onClose();
    alert(`Quotation of ₹${totalEstimate.toLocaleString('en-IN')} submitted to buyer! You can track this lead in your Seller/Supplier Hub.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-lg w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Supplier Quotation Submission
            </span>
            <h3 className="text-base font-extrabold tracking-tight">
              Submit Quotation for RFQ #{rfq.id.slice(-6)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RFQ Summary Card */}
        <div className="p-4 bg-gray-50 dark:bg-[#101713] border-b border-gray-200 dark:border-gray-800 text-xs space-y-1">
          <div className="font-bold text-gray-800 dark:text-gray-200">
            {rfq.title}
          </div>
          <div className="text-gray-500 flex flex-wrap gap-2 text-[11px]">
            <span>Required: <strong className="text-gray-700 dark:text-gray-300">{rfq.quantity} {rfq.unit}s</strong></span>
            <span>•</span>
            <span>Destination: <strong className="text-gray-700 dark:text-gray-300">{rfq.deliveryCity}</strong></span>
            {rfq.targetBudget && (
              <>
                <span>•</span>
                <span>Budget: <strong className="text-[#16834A]">₹{rfq.targetBudget.toLocaleString('en-IN')}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Quotation Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Quoted Unit Price (₹ / {rfq.unit}) *
              </label>
              <input
                type="number"
                required
                min={1}
                step={0.5}
                placeholder="e.g. 520"
                value={unitPrice || ''}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Supplier MOQ ({rfq.unit}s)
              </label>
              <input
                type="number"
                min={1}
                value={moq}
                onChange={(e) => setMoq(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Computed Total Box */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-900 dark:text-emerald-300">
              Total Quotation Value ({rfq.quantity} {rfq.unit}s):
            </span>
            <span className="text-base font-extrabold text-[#16834A]">
              ₹{totalEstimate.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Dispatch Timeline (Days)
              </label>
              <input
                type="number"
                min={1}
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Price Validity (Days)
              </label>
              <input
                type="number"
                min={1}
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Freight & Shipping Terms
            </label>
            <input
              type="text"
              value={shippingTerms}
              onChange={(e) => setShippingTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Remarks & Technical Compliance Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#16834A] hover:bg-[#0D5F38] rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Formal Quotation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
