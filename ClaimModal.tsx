import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Flag, Send } from 'lucide-react';

export const ClaimModal: React.FC = () => {
  const { 
    isClaimModalOpen, 
    setIsClaimModalOpen, 
    selectedBusinessDetail, 
    submitClaim, 
    currentUser 
  } = useApp();

  const [applicantName, setApplicantName] = useState(currentUser?.displayName || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phoneNumber || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [gstin, setGstin] = useState('');
  const [notes, setNotes] = useState('');

  if (!isClaimModalOpen || !selectedBusinessDetail) return null;
  const biz = selectedBusinessDetail;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !gstin) {
      alert('Please provide your name, phone number, and official GSTIN to verify ownership.');
      return;
    }

    submitClaim({
      businessId: biz.id,
      businessName: biz.name,
      applicantName,
      applicantPhone,
      applicantEmail,
      gstin: gstin.toUpperCase(),
      notes,
    });

    setIsClaimModalOpen(false);
    alert(`Ownership claim for "${biz.name}" submitted successfully! Our compliance admin team will verify your GSTIN details within 24 business hours.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-md w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 to-amber-600 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" /> Ownership Verification
            </span>
            <h3 className="text-base font-extrabold tracking-tight">
              Claim "{biz.name}"
            </h3>
          </div>
          <button
            onClick={() => setIsClaimModalOpen(false)}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[11px]">
            To protect genuine Indian enterprises against unauthorized takeovers, please provide your contact details and active GSTIN certificate reference.
          </p>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Applicant Full Name / Authorized Signatory *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rameshwar Patel (Director)"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Official Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98000 00000"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                placeholder="md@company.in"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Company GSTIN (15 Digits) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 27AAACB2234K1ZV"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
              Supporting Proof / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="State your role (Proprietor / Partner / Director) and proof of identity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ownership Claim</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
