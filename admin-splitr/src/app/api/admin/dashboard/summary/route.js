export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');

    // Try to fetch from external API first
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/dashboard/summary`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      return Response.json(data);
    }

    // External API not available, use fallback
  } catch (error) {
    console.log('External API unavailable, using fallback data');
    
    // Return fallback mock data
    const mockSummary = {
      txToday: 1247,
      transactionsToday: 1247,
      amountSplitToday: 45200000000,
      totalAmount: 45200000000,
      successRate: 0.942,
      failedRate: 0.058
    };
    
    return Response.json(mockSummary);
  }
}