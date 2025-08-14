"use client";

import { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import {
  getTransactions,
  getCategories,
  getPaymentMethods,
  getDailyAmount,
  periodMap,
} from "../../lib/api";

// ---------- Small UI pieces ----------
function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300"
      aria-label="Filter"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// --- Y-axis nice ticks helper (untuk bar chart Amount) ---
function makeNiceScale(maxVal, tickCount = 5) {
  if (!isFinite(maxVal) || maxVal <= 0) {
    return { max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], step: 0.25 };
  }
  const raw = maxVal / tickCount;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const niceNorm =
    norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;
  const niceMax = Math.ceil(maxVal / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(v);
  return { max: niceMax, ticks, step };
}

// --- Reusable SVG bar chart with Y-axis + grid ---
function AmountBarChart({
  data,
  valueKey = "amount",
  labelKey = "label",
  unitLabel = "Amount (Million Rp)",
  height = 260,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 grid place-items-center text-sm text-slate-500">
        no data for selected range
      </div>
    );
  }

  const pad = { l: 64, r: 16, t: 16, b: 34 };
  const minBarW = 18;
  const barGap = 8;

  const maxVal = Math.max(...data.map((d) => Number(d[valueKey] || 0)));
  const { max: niceMax, ticks } = makeNiceScale(maxVal, 5);

  // dynamic width: scrolls horizontally jika data banyak
  const contentW = data.length * minBarW + (data.length - 1) * barGap;
  const width = Math.max(520, pad.l + pad.r + contentW);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const scaleY = (v) => pad.t + innerH - (v / (niceMax || 1)) * innerH;
  const barW = Math.max(minBarW, innerW / data.length - barGap);

  return (
    <div className="overflow-x-auto pr-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-64"
        aria-label="Amount bar chart"
      >
        {/* Y grid + ticks */}
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return (
            <g key={i}>
              <line
                x1={pad.l}
                y1={y}
                x2={width - pad.r}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1={pad.l - 4}
                y1={y}
                x2={pad.l}
                y2={y}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={pad.l - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {t}
              </text>
            </g>
          );
        })}
        {/* Y axis line */}
        <line
          x1={pad.l}
          y1={pad.t}
          x2={pad.l}
          y2={pad.t + innerH}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Y axis title */}
        <text
          x={14}
          y={pad.t + innerH / 2}
          fontSize="11"
          fill="#64748b"
          transform={`rotate(-90 14 ${pad.t + innerH / 2})`}
        >
          {unitLabel}
        </text>

        {/* Bars */}
        {data.map((d, i) => {
          const x = pad.l + i * (barW + barGap);
          const val = Number(d[valueKey] || 0);
          const y = scaleY(val);
          const h = (val / (niceMax || 1)) * innerH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="4"
                className="fill-teal-400"
              >
                <title>{`${d[labelKey]}: Rp ${val} Juta`}</title>
              </rect>
              <text
                x={x + barW / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {d[labelKey]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- Helpers ----------
const formatID = (n) => new Intl.NumberFormat("id-ID").format(n);
const formatPercent = (n) => `${(n * 100).toFixed(1)} %`;
const formatIDRShort = (n) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  return `Rp ${formatID(n)}`;
};
const toConic = (segments) => {
  let acc = 0;
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  return `conic-gradient(${segments
    .map((s) => {
      const p = (s.value / total) * 100; // pastikan 0–100
      const start = acc;
      acc += p;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(",")})`;
};

// Palet warna untuk kategori
const CAT_COLORS = [
  "#2dd4bf",
  "#fb923c",
  "#9aa3af",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
];
const paymentColor = (name) => {
  if (/instant/i.test(name)) return "#fb923c";
  if (/scheduled/i.test(name)) return "#2dd4bf";
  return "#8b5cf6";
};

// ---------- Mappers respons API -> shape chart ----------
const mapTransactions = (json) => {
  const arr = json?.data ?? [];
  return arr.map((it) => ({
    label: it.label,
    value: Number(it.transactions ?? 0),
  }));
};

const mapCategories = (json) => {
  const arr = json?.data ?? [];
  console.log("Raw categories data:", arr);

  return arr.map((it, i) => ({
    name: it.category === "Other" ? "Others" : it.category,
    value: Number(it.percentage || 0),
    color: CAT_COLORS[i % CAT_COLORS.length],
  }));
};

const mapPaymentMethods = (json) => {
  const arr = json?.data ?? json ?? [];
  const raw = arr.map((it) => ({
    name: it.name ?? it.method ?? "Unknown",
    rawValue: Number(it.value ?? it.count ?? it.total ?? 0),
  }));
  const total =
    raw.reduce((s, x) => s + (isFinite(x.rawValue) ? x.rawValue : 0), 0) || 1;
  return raw.map((x) => ({
    name: x.name,
    value: Number(((x.rawValue * 100) / total).toFixed(1)),
    color: paymentColor(x.name),
  }));
};

const mapDailyAmount = (json) => {
  const arr = json?.data ?? json ?? [];
  return arr.map((it, i) => ({
    label: it.label ?? it.day ?? it.date ?? it.month ?? String(i + 1),
    amount: Number(it.amount ?? it.value ?? it.total ?? 0),
  }));
};

export default function Dashboard() {
  const [user] = useState({ name: "John Doe", role: "User" });

  // ---------- FILTER STATES ----------
  const [trendRange, setTrendRange] = useState("7d"); // 7d | 30d | this_month | full_year
  const [catRange, setCatRange] = useState("7d"); // 7d | this_month | full_year
  const [payRange, setPayRange] = useState("7d"); // 7d | full_year
  const [amountRange, setAmountRange] = useState("7d"); // 7d | this_month | full_year

  // ---------- DATA STATES + loading/error ----------
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState("");

  const [categoriesData, setCategoriesData] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  const [paymentData, setPaymentData] = useState([]);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  const [amountData, setAmountData] = useState([]);
  const [amountLoading, setAmountLoading] = useState(false);
  const [amountError, setAmountError] = useState("");

  // ---------- EFFECT: Transactions (line) ----------
  useEffect(() => {
    (async () => {
      try {
        setTrendLoading(true);
        setTrendError("");
        console.log("Fetching trends for period:", periodMap[trendRange]);
        const json = await getTransactions(periodMap[trendRange]);
        console.log("Trends API response:", json);
        const mapped = mapTransactions(json);
        console.log("Mapped trends data:", mapped);
        setTrendData(mapped);
      } catch (e) {
        console.error("Trends API error:", e);
        setTrendError(e.response?.data?.message || e.message || "fetch error");
      } finally {
        setTrendLoading(false);
      }
    })();
  }, [trendRange]);

  // ---------- EFFECT: Categories (pie) ----------
  useEffect(() => {
    (async () => {
      try {
        setCatLoading(true);
        setCatError("");
        console.log("Fetching categories for period:", periodMap[catRange]);
        const json = await getCategories(periodMap[catRange]);
        console.log("Categories API response:", json);
        const mapped = mapCategories(json);
        console.log("Mapped categories data:", mapped);
        setCategoriesData(mapped);
      } catch (e) {
        console.error("Categories API error:", e);
        setCatError(e.response?.data?.message || e.message || "fetch error");
      } finally {
        setCatLoading(false);
      }
    })();
  }, [catRange]);

  // ---------- EFFECT: Payment Methods (pie) ----------
  useEffect(() => {
    (async () => {
      try {
        setPayLoading(true);
        setPayError("");
        const json = await getPaymentMethods(periodMap[payRange]);
        setPaymentData(mapPaymentMethods(json));
      } catch (e) {
        setPayError(e.response?.data?.message || e.message || "fetch error");
      } finally {
        setPayLoading(false);
      }
    })();
  }, [payRange]);

  // ---------- EFFECT: Daily/Monthly Amount Split (bar) ----------
  useEffect(() => {
    (async () => {
      try {
        setAmountLoading(true);
        setAmountError("");
        const json = await getDailyAmount(periodMap[amountRange]);
        setAmountData(mapDailyAmount(json));
      } catch (e) {
        setAmountError(e.response?.data?.message || e.message || "fetch error");
      } finally {
        setAmountLoading(false);
      }
    })();
  }, [amountRange]);

  // ---------- Summary (sementara tetap statis) ----------
  const summary = {
    txToday: 1247,
    amountSplitToday: 45_200_000_000,
    successRate: 0.942,
    failedRate: 0.058,
  };

  // ---------- Line chart layout (depends on trendData) ----------
  const lineChart = useMemo(() => {
    const width = 520;
    const height = 200;
    const pad = { l: 40, r: 10, t: 10, b: 30 };
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;

    const minY = trendData.length
      ? Math.min(...trendData.map((d) => d.value))
      : 0;
    const maxY = trendData.length
      ? Math.max(...trendData.map((d) => d.value))
      : 1;
    const xStep =
      trendData.length > 1 ? innerW / (trendData.length - 1) : innerW;

    const scaleY = (v) =>
      pad.t + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;
    const points = trendData
      .map((d, i) => `${pad.l + i * xStep},${scaleY(d.value)}`)
      .join(" ");

    return { width, height, pad, innerH, xStep, scaleY, points };
  }, [trendData]);

  return (
    <AuthGuard>
      <div className="h-screen bg-white">
        <Sidebar />

        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="bg-white border-b">
            <div className="px-6">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3 ml-16">
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">
                      Dashboard Monitoring
                    </div>
                    <div className="text-sm text-slate-500 -mt-0.5">
                      Overview of transaction performance and statistics
                    </div>
                  </div>
                </div>
                <div className="pr-2 text-sm text-gray-600">
                  Welcome, {user.name}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto px-6 py-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-sky-400">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M7 3h10a1 1 0 0 1 1 1v15l-2-1-2 1-2-1-2 1-2-1-2 1V4a1 1 0 0 1 1-1z" />
                      <path d="M9 7h6M9 11h6M9 15h3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">
                      Transaction Today
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {formatID(summary.txToday)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-500 font-bold">Rp</span>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">
                      Amount Split Today
                    </div>
                    <div className="text-2xl font-semibold text-slate-900">
                      {formatIDRShort(summary.amountSplitToday)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Success Rate</div>
                    <div className="text-2xl font-semibold text-emerald-600">
                      {formatPercent(summary.successRate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-rose-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Failed Rate</div>
                    <div className="text-2xl font-semibold text-rose-600">
                      {formatPercent(summary.failedRate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Transaction Trends */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Transaction Trends
                  </h3>
                  <FilterSelect
                    value={trendRange}
                    onChange={setTrendRange}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "30d", label: "30 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "full_year", label: "Full Year" },
                    ]}
                  />
                </div>
                <div className="px-6 pb-6 pt-2">
                  {trendError ? (
                    <div className="h-64 grid place-items-center text-sm text-rose-600">
                      failed to load
                    </div>
                  ) : trendLoading ? (
                    <div className="h-64 grid place-items-center text-sm text-slate-500">
                      loading...
                    </div>
                  ) : (
                    <svg
                      viewBox={`0 0 520 200`}
                      className="w-full h-64"
                      aria-label="Transaction trends line chart"
                    >
                      {/* Y grid */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = 10 + (i / 4) * (200 - 10 - 30);
                        return (
                          <line
                            key={i}
                            x1={40}
                            y1={y}
                            x2={520 - 10}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        );
                      })}
                      {/* X labels */}
                      {trendData.map((d, i) => (
                        <text
                          key={`${d.label}-${i}`}
                          x={
                            40 +
                            i *
                              (trendData.length > 1
                                ? (520 - 40 - 10) / (trendData.length - 1)
                                : 0)
                          }
                          y={200 - 8}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#64748b"
                        >
                          {d.label}
                        </text>
                      ))}
                      {/* Y title */}
                      <text
                        x="14"
                        y={100}
                        fontSize="11"
                        fill="#64748b"
                        transform="rotate(-90 14 100)"
                      >
                        Transactions
                      </text>
                      {/* Polyline */}
                      {trendData.length > 0 && (
                        <>
                          <polyline
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2.5"
                            points={(() => {
                              const width = 520,
                                pad = { l: 40, r: 10, t: 10, b: 30 };
                              const innerW = width - pad.l - pad.r,
                                innerH = 200 - pad.t - pad.b;
                              const minY = Math.min(
                                ...trendData.map((d) => d.value)
                              );
                              const maxY = Math.max(
                                ...trendData.map((d) => d.value)
                              );
                              const xStep =
                                trendData.length > 1
                                  ? innerW / (trendData.length - 1)
                                  : innerW;
                              const scaleY = (v) =>
                                pad.t +
                                innerH -
                                ((v - minY) / (maxY - minY || 1)) * innerH;
                              return trendData
                                .map(
                                  (d, i) =>
                                    `${pad.l + i * xStep},${scaleY(d.value)}`
                                )
                                .join(" ");
                            })()}
                          />
                          {trendData.map((d, i) => {
                            const width = 520,
                              pad = { l: 40, r: 10, t: 10, b: 30 };
                            const innerW = width - pad.l - pad.r,
                              innerH = 200 - pad.t - pad.b;
                            const minY = Math.min(
                              ...trendData.map((x) => x.value)
                            );
                            const maxY = Math.max(
                              ...trendData.map((x) => x.value)
                            );
                            const xStep =
                              trendData.length > 1
                                ? innerW / (trendData.length - 1)
                                : innerW;
                            const scaleY = (v) =>
                              pad.t +
                              innerH -
                              ((v - minY) / (maxY - minY || 1)) * innerH;
                            return (
                              <circle
                                key={i}
                                cx={40 + i * xStep}
                                cy={scaleY(d.value)}
                                r="3.5"
                                fill="#8b5cf6"
                              />
                            );
                          })}
                        </>
                      )}
                    </svg>
                  )}
                </div>
              </div>

              {/* Transaction Categories (Pie + % di legend) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Transaction Categories
                  </h3>
                  <FilterSelect
                    value={catRange}
                    onChange={setCatRange}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "full_year", label: "Full Year" },
                    ]}
                  />
                </div>

                <div className="px-6 pb-6 pt-2">
                  {catError ? (
                    <div className="h-56 grid place-items-center text-sm text-rose-600">
                      failed to load
                    </div>
                  ) : catLoading ? (
                    <div className="h-56 grid place-items-center text-sm text-slate-500">
                      loading...
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center">
                        <div
                          aria-label="Transaction categories pie chart"
                          className="relative w-56 h-56 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
                          style={{ background: toConic(categoriesData) }}
                        />
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-3">
                        {categoriesData.map((c) => (
                          <div
                            key={c.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-sm"
                                style={{ backgroundColor: c.color }}
                              />
                              <span className="text-sm text-slate-700">
                                {c.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {c.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Methods (Pie) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Payment Methods
                  </h3>
                  <FilterSelect
                    value={payRange}
                    onChange={setPayRange}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "full_year", label: "Full Year" },
                    ]}
                  />
                </div>
                <div className="px-6 pb-6 pt-2">
                  {payError ? (
                    <div className="h-56 grid place-items-center text-sm text-rose-600">
                      failed to load
                    </div>
                  ) : payLoading ? (
                    <div className="h-56 grid place-items-center text-sm text-slate-500">
                      loading...
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center">
                        <div
                          aria-label="Payment methods pie chart"
                          className="relative w-56 h-56 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
                          style={{ background: toConic(paymentData) }}
                        />
                      </div>
                      <div className="mt-6 space-y-2 max-w-sm mx-auto">
                        {paymentData.map((m) => (
                          <div
                            key={m.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-sm"
                                style={{ backgroundColor: m.color }}
                              />
                              <span className="text-sm text-slate-700">
                                {m.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {m.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Daily / Monthly Amount Split (Bar) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    {amountRange === "full_year"
                      ? "Monthly Amount Split"
                      : "Daily Amount Split"}
                  </h3>
                  <FilterSelect
                    value={amountRange}
                    onChange={setAmountRange}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "full_year", label: "Full Year" },
                    ]}
                  />
                </div>
                <div className="px-6 pb-6 pt-2">
                  {amountError ? (
                    <div className="h-64 grid place-items-center text-sm text-rose-600">
                      failed to load
                    </div>
                  ) : amountLoading ? (
                    <div className="h-64 grid place-items-center text-sm text-slate-500">
                      loading...
                    </div>
                  ) : (
                    <AmountBarChart
                      data={amountData}
                      valueKey="amount"
                      labelKey="label"
                      unitLabel="Amount (Million Rp)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-500">
              Copyright 2025. All rights reserved.
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
