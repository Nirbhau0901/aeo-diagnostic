@AGENTS.md



\# AEO Diagnostic — Claude Code Context



\## What this project is

A web app that helps Amazon sellers check how well AI models (GPT-4o, Claude, 

Gemini, Llama via Groq) recommend their brand when shoppers ask product queries.

User enters a query + brand name, gets a report card with grades, competitor 

rankings, and AEO improvement tips.



\## Tech stack

\- Next.js 14 (App Router)

\- TypeScript

\- Tailwind CSS

\- shadcn/ui for components

\- Framer Motion for animations

\- Supabase (PostgreSQL) for query history

\- Vercel for deployment



\## AI APIs used

\- OpenAI GPT-4o — via openai npm package

\- Anthropic Claude 3.5 Sonnet — via @anthropic-ai/sdk

\- Google Gemini 1.5 Pro — via @google/generative-ai

\- Llama 3.3 70B — via Groq API (openai-compatible endpoint)



\## Folder structure

\- app/ — Next.js App Router pages and API routes

\- app/api/diagnose/route.ts — core API: fires all 4 AI calls in parallel

\- app/api/history/route.ts — save and fetch from Supabase

\- components/ — all React components

\- lib/ — API client files, scorer logic, supabase client

\- types/ — shared TypeScript types



\## Environment variables (in .env.local, never commit)

\- OPENAI\_API\_KEY

\- ANTHROPIC\_API\_KEY

\- GEMINI\_API\_KEY

\- GROQ\_API\_KEY

\- NEXT\_PUBLIC\_SUPABASE\_URL

\- NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY



\## Coding conventions

\- Always use TypeScript, never plain JS

\- Use async/await, never .then() chains

\- Use Promise.allSettled() for parallel AI calls (so one failure doesn't break others)

\- All API keys must stay server-side only (inside app/api/ routes, never in components)

\- Components should be small and single-purpose

\- Use Tailwind for all styling, no inline style objects unless necessary

\- Use shadcn/ui components where possible before building custom ones



\## How to run locally

npm run dev



\## Key design decisions

\- Parallel AI calls for speed (\~5s vs \~15s sequential)

\- Supabase saves every query so users can track AEO score over time

\- Groq runs Llama 3.3 (open-source model) as the 4th comparison point

\- Claude is also used to generate AEO improvement tips after the scan



\## Current status

Setting up project — nothing built yet.



\## Bug fix approach

\- Check browser console and terminal logs first

\- API errors should be caught per-model so other models still return results

\- Never let one failed API call return a 500 — use try/catch per model



\## Code review priorities

1\. API keys never exposed client-side

2\. Error handling on every AI call

3\. TypeScript types defined for all data shapes

4\. Mobile responsive layout



\## Agent Behaviour Rules



\### After completing every task:

1\. Run `npm run build` to check for TypeScript and build errors

2\. If errors exist, fix them before considering the task done

3\. Check browser console for runtime errors

4\. Review the code you just wrote for:

&#x20;  - API keys accidentally exposed client-side

&#x20;  - Missing error handling on any API call

&#x20;  - Any TypeScript `any` types that should be properly typed

&#x20;  - Unused imports or variables



\### Debugging workflow:

1\. Read the full error message carefully

2\. Check which file and line number the error points to

3\. Fix the root cause, not just the symptom

4\. After fixing, run `npm run build` again to confirm resolved



\### Code quality standards:

\- Every API call must have try/catch

\- Never use `any` type in TypeScript

\- Every component must handle loading and error states

\- No console.log left in production code (use only for debugging, remove after)



\### Token efficiency:

\- Work in small focused tasks, one file at a time

\- Do not rewrite files that are already working

\- When editing, change only what is necessary

\- Always read a file before editing it

