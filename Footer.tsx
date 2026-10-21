import React from 'react';
import { useApp } from '../../context/AppContext';
import { INDIAN_CITIES, CATEGORIES_DATA } from '../../data/mockSeedData';
import { ShieldCheck, PhoneCall, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCity, setSelectedCategory, setActiveView, t } = useApp();

  return (
    <footer className="bg-[#101713] text-[#9EAEA3] pt-14 pb-8 border-t border-[#24332A] mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#24332A]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16834A]/20 text-[#16834A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">100% GSTIN Verified</div>
              <p className="mt-1 text-gray-400 text-[11px] leading-relaxed">
                Every listed manufacturer and wholesale supplier is checked against Government GST data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16834A]/20 text-[#16834A] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Escrow Buyer Protection</div>
              <p className="mt-1 text-gray-400 text-[11px] leading-relaxed">
                Secure payments held in designated trust accounts until sample approval and proof of dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16834A]/20 text-[#16834A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Real Quotations (RFQ)</div>
              <p className="mt-1 text-gray-400 text-[11px] leading-relaxed">
                Post your bulk requirement for free and receive competitive price quotes from top factory owners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16834A]/20 text-[#16834A] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Direct WhatsApp Connect</div>
              <p className="mt-1 text-gray-400 text-[11px] leading-relaxed">
                Chat directly with authorized sales directors and engineers without intermediary markups.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Columns Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-[#24332A]">
          {/* Col 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#16834A] flex items-center justify-center text-white font-bold text-sm">
                BC
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                BUSINESS <span className="text-[#16834A]">CONNECT</span>
              </span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-4">
              India's premier unified B2B wholesale portal, enterprise directory, and direct retail marketplace built to empower 63+ million Indian MSMEs.
            </p>
            <div className="space-y-1.5 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#16834A]" />
                <span>BKC Bandra-Kurla Complex, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#16834A]" />
                <span>Support: 1800-209-8800 (Mon - Sat 9am to 7pm IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#16834A]" />
                <span>help@businessconnect.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Major Industrial Cities */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Key Industrial Hubs
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
              {INDIAN_CITIES.slice(1, 11).map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setActiveView('directory');
                  }}
                  className="text-left hover:text-[#16834A] transition truncate cursor-pointer"
                >
                  {city.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Product Categories */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {CATEGORIES_DATA.slice(0, 6).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setActiveView('b2b');
                    }}
                    className="hover:text-[#16834A] transition text-left cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Portals */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Portals & Services
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setActiveView('rfq-board')} className="hover:text-[#16834A] transition cursor-pointer">
                  → Post Buying Requirement (RFQ)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('directory')} className="hover:text-[#16834A] transition cursor-pointer">
                  → Search Business Directory
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('b2b')} className="hover:text-[#16834A] transition cursor-pointer">
                  → Wholesale B2B Price Index
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('b2c')} className="hover:text-[#16834A] transition cursor-pointer">
                  → Retail Shopping & Doorstep Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-[#16834A] transition cursor-pointer">
                  → Supplier & Seller Hub CRM
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} BUSINESS CONNECT India Pvt Ltd. All rights reserved. Made for Make in India & Atmanirbhar Bharat.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-300 cursor-pointer">GST Compliance</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Security Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
