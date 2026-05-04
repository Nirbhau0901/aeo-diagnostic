import { NextResponse } from 'next/server'
import { getHistory } from '@/lib/supabase'

export async function GET() {
  try {
    const history = await getHistory()
    return NextResponse.json(history)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch history'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
