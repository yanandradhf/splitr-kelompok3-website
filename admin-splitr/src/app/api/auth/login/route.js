import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    console.log('Login attempt:', { username });
    
    // Try external API first
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ username, password }),
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('External API login successful');
        
        // Ensure sessionId exists
        if (!data.sessionId) {
          data.sessionId = 'session_' + Date.now();
        }
        
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('External API unavailable, using fallback authentication');
    }
    
    // No fallback - pure API only
    console.log('External API unavailable');
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
    
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}