import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    console.log('Local login attempt:', { username });
    
    // TODO: Uncomment for API version
    // const response = await fetch('https://533c27f18d6b.ngrok-free.app/api/admin/login', {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'ngrok-skip-browser-warning': 'true'
    //   },
    //   body: JSON.stringify({ username, password })
    // });
    // const data = await response.json();
    // return new Response(JSON.stringify(data), {
    //   status: response.status,
    //   headers: { 'Content-Type': 'application/json' }
    // });
    
    // Local authentication
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