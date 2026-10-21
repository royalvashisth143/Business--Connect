import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_DATA, INDIAN_CITIES } from '../../data/mockSeedData';
import { 
  X, 
  FileCheck2, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Send 
} from 'lucide-react';

export const PostRFQModal: React.FC = () => {
  const { 
    isPostRfqModalOpen, 
    setIsPostRfqModalOpen, 
    addRFQ, 
    currentUser, 
    selectedCity,
    setActiveView 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES_DATA[0].name);
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('Piece');
  const [budget, setBudget] = useState('');
  const [deliveryCity, setDeliveryCity] = useState(selectedCity === 'All India' ? 'Mumbai' : selectedCity.split(',')[0]);
  const [deliveryState, setDeliveryState] = useState('Maharashtra');
  const [expectedDate, setExpectedDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [urgency, setUrgency] = useState<'Immediate' | 'Within 15 Days' | 'Within 1 Month' | 'Flexible'>('Within 15 Days');
  const [description, setDescription] = useState('');
  const [buyerName, setBuyerName] = useState(currentUser?.displayName || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phoneNumber || '');

  if (!isPostRfqModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRFQ({
      title,
      category,
      quantity: Number(quantity) || 1,
      unit,
      targetBudget: budget ? Number(budget) : undefined,
      deliveryCity,
      deliveryState,
      expectedDeliveryDate: expectedDate,
      urgency,
      description,
      buyerName: buyerName || 'Indian Enterprise Buyer',
      buyerPhone: buyerPhone || '+91 98000 12345',
    });

    setIsPostRfqModalOpen(false);
    alert('Your Buying Requirement (RFQ) has been published to verified suppliers across India! Suppliers will submit quotations shortly.');
    setActiveView('rfq-board');
  };

  const unitsList = [
    'Piece', 
    'Metric Ton', 
    'Kilogram (Kg)', 
    'Meter', 
    'Box', 
    'Set', 
    'Liter', 
    'Square Foot'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-2xl w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Free Corporate Sourcing
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Post Your Buying Requirement (RFQ)
            </h2>
            <p className="text-xs text-white/90 mt-1">
              Connect with primary mills, OEM manufacturers, and verified suppliers across India.
            </p>
          </div>

          <button
            onClick={() => setIsPostRfqModalOpen(false)}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Requirement Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              What product or raw material are you looking for? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 50 Metric Tons TMT Steel Rebars Fe 550D or 10,000 Mtr Cotton Fabric"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          {/* Category & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              >
                {CATEGORIES_DATA.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              >
                {unitsList.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Expected Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Target Budget (Optional ₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Delivery Destination City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Pune, Delhi NCR"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e: any) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
              >
                <option value="Immediate">Immediate (Within 48 Hours)</option>
                <option value="Within 15 Days">Within 15 Days</option>
                <option value="Within 1 Month">Within 1 Month</option>
                <option value="Flexible">Flexible Planning</option>
              </select>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Specifications / Quality Standards / Drawings
            </label>
            <textarea
              rows={3}
              placeholder="State any specific dimensions, grade (e.g. SS316, Fe550D, GSM), test certificates required, packaging preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          {/* Contact Details */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#101713] border border-gray-200 dark:border-gray-800 space-y-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Buyer Contact Verification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Name / Enterprise Name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1]"
              />
              <input
                type="tel"
                placeholder="Mobile / WhatsApp Number (+91)"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18221C] text-[#18231D] dark:text-[#F0F4F1]"
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Your contact details are protected. Only verified matching suppliers can submit quotations.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPostRfqModalOpen(false)}
              className="px-5 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#16834A] hover:bg-[#0D5F38] rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Requirement Now</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
