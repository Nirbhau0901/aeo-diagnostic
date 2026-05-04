import { GoogleGenerativeAI } from '@google/generative-ai'

export async function queryGemini(query: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(query)
    return result.response.text()
  } catch (err) {
    console.error('[gemini] Error:', err)
    const message = err instanceof Error ? err.message : 'Gemini request failed'
    return `Error: ${message}`
  }
}
