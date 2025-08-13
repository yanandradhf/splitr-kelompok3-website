export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('payment_method');
    const search = searchParams.get('search');
    
    const apiUrl = new URL('https://533c27f18d6b.ngrok-free.app/api/admin/transactions');
    apiUrl.searchParams.set('limit', limit);
    apiUrl.searchParams.set('page', page);
    
    if (dateFrom) apiUrl.searchParams.set('date_from', dateFrom);
    if (dateTo) apiUrl.searchParams.set('date_to', dateTo);
    if (status) apiUrl.searchParams.set('status', status);
    if (paymentMethod) apiUrl.searchParams.set('payment_method', paymentMethod);
    if (search) apiUrl.searchParams.set('search', search);
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${sessionId}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Transactions API error:', error);
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}