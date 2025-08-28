import axios from "axios";
const BASEAPI = process.env.NEXT_PUBLIC_API_BASE;
const BASE = BASEAPI + "/api/admin/dashboard/charts";

export const periodMap = {
  "7d": "7days",
  "this_month": "thismonth",
  "this_year": "year",
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
    return { data: [] };
  }
};

export const getCategories = async (period) => {
  try {
    const response = await api.get(`/categories?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Categories:', error);
    return { data: [] };
  }
};

export const getPaymentMethods = async (period) => {
  try {
    const response = await api.get(`/payment-methods?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Payment Methods:', error);
    return { data: [] };
  }
};

export const getDailyAmount = async (period) => {
  try {
    const response = await api.get(`/daily-amount?period=${period}`);
    return response.data || { data: [] };
  } catch (error) {
    console.error('API Error - Daily Amount:', error);
    return { data: [] };
  }
};
