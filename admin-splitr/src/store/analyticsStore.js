import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';

const useAnalyticsStore = create((set, get) => ({
  geographicData: { heatmapData: [] },
  loading: false,
  period: '7days',
  
  // Cache
  lastFetch: {},

  setPeriod: (newPeriod) => {
    set({ period: newPeriod });
    get().fetchGeographicData();
  },

  fetchGeographicData: async () => {
    const { period, lastFetch } = get();
    const now = Date.now();
    
    // Cache for 3 minutes per period
    if (now - (lastFetch[period] || 0) < 3 * 60 * 1000) return;

    set({ loading: true });
    try {
      const sessionId = Cookies.get("sessionId");
      const response = await axios.get("/api/analytics/geographic", {
        params: { sessionId, period }
      });

      set({
        geographicData: response.data || { heatmapData: [] },
        lastFetch: { ...lastFetch, [period]: now },
      });
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      set({ geographicData: { heatmapData: [] } });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAnalyticsStore;