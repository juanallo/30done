# 30done

A mobile/web app that helps users commit to and complete 30-day fitness challenges with a visual "don't break the chain" system.

## Development Guidelines

### File Naming Conventions

- **Hooks**: Use camelCase naming (e.g., `useChallenge.ts`, `useMobile.tsx`, `useToast.ts`)
- **Components**: Use pascalCase naming (e.g., `ThemeProvider.tsx`, `Button.tsx`)
- **Pages**: Use kebab-case naming (e.g., `page.tsx`)


## Tech Stack

- **Framework**: Next.js
- **UI Components**: DaisyUI + Tailwind CSS
- **Package Manager**: Yarn
- **Testing**: Vitest, React Testing Library, Playwright
- **Component Development**: Storybook
- **Hosting**: Vercel
- **Auth**: Clerk

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run the development server:
   ```bash
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
30done/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks (camelCase naming)
├── lib/                # Utility functions and data
├── public/             # Static assets
└── styles/             # Global styles
``` 