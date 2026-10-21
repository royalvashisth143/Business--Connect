import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Send, 
  Handshake, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  PlusCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HowItWorksAndFaq: React.FC = () => {
  const { setIsPostRfqModalOpen, setActiveView, t } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const stepsBuyer = [
    {
      step: '01',
      title: 'Post Requirement (RFQ)',
      desc: 'Specify your product specs, target quantity, delivery city in India, and target budget in 60 seconds.',
      icon: FileCheck2
    },
    {
      step: '02',
      title: 'Receive Direct Quotes',
      desc: 'Verified manufacturers & mills submit competitive per-unit rates, MOQs, and lead times directly.',
      icon: Send
    },
    {
      step: '03',
      title: 'Compare & Chat on WhatsApp',
      desc: 'Examine certifications, past client reviews, and connect directly with factory directors without middlemen.',
      icon: Handshake
    },
    {
      step: '04',
      title: 'Escrow Protected Fulfillment',
      desc: 'Pay through secure payment gateway with GST invoice and dispatch tracking right to your factory gates.',
      icon: ShieldCheck
    }
  ];

  const faqs = [
    {
      q: 'How does BUSINESS CONNECT verify Indian businesses and GSTIN?',
      a: 'We validate the legal entity name, active registration status, state jurisdiction, and principal place of business directly against official GSTIN and MSME Udyam databases before issuing the verified green badge.'
    },
    {
      q: 'Is there any fee to post a bulk buying requirement (RFQ)?',
      a: 'No, posting an RFQ is 100% free for all buyers, corporate purchasing teams, and contractors. You can specify custom technical drawings, batch quantities, and delivery timelines.'
    },
    {
      q: 'Can I sell both wholesale (B2B) and single retail pieces (B2C)?',
      a: 'Yes! Our dual marketplace architecture allows suppliers to set wholesale tier pricing with a Minimum Order Quantity (MOQ) as well as retail pricing with instant checkout and integrated doorstep courier dispatch.'
    },
    {
      q: 'How do digital product catalogues and QR codes work?',
      a: 'Every registered company receives a dedicated mini-website URL and an auto-generated QR code. You can download and print this QR code on your product packaging, visiting cards, or exhibition stalls for instant mobile scanning.'
    },
    {
      q: 'How are payments protected on the platform?',
      a: 'We support instant UPI, NetBanking, and credit/debit card checkouts with server-verified status. For high-value bulk transactions, buyers can utilize milestone escrow payments where funds are released only after satisfactory dispatch.'
    }
  ];

  const testimonials = [
    {
      quote: "BUSINESS CONNECT transformed our Pune CNC machine tool exports. We received over ₹1.4 Crore worth of qualified commercial enquiries in just 90 days with zero commission on direct leads.",
      author: "Rajeshwar Shinde",
      title: "Managing Director",
      company: "Bharat Precision Forge & CNC Ltd",
      city: "Pune, Maharashtra"
    },
    {
      quote: "As a wholesale boutique buyer in Delhi, finding authentic Surat jacquard weaver mills used to require physical travel every month. Now I post my requirements and receive verified factory pricing within 2 hours.",
      author: "Pooja Malhotra",
      title: "Head of Sourcing",
      company: "Vogue Sarees & Textiles",
      city: "Delhi NCR"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#101713]">
      
      {/* 1. Big Post RFQ Banner Card */}
      <section className="py-12 bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-black/10 rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Free Buying Requirement Desk
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {t('postRfqTitle')}
              </h2>
              <p className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed">
                {t('postRfqSubtitle')}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-emerald-100">
                <span>✓ 50,000+ Verified Suppliers</span>
                <span>✓ Average response within 3 hours</span>
                <span>✓ Direct WhatsApp negotiation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => setIsPostRfqModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white text-[#0D5F38] hover:bg-emerald-50 font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-[#16834A]" />
                <span>Post Your RFQ Free</span>
              </button>
              <button
                onClick={() => setActiveView('rfq-board')}
                className="px-5 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Open RFQs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-14 border-b border-[#E2E8E4] dark:border-[#24332A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider mb-1">
              Simple 4-Step Sourcing Workflow
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('howItWorks')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Streamlining procurement, lead generation, and wholesale commerce for Indian enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {stepsBuyer.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div 
                  key={st.step}
                  className="relative p-6 rounded-2xl bg-[#F5F8F6] dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#16834A] flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black text-gray-300 dark:text-gray-700 font-mono">
                        {st.step}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Testimonials */}
      <section className="py-14 bg-[#F5F8F6] dark:bg-[#141C17] border-b border-[#E2E8E4] dark:border-[#24332A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('testimonials')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((tItem, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#16834A]/40 mb-3" />
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{tItem.quote}"
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1]">
                      {tItem.author}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {tItem.title}, {tItem.company}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#16834A] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {tItem.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ) */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {t('faqs')}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Everything you need to know about purchasing, listing, verification, and quotations.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#18221C] transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#18231D] dark:text-[#F0F4F1] hover:text-[#16834A] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#16834A]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
