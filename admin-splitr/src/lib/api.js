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
    const mockData = period === 'year' ? [
      { label: 'Jan', transactions: 1200 },
      { label: 'Feb', transactions: 1350 },
      { label: 'Mar', transactions: 1180 },
      { label: 'Apr', transactions: 1420 },
      { label: 'May', transactions: 1650 },
      { label: 'Jun', transactions: 1580 },
      { label: 'Jul', transactions: 1720 },
      { label: 'Aug', transactions: 1890 },
      { label: 'Sep', transactions: 1650 },
      { label: 'Oct', transactions: 1780 },
      { label: 'Nov', transactions: 1920 },
      { label: 'Dec', transactions: 2100 }
    ] : period === 'thismonth' ? [
      { label: 'Week 1', transactions: 320 },
      { label: 'Week 2', transactions: 450 },
      { label: 'Week 3', transactions: 380 },
      { label: 'Week 4', transactions: 520 }
    ] : [
      { label: 'Mon', transactions: 120 },
      { label: 'Tue', transactions: 150 },
      { label: 'Wed', transactions: 180 },
      { label: 'Thu', transactions: 200 },
      { label: 'Fri', transactions: 250 },
      { label: 'Sat', transactions: 300 },
      { label: 'Sun', transactions: 280 }
    ];
    return { data: mockData };
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
        { category: 'Other', percentage: 5 }
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
        { name: 'instant', value: 65 },
        { name: 'scheduled', value: 35 }
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
    const mockData = period === 'year' ? [
      { label: 'Jan', amount: 125.5 },
      { label: 'Feb', amount: 142.3 },
      { label: 'Mar', amount: 138.7 },
      { label: 'Apr', amount: 155.1 },
      { label: 'May', amount: 170.2 },
      { label: 'Jun', amount: 165.8 },
      { label: 'Jul', amount: 180.4 },
      { label: 'Aug', amount: 195.6 },
      { label: 'Sep', amount: 175.3 },
      { label: 'Oct', amount: 185.7 },
      { label: 'Nov', amount: 200.1 },
      { label: 'Dec', amount: 220.8 }
    ] : period === 'thismonth' ? [
      { label: 'Week 1', amount: 45.2 },
      { label: 'Week 2', amount: 52.8 },
      { label: 'Week 3', amount: 48.6 },
      { label: 'Week 4', amount: 58.4 }
    ] : [
      { label: 'Mon', amount: 15.5 },
      { label: 'Tue', amount: 22.3 },
      { label: 'Wed', amount: 18.7 },
      { label: 'Thu', amount: 25.1 },
      { label: 'Fri', amount: 30.2 },
      { label: 'Sat', amount: 35.8 },
      { label: 'Sun', amount: 28.4 }
    ];
    return { data: mockData };
  }
};
