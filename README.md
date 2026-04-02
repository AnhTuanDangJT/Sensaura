# Sensaura

Premium art-platform style UI built with **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**.  
The UI uses in-app state (`localStorage`) for demos; the optional **Spring Boot** API lives under `ai-backend/` for future integration.

- **Live deploy (recommended):** [Vercel](https://vercel.com) — connect this repo and deploy the Next.js app from the repository root.
- **Repository:** [github.com/AnhTuanDangJT/Sensaura](https://github.com/AnhTuanDangJT/Sensaura)

## Requirements

- **Node.js** 20.9+ (see `engines` in `package.json`)
- **npm** (ships with Node)

## Local development (frontend only)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local development (frontend + Java backend)

The Java API is **not** run by Vercel; host it separately (e.g. Railway, Render, Fly.io) when you wire real auth/API calls.

1. **Backend** — from `ai-backend/`:

   - **Command Prompt:** `run-local.bat`
   - **PowerShell:** `.\run-local.ps1`  
   API: [http://localhost:8080](http://localhost:8080) (or 8081–8083 if 8080 is busy). See [ai-backend/README.md](ai-backend/README.md).

2. **Frontend** — from the repo root:

   ```bash
   npm install
   npm run dev
   ```

## Production build (same as Vercel)

```bash
npm install
npm run build
npm start
```

## Deploy on Vercel

1. Push this repository to GitHub (see [Push to GitHub](#push-to-github)).
2. In [Vercel](https://vercel.com) → **Add New** → **Project** → import **AnhTuanDangJT/Sensaura**.
3. Use defaults:
   - **Framework Preset:** Next.js  
   - **Root Directory:** `.` (repository root)  
   - **Build Command:** `npm run build`  
   - **Output:** handled automatically by Next.js  
4. **Environment variables:** optional for the current UI. When you add API calls, set e.g. `NEXT_PUBLIC_API_URL` in Vercel (see `.env.example`).

### Monorepo note

`ai-backend/` is included for local/API development. Vercel only builds the Next.js app at the root; it does **not** deploy the Spring Boot service.

## Push to GitHub

If the remote is empty or you are pushing for the first time:

```bash
git init
git add .
git commit -m "Initial commit: Sensaura Next.js app"
git branch -M main
git remote add origin https://github.com/AnhTuanDangJT/Sensaura.git
git push -u origin main
```

If the repo already exists and you are updating:

```bash
git remote add origin https://github.com/AnhTuanDangJT/Sensaura.git   # skip if already added
git add .
git commit -m "Your message"
git push origin main
```

## Troubleshooting

| Issue | Suggestion |
|--------|------------|
| `JavaScript heap out of memory` during `npm run dev` / build | Set `NODE_OPTIONS=--max-old-space-size=4096` (Windows: `set NODE_OPTIONS=--max-old-space-size=4096` then `npm run dev`). |
| Next.js workspace root warning | This repo sets `turbopack.root` in `next.config.ts`. Remove stray `package-lock.json` in parent folders if you do not need them. |

## License

Private project unless you add a license file.
