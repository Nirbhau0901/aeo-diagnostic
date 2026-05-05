import { NextRequest, NextResponse } from 'next/server'
import { getHistory } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId') ?? undefined
  try {
    const history = await getHistory(userId)
    return NextResponse.json(history)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch history'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
