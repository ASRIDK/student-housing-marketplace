# Challenges, failures and lessons learned

The problems that cost us the most time, in the format the course asks
for: **what happened, why, what we tried, what we learned.** The failures
that come from the AI itself (hallucination, sycophancy, prompt injection,
context limits) have their own page:
[llm-failure-modes.md](llm-failure-modes.md).

## 1. The school network blocks Postgres

**What happened.** The first database migration failed with
`P1001: Can't reach database server`. Neon's dashboard showed the database
running.

**Why.** Postgres listens on port 5432. Testing the two ports directly
(`nc -zv <host> 5432` timed out, `nc -zv <host> 443` answered at once)
showed that the school network blocks 5432 and lets HTTPS through.

**What we tried.** Checking the connection string and the password first,
which were both fine. Then testing the ports.

**What we did.** Changed the driver, not the database. Neon's serverless
driver (`@prisma/adapter-neon`) carries Postgres over a WebSocket on port
443, so the app, the seed script and the API work from any network.
Prisma's own migration command still needs 5432, so migrations run from a
normal network or on deploy (`npm run vercel-build` runs
`prisma migrate deploy`).

**Lesson.** When a connection fails, test the network before rewriting
the code. It took two commands.

## 2. Three branches merged, and `main` stopped compiling

**What happened.** On 24 September four pull requests were merged within
28 minutes: the browse page (#8), the listing form (#10), the database
(#9) and the integration fixes (#7). Afterwards `main` no longer built.

**Why.** To merge, the branches were first brought up to date with `main`
in GitHub's web editor. One conflict in `src/app/page.tsx` was resolved by
keeping **both** versions of the file, one after the other: 7 opening
`<div` tags against 4 closing ones. GitHub accepted it, because the web
editor does not build the code.

**What we tried.** Reading the merge commits one by one to find which one
introduced the break, then rebuilding the page from the complete version
(PR #11).

**Also found while integrating** (PR #7 and #11): four pages rendered
their own `<main>` inside the layout's `<main>`; a nested clone of the
repository had been committed as a broken submodule; the listing form
updated a React ref during render, which the linter rejects; and a type
import had been dropped in a merge.

**Lesson.** Resolve conflicts locally and build before pushing. Run the
same checks on every branch. That is now automatic: see
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## 3. The build needed the internet

**What happened.** `npm run build` failed on a machine without network
access.

**Why.** The layout loaded its font from Google Fonts, and Next.js
downloads it at build time.

**What we did.** Self-hosted the font files in `src/app/fonts/` with
`next/font/local`. The build now needs no network at all.

**Lesson.** Anything fetched at build time is a dependency. Treat it like
one.

## 4. Libraries newer than the AI's knowledge

**What happened.** Three commands or patterns suggested by the assistant
failed against the versions we had installed:

- `prisma migrate diff --to-schema-datamodel`: Prisma 7 had removed the
  flag, and its replacement is `--to-schema`;
- Prisma 7 no longer reads `.env` files on its own, so the CLI could not
  see the database URL;
- Zod 4 refuses `.partial()` on a schema that has a `.refine()`, which
  broke the "update" schema derived from the "create" one.

**Why.** The model learned from code written for older versions. See
*hallucination* in [llm-failure-modes.md](llm-failure-modes.md).

**What we did.** Trusted the error message over the suggestion each time:
`--to-schema`; a `prisma.config.ts` that loads `.env.local`; one base Zod
object with the create and update schemas built from it
(`src/lib/listing-schema.ts`).

**Lesson.** The installed version is the source of truth. When the AI
suggests a flag, check that version's changelog.

## 5. A component made for artwork, used for photographs

**What happened.** The 3D wheel on the home page was written for abstract
portfolio pieces. With photos of rooms, cards lay on their side, the top
and bottom of the ring were cut off, and there was no space in the middle
for a headline.

**What we did.** Four prompt iterations, documented with an evaluation
table in [`prompts/`](../prompts/). The final version leans the cards at
most 26°, shrinks them so the ring fits, and puts every listing on the
wheel, which is what opens the centre.

**Lesson.** A component written for one kind of content makes assumptions
about that content. Read what it assumes before feeding it something else.

## 6. Building pages before the skeleton existed

**What happened.** Côme and Alejandro started before the shared project
skeleton was merged, and one branch was created from the wrong base with a
placeholder git identity.

**What we did.** Each of them wrote small placeholder files matching the
shared `Listing` type exactly, so their code would type-check and be
replaced cleanly when the skeleton landed. For the misconfigured branch,
the lead wrote a prompt the teammate could run himself to rebase and fix
the author details, rather than rewriting his history for him.

**Lesson.** Agree the data shape first, in a file everyone can paste into
their AI assistant. It is what let five people work at once.

## 7. A password pasted into a prompt

**What happened.** While setting up the database, the full connection
string, password included, was pasted into the AI chat.

**What we did.** The assistant flagged it, and the password was rotated
the same day. Connection strings now live only in `.env.local`, which git
ignores. `.env.example` lists the variable names with empty values.

**Lesson.** A chat with an AI is not a private place. Anything pasted
into it should be treated as shared.

## 8. The AI cannot see your machine

**What happened.** Code that built fine in the assistant's environment
failed on a teammate's laptop: files in a duplicated `src/src/` folder,
unsaved files, stale dev servers on port 3000, copy-paste that dropped
characters. Details in [Leo's log](../tasks/prompts-leo.md).

**What we did.** Sent screenshots of the file tree and the terminal, and
created files from the terminal instead of copy-pasting from the chat.

**Lesson.** A correct answer from the AI is half the job. The other half
is getting it into the project and checking it there.

## Lessons learned

1. **Agree the data shape before anyone writes a page.** The shared
   `Listing` type let five people build in parallel.
2. **One file talks to the database** (`src/lib/listings.ts`). Every
   page and route goes through it, so a schema change touches one place.
3. **Branch, pull request, review, merge.** After the first day's setup,
   nothing reached `main` any other way. When `main` broke, the history
   showed exactly which merge did it.
4. **Automate the checks.** Lint, types, tests and a production build ran
   by hand before every PR. They now run on GitHub for every PR.
5. **Test the environment early.** A network that blocks a port or a build
   that needs the internet is cheaper to find on day one.
6. **The installed version wins.** When the AI and the error message
   disagree, the error message is right.
7. **Secrets never go in a prompt.**
8. **Show the AI what you want.** A screen recording worked in one prompt;
   adjectives took several.
9. **Check your git identity.** `git config user.email` must match your
   GitHub account, or your commits are not credited to you.
