'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthGuard from '../components/AuthGuard';

export default function Transactions() {
  const router = useRouter();
  const [user] = useState({ name: 'John Doe', role: 'User' });
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic transaction data - can be updated from API
  const [transactions, setTransactions] = useState([
    { id: 'TXN001', date: '2024-01-15', sender: 'John Doe', amount: 125000, status: 'Success', paymentMethod: 'Bank Transfer' },
    { id: 'TXN002', date: '2024-01-14', sender: 'Jane Smith', amount: 80000, status: 'Pending', paymentMethod: 'Credit Card' },
    { id: 'TXN003', date: '2024-01-13', sender: 'Bob Wilson', amount: 200000, status: 'Success', paymentMethod: 'e-Wallet' },
    { id: 'TXN004', date: '2024-01-12', sender: 'Alice Brown', amount: 150000, status: 'Failed', paymentMethod: 'Bank Transfer' },
    { id: 'TXN005', date: '2024-01-11', sender: 'Charlie Davis', amount: 45000, status: 'Success', paymentMethod: 'Credit Card' },
    { id: 'TXN006', date: '2024-01-10', sender: 'Diana Miller', amount: 95000, status: 'Pending', paymentMethod: 'e-Wallet' }
  ]);
  
  // Filtered transactions based on filters and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesDateRange = (!dateFrom || transaction.date >= dateFrom) && (!dateTo || transaction.date <= dateTo);
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesPaymentMethod = !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;
    const matchesSearch = !searchQuery || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.sender.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDateRange && matchesStatus && matchesPaymentMethod && matchesSearch;
  });

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setStatusFilter('');
    setPaymentMethodFilter('');
    setSearchQuery('');
  };

  const handleDownload = (transactionId) => {
    alert(`Downloading details for ${transactionId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthGuard>
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
      
      <div className="flex flex-col h-full">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center ml-16">
                <span className="text-lg font-semibold text-gray-900">Transactions</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Filter Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  />
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                
                {/* Payment Method Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                  >
                    <option value="">All Methods</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="e-Wallet">e-Wallet</option>
                  </select>
                </div>
              </div>
              
              {/* Reset Button */}
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Transaction ID or Sender..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Transaction Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.sender}</div>
                        <div className="text-sm text-gray-500">{transaction.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">
                          Rp {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDownload(transaction.id)}
                          className="text-orange-600 hover:text-orange-900 font-medium text-sm flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}