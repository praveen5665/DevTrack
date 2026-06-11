# DevTrack

A personal productivity dashboard for tracking tasks and focus sessions. Built with Next.js, Zustand, and Tailwind CSS. All data is stored locally in the browser via `localStorage`.

## Features

- **Task Management** — Add, edit, delete, and organize tasks with category (DSA, LLD, System Design, Fundamentals, Project), priority (P1–P4), and a scheduled date.
- **Kanban Board** — Tasks are grouped into To Do, In Progress, and Done columns with priority ordering.
- **Focus Timer** — Pomodoro-style timer (25/50 min presets) with an optional task link. Sessions are automatically logged on completion.
- **Metrics** — Daily snapshot of tasks completed and focus minutes logged.
- **Persistence** — All data survives page refreshes via Zustand's `persist` middleware writing to `localStorage`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Produces a static export in `out/`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.

2. In `next.config.ts`, uncomment and set `basePath` and `assetPrefix` to match your repository name:

   ```ts
   basePath: "/your-repo-name",
   assetPrefix: "/your-repo-name/",
   ```

3. Go to your repo **Settings > Pages**. Under **Source**, select **GitHub Actions**.

4. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` will build and deploy automatically.

Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Tech Stack

- Next.js (App Router) — static export
- TypeScript
- Tailwind CSS v4
- Zustand (state management + persist middleware)
- shadcn/ui (component library)
- Lucide Icons
