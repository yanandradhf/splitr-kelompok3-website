import { CHART_COLORS } from '../constants/colors';

// Chart helpers
export const toConic = (segments) => {
  let acc = 0;
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  return `conic-gradient(${segments
    .map((s) => {
      const p = (s.value / total) * 100;
      const start = acc;
      acc += p;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(",")})`;
};

export const getPaymentColor = (name) => {
  if (/instant/i.test(name)) return CHART_COLORS.PAYMENT_METHODS.instant;
  if (/scheduled/i.test(name)) return CHART_COLORS.PAYMENT_METHODS.scheduled;
  return CHART_COLORS.PAYMENT_METHODS.default;
};

export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || "";
  
  if (statusLower.includes("completed")) {
    if (statusLower.includes("late")) return CHART_COLORS.STATUS.completed_late;
    if (statusLower.includes("scheduled")) return CHART_COLORS.STATUS.completed_scheduled;
    return CHART_COLORS.STATUS.completed;
  }
  
  return CHART_COLORS.STATUS[statusLower] || CHART_COLORS.STATUS.default;
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};