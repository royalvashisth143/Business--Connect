import { collection, addDoc, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SearchLog, TopSearchMetric, ZeroResultMetric, CategoryPopularityMetric } from '../types';

export const INITIAL_SEARCH_LOGS: SearchLog[] = [
  // High volume top queries
  {
    id: 'log-1',
    query: 'cnc lathe machine',
    category: 'Industrial Machinery & Equipment',
    city: 'Pune, Maharashtra',
    resultCount: 2,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T10:15:00Z'
  },
  {
    id: 'log-2',
    query: 'cnc lathe machine',
    category: 'Industrial Machinery & Equipment',
    city: 'Bengaluru, Karnataka',
    resultCount: 2,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T11:40:00Z'
  },
  {
    id: 'log-3',
    query: 'surat silk sarees wholesale',
    category: 'Textiles, Fabrics & Apparel',
    city: 'Surat, Gujarat',
    resultCount: 2,
    isZeroResult: false,
    userRole: 'retailer',
    timestamp: '2026-10-14T12:05:00Z'
  },
  {
    id: 'log-4',
    query: '10kw solar inverter',
    category: 'Electronics & Automation',
    city: 'Bengaluru, Karnataka',
    resultCount: 1,
    isZeroResult: false,
    userRole: 'supplier',
    timestamp: '2026-10-14T13:22:00Z'
  },
  {
    id: 'log-5',
    query: 'corrugated cartons 5 ply',
    category: 'Packaging & Paper Products',
    city: 'Delhi NCR, Delhi',
    resultCount: 1,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T14:10:00Z'
  },
  {
    id: 'log-6',
    query: '1121 steam basmati rice',
    category: 'Agricultural & Organic Foods',
    city: 'Ludhiana, Punjab',
    resultCount: 1,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T15:30:00Z'
  },
  {
    id: 'log-7',
    query: 'surat silk sarees wholesale',
    category: 'Textiles, Fabrics & Apparel',
    city: 'Jaipur, Rajasthan',
    resultCount: 2,
    isZeroResult: false,
    userRole: 'customer',
    timestamp: '2026-10-14T16:15:00Z'
  },
  {
    id: 'log-8',
    query: 'brass bushings knurled',
    category: 'Industrial Machinery & Equipment',
    city: 'Pune, Maharashtra',
    resultCount: 1,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T17:05:00Z'
  },
  {
    id: 'log-9',
    query: '10kw solar inverter',
    category: 'Electronics & Automation',
    city: 'Pune, Maharashtra',
    resultCount: 1,
    isZeroResult: false,
    userRole: 'buyer',
    timestamp: '2026-10-14T18:00:00Z'
  },

  // Actionable Zero-Result (Unmet Demand) Queries for Admin Dashboard
  {
    id: 'log-10',
    query: 'laser tube cutting machine 3000w',
    category: 'Industrial Machinery & Equipment',
    city: 'Ahmedabad, Gujarat',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'buyer',
    timestamp: '2026-10-15T08:10:00Z'
  },
  {
    id: 'log-11',
    query: 'laser tube cutting machine 3000w',
    category: 'Industrial Machinery & Equipment',
    city: 'Rajkot, Gujarat',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'buyer',
    timestamp: '2026-10-15T08:45:00Z'
  },
  {
    id: 'log-12',
    query: 'lithium prismatic lifepo4 100ah cells',
    category: 'Electronics & Automation',
    city: 'Bengaluru, Karnataka',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'buyer',
    timestamp: '2026-10-15T09:15:00Z'
  },
  {
    id: 'log-13',
    query: 'lithium prismatic lifepo4 100ah cells',
    category: 'Electronics & Automation',
    city: 'Pune, Maharashtra',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'supplier',
    timestamp: '2026-10-15T09:40:00Z'
  },
  {
    id: 'log-14',
    query: 'biodegradable cornstarch mailing bags',
    category: 'Packaging & Paper Products',
    city: 'Delhi NCR, Delhi',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'retailer',
    timestamp: '2026-10-15T10:05:00Z'
  },
  {
    id: 'log-15',
    query: 'submersible solar water pumps 5hp',
    category: 'Agriculture & Food',
    city: 'Indore, Madhya Pradesh',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'buyer',
    timestamp: '2026-10-15T10:30:00Z'
  },
  {
    id: 'log-16',
    query: 'medical grade nitrile gloves bulk container',
    category: 'Local Business Services',
    city: 'Mumbai, Maharashtra',
    resultCount: 0,
    isZeroResult: true,
    userRole: 'buyer',
    timestamp: '2026-10-15T10:55:00Z'
  }
];

export const INITIAL_CATEGORY_CLICKS: Record<string, number> = {
  'Industrial Machinery & Equipment': 430,
  'Textiles, Fabrics & Apparel': 580,
  'Electronics & Automation': 390,
  'Packaging & Paper Products': 275,
  'Agricultural & Organic Foods': 310,
  'Chemicals, Dyes & Pharma': 195,
  'Building & Construction Materials': 240,
  'Local Business Services': 210,
};

/**
 * Log a search event to Firestore and return the created record
 */
export async function recordSearchLog(logData: Omit<SearchLog, 'id'>): Promise<SearchLog> {
  const newLog: SearchLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };

  try {
    const docRef = await addDoc(collection(db, 'search_logs'), {
      query: newLog.query,
      category: newLog.category || '',
      city: newLog.city || '',
      resultCount: newLog.resultCount,
      isZeroResult: newLog.isZeroResult,
      userRole: newLog.userRole || 'visitor',
      timestamp: newLog.timestamp,
    });
    newLog.id = docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'search_logs');
  }

  return newLog;
}

/**
 * Aggregate top queries from log array
 */
export function computeTopQueries(logs: SearchLog[], limitCount = 10): TopSearchMetric[] {
  const queryMap = new Map<string, { count: number; totalResults: number; lastSearched: string; category?: string }>();

  logs.forEach(item => {
    const q = item.query.trim().toLowerCase();
    if (!q) return;

    const existing = queryMap.get(q);
    if (existing) {
      existing.count += 1;
      existing.totalResults += item.resultCount;
      if (new Date(item.timestamp) > new Date(existing.lastSearched)) {
        existing.lastSearched = item.timestamp;
      }
    } else {
      queryMap.set(q, {
        count: 1,
        totalResults: item.resultCount,
        lastSearched: item.timestamp,
        category: item.category
      });
    }
  });

  return Array.from(queryMap.entries())
    .map(([query, data]) => ({
      query,
      count: data.count,
      avgResults: Math.round((data.totalResults / data.count) * 10) / 10,
      lastSearched: data.lastSearched,
      category: data.category
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limitCount);
}

/**
 * Aggregate queries that returned 0 results (unmet buyer demand)
 */
export function computeZeroResultQueries(logs: SearchLog[], limitCount = 10): ZeroResultMetric[] {
  const zeroMap = new Map<string, { count: number; category?: string; city?: string; lastSearched: string }>();

  logs.filter(l => l.isZeroResult).forEach(item => {
    const q = item.query.trim().toLowerCase();
    if (!q) return;

    const existing = zeroMap.get(q);
    if (existing) {
      existing.count += 1;
      if (new Date(item.timestamp) > new Date(existing.lastSearched)) {
        existing.lastSearched = item.timestamp;
      }
    } else {
      zeroMap.set(q, {
        count: 1,
        category: item.category,
        city: item.city,
        lastSearched: item.timestamp
      });
    }
  });

  return Array.from(zeroMap.entries())
    .map(([query, data]) => ({
      query,
      count: data.count,
      category: data.category,
      city: data.city,
      lastSearched: data.lastSearched
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limitCount);
}

/**
 * Aggregate category popularity from searches and category clicks
 */
export function computeCategoryPopularity(
  logs: SearchLog[],
  categoryClicks: Record<string, number>
): CategoryPopularityMetric[] {
  const searchCounts: Record<string, number> = {};

  logs.forEach(l => {
    if (l.category) {
      searchCounts[l.category] = (searchCounts[l.category] || 0) + 1;
    }
  });

  const allCategories = Array.from(
    new Set([...Object.keys(categoryClicks), ...Object.keys(searchCounts)])
  );

  return allCategories.map(cat => ({
    category: cat,
    searchCount: searchCounts[cat] || 0,
    clickCount: categoryClicks[cat] || 0,
  })).sort((a, b) => (b.clickCount + b.searchCount * 2) - (a.clickCount + a.searchCount * 2));
}

/**
 * Download CSV helper
 */
function downloadCSV(csvContent: string, filename: string) {
  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export full search logs to CSV
 */
export function exportSearchLogsCSV(logs: SearchLog[], filename = 'BusinessConnect_Search_Logs') {
  if (!logs || logs.length === 0) return;
  const headers = ['Log ID', 'Search Query', 'Category', 'City', 'Results Found', 'Is Zero Result', 'User Role', 'Timestamp'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.query.replace(/"/g, '""')}"`,
    `"${(l.category || '').replace(/"/g, '""')}"`,
    `"${(l.city || '').replace(/"/g, '""')}"`,
    l.resultCount,
    l.isZeroResult ? 'YES' : 'NO',
    `"${l.userRole || 'visitor'}"`,
    `"${l.timestamp}"`
  ].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  downloadCSV(csv, filename);
}

/**
 * Export unmet zero-result buyer demand to CSV for supplier onboarding & sourcing
 */
export function exportZeroResultDemandCSV(zeroMetrics: ZeroResultMetric[], filename = 'BusinessConnect_Unmet_Buyer_Demand') {
  if (!zeroMetrics || zeroMetrics.length === 0) return;
  const headers = ['Rank', 'Unmet Demand Query', 'Category', 'City/Region', 'Buyer Search Count', 'Last Inquired'];
  const rows = zeroMetrics.map((m, idx) => [
    idx + 1,
    `"${m.query.replace(/"/g, '""')}"`,
    `"${(m.category || 'General').replace(/"/g, '""')}"`,
    `"${(m.city || 'All India').replace(/"/g, '""')}"`,
    m.count,
    `"${m.lastSearched}"`
  ].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  downloadCSV(csv, filename);
}

export interface SearchMetricsSummary {
  totalSearches: number;
  uniqueQueries: number;
  zeroResultCount: number;
  zeroResultRate: number; // percentage, e.g. 15.4
  topQuery: string;
  topQueryCount: number;
  topCategory: string;
}

export function generateSearchMetricsSummary(
  logs: SearchLog[],
  categoryClicks: Record<string, number>
): SearchMetricsSummary {
  const total = logs.length;
  const unique = new Set(logs.map(l => l.query.trim().toLowerCase())).size;
  const zeroResults = logs.filter(l => l.isZeroResult).length;
  const zeroRate = total > 0 ? Math.round((zeroResults / total) * 1000) / 10 : 0;

  const topQueries = computeTopQueries(logs, 1);
  const topCategories = computeCategoryPopularity(logs, categoryClicks);

  return {
    totalSearches: total,
    uniqueQueries: unique,
    zeroResultCount: zeroResults,
    zeroResultRate: zeroRate,
    topQuery: topQueries[0]?.query || 'None',
    topQueryCount: topQueries[0]?.count || 0,
    topCategory: topCategories[0]?.category || 'Industrial Machinery & Equipment'
  };
}
