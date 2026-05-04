# AEO Diagnostic 🔍

> See how AI search engines rank and recommend your brand — before your competitors do.

**Live Demo:** https://aeo-diagnostic-three.vercel.app/

## What is AEO?
Answer Engine Optimization (AEO) is the AI-era equivalent of SEO. Instead of ranking on Google, brands now need to appear in ChatGPT, Claude, and Gemini responses when shoppers ask "what's the best X?". This tool diagnoses exactly that.

## Features
- Query 4 AI models simultaneously: GPT-4o Mini, Claude Haiku 4.5, Gemini 2.0 Flash, Llama 3.3 70B
- Get a letter grade (A-F) per model based on mention, position, and sentiment
- See which competitors dominate AI recommendations
- Get Claude-powered AEO improvement tips
- Track query history over time via Supabase

## Tech Stack
- **Frontend:** Next.js 14, React, Tailwind CSS, shadcn/ui, Framer Motion
- **AI APIs:** OpenAI, Anthropic, Google Gemini, Groq
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Running Locally
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with your API keys (see `.env.example`)
4. Run `npm run dev`
5. Open http://localhost:3000

## Environment Variables
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Built For
Pixii.ai Founding Engineer Assignment — May 2026
