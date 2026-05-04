import { createClient } from '@supabase/supabase-js'
import type { DiagnosticResult, QueryHistory } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function saveQuery(data: DiagnosticResult): Promise<void> {
  const { error } = await supabase.from('queries').insert({
    query_text: data.query,
    brand_name: data.brandName,
    overall_score: data.overallScore,
    results: data,
  })
  if (error) throw new Error(error.message)
}

export async function getHistory(): Promise<QueryHistory[]> {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw new Error(error.message)
  return (data ?? []) as QueryHistory[]
}
