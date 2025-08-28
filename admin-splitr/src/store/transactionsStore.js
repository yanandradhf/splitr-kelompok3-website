import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const useTransactionsStore = create((set, get) => ({
  transactions: [],
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Filters
  filters: {
    dateFrom: '',
    dateTo: '',
    statusFilter: '',
    paymentMethodFilter: '',
    searchQuery: '',
    sortField: '',
    sortDirection: 'asc',
  },

  // Cache
  lastFetch: 0,
  cacheKey: '',

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        dateFrom: '',
        dateTo: '',
        statusFilter: '',
        paymentMethodFilter: '',
        searchQuery: '',
        sortField: '',
        sortDirection: 'asc',
      }
    });
    get().fetchTransactions(1);
  },

  fetchTransactions: async (page = 1) => {
    const { filters } = get();
    const now = Date.now();
    
    // Create cache key from filters
    const cacheKey = JSON.stringify({ ...filters, page });
    const { lastFetch, cacheKey: currentCacheKey } = get();
    
    // Cache for 1 minute if same filters
    if (now - lastFetch < 60 * 1000 && cacheKey === currentCacheKey) return;

    set({ loading: true });
    try {
      const sessionId = Cookies.get("sessionId");
      const params = {
        sessionId,
        limit: "10",
        page: page.toString(),
      };

      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.statusFilter) params.status = filters.statusFilter;
      if (filters.paymentMethodFilter) params.payment_method = filters.paymentMethodFilter;
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.sortField) {
        params.sort_by = filters.sortField;
        params.sort_direction = filters.sortDirection;
      }

      const response = await axios.get("/api/transactions", { params });
      const data = response.data;
      
      set({
        transactions: data.data || [],
        pagination: {
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || 10,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.total_pages || 0,
        },
        lastFetch: now,
        cacheKey,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ transactions: [] });
    } finally {
      set({ loading: false });
    }
  },

  exportCSV: async () => {
    const { filters } = get();
    try {
      const sessionId = Cookies.get("sessionId");
      const params = { sessionId };

      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.statusFilter) params.status = filters.statusFilter;
      if (filters.paymentMethodFilter) params.payment_method = filters.paymentMethodFilter;
      if (filters.searchQuery) params.search = filters.searchQuery;

      const response = await axios.get("/api/transactions/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "transactions.csv";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("CSV export error:", error);
      throw error;
    }
  },
}));

export default useTransactionsStore;