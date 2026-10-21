import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadStatus } from '../../types';
import { 
  Building, 
  Package, 
  FileCheck2, 
  ShoppingCart, 
  Users, 
  ShieldCheck, 
  Download, 
  PlusCircle, 
  Trash2, 
  Check, 
  X, 
  Star, 
  QrCode, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  Kanban, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Radio
} from 'lucide-react';
import { SearchAnalyticsDashboard } from './SearchAnalyticsDashboard';

export const DashboardRouter: React.FC = () => {
  const { 
    activeRole, 
    currentUser, 
    businesses, 
    products, 
    rfqs, 
    quotations, 
    leads, 
    orders, 
    claims, 
    reviewClaim, 
    toggleBusinessVerification, 
    toggleBusinessFeatured, 
    deleteBusiness,
    deleteProduct,
    updateLeadStatus,
    setIsAddProductModalOpen,
    setQrBusiness,
    setIsQrModalOpen,
    setSelectedBusinessDetail,
    setSelectedProductDetail,
    searchLogs,
    topSearchQueries,
    zeroResultQueries
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Export to CSV helper
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(v => typeof v === 'object' ? `"${JSON.stringify(v).replace(/"/g, '""')}"` : `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for Super Admin
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalVerifiedBiz = businesses.filter(b => b.isVerified).length;

  return (
    <div className="min-h-screen bg-[#F5F8F6] dark:bg-[#101713] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#16834A] text-white uppercase">
                {activeRole.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">
                {currentUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
              {activeRole === 'super_admin' ? 'Super Admin Control Center' : 
               activeRole === 'admin' ? 'Operations & Moderation Desk' :
               activeRole === 'seller' || activeRole === 'supplier' ? 'Supplier & Seller Commercial Hub' :
               'Buyer & Customer Account Portal'}
            </h1>
          </div>

          {/* Quick Action CTA based on Role */}
          <div className="flex items-center gap-2">
            {(activeRole === 'seller' || activeRole === 'supplier') && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Product</span>
              </button>
            )}

            {activeRole === 'super_admin' && (
              <button
                onClick={() => exportToCSV(businesses, 'BusinessConnect_Businesses')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#18221C] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:border-[#16834A] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800 mb-6 scrollbar-none text-xs font-bold">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#16834A] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
            }`}
          >
            Overview Metrics
          </button>

          {(activeRole === 'super_admin' || activeRole === 'admin') && (
            <>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeTab === 'moderation'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                Directory Moderation ({businesses.length})
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'claims'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                <span>GST Claims Queue</span>
                {claims.filter(c => c.status === 'Pending').length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {claims.filter(c => c.status === 'Pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('search_analytics')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'search_analytics'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search & Demand Analytics</span>
                {zeroResultQueries.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {zeroResultQueries.length} Unmet
                  </span>
                )}
              </button>
            </>
          )}

          {(activeRole === 'seller' || activeRole === 'supplier') && (
            <>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                My Products & Catalog ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('crm')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'crm'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Buyer Lead CRM ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeTab === 'quotes'
                    ? 'bg-[#16834A] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
                }`}
              >
                Quotes Sent ({quotations.length})
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#16834A] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('rfqs')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'rfqs'
                ? 'bg-[#16834A] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
            }`}
          >
            Procurement RFQs ({rfqs.length})
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Total Active Businesses
                </div>
                <div className="text-2xl font-black text-[#16834A] mt-1">
                  {businesses.length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {totalVerifiedBiz} GSTIN Verified
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Marketplace Products
                </div>
                <div className="text-2xl font-black text-[#16834A] mt-1">
                  {products.length}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  B2B Wholesale + B2C Retail
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Leads & RFQ Inquiries
                </div>
                <div className="text-2xl font-black text-[#16834A] mt-1">
                  {rfqs.length + leads.length}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {quotations.length} Active Quotes Submitted
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Order Invoiced Total
                </div>
                <div className="text-2xl font-black text-[#16834A] mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {orders.length} Verified Orders
                </div>
              </div>
            </div>

            {/* Super Admin Search & Discovery Telemetry Card */}
            {(activeRole === 'super_admin' || activeRole === 'admin') && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#18221C] to-[#101713] border border-gray-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Search Telemetry
                    </span>
                    <span className="text-xs text-amber-400 font-bold">
                      {zeroResultQueries.length} Unmet Demand Queries Recorded
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    Buyer Discovery & Search Demand Intelligence
                  </h3>
                  <p className="text-xs text-gray-400 max-w-2xl">
                    Top searched keyword: <strong className="text-emerald-300 capitalize">{topSearchQueries[0]?.query || 'None'}</strong> ({topSearchQueries[0]?.count || 0} searches). Buyers are actively seeking unmet items such as <strong className="text-amber-300">"{zeroResultQueries[0]?.query || 'industrial tooling'}"</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('search_analytics')}
                  className="px-4 py-2.5 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  <span>Open Demand Hub</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Profile Card for Seller / Supplier */}
            {(activeRole === 'seller' || activeRole === 'supplier') && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D5F38] to-[#16834A] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase">
                    Seller Profile Score: 92% Complete
                  </span>
                  <h3 className="text-lg font-extrabold mt-1">
                    {currentUser?.companyName || 'Bharat Precision Forge & CNC Ltd'}
                  </h3>
                  <p className="text-xs text-white/90 mt-0.5">
                    GSTIN: {currentUser?.gstin || '27AAACB2234K1ZV'} • City: {currentUser?.city || 'Pune'} • Verified Manufacturer Status Active
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const biz = businesses[0];
                      if (biz) {
                        setQrBusiness(biz);
                        setIsQrModalOpen(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-white text-[#0D5F38] hover:bg-emerald-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Download QR Code</span>
                  </button>
                </div>
              </div>
            )}

            {/* Recent Orders Preview */}
            <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
              <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] mb-4">
                Recent Orders & Invoices
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.slice(0, 5).map(ord => (
                      <tr key={ord.id} className="py-2.5">
                        <td className="py-3 font-mono font-bold text-[#16834A]">{ord.id}</td>
                        <td className="py-3">
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{ord.customerName}</div>
                          <div className="text-[10px] text-gray-500">{ord.shippingAddress.city}</div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {ord.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 font-bold text-gray-800 dark:text-gray-200">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-emerald-600">{ord.orderStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. DIRECTORY MODERATION (SUPER ADMIN / ADMIN) */}
        {activeTab === 'moderation' && (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
                Directory Moderation & Verification Actions
              </h3>
              <span className="text-xs text-gray-500">
                Total {businesses.length} Listed Enterprises
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                    <th className="pb-3">Enterprise</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">GSTIN</th>
                    <th className="pb-3 text-center">Verified</th>
                    <th className="pb-3 text-center">Featured</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {businesses.map(b => (
                    <tr key={b.id} className="py-2.5">
                      <td className="py-3">
                        <div className="font-bold text-gray-800 dark:text-gray-200">{b.name}</div>
                        <div className="text-[10px] text-gray-500">{b.businessType} • Estd. {b.establishedYear}</div>
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">{b.category}</td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">{b.city}, {b.state}</td>
                      <td className="py-3 font-mono text-[11px]">{b.gstin || 'Pending'}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => toggleBusinessVerification(b.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            b.isVerified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                          }`}
                        >
                          {b.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => toggleBusinessFeatured(b.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            b.isFeatured ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                          }`}
                        >
                          {b.isFeatured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteBusiness(b.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CLAIMS QUEUE (SUPER ADMIN / ADMIN) */}
        {activeTab === 'claims' && (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
              Business Ownership Verification Claims
            </h3>

            {claims.length > 0 ? (
              <div className="space-y-3">
                {claims.map(cl => (
                  <div
                    key={cl.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#101713] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                        Claim on: {cl.businessName}
                      </div>
                      <div className="text-gray-500 mt-0.5">
                        Applicant: <strong>{cl.applicantName}</strong> ({cl.applicantEmail}, {cl.applicantPhone})
                      </div>
                      <div className="font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                        Submitted GSTIN: {cl.gstin}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {cl.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => reviewClaim(cl.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-[#16834A] text-white font-bold hover:bg-[#0D5F38] cursor-pointer"
                          >
                            Approve & Verify
                          </button>
                          <button
                            onClick={() => reviewClaim(cl.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          cl.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cl.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No pending business claim requests.</p>
            )}
          </div>
        )}

        {/* 4. SELLER PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
                Catalog Products & Inventory
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#16834A] text-white font-bold text-xs hover:bg-[#0D5F38] cursor-pointer flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#101713] flex gap-3 relative"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#18231D] dark:text-[#F0F4F1] truncate">
                      {p.name}
                    </h4>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      MOQ: {p.moq} {p.priceUnit}s • Stock: {p.stockQuantity}
                    </div>
                    <div className="text-xs font-extrabold text-[#16834A] mt-1">
                      ₹{p.wholesalePrice.toLocaleString('en-IN')} (Wholesale)
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProductDetail(p)}
                        className="text-[10px] font-bold text-[#16834A] hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BUYER LEAD CRM KANBAN PIPELINE */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#18231D] dark:text-[#F0F4F1]">
                  Buyer Lead CRM & Quotation Pipeline
                </h3>
                <p className="text-xs text-gray-500">
                  Track qualified purchase enquiries from directory visitors, product pages, and WhatsApp.
                </p>
              </div>
            </div>

            {/* Pipeline Columns */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(['New', 'Contacted', 'Quoted', 'Negotiating', 'Won'] as LeadStatus[]).map(status => {
                const columnLeads = leads.filter(l => l.status === status);
                return (
                  <div
                    key={status}
                    className="p-3 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 space-y-2 min-h-[300px]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span>{status}</span>
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] flex items-center justify-center text-[10px]">
                        {columnLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {columnLeads.map(lead => (
                        <div
                          key={lead.id}
                          className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-[#101713] text-xs space-y-1.5 shadow-2xs"
                        >
                          <div className="font-bold text-gray-800 dark:text-gray-200">
                            {lead.buyerName}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            {lead.productTitle}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Qty: {lead.quantity}
                          </div>

                          <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-[10px]">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className="text-[10px] font-semibold bg-white dark:bg-[#18221C] border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Quoted">Quoted</option>
                              <option value="Negotiating">Negotiating</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>

                            <button
                              onClick={() => {
                                const text = encodeURIComponent(`Hello ${lead.buyerName}, following up regarding your enquiry for ${lead.productTitle} on BUSINESS CONNECT.`);
                                window.open(`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                              }}
                              className="text-emerald-600 font-bold hover:underline"
                            >
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. ORDERS & SHIPMENTS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
              Orders & Commercial Dispatches
            </h3>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(o => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#101713] space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#16834A]">{o.id}</span>
                        <span className="text-gray-400 ml-2">Placed on {new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {o.orderStatus}
                        </span>
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                          ₹{o.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">Purchased Items:</div>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                          {o.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{it.productName} (x{it.quantity})</span>
                              <span className="font-bold">₹{it.subtotal.toLocaleString('en-IN')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">Shipping Destination:</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {o.shippingAddress.fullName}<br/>
                          {o.shippingAddress.addressLine}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No orders recorded yet.</p>
            )}
          </div>
        )}

        {/* 7. RFQS TAB */}
        {activeTab === 'rfqs' && (
          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
              Procurement RFQs & Buyer Demands
            </h3>
            <div className="space-y-3">
              {rfqs.map(r => (
                <div key={r.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#101713] text-xs space-y-1">
                  <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{r.title}</div>
                  <div className="text-gray-500">
                    Category: {r.category} • Qty: {r.quantity} {r.unit}s • Destination: {r.deliveryCity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. SEARCH & DEMAND ANALYTICS (SUPER ADMIN / ADMIN) */}
        {activeTab === 'search_analytics' && (
          <SearchAnalyticsDashboard />
        )}

      </div>
    </div>
  );
};
