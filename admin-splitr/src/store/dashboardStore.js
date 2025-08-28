import { create } from 'zustand';
import { getTransactions, getCategories, getPaymentMethods, getDailyAmount, periodMap } from '../lib/api';
import axios from 'axios';
import Cookies from 'js-cookie';

const useDashboardStore = create((set, get) => ({
  // Summary data
  summary: {
    txToday: 0,
    amountSplitToday: 0,
    successRate: 0,
    failedRate: 0,
  },
  summaryLoading: false,

  // Charts data
  trendData: [],
  trendLoading: false,
  trendError: '',

  categoriesData: [],
  catLoading: false,
  catError: '',

  paymentData: [],
  payLoading: false,
  payError: '',

  amountData: [],
  amountLoading: false,
  amountError: '',

  // Cache timestamps
  lastFetch: {
    summary: 0,
    trends: {},
    categories: {},
    payment: {},
    amount: {},
  },

  // Actions
  fetchSummary: async () => {
    const now = Date.now();
    const { lastFetch } = get();
    
    // Cache for 5 minutes
    if (now - lastFetch.summary < 5 * 60 * 1000) return;

    set({ summaryLoading: true });
    try {
      const response = await axios.get('/api/admin/dashboard/summary', {
        headers: {
          Authorization: `Bearer ${Cookies.get("sessionId")}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = response.data;
      set({
        summary: {
          txToday: data.today?.transaction_count || 0,
          amountSplitToday: data.today?.amount_split || 0,
          successRate: (data.today?.success_rate || 0) / 100,
          failedRate: (data.today?.failed_rate || 0) / 100,
        },
        lastFetch: { ...lastFetch, summary: now },
      });
    } catch (error) {
      console.error("Summary API error:", error);
      set({
        summary: { txToday: 0, amountSplitToday: 0, successRate: 0, failedRate: 0 }
      });
    } finally {
      set({ summaryLoading: false });
    }
  },

  fetchTrends: async (period) => {
    const now = Date.now();
    const { lastFetch } = get();
    
    // Cache for 2 minutes per period
    if (now - (lastFetch.trends[period] || 0) < 2 * 60 * 1000) return;

    set({ trendLoading: true, trendError: '' });
    try {
      const json = await getTransactions(periodMap[period]);
      const mapped = json?.data?.map(it => ({
        label: it.label,
        value: Number(it.transactions ?? 0),
      })) || [];
      
      set({
        trendData: mapped,
        lastFetch: { ...lastFetch, trends: { ...lastFetch.trends, [period]: now } },
      });
    } catch (error) {
      set({ trendError: error.message || 'fetch error' });
    } finally {
      set({ trendLoading: false });
    }
  },

  fetchCategories: async (period) => {
    const now = Date.now();
    const { lastFetch } = get();
    
    if (now - (lastFetch.categories[period] || 0) < 2 * 60 * 1000) return;

    set({ catLoading: true, catError: '' });
    try {
      const json = await getCategories(periodMap[period]);
      const CAT_COLORS = ["#2dd4bf", "#fb923c", "#9aa3af", "#8b5cf6", "#22c55e", "#f59e0b", "#3b82f6", "#ef4444"];
      
      const mapped = json?.data?.map((it, i) => ({
        name: it.category === "Other" ? "Others" : it.category,
        value: Number(it.percentage || 0),
        color: CAT_COLORS[i % CAT_COLORS.length],
      })) || [];
      
      set({
        categoriesData: mapped,
        lastFetch: { ...lastFetch, categories: { ...lastFetch.categories, [period]: now } },
      });
    } catch (error) {
      set({ catError: error.message || 'fetch error' });
    } finally {
      set({ catLoading: false });
    }
  },

  fetchPaymentMethods: async (period) => {
    const now = Date.now();
    const { lastFetch } = get();
    
    if (now - (lastFetch.payment[period] || 0) < 2 * 60 * 1000) return;

    set({ payLoading: true, payError: '' });
    try {
      const json = await getPaymentMethods(periodMap[period]);
      const paymentColor = (name) => {
        if (/instant/i.test(name)) return "#fb923c";
        if (/scheduled/i.test(name)) return "#2dd4bf";
        return "#8b5cf6";
      };

      const raw = json?.data?.map(it => ({
        name: it.name ?? it.method ?? "Unknown",
        rawValue: Number(it.value ?? it.count ?? it.total ?? 0),
      })) || [];
      
      const total = raw.reduce((s, x) => s + (isFinite(x.rawValue) ? x.rawValue : 0), 0) || 1;
      const mapped = raw.map(x => ({
        name: x.name,
        value: Number(((x.rawValue * 100) / total).toFixed(1)),
        color: paymentColor(x.name),
      }));
      
      set({
        paymentData: mapped,
        lastFetch: { ...lastFetch, payment: { ...lastFetch.payment, [period]: now } },
      });
    } catch (error) {
      set({ payError: error.message || 'fetch error' });
    } finally {
      set({ payLoading: false });
    }
  },

  fetchDailyAmount: async (period) => {
    const now = Date.now();
    const { lastFetch } = get();
    
    if (now - (lastFetch.amount[period] || 0) < 2 * 60 * 1000) return;

    set({ amountLoading: true, amountError: '' });
    try {
      const json = await getDailyAmount(periodMap[period]);
      const mapped = json?.data?.map((it, i) => ({
        label: it.label ?? it.day ?? it.date ?? it.month ?? String(i + 1),
        amount: Number(it.amount ?? it.value ?? it.total ?? 0),
      })) || [];
      
      set({
        amountData: mapped,
        lastFetch: { ...lastFetch, amount: { ...lastFetch.amount, [period]: now } },
      });
    } catch (error) {
      set({ amountError: error.message || 'fetch error' });
    } finally {
      set({ amountLoading: false });
    }
  },
}));

export default useDashboardStore;