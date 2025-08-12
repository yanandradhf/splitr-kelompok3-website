"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Transaction Chart Component
function TransactionChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periodOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "thismonth", label: "This Month" },
    { value: "year", label: "A Year" },
  ];

  const fetchTransactionData = async (period) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://6cbbd3af6b2f.ngrok-free.app/api/admin/dashboard/charts/transactions?period=${period}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          timeout: 30000,
        }
      );
      console.log("API Response nabilaah:", response.data.data);
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setError("Invalid data format received");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData(selectedPeriod);
  }, [selectedPeriod]);

  const formatLabels = (data, period) => {
    return data.map((item, index) => {
      // Use the label from API response if available, otherwise format the date
      if (item.label) {
        return item.label;
      }

      const date = new Date(item.date);
      switch (period) {
        case "7days":
          return date.toLocaleDateString("en-US", { weekday: "short" });
        case "30days":
          return index % 5 === 0 || index === data.length
            ? date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })
            : "";
        case "thismonth":
          return index % 5 === 0 || index === data.length
            ? date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })
            : "";
        case "year":
          return date.toLocaleDateString("en-US", { month: "short" });
        default:
          return item.date;
      }
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction Trends
          </h3>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
            disabled
          >
            <option>Loading...</option>
          </select>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction Trends
          </h3>
          <select
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p>{error ? `Error: ${error}` : "No data available"}</p>
            <button
              onClick={() => fetchTransactionData(selectedPeriod)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Original data:", data);

  const labels = formatLabels(data, selectedPeriod);
  const transactions = data.map((item) => item.transactions);

  console.log("Labels:", labels);
  console.log("Transactions:", transactions);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: transactions,
        borderColor: "#FF8500",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0,
        pointRadius: 4,
        pointBackgroundColor: "#FF8500",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#FF8500",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#ffffff",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#d1d5db",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: "600",
        },
        bodyFont: {
          size: 12,
          weight: "500",
        },
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            console.log("Tooltip index:", index);
            console.log("Data at index:", data[index]);
            const item = data[index];

            // Only show label if it exists, otherwise just show the formatted date
            if (item.label) {
              return `${item.label} - ${new Date(item.date).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}`;
            } else {
              return new Date(item.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            }
          },
          label: (context) => {
            const index = context.dataIndex;
            const item = data[index];
            return `Transactions: ${item.transactions.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#e5e7eb",
          lineWidth: 1,
        },
        border: {
          display: true,
          color: "#d1d5db",
        },
        ticks: {
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
          maxTicksLimit:
            selectedPeriod === "30days" || selectedPeriod === "thismonth"
              ? 8
              : undefined,
        },
        title: {
          display: true,
          text: "Time Period",
          color: "#374151",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "#e5e7eb",
          lineWidth: 1,
        },
        border: {
          display: true,
          color: "#d1d5db",
        },
        ticks: {
          color: "#374151",
          font: {
            size: 12,
            weight: "500",
          },
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        title: {
          display: true,
          text: "Number of Transactions",
          color: "#374151",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Transaction Trends
        </h3>
        <select
          className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {periodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="p-6">
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user] = useState({ name: "John Doe", role: "User" });
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [monthlyData] = useState([
    { month: "Jan", amount: 1200000 },
    { month: "Feb", amount: 1800000 },
    { month: "Mar", amount: 1500000 },
    { month: "Apr", amount: 2000000 },
    { month: "May", amount: 1600000 },
    { month: "Jun", amount: 2200000 },
  ]);

  // Calculate chart values
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://6cbbd3af6b2f.ngrok-free.app/api/admin/dashboard/stats',
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          timeout: 30000
        }
      );
      setDashboardStats(response.data);
    } catch (err) {
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthGuard>
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center ml-16">
                  <span className="text-lg font-semibold text-gray-900">
                    Dashboard
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-auto px-6 py-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Transaction Count
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : dashboardStats?.today?.transaction_count?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Amount Split
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : `Rp ${(dashboardStats?.today?.amount_split / 1000000)?.toFixed(1) || '0'}M`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Success Rate
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : `${dashboardStats?.today?.success_rate || '0'}%`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      Failed Rate
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : `${dashboardStats?.today?.failed_rate || '0'}%`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Transaction Trends Line Chart */}
              <TransactionChart />

              {/* Monthly Spending Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Monthly Spending Trend
                  </h3>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {monthlyData.map((data, index) => {
                      const heightPercentage = (data.amount / maxAmount) * 100;
                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-md transition-all duration-1000 hover:from-orange-600 hover:to-orange-400"
                            style={{
                              height: `${heightPercentage}%`,
                              minHeight: "20px",
                            }}
                          ></div>
                          <div className="mt-2 text-xs font-medium text-gray-600">
                            {data.month}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>Rp 0</span>
                    <span>Rp {(maxAmount / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Transactions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        name: "Dinner Split",
                        amount: "-Rp 125,000",
                        status: "completed",
                        color: "green",
                      },
                      {
                        name: "Movie Tickets",
                        amount: "-Rp 80,000",
                        status: "pending",
                        color: "yellow",
                      },
                      {
                        name: "Grocery Shopping",
                        amount: "-Rp 200,000",
                        status: "completed",
                        color: "green",
                      },
                      {
                        name: "Gas Bill",
                        amount: "-Rp 150,000",
                        status: "pending",
                        color: "yellow",
                      },
                    ].map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full bg-${transaction.color}-400 mr-3`}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {transaction.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Actions AUL
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          New Split
                        </span>
                      </div>
                    </button>
                    <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Add Group
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => router.push("/transactions")}
                      className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          View All
                        </span>
                      </div>
                    </button>
                    <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Settings
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
