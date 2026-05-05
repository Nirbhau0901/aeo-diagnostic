import { GoogleGenerativeAI } from '@google/generative-ai'

export async function queryGemini(query: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  async function attempt(): Promise<string> {
    const result = await model.generateContent(query)
    return result.response.text()
  }

  try {
    return await attempt()
  } catch (err) {
    const is503 =
      err instanceof Error &&
      (err.message.includes('503') || err.message.toLowerCase().includes('service unavailable'))
    if (is503) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      try {
        return await attempt()
      } catch (retryErr) {
        const message = retryErr instanceof Error ? retryErr.message : 'Gemini request failed'
        return `Error: ${message}`
      }
    }
    const message = err instanceof Error ? err.message : 'Gemini request failed'
    return `Error: ${message}`
  }
}
