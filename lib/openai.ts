import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function queryOpenAI(query: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1024,
    })
    return response.choices[0]?.message?.content ?? ''
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI request failed'
    return `Error: ${message}`
  }
}
