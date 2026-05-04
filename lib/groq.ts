import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function queryGroq(query: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: query }],
      max_tokens: 1024,
    })
    return response.choices[0]?.message?.content ?? ''
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Groq request failed'
    return `Error: ${message}`
  }
}
