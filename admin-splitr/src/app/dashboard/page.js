"use client";

import { useMemo, useState, useEffect } from "react";
import { DashboardLayout, BarChart, Select } from "../../components";
import useDashboardStore from "../../store/dashboardStore";
import { formatID, formatPercent, formatIDRShort, toConic } from "../../utils/formatters";
import { getPaymentColor } from "../../utils/helpers";
import { CHART_COLORS } from "../../constants/colors";









export default function Dashboard() {
  // Zustand stores
  const {
    summary, summaryLoading,
    trendData, trendLoading, trendError,
    categoriesData, catLoading, catError,
    paymentData, payLoading, payError,
    amountData, amountLoading, amountError,
    fetchSummary, fetchTrends, fetchCategories, fetchPaymentMethods, fetchDailyAmount
  } = useDashboardStore();

  // Filter states
  const [trendRange, setTrendRange] = useState("7d");
  const [catRange, setCatRange] = useState("7d");
  const [payRange, setPayRange] = useState("7d");
  const [amountRange, setAmountRange] = useState("7d");

  // Initial data fetch
  useEffect(() => {
    fetchSummary();
    fetchTrends(trendRange);
    fetchCategories(catRange);
    fetchPaymentMethods(payRange);
    fetchDailyAmount(amountRange);
  }, []);

  // Fetch data when filters change
  useEffect(() => { fetchTrends(trendRange); }, [trendRange]);
  useEffect(() => { fetchCategories(catRange); }, [catRange]);
  useEffect(() => { fetchPaymentMethods(payRange); }, [payRange]);
  useEffect(() => { fetchDailyAmount(amountRange); }, [amountRange]);

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
    <DashboardLayout 
      title="Dashboard Monitoring" 
      subtitle="Overview of transaction performance and statistics"
    >
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
                      {summaryLoading ? "..." : formatID(summary.txToday)}
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
                      {summaryLoading
                        ? "..."
                        : formatIDRShort(summary.amountSplitToday)}
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
                      {summaryLoading
                        ? "..."
                        : formatPercent(summary.successRate)}
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
                      {summaryLoading
                        ? "..."
                        : formatPercent(summary.failedRate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Transaction Trends */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Transaction Trends
                  </h3>
                  <Select
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value)}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "this_year", label: "This Year" },
                    ]}
                    className="text-sm bg-slate-50 border-slate-200"
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
                            key={`y-grid-${i}`}
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
                          key={`x-label-${i}-${d.label}`}
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
                                key={`circle-${i}-${d.label}`}
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
                  <Select
                    value={catRange}
                    onChange={(e) => setCatRange(e.target.value)}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "this_year", label: "This Year" },
                    ]}
                    className="text-sm bg-slate-50 border-slate-200"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Payment Methods (Pie) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="px-6 pt-6 flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold text-slate-900">
                    Payment Methods
                  </h3>
                  <Select
                    value={payRange}
                    onChange={(e) => setPayRange(e.target.value)}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "this_year", label: "This Year" },
                    ]}
                    className="text-sm bg-slate-50 border-slate-200"
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
                    {amountRange === "this_year"
                      ? "Monthly Amount Split"
                      : "Daily Amount Split"}
                  </h3>
                  <Select
                    value={amountRange}
                    onChange={(e) => setAmountRange(e.target.value)}
                    options={[
                      { value: "7d", label: "7 Days" },
                      { value: "this_month", label: "This Month" },
                      { value: "this_year", label: "This Year" },
                    ]}
                    className="text-sm bg-slate-50 border-slate-200"
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
                    <BarChart
                      data={amountData}
                      valueKey="amount"
                      labelKey="label"
                      unitLabel="Amount (Million Rp)"
                      color="#2dd4bf"
                    />
                  )}
                </div>
              </div>
            </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500">
        SPLITR by BNI Copyright 2025. All rights reserved.
      </div>
    </DashboardLayout>
  );
}
