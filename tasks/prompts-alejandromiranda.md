# Prompts — Alejandro (feature/browse-listings)

AI assistant used: **Claude Code** (Anthropic). This file documents the
prompts that drove the home page / browse-listings feature, as asked
in `tasks/00-EVERYONE-READ-THIS-FIRST.txt`.

## 1. Project bootstrap

> ayudame a elaborar este proyecto

Claude read `tasks/00-EVERYONE-READ-THIS-FIRST.txt` and my task file
first, noticed the shared Next.js skeleton hadn't been merged into
`main` yet, and asked whether to scaffold a temporary local Next.js
16 + TypeScript + Tailwind project to build and preview against. I
chose "create a temporary local scaffold" — it gets replaced cleanly
by `git merge main` once Taoufik's real skeleton lands, since it only
touches shared files nobody else had created yet.

**Lesson:** giving the assistant the task files to read itself worked
better than pasting the Listing type or the checklist by hand.

## 2. ListingCard

> I'm working in a Next.js 16 App Router project with TypeScript and
> Tailwind CSS. Here is the Listing type: `<paste from types.ts>`.
> Create src/components/ListingCard.tsx: a card component that takes
> a `listing: Listing` prop, shows the first photo with next/image
> (or a grey placeholder), city as a badge, neighbourhood, rent with
> currency, rooms, and available-from date, and wraps everything in a
> next/link Link to /listings/{id}. Mobile-friendly, no external UI
> libraries.

This is the starter prompt suggested in my task file, barely edited.
Correct on the first try — giving it the exact shared type plus hard
constraints (mobile-friendly, no external libraries, `next/image`)
left little room to improvise something that wouldn't match Leo's or
Côme's pages.

## 3. FilterBar

> Create src/components/FilterBar.tsx as a client component with a
> City dropdown (All/Milan/Madrid/Geneva/Paris/Marseille), a max-rent
> number input, an available-from date input, and a reset button.
> Store the filter values in the URL via useSearchParams + useRouter
> so the link is shareable.

**Gotcha:** Claude flagged on its own that a client component reading
`useSearchParams` needs a `<Suspense>` boundary in the parent or the
Next.js 16 build fails — called out in the "things that will bite
you" section of the shared instructions, and easy to miss otherwise.

## 4. EmptyState

> Create src/components/EmptyState.tsx — a simple message shown when
> no listing matches the active filters.

Simple enough not to need iteration.

## 5. Home page grid + filtering logic

> In src/app/page.tsx, import the mock listings, keep only
> status === "active", read searchParams (it's a Promise in Next.js
> 16 — await it), filter by city/maxRent/availableFrom, sort newest
> first by createdAt, and render ListingCard in a responsive grid
> (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3). Wrap FilterBar in
> Suspense. Show an apartment count and EmptyState when nothing
> matches.

**Iteration:** asked Claude to double-check the filters actually
filter correctly instead of trusting the code by eye — it curled a
few URLs (`?city=Paris`, `?maxRent=600`, a combination with zero
matches) and compared the counts against the mock data before I ever
opened a browser.

## 6. Visual verification

> Take screenshots of the home page at laptop and mobile widths, plus
> a filtered and an empty-state URL, and check the browser console
> for errors.

Ran through a headless Chromium (Playwright), since there's no real
display in this environment. Zero console errors across all four
views; confirmed the 3-column/1-column responsive grid visually
before calling the task done.

## 7. Git workflow correction

After going over the course's Git slides, I pointed out that a single
commit bundling the scaffold and every component broke the "one
commit = one thing you can name in a sentence" rule, and that the
PR step of the Feature Branch → PR → Review → Merge flow was still
missing.

Claude rewrote the single commit into 6 atomic commits (scaffold,
shared types/mock data, ListingCard, FilterBar, EmptyState, page.tsx),
force-pushed with `--force-with-lease` to this personal branch (safe
since nobody else had pulled it), and opened the PR to `main`.

## What didn't work well

- My very first prompt ("ayudame a elaborar este proyecto") had no
  context at all — it worked because Claude read the task files
  itself, but a more specific first prompt would have skipped a
  clarifying question about whether to scaffold Next.js locally.
- I hadn't checked that Node.js was even installed on this machine
  before asking for the project to be built — worth checking your
  toolchain first next time.
