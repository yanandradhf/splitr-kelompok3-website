'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthGuard from '../components/AuthGuard';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Loading...', role: 'User' });
  const [isOpen, setIsOpen] = useState(false);
  
  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({ 
        name: parsedUser.name || parsedUser.username || 'Admin', 
        role: parsedUser.role || 'Admin' 
      });
    }
  }, []);
  
  // Chart data - can be replaced with API data
  const [expenseCategories] = useState([
    { name: 'Food & Dining', percentage: 40, color: '#f97316', bgColor: 'bg-orange-500' },
    { name: 'Transport', percentage: 25, color: '#3b82f6', bgColor: 'bg-blue-500' },
    { name: 'Entertainment', percentage: 20, color: '#10b981', bgColor: 'bg-green-500' },
    { name: 'Others', percentage: 15, color: '#8b5cf6', bgColor: 'bg-purple-500' }
  ]);
  
  const [monthlyData] = useState([
    { month: 'Jan', amount: 1200000 },
    { month: 'Feb', amount: 1800000 },
    { month: 'Mar', amount: 1500000 },
    { month: 'Apr', amount: 2000000 },
    { month: 'May', amount: 1600000 },
    { month: 'Jun', amount: 2200000 }
  ]);
  
  // Calculate chart values
  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
  const calculateStrokeDasharray = (percentage) => (percentage / 100) * 251.2;
  const calculateStrokeDashoffset = (percentage, startPercentage = 0) => {
    return 251.2 - (startPercentage / 100) * 251.2;
  };

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionId');
      router.push('/');
    }
  };

  return (
    <AuthGuard>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        
        {/* Main Content */}
        <div className="flex flex-col min-h-screen transition-all duration-300" style={{marginLeft: isOpen ? '256px' : '0px'}}>
          {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-6">
            <div className="flex justify-between items-center h-24">
              <div className="flex flex-col ml-16">
                <span className="text-xl font-semibold text-gray-900">Dashboard Monitoring</span>
                <span className="text-sm text-gray-500 mt-1">Overview of transaction performance and statistics.</span>
              </div>
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/profile.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggOEE0IDQgMCAxIDAgOCAwYTQgNCAwIDAgMCAwIDhaTTggMTBjLTQuNDIgMC04IDMuNTgtOCA4aDEuNWMwLTMuNTggMi45Mi02LjUgNi41LTYuNXM2LjUgMi45MiA2LjUgNi41SDE2Yy0wLTQuNDItMy41OC04LTgtOFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
                  }}
                />
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                <p className="text-2xl font-bold text-gray-900">Rp 2,450,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-900">56</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Groups</h3>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expense Categories Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    {expenseCategories.map((category, index) => {
                      const startPercentage = expenseCategories.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0);
                      return (
                        <circle 
                          key={category.name}
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke={category.color} 
                          strokeWidth="8"
                          strokeDasharray={calculateStrokeDasharray(category.percentage)}
                          strokeDashoffset={calculateStrokeDashoffset(category.percentage, startPercentage)}
                          className="transition-all duration-1000"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${category.bgColor} rounded-full mr-3`}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Spending Trend</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => {
                  const heightPercentage = (data.amount / maxAmount) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-md transition-all duration-1000 hover:from-orange-600 hover:to-orange-400" 
                        style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                      >
                      </div>
                      <div className="mt-2 text-xs font-medium text-gray-600">{data.month}</div>
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
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Dinner Split', amount: '-Rp 125,000', status: 'completed', color: 'green' },
                  { name: 'Movie Tickets', amount: '-Rp 80,000', status: 'pending', color: 'yellow' },
                  { name: 'Grocery Shopping', amount: '-Rp 200,000', status: 'completed', color: 'green' },
                  { name: 'Gas Bill', amount: '-Rp 150,000', status: 'pending', color: 'yellow' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-${transaction.color}-400 mr-3`}></div>
                      <span className="font-medium text-gray-900">{transaction.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{transaction.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">New Split</span>
                  </div>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Add Group</span>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/transactions')}
                  className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">View All</span>
                  </div>
                </button>
                <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Settings</span>
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
