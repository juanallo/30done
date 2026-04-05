# AGENTS.md – 30done

Context for AI agents and developers working on this codebase.

---

## 1. Project overview

**30done** is a mobile-first web app that helps users complete 30-day fitness challenges with streak-based tracking (“don’t break the chain”). Users can browse challenges, start one, see today’s workout, mark days complete/skip, and view progress and streaks. The app is a PWA with offline support and works without an account (local-first).

Product details: see `.cursor/rules/prd.mdc` (PRD).

---

## 2. Tech stack

| Area | Current | Notes |
|------|---------|--------|
| **Package manager** | yarn | Use `yarn` for install/scripts. |
| **Framework** | Next.js 15 (App Router) | React 19. |
| **Styling** | Tailwind CSS | With `tailwindcss-animate`. |
| **UI** | DaisyUI + shadcn/ui (Radix) | DaisyUI for layout/buttons; `components/ui/*` are shadcn-style (Radix primitives). Theme: `data-theme="night"` in root layout. |
| **Icons** | lucide-react | Via `components.json` (iconLibrary: lucide). |
| **Forms** | react-hook-form + zod + @hookform/resolvers | Present in deps; use for forms and validation. |
| **Data / API** | Local only | Challenge catalog from `lib/data.ts`; progress in `localStorage` via `useChallenge`. **No react-query or GQL in codebase yet** (see `.cursor/rules/frontend.mdc` for intended API client/server). |
| **Auth** | None (MVP) | Clerk is in frontend rules for future use. |
| **PWA** | Yes | `manifest.json`, `sw.js`, `PWAInstaller`, `IOSInstallPrompt`, `OfflineBanner`. |
| **Hosting** | Vercel | Per frontend rules. |

**Config:**  
- `next.config.mjs`: ESLint/TypeScript errors ignored in build; `images.unoptimized: true`; security headers; special headers for `/sw.js`.  
- `tsconfig.json`: path alias `@/*` → project root.  
- `components.json`: shadcn schema; aliases `@/components`, `@/lib`, `@/hooks`, etc.

---

## 3. Repository structure (source)

```
30done/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout: PWA meta, OfflineBanner, PWAInstaller, theme
│   ├── page.tsx            # Home (CTA → /challenges)
│   ├── globals.css         # Tailwind + DaisyUI + CSS variables
│   ├── challenges/         # Challenge library
│   │   ├── page.tsx        # List challenges; start/continue/reset/remove
│   │   └── [challengeId]/page.tsx
│   ├── workout/            # Today’s workout & day actions
│   │   ├── page.tsx        # Redirect/select if multiple active
│   │   └── [challengeId]/page.tsx  # Exercise view, complete/skip
│   ├── progress/           # Progress & history
│   │   ├── page.tsx        # Overview of active challenges
│   │   └── [challengeId]/page.tsx  # Per-challenge progress/calendar
│   ├── dashboard/          # Dashboard (post-start flow)
│   ├── offline/            # Offline fallback page
│   └── ...
├── components/
│   ├── ui/                 # shadcn-style components (Radix + Tailwind)
│   ├── navigation-header.tsx   # Shared back nav + title
│   ├── offline-banner.tsx
│   ├── pwa-installer.tsx
│   ├── motivation.tsx
│   └── theme-provider.tsx
├── hooks/
│   ├── useChallenge.ts     # All challenge/progress state (localStorage)
│   ├── useOffline.ts      # Online/offline + SW cache refresh
│   └── useToast.ts
├── lib/
│   ├── types.ts           # Challenge, Exercise, StoredChallengeData, ActiveChallenge, etc.
│   ├── data.ts            # challenges[] + getChallengeById, getAllChallenges
│   └── utils.ts            # cn(), getChallengeInitials()
└── public/
    ├── manifest.json
    ├── sw.js
    └── challenges/        # Exercise images (gifs, pngs)
```

---

## 4. Core concepts

- **Challenge** – 30-day program with metadata (title, duration, difficulty, estimatedTime) and an `exercises` array (one per day: day, name, details, duration). Optional `images[]` for exercise demos.  
- **Active challenge** – User has “started” a challenge; progress is stored in `localStorage` under `activeChallenges` as `StoredChallengeData[]`.  
- **Progress** – `currentDay`, `completedDays[]`, `completionRecords[]` (day + date), `streak`, `startDate`.  
- **Streak** – Consecutive completed days from the latest completed day backward.  
- **Today** – Date in `YYYY-MM-DD` (local); at most one completion per challenge per calendar day.

Key types: `lib/types.ts` (`Challenge`, `Exercise`, `StoredChallengeData`, `ActiveChallenge`, `CompletionRecord`).

---

## 5. Data flow and state

- **Challenge catalog:** Static list in `lib/data.ts`; read via `getChallengeById(id)` or `getAllChallenges()`.  
- **User progress:** Single source of truth is `localStorage["activeChallenges"]` (array of `StoredChallengeData`). All reads/writes go through the **`useChallenge`** hook (`hooks/useChallenge.ts`), which:
  - Loads/saves `activeChallenges` and exposes: `activeChallenges`, `getActiveChallenge(id)`, `getChallengeProgress(id)`, `markDayComplete`, `startChallenge`, `resetChallenge`, `removeChallenge`, `hasCompletedToday`, `isLoading`, plus legacy single-challenge fields.  
- **Routing:** Next.js App Router; `useRouter()` from `next/navigation` for `push()`.  
- **Offline:** `useOffline()` exposes `isOffline`; service worker handles caching; `OfflineBanner` and `/offline` page for UX.

No server API or react-query yet; adding API/GQL later should be done behind the same logical interface (e.g. keep `useChallenge` as the facade and swap implementation).

---

## 6. Routes (App Router)

| Route | Purpose |
|-------|--------|
| `/` | Home; CTA to `/challenges` |
| `/challenges` | List all challenges; start/continue/reset/remove |
| `/challenges/[challengeId]` | Challenge detail (e.g. before start) |
| `/workout` | Workout entry; redirects or selects active challenge |
| `/workout/[challengeId]` | Today’s workout for that challenge; complete/skip day |
| `/progress` | Progress overview (all active) |
| `/progress/[challengeId]` | Single challenge progress/calendar |
| `/dashboard` | Post-start dashboard |
| `/offline` | Offline fallback |

Dynamic segments: `params` in App Router are **Promises** (e.g. `use(params)` in client components).

---

## 7. UI and components

- **Path aliases:** `@/components`, `@/lib`, `@/hooks` (see `tsconfig.json` and `components.json`). Use `@/` for imports.  
- **DaisyUI:** Use for quick layout and buttons (e.g. `btn`, `btn-primary`, `btn-ghost`, `card`). Theme and class-based.  
- **shadcn-style (`components/ui/`):** Use for complex or accessible pieces (dialogs, forms, carousel, etc.). Compose with Tailwind and `cn()` from `@/lib/utils`.  
- **Shared chrome:** `NavigationHeader` for back button + title + optional subtitle/right element.  
- **Icons:** Prefer `lucide-react` for consistency.

New UI: add to `components/` (or `components/ui/` if it’s a primitive); use Tailwind + DaisyUI/shadcn patterns; keep mobile-first (target small screens).

---

## 8. PWA and offline

- **Manifest:** `public/manifest.json` (name, short_name, icons, theme_color, display standalone, etc.).  
- **Service worker:** `public/sw.js`; custom headers in `next.config.mjs` (Content-Type, Cache-Control, CSP for `/sw.js`).  
- **Layout:** Root layout includes `PWAInstaller`, `IOSInstallPrompt`, `OfflineBanner`.  
- **Behavior:** `useOffline()` tracks online/offline and can trigger SW cache refresh when back online.  
- **Images:** Next.js images are unoptimized; static assets (e.g. `/challenges/*`) are used for exercise demos.

---

## 9. Conventions and where to change things

- **New challenge data:** Add to `challenges` in `lib/data.ts`; conform to `Challenge` and `Exercise` in `lib/types.ts`.  
- **New types:** Define in `lib/types.ts` and reuse across hooks and components.  
- **New pages/routes:** Add under `app/` with the appropriate segment (static or dynamic). Use `"use client"` where you need hooks or browser APIs.  
- **Challenge/progress logic:** Extend or refactor `useChallenge`; keep localStorage (or future API) behind this hook.  
- **New shared UI:** Add to `components/` or `components/ui/`; use `cn()` and existing design tokens (DaisyUI theme, CSS variables in `globals.css`).  
- **Styling:** Prefer Tailwind utility classes and DaisyUI/shadcn patterns; avoid one-off global CSS unless necessary.

---

## 10. Scripts and tooling

- **Dev:** `yarn dev` (Next.js dev server).  
- **Build:** `yarn build`.  
- **Lint:** `yarn lint` (Next.js ESLint).  
- **TypeScript:** No emit (`noEmit: true`); Next handles build. ESLint and TypeScript errors are currently ignored in production build (`next.config.mjs`); fix or re-enable when stabilizing.

---

## 11. Testing and future stack (from rules)

Per `.cursor/rules/frontend.mdc`: testing is Vitest + React Testing Library + Playwright; component development is Storybook; API client is react-query; API server is GQL; auth/user is Clerk. None of these are implemented in the repo yet—treat as target stack when adding tests, API, or auth.

---

## Quick reference

- **Challenge list / definitions:** `lib/data.ts`  
- **Types:** `lib/types.ts`  
- **Progress state and actions:** `hooks/useChallenge.ts`  
- **Path alias:** `@/*` → project root  
- **Root layout / PWA:** `app/layout.tsx`  
- **Product goals and features:** `.cursor/rules/prd.mdc`  
- **Stack and tooling:** `.cursor/rules/frontend.mdc`
