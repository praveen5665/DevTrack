

# temp-project — Next.js 16 App Router

## Commands

| Action     | Command         |
| ---------- | --------------- |
| dev server | `npm run dev`   |
| build      | `npm run build` |
| prod start | `npm run start` |
| lint       | `npm run lint`  |

No typecheck or test script exists. For manual typechecking: `npx tsc --noEmit`.

## Stack quirks

- **Tailwind v4** — uses `@import "tailwindcss"` (not legacy `@tailwind` directives) and the `@tailwindcss/postcss` PostCSS plugin.
- **ESLint flat config** — `eslint.config.mjs` with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Available skills

Skills in `.agents/skills/` are loaded automatically. Use the `skill` tool when a task matches:
- `ai-sdk` — Vercel AI SDK (generateText, streamText, useChat, tool calling, etc.)
- `frontend-design` — visual aesthetic guidance
- `nextjs-best-practices` — App Router patterns, Server Components, data fetching
