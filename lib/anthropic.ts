import Anthropic from '@anthropic-ai/sdk'

export async function queryAnthropic(query: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: query }],
    })
    const block = message.content[0]
    if (block.type === 'text') return block.text
    return ''
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Anthropic request failed'
    return `Error: ${message}`
  }
}
