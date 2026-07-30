# {{PROJECT_NAME}} -- Claude Code Instructions

## Before ANY Task

Read these docs in order before writing code:

1. **README.md** -- Tech stack, project structure, doc update checklist
2. **docs/TODO.md** -- Small tasks & known issues 
3. **docs/PROGRESS.md** -- What's built, what's in progress
4. **docs/STYLEGUIDE.md** -- Colors, typography, component patterns

## Rules

- **⛔ VERIFY WITH `npm run build` — NEVER `tsc --noEmit` or bare `vite build`.** This repo's root `tsconfig.json` is solution-style (project references only), so `npx tsc --noEmit` exits 0 **without checking a single file** — it is a vacuous "pass". `vite build` alone skips type-checking too. The ONLY commands that actually type-check are `npm run build` or `tsc -b` (what the Dockerfile runs). This has shipped broken Docker builds more than once. NO code change is "done" or reported as passing until `npm run build` succeeds.
- **When changing a shared type or data shape, grep for every importer first** (`grep -rn "from '@/data/..." src/`). A shape change to a module used by multiple pages (e.g. `src/data/galleries.ts` → used by both `News.tsx` and `news/Launch.tsx`) must update all consumers in the same edit.
- **Read official docs first.** Before using any CSS framework, JS library, or tool -- read its official documentation. Not your training data, not your memory. The actual docs.
- **docs/TODO.md is where all todos live.** Update all TODOS and keep theme here to work on them after finishing a main task.
- **Follow STYLEGUIDE.md** for all visual changes -- colors, typography, spacing, component patterns. Consistency is non-negotiable.
- **Do NOT run git commands** (commit, push, etc.) unless the user explicitly asks.

<!--
  Add project-specific rules below. Examples:
  - **All images must have alt text** for accessibility.
  - **Mobile-first** -- write styles for small screens first, then use media queries to scale up.
  - **No inline styles** -- everything goes through CSS classes or the designated framework.
-->

## After Completing a Feature

Follow the 4-step doc update checklist in README.md:

1. **README.md** -- Tech Stack, Project Structure, Development Progress
2. **PROGRESS.md** -- Check off completed items
3. **TODO.md** -- when finding TODOs already completed
4. **STYLEGUIDE.md** -- If new visual patterns, colors, or components were introduced

This is not optional. Do it before considering a feature "done".
