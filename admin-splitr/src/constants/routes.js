export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  ANALYTICS: '/analytics/geographic',
  FORGOT_PASSWORD: '/forgot-password',
  SSO_BNI: '/sso/bni'
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SSO_BNI: '/api/auth/sso/bni'
  },
  DASHBOARD: {
    SUMMARY: '/api/admin/dashboard/summary',
    CHARTS: {
      TRANSACTIONS: '/api/admin/dashboard/charts/transactions',
      CATEGORIES: '/api/admin/dashboard/charts/categories', 
      PAYMENT_METHODS: '/api/admin/dashboard/charts/payment-methods',
      DAILY_AMOUNT: '/api/admin/dashboard/charts/daily-amount'
    }
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    EXPORT: '/api/transactions/export'
  },
  ANALYTICS: {
    GEOGRAPHIC: '/api/analytics/geographic'
  }
};