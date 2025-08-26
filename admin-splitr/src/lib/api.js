import axios from "axios";
const BASEAPI = process.env.NEXT_PUBLIC_API_BASE;
const BASE = BASEAPI + "/api/admin/dashboard/charts";

export const periodMap = {
  "7d": "7days",
  "30d": "30days",
  this_month: "thismonth",
  full_year: "year",
};

const api = axios.create({
  baseURL: BASE,
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionId = document.cookie
      .split('; ')
      .find(row => row.startsWith('sessionId='))
      ?.split('=')[1];
    if (sessionId) {
      config.headers.Authorization = `Bearer ${sessionId}`;
    }
  }
  return config;
});

export const getTransactions = async (period) => {
  try {
    const response = await api.get(`/transactions?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Transactions:', error);
    // Return mock data for development
    return {
      data: [
        { label: 'Mon', transactions: 120 },
        { label: 'Tue', transactions: 150 },
        { label: 'Wed', transactions: 180 },
        { label: 'Thu', transactions: 200 },
        { label: 'Fri', transactions: 250 },
        { label: 'Sat', transactions: 300 },
        { label: 'Sun', transactions: 280 }
      ]
    };
  }
};

export const getCategories = async (period) => {
  try {
    const response = await api.get(`/categories?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Categories:', error);
    return {
      data: [
        { category: 'Food & Dining', percentage: 35 },
        { category: 'Transportation', percentage: 25 },
        { category: 'Shopping', percentage: 20 },
        { category: 'Entertainment', percentage: 15 },
        { category: 'Others', percentage: 5 }
      ]
    };
  }
};

export const getPaymentMethods = async (period) => {
  try {
    const response = await api.get(`/payment-methods?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Payment Methods:', error);
    return {
      data: [
        { name: 'Instant Payment', value: 45 },
        { name: 'Scheduled Payment', value: 35 },
        { name: 'Bank Transfer', value: 20 }
      ]
    };
  }
};

export const getDailyAmount = async (period) => {
  try {
    const response = await api.get(`/daily-amount?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Daily Amount:', error);
    return {
      data: [
        { label: 'Mon', amount: 15.5 },
        { label: 'Tue', amount: 22.3 },
        { label: 'Wed', amount: 18.7 },
        { label: 'Thu', amount: 25.1 },
        { label: 'Fri', amount: 30.2 },
        { label: 'Sat', amount: 35.8 },
        { label: 'Sun', amount: 28.4 }
      ]
    };
  }
};
