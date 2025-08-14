const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const status = searchParams.get("status");
    const paymentMethod = searchParams.get("payment_method");
    const search = searchParams.get("search");

    // Try to get data from transactions API first
    const transactionsUrl = new URL(`${API_BASE}/api/admin/transactions`);
    transactionsUrl.searchParams.set("limit", "1000"); // Get more data for export
    transactionsUrl.searchParams.set("page", "1");

    if (dateFrom) transactionsUrl.searchParams.set("date_from", dateFrom);
    if (dateTo) transactionsUrl.searchParams.set("date_to", dateTo);
    if (status) transactionsUrl.searchParams.set("status", status);
    if (paymentMethod)
      transactionsUrl.searchParams.set("payment_method", paymentMethod);
    if (search) transactionsUrl.searchParams.set("search", search);

    const response = await fetch(transactionsUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${sessionId}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions for export");
    }

    const data = await response.json();
    const transactions = data.data || [];

    // Generate CSV content matching table structure
    const headers = [
      "No",
      "Transaction ID",
      "Transaction Date",
      "Sender",
      "Recipient",
      "Amount",
      "Branch Code",
      "Payment Method",
      "Status",
    ];
    const csvRows = [headers.join(",")];

    transactions.forEach((transaction, index) => {
      const row = [
        index + 1,
        `"${transaction.transaction_id || "N/A"}"`,
        `"${transaction.transaction_date || "N/A"}"`,
        `"${transaction.sender?.name || "N/A"}"`,
        `"${transaction.recipient?.name || "N/A"}"`,
        `"Rp ${transaction.amount?.toLocaleString() || "0"}"`,
        `"${transaction.recipient?.branch_code || "N/A"}"`,
        `"${transaction.payment_method || "N/A"}"`,
        `"${transaction.status || "N/A"}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="transactions.csv"',
      },
    });
  } catch (error) {
    console.error("Export API error:", error);
    return Response.json(
      { error: "Failed to export transactions" },
      { status: 500 }
    );
  }
}
