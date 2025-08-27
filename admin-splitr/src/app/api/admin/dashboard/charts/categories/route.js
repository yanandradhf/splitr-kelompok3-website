export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/dashboard/charts/categories?period=${period}`, {
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
    } catch (error) {
      console.log('External API unavailable, using fallback data');
    }

    // Fallback mock data
    const mockData = [
      { category: 'Food & Dining', percentage: 35 },
      { category: 'Transportation', percentage: 25 },
      { category: 'Shopping', percentage: 20 },
      { category: 'Entertainment', percentage: 15 },
      { category: 'Other', percentage: 5 }
    ];

    return Response.json({ data: mockData });
  } catch (error) {
    console.log('Chart API unavailable, using fallback data');
    return Response.json({ data: [] }, { status: 500 });
  }
}