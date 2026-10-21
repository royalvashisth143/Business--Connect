import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, Copy, ShieldCheck, Check, QrCode } from 'lucide-react';

export const QRModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen, qrBusiness } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isQrModalOpen || !qrBusiness) return null;
  const biz = qrBusiness;

  const profileUrl = `${window.location.origin}/#business/${biz.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    // Generate an image or alert
    alert(`QR Code for "${biz.name}" ready for printing on brochures, business cards, and packaging!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#18221C] rounded-3xl max-w-sm w-full my-6 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-center">
        
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#141C17]">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#16834A]" />
            <h3 className="font-extrabold text-xs text-[#18231D] dark:text-[#F0F4F1]">
              Digital Catalogue QR Code
            </h3>
          </div>
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-xl mx-auto overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xs">
            <img src={biz.logo} alt={biz.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#18231D] dark:text-[#F0F4F1]">
              {biz.name}
            </h4>
            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834A]" />
              <span>GSTIN: {biz.gstin || '27AAACB2234K1ZV'}</span>
            </div>
          </div>

          {/* Clean High-Density SVG QR Pattern */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-md inline-block">
            <svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer border & markers */}
              <rect width="200" height="200" fill="white" />
              
              {/* Top-Left Corner Box */}
              <rect x="20" y="20" width="46" height="46" rx="8" stroke="#16834A" strokeWidth="10" />
              <rect x="34" y="34" width="18" height="18" rx="4" fill="#0D5F38" />

              {/* Top-Right Corner Box */}
              <rect x="134" y="20" width="46" height="46" rx="8" stroke="#16834A" strokeWidth="10" />
              <rect x="148" y="34" width="18" height="18" rx="4" fill="#0D5F38" />

              {/* Bottom-Left Corner Box */}
              <rect x="20" y="134" width="46" height="46" rx="8" stroke="#16834A" strokeWidth="10" />
              <rect x="34" y="148" width="18" height="18" rx="4" fill="#0D5F38" />

              {/* Matrix Data Blocks */}
              <rect x="76" y="24" width="8" height="8" fill="#18231D" />
              <rect x="92" y="24" width="16" height="8" fill="#18231D" />
              <rect x="116" y="24" width="8" height="8" fill="#18231D" />
              <rect x="76" y="40" width="16" height="8" fill="#18231D" />
              <rect x="100" y="40" width="8" height="16" fill="#18231D" />
              <rect x="116" y="48" width="8" height="8" fill="#18231D" />
              <rect x="84" y="56" width="8" height="8" fill="#18231D" />

              <rect x="24" y="76" width="8" height="16" fill="#18231D" />
              <rect x="40" y="76" width="16" height="8" fill="#18231D" />
              <rect x="64" y="76" width="8" height="8" fill="#18231D" />
              <rect x="80" y="76" width="16" height="8" fill="#16834A" />
              <rect x="104" y="76" width="8" height="16" fill="#18231D" />
              <rect x="120" y="76" width="16" height="8" fill="#18231D" />
              <rect x="144" y="76" width="8" height="8" fill="#18231D" />
              <rect x="160" y="76" width="16" height="8" fill="#18231D" />

              {/* Center Logo Badge */}
              <rect x="82" y="82" width="36" height="36" rx="8" fill="#16834A" />
              <text x="100" y="105" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">BC</text>

              <rect x="24" y="100" width="16" height="8" fill="#18231D" />
              <rect x="48" y="100" width="8" height="16" fill="#18231D" />
              <rect x="64" y="108" width="8" height="8" fill="#18231D" />
              <rect x="128" y="100" width="8" height="16" fill="#18231D" />
              <rect x="144" y="108" width="16" height="8" fill="#18231D" />
              <rect x="168" y="100" width="8" height="8" fill="#18231D" />

              <rect x="76" y="128" width="16" height="8" fill="#18231D" />
              <rect x="100" y="128" width="8" height="16" fill="#18231D" />
              <rect x="116" y="128" width="16" height="8" fill="#18231D" />

              <rect x="76" y="152" width="8" height="16" fill="#18231D" />
              <rect x="92" y="160" width="16" height="8" fill="#18231D" />
              <rect x="116" y="152" width="8" height="16" fill="#18231D" />
              <rect x="132" y="136" width="8" height="8" fill="#18231D" />
              <rect x="148" y="144" width="16" height="8" fill="#18231D" />
              <rect x="172" y="136" width="8" height="16" fill="#18231D" />
            </svg>
          </div>

          <p className="text-[11px] text-gray-500 leading-tight">
            Scan to view live products, verified certifications, and contact options directly on any smartphone.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-[#16834A] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16834A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-3 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
