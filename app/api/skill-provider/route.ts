import { NextResponse } from 'next/server';
import { detectProvider } from '@/lib/aiCall';

export async function GET() {
  const provider = detectProvider();
  if (!provider) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 503 });
  }
  return NextResponse.json({ provider });
}
