import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  exportSearchLogsCSV, 
  exportZeroResultDemandCSV, 
  generateSearchMetricsSummary 
} from '../../lib/searchAnalytics';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Download, 
  Radio, 
  CheckCircle2, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  MapPin, 
  Tag, 
  ArrowUpRight, 
  Sparkles,
  Send,
  Building,
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';

export const SearchAnalyticsDashboard: React.FC = () => {
  const { 
    searchLogs, 
    categoryClicks, 
    topSearchQueries, 
    zeroResultQueries, 
    categoryPopularity, 
    clearSearchLogs,
    logSearch,
    broadcastRfqFromDemand,
    addSeedBusinessForDemand,
    setSearchQuery,
    setSelectedCategory,
    setActiveView
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'top' | 'zero' | 'categories' | 'stream'>('zero');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [testSearchInput, setTestSearchInput] = useState<string>('');
  const [testCategoryInput, setTestCategoryInput] = useState<string>('Industrial Machinery & Equipment');
  const [testCityInput, setTestCityInput] = useState<string>('Mumbai, Maharashtra');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const metrics = generateSearchMetricsSummary(searchLogs, categoryClicks);

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4500);
  };

  const handleSimulateTestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSearchInput.trim()) return;
    
    // Simulate with 0 results if it contains "custom" or "unmet", otherwise 2
    const isZero = testSearchInput.toLowerCase().includes('zero') || 
                   testSearchInput.toLowerCase().includes('custom') || 
                   testSearchInput.toLowerCase().includes('machine');
    const resultCount = isZero ? 0 : 2;

    logSearch(testSearchInput.trim(), resultCount, testCategoryInput, testCityInput);
    showNotification(`Logged simulated search for "${testSearchInput.trim()}" (${resultCount} results found)`);
    setTestSearchInput('');
  };

  const handleBroadcastRfq = (query: string, category?: string, city?: string) => {
    const created = broadcastRfqFromDemand(query, category, city);
    showNotification(`Created & Broadcasted Platform RFQ "${created.title}"! Suppliers can now submit wholesale bids.`);
  };

  const handleOnboardSupplier = (query: string, category?: string, city?: string) => {
    const biz = addSeedBusinessForDemand(query, category, city);
    showNotification(`Onboarded verified supplier "${biz.name}" and catalogued product to satisfy buyer demand!`);
  };

  const handleInspectQuery = (query: string, category?: string) => {
    setSearchQuery(query);
    if (category) setSelectedCategory(category);
    setActiveView('directory');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-medium text-xs flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner & Action Controls */}
      <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#16834A] flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#16834A] animate-pulse" /> Live Search Intelligence Utility
            </span>
            <span className="text-xs text-gray-400">
              India MSME B2B & B2C Discovery Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#18231D] dark:text-[#F0F4F1] tracking-tight">
            Search Demand & Content Discovery Hub
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Real-time tracking of buyer search intent, unmet demand queries with zero matching suppliers, and category click-through engagement across all Indian industrial hubs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportSearchLogsCSV(searchLogs)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#101713] border border-gray-200 dark:border-gray-700 hover:border-[#16834A] text-gray-700 dark:text-gray-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download full search query log stream as CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#16834A]" />
            <span>Export Search Logs (CSV)</span>
          </button>

          <button
            onClick={() => exportZeroResultDemandCSV(zeroResultQueries)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download zero-result queries as supplier recruitment lead list"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Export Unmet Demand (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Searches Tracked</span>
            <Search className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#18231D] dark:text-[#F0F4F1] mt-2">
            {metrics.totalSearches}
          </div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <span>{metrics.uniqueQueries} unique query terms</span>
          </div>
        </div>

        {/* Metric 2: Unmet Zero-Result Demand */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-amber-200 dark:border-amber-900/60 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>Unmet Demand (Zero Results)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {metrics.zeroResultCount}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-500/80 mt-1 flex items-center gap-1">
            <span className="font-bold">{metrics.zeroResultRate}% of all searches</span>
            <span>• Supplier acquisition leads</span>
          </div>
        </div>

        {/* Metric 3: Top Query */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Top Searched Query</span>
            <TrendingUp className="w-4 h-4 text-[#16834A]" />
          </div>
          <div className="text-base sm:text-lg font-black text-[#16834A] mt-2 truncate capitalize">
            {metrics.topQuery}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {metrics.topQueryCount} recorded searches in 24h
          </div>
        </div>

        {/* Metric 4: Top Category */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18221C] border border-gray-200 dark:border-gray-800 shadow-xs relative overflow-hidden">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Most Active Category</span>
            <Layers className="w-4 h-4 text-[#16834A]" />
          </div>
          <div className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-200 mt-2 truncate">
            {metrics.topCategory}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Highest search + click engagement
          </div>
        </div>

      </div>

      {/* Interactive Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('zero')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'zero'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Unmet Demand (Zero Results)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'zero' ? 'bg-white text-amber-700 font-black' : 'bg-amber-100 text-amber-800'
          }`}>
            {zeroResultQueries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('top')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'top'
              ? 'bg-[#16834A] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Top Search Queries</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSubTab === 'top' ? 'bg-white text-[#16834A] font-black' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {topSearchQueries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'categories'
              ? 'bg-[#16834A] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Popular Categories ({categoryPopularity.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('stream')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'stream'
              ? 'bg-[#16834A] text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#18221C]'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Search Stream ({searchLogs.length})</span>
        </button>
      </div>

      {/* 1. ZERO-RESULT SEARCHES (UNMET DEMAND & ACTIONABLE LEADS) */}
      {activeSubTab === 'zero' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  Actionable Sourcing Opportunities & Unmet Demand
                </h4>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                  These keywords were searched by real corporate buyers and retailers in India, but yielded 0 results. You can convert each query into an active buying RFQ or instantly onboard a verified supplier to capture marketplace GMV.
                </p>
              </div>
            </div>
            <button
              onClick={() => exportZeroResultDemandCSV(zeroResultQueries)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Demand List
            </button>
          </div>

          <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Unmet Buyer Query</th>
                  <th className="pb-3">Industry Category</th>
                  <th className="pb-3">Target City/Region</th>
                  <th className="pb-3 text-center">Searches</th>
                  <th className="pb-3 text-center">Opportunity Level</th>
                  <th className="pb-3 text-right">Super Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {zeroResultQueries.map((item, idx) => (
                  <tr key={item.query} className="py-3 hover:bg-gray-50/50 dark:hover:bg-[#101713] transition">
                    <td className="py-3.5 font-bold text-gray-400">#{idx + 1}</td>
                    <td className="py-3.5">
                      <div className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1] flex items-center gap-2">
                        <span>{item.query}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Last requested: {new Date(item.lastSearched).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 font-medium">
                        <MapPin className="w-3 h-3 text-[#16834A]" />
                        <span>{item.city || 'All India'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="font-extrabold text-sm text-amber-600">
                        {item.count}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.count >= 2 
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.count >= 2 ? 'High Demand' : 'Medium Demand'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1-click broadcast RFQ */}
                        <button
                          onClick={() => handleBroadcastRfq(item.query, item.category, item.city)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Broadcast as platform RFQ requirement so Indian suppliers can bid"
                        >
                          <Send className="w-3 h-3" />
                          <span>Broadcast RFQ</span>
                        </button>

                        {/* 1-click onboard seed supplier */}
                        <button
                          onClick={() => handleOnboardSupplier(item.query, item.category, item.city)}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#101713] border border-gray-300 dark:border-gray-700 hover:border-[#16834A] text-gray-700 dark:text-gray-300 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Register matching verified Indian manufacturer and catalog product"
                        >
                          <Building className="w-3 h-3 text-[#16834A]" />
                          <span>Add Supplier</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TOP SEARCH QUERIES TAB */}
      {activeSubTab === 'top' && (
        <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
              Ranked Popular Search Terms across India
            </h3>
            <span className="text-xs text-gray-500">
              Top {topSearchQueries.length} High-Intent Queries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Search Query Keyword</th>
                  <th className="pb-3">Industry Category</th>
                  <th className="pb-3 text-center">Total Volume</th>
                  <th className="pb-3 text-center">Avg Results Found</th>
                  <th className="pb-3">Last Searched</th>
                  <th className="pb-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {topSearchQueries.map((item, idx) => (
                  <tr key={item.query} className="py-3 hover:bg-gray-50/50 dark:hover:bg-[#101713] transition">
                    <td className="py-3 font-bold text-gray-400">#{idx + 1}</td>
                    <td className="py-3">
                      <div className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#16834A]" />
                        <span className="capitalize">{item.query}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-gray-800 font-medium">
                        {item.category || 'All Categories'}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="font-black text-sm text-[#16834A]">
                        {item.count}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.avgResults > 0 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {item.avgResults} listings
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-[11px]">
                      {new Date(item.lastSearched).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleInspectQuery(item.query, item.category)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#16834A] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[#16834A]/30 transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Results</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. POPULAR CATEGORIES DISCOVERY TAB */}
      {activeSubTab === 'categories' && (
        <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
                Category Engagement & Sector Popularity
              </h3>
              <p className="text-xs text-gray-500">
                Ranking based on search volume + homepage & catalog click-throughs.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              Weighted Interest Index
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryPopularity.map((cat, idx) => {
              const maxScore = (categoryPopularity[0]?.clickCount || 100) + (categoryPopularity[0]?.searchCount || 10) * 2;
              const currentScore = cat.clickCount + cat.searchCount * 2;
              const percent = Math.min(100, Math.round((currentScore / (maxScore || 1)) * 100));

              return (
                <div
                  key={cat.category}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#101713] space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[#16834A] flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-[#18231D] dark:text-[#F0F4F1]">
                        {cat.category}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.category);
                        setActiveView('b2b');
                      }}
                      className="text-[11px] font-bold text-[#16834A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#16834A] to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                    <span>{cat.clickCount} Directory / Grid Clicks</span>
                    <span>{cat.searchCount} Direct Searches</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Score: {currentScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. REAL-TIME LIVE SEARCH STREAM TAB */}
      {activeSubTab === 'stream' && (
        <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1] flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Real-Time Search Event Stream</span>
              </h3>
              <p className="text-xs text-gray-500">
                Audited query log events across web and mobile visitors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear search logs? This will reset all discovery metrics.')) {
                    clearSearchLogs();
                    showNotification('Search logs cleared.');
                  }
                }}
                className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition font-medium flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Logs</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="pb-3">Timestamp (IST)</th>
                  <th className="pb-3">Buyer Query</th>
                  <th className="pb-3">Industry Category</th>
                  <th className="pb-3">City Location</th>
                  <th className="pb-3">User Role</th>
                  <th className="pb-3 text-right">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {searchLogs.slice(0, 30).map((log) => (
                  <tr key={log.id} className="py-2.5 hover:bg-gray-50/50 dark:hover:bg-[#101713] transition">
                    <td className="py-2.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{log.query}</span>
                    </td>
                    <td className="py-2.5 text-gray-500 text-[11px]">
                      {log.category || 'All Categories'}
                    </td>
                    <td className="py-2.5 text-gray-500 text-[11px]">
                      {log.city || 'All India'}
                    </td>
                    <td className="py-2.5">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {log.userRole || 'visitor'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {log.isZeroResult ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          0 Results (Unmet)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {log.resultCount} Found
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SIMULATE & TEST SEARCH LOGGING CONSOLE */}
      <div className="bg-white dark:bg-[#18221C] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#16834A]" />
          <h3 className="font-extrabold text-sm sm:text-base text-[#18231D] dark:text-[#F0F4F1]">
            Search Logging Utility Test Console
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Test search logging triggers, verify zero-result detection, and simulate buyer queries to view immediate dashboard synchronization.
        </p>

        <form onSubmit={handleSimulateTestSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="e.g. 500kva diesel generator or zero-result machine..."
              value={testSearchInput}
              onChange={(e) => setTestSearchInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={testCityInput}
              onChange={(e) => setTestCityInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#101713] text-[#18231D] dark:text-[#F0F4F1] focus:border-[#16834A] focus:outline-hidden cursor-pointer"
            >
              <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
              <option value="Delhi NCR, Delhi">Delhi NCR, Delhi</option>
              <option value="Surat, Gujarat">Surat, Gujarat</option>
              <option value="Bengaluru, Karnataka">Bengaluru, Karnataka</option>
              <option value="Pune, Maharashtra">Pune, Maharashtra</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-[#16834A] hover:bg-[#0D5F38] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Search Log</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
