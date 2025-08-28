export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';
    const sessionId = searchParams.get('sessionId');

    console.log('Geographic API called with:', { period, sessionId });

    // Try external API first
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/admin/analytics/geographic?sessionId=${sessionId}&period=${period}`;
      console.log('Calling external API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        timeout: 5000
      });

      console.log('External API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('External API data:', data);
        return Response.json(data);
      }
    } catch (error) {
      console.log('External API error:', error.message);
    }

    console.log('Returning empty data');
    // Return empty data when API fails
    return Response.json({
      heatmapData: []
    });
  } catch (error) {
    console.log('Geographic API error:', error);
    return Response.json({
      heatmapData: []
    }, { status: 500 });
  }
}