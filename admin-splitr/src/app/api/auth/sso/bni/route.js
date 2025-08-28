import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'BNI SSO maintenance mode' }, { status: 503 });
}