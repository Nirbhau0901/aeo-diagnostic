import { createClient } from '@supabase/supabase-js'
import type { DiagnosticResult, QueryHistory } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function saveQuery(data: DiagnosticResult, userId?: string): Promise<void> {
  const { error } = await supabase.from('queries').insert({
    query_text: data.query,
    brand_name: data.brandName,
    overall_score: data.overallScore,
    results: data,
    ...(userId ? { user_id: userId } : {}),
  })
  if (error) throw new Error(error.message)
}

export async function getHistory(userId?: string): Promise<QueryHistory[]> {
  let query = supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as QueryHistory[]
}
