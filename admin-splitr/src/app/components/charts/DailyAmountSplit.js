"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Bar = dynamic(() => import("react-chartjs-2").then((m) => m.Bar), { ssr: false });

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmtRpM = (v) => (v >= 1000 ? `Rp ${(v / 1000).toFixed(2)}B` : `Rp ${Number(v).toFixed(1)}M`);

// GANTI ke env kalau mau: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const API_BASE = "https://533c27f18d6b.ngrok-free.app";

/** Pastikan payload JSON (bisa jadi string HTML dari ngrok) */
function safeJson(x) {
  if (x && typeof x === "object") return x;
  try {
    return JSON.parse(x);
  } catch {
    return null;
  }
}

function normalizeApi(period, payload) {
  const toJuta = (x) => (x ?? 0) / 1_000_000;
  const list = Array.isArray(payload?.data) ? payload.data : [];

  if (period === "7d") {
    return {
      labels: list.map((d) => d.label), // Thu, Fri, ...
      data: list.map((d) => toJuta(d.amount)),
    };
  }
  if (period === "thismonth") {
    return {
      labels: list.map((d) => d.label || d.full_label || d.date?.slice(8, 10)),
      data: list.map((d) => toJuta(d.amount)),
    };
  }
  // year
  return {
    labels: list.map((d) => d.label || monthNames[(d.month ?? 1) - 1]),
    data: list.map((d) => toJuta(d.amount)),
  };
}

export default function DailyAmountSplit({ initialRange = "7d", height = 260 }) {
  const [range, setRange] = useState(initialRange); // "7d" | "thismonth" | "year"
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const period = range === "7d" ? "7days" : range === "thismonth" ? "thismonth" : "year";

        const res = await axios.get(`${API_BASE}/api/admin/dashboard/charts/daily-amount`, {
          params: { period },
          // header penting supaya ngrok TIDAK membalas HTML warning
          headers: { "ngrok-skip-browser-warning": "true" },
          signal: controller.signal,
        });

        if (!mounted) return;

        // amankan parsing (kalau ngrok/Reverse proxy balas string)
        const json = safeJson(res.data);
        if (!json || typeof json !== "object") {
          throw new Error("Unexpected response (not JSON). Cek header ngrok & CORS.");
        }

        const { labels, data } = normalizeApi(range, json);
        // DEBUG kalau perlu:
        console.log("AULIAA labels:", labels);
        console.log("AULIAA data (juta):", data);

        setLabels(labels);
        setData(data);
      } catch (e) {
        if (!mounted || controller.signal.aborted) return;
        setErr(e?.response?.data?.message || e.message || "Failed to load");
        setLabels([]);
        setData([]);
      } finally {
        mounted && setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [range]);

  // ── Axis scaling (lebih proporsional per range)
  const { maxY, stepY } = useMemo(() => {
    const peak = Math.max(0, ...data);            // data dalam "juta"
    const baseMin = range === "year" ? 40 : 10;   // 40M utk yearly, 10M utk 7d/thismonth
    const maxY = Math.max(baseMin, Math.ceil(peak / 10) * 10);
    const stepY = Math.max(2, Math.round(maxY / 4)); // grid rapi min 2M
    return { maxY, stepY };
  }, [data, range]);

  // tampilkan sebagian label di X kalau panjang
  const stepX = useMemo(() => {
    if (labels.length <= 8) return 1;
    if (labels.length <= 16) return 2;
    if (labels.length <= 31) return 4;
    return 1;
  }, [labels.length]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => fmtRpM(ctx.raw) } },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            color: "#6b7280",
            font: { size: 12 },
            callback: function (value, index) {
              return index % stepX === 0 || index === labels.length - 1
                ? this.getLabelForValue(index)
                : "";
            },
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: maxY,
          ticks: { stepSize: stepY, color: "#6b7280" },
          title: { display: true, text: "Amount (Rp Millions)", color: "#6b7280", font: { weight: "600" } },
          grid: { drawBorder: false, color: "rgba(0,0,0,0.06)" },
        },
      },
      datasets: {
        bar: { borderRadius: 8, borderSkipped: "bottom", categoryPercentage: 0.7, barPercentage: 0.9 },
      },
    }),
    [labels.length, maxY, stepY, stepX]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: "rgba(34,211,238,0.9)",
          hoverBackgroundColor: "rgba(34,211,238,1)",
        },
      ],
    }),
    [labels, data]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Daily Amount Split</h3>
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="thismonth">This Month</option>
            <option value="year">A Year</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
        </div>
      </div>

      {err ? (
        <div className="p-6 text-sm text-red-600">Gagal memuat data: {err}</div>
      ) : (
        <div className="px-4 pb-4" style={{ height }}>
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">Loading…</div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      )}
    </div>
  );
}
