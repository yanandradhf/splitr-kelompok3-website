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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTransactions = async (period) => {
  const response = await api.get(`/transactions?period=${period}`);
  return response.data;
};

export const getCategories = async (period) => {
  const response = await api.get(`/categories?period=${period}`);
  return response.data;
};

export const getPaymentMethods = async (period) => {
  const response = await api.get(`/payment-methods?period=${period}`);
  return response.data;
};

export const getDailyAmount = async (period) => {
  const response = await api.get(`/daily-amount?period=${period}`);
  return response.data;
};
