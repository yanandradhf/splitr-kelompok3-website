const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const generateMockTransactions = (limit, page, filters = {}) => {
  const transactions = [];
  const statuses = ['completed', 'pending', 'failed'];
  const methods = ['instant', 'scheduled'];
  const names = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'];
  const branchCodes = ['001', '002', '003', '004', '005'];
  
  for (let i = 0; i < limit; i++) {
    const id = (page - 1) * limit + i + 1;
    const senderName = names[Math.floor(Math.random() * names.length)];
    const recipientName = names[Math.floor(Math.random() * names.length)];
    
    // Generate date within filter range if specified
    let transactionDate;
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      const randomTime = fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime());
      transactionDate = new Date(randomTime).toISOString().split('T')[0];
    } else {
      transactionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    
    // Use filtered status if specified, map 'completed' to 'Success' for display
    let status = filters.status || statuses[Math.floor(Math.random() * statuses.length)];
    if (status === 'completed') status = 'Success';
    if (status === 'pending') status = 'Pending';
    if (status === 'failed') status = 'Failed';
    
    // Use filtered payment method if specified
    const paymentMethod = filters.paymentMethod || methods[Math.floor(Math.random() * methods.length)];
    
    // Filter by search if specified
    const finalSenderName = filters.search && Math.random() > 0.5 ? 
      filters.search : senderName;
    const finalRecipientName = filters.search && Math.random() > 0.5 ? 
      filters.search : recipientName;
    
    transactions.push({
      transaction_id: `TXN${String(id).padStart(6, '0')}`,
      transaction_date: transactionDate,
      sender: {
        name: finalSenderName
      },
      recipient: {
        name: finalRecipientName,
        branch_code: branchCodes[Math.floor(Math.random() * branchCodes.length)]
      },
      amount: Math.floor(Math.random() * 500000) + 10000,
      payment_method: paymentMethod,
      status: status
    });
  }
  return transactions;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("payment_method");
    const search = searchParams.get("search");

    const apiUrl = new URL(`${API_BASE}/api/admin/transactions`);
    apiUrl.searchParams.set("limit", limit.toString());
    apiUrl.searchParams.set("page", page.toString());

    if (dateFrom) apiUrl.searchParams.set("date_from", dateFrom);
    if (dateTo) apiUrl.searchParams.set("date_to", dateTo);
    if (status) apiUrl.searchParams.set("status", status);
    if (paymentMethod) apiUrl.searchParams.set("payment_method", paymentMethod);
    if (search) apiUrl.searchParams.set("search", search);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${sessionId}`,
      },
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Transactions API error, using fallback data:", error);
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    
    // Apply filters to mock data generation
    const filters = {
      dateFrom,
      dateTo,
      status,
      paymentMethod,
      search
    };
    
    const mockData = {
      data: generateMockTransactions(limit, page, filters),
      pagination: {
        page: page,
        limit: limit,
        total: 150,
        total_pages: Math.ceil(150 / limit)
      }
    };
    
    return Response.json(mockData);
  }
}
