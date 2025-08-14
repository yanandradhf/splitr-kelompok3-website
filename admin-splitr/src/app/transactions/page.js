'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import AuthGuard from '../components/AuthGuard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Transactions() {
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
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic transaction data from API
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Fetch transactions from API
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const sessionId = localStorage.getItem('sessionId');
      
      const params = {
        sessionId,
        limit: '10',
        page: page.toString()
      };
      
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (statusFilter) params.status = statusFilter;
      if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
      if (searchQuery) params.search = searchQuery;
      
      const response = await axios.get('/api/transactions', { params });
      
      const data = response.data;
      setTransactions(data.data || []);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 10,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.total_pages || 0
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load transactions on component mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  // Auto-apply filters when search query changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        fetchTransactions(1);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Use transactions directly since filtering is done by API
  const filteredTransactions = transactions || [];

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setStatusFilter('');
    setPaymentMethodFilter('');
    setSearchQuery('');
    // Fetch data again with no filters
    fetchTransactions(1);
  };

  const applyFilters = () => {
    fetchTransactions(1); // Reset to page 1 when applying filters
  };

  const exportCSV = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const params = { sessionId };
      
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (statusFilter) params.status = statusFilter;
      if (paymentMethodFilter) params.payment_method = paymentMethodFilter;
      if (searchQuery) params.search = searchQuery;
      
      const response = await axios.get('/api/transactions/export', {
        params,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'transactions.csv';
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export CSV');
    }
  };

  const exportPDF = async () => {
    try {
      // Use current filtered transactions data for PDF
      const dataToExport = filteredTransactions.length > 0 ? filteredTransactions : transactions;
      
      // Create PDF using jsPDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Transaction Report', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Prepare table data
      const tableData = dataToExport.map((transaction, index) => [
        index + 1,
        transaction.transaction_id || 'N/A',
        transaction.transaction_date || 'N/A',
        transaction.sender?.name || 'N/A',
        transaction.recipient?.name || 'N/A',
        `Rp ${transaction.amount?.toLocaleString() || '0'}`,
        transaction.recipient?.branch_code || 'N/A',
        transaction.payment_method || 'N/A',
        transaction.status || 'N/A'
      ]);
      
      // Add table
      autoTable(doc, {
        head: [['No', 'Transaction ID', 'Date', 'Sender', 'Recipient', 'Amount', 'Branch Code', 'Payment Method', 'Status']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [63, 216, 212], // #3FD8D4
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
      
      // Save PDF
      doc.save('transactions.pdf');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF');
    }
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
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="flex flex-col min-h-screen transition-all duration-300" style={{marginLeft: isOpen ? '256px' : '0px'}}>
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-6">
            <div className="flex justify-between items-center h-24">
              <div className="flex flex-col ml-16">
                <span className="text-xl font-semibold text-gray-900">Transaction Monitoring View</span>
                <span className="text-sm text-gray-500 mt-1">View and export past completed transactions.</span>
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

        <main className="flex-1 px-6 py-8">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6">

              
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
                    <option value="Instant">Instant</option>
                    <option value="Schedule">Schedule</option>
                  </select>
                </div>
              </div>
              
              {/* Export and Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={applyFilters}
                    className="px-5 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition-colors"
                  >
                    Apply Filters
                  </button>

                  <button
                    onClick={resetFilters}
                    className="px-5 py-1 bg-white text-black border border-black rounded-md text-sm hover:bg-gray-100 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={exportCSV}
                    className="px-5 py-1 bg-white text-black border border-black rounded-md text-sm hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>

                  <button
                    onClick={exportPDF}
                    className="px-5 py-1 bg-white text-black border border-black rounded-md text-sm hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or account number"
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Loading transactions...</div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">No transactions found</div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{backgroundColor: '#3FD8D4'}}>
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Transaction Date</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Branch Code</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-black uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-gray-900">{transaction.transaction_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {transaction.transaction_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-gray-900">{transaction.sender?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="font-medium text-gray-900">{transaction.recipient?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-semibold text-gray-900">
                          Rp {transaction.amount?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-medium text-gray-900">{transaction.recipient?.branch_code || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-medium text-gray-900">{transaction.payment_method || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            
            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total transactions)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchTransactions(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-orange-500"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md">
                      {pagination.page}
                    </span>
                    <button
                      onClick={() => fetchTransactions(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-orange-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}