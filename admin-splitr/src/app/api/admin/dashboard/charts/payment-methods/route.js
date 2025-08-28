export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/dashboard/charts/payment-methods?sessionId=${sessionId}&period=${period}`, {
        headers: {
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

    return Response.json({ data: [] });
  } catch (error) {
    console.log('Chart API unavailable, using fallback data');
    return Response.json({ data: [] }, { status: 500 });
  }
}