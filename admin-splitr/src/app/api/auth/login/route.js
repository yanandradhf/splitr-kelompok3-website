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
    
    // Fallback authentication
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'Admin', name: 'Administrator' },
      { username: 'user', password: 'user123', role: 'User', name: 'User Demo' },
      { username: 'demo', password: 'demo123', role: 'Demo', name: 'Demo User' }
    ];
    
    const user = validCredentials.find(u => u.username === username && u.password === password);
    
    if (user) {
      const response = {
        success: true,
        sessionId: 'session_' + Date.now(),
        admin: {
          id: 1,
          username: user.username,
          name: user.name,
          role: user.role
        }
      };
      
      console.log('Login successful:', response);
      return NextResponse.json(response);
    } else {
      console.log('Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}