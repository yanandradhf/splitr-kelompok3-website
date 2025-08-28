// Number formatters
export const formatID = (n) => new Intl.NumberFormat("id-ID").format(n);

export const formatPercent = (n) => `${(n * 100).toFixed(1)}%`;

export const formatIDRShort = (n) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  return `Rp ${formatID(n)}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Date formatters
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('id-ID');
};

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