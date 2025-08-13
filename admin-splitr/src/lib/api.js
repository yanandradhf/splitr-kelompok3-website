// util pemanggil API dashboard
const BASE = 'https://533c27f18d6b.ngrok-free.app/api/admin/dashboard/charts';

// mapping value filter UI -> query ?period=
export const periodMap = {
  '7d': '7days',
  '30d': '30days',
  'this_month': 'thismonth',
  'full_year': 'year',
};

// optional: header auth kalau perlu token
function authHeaders() {
  try {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}

async function request(path, period, options = {}) {
  const url = `${BASE}/${path}?period=${period}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json', ...authHeaders(), ...(options.headers || {}) },
    signal: options.signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export const getTransactions   = (period, opt) => request('transactions',     period, opt);
export const getCategories     = (period, opt) => request('categories',       period, opt);
export const getPaymentMethods = (period, opt) => request('payment-methods',  period, opt);
export const getDailyAmount    = (period, opt) => request('daily-amount',     period, opt);
