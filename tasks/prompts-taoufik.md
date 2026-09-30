# Prompts — Taoufik (lead: skeleton, backend, integration, front-end)

AI assistant used: **Claude Code** (Anthropic), in the terminal, with
Playwright for screenshots and the Neon CLI for the database. This file
documents the prompts that drove my part of the project, as asked in
`tasks/00-EVERYONE-READ-THIS-FIRST.txt`. Prompts are quoted as I typed
them, typos included. The one prompt that contained a database password
is redacted.

The longest prompt thread, the home page hero, has its own versioned
write-up in [`prompts/`](../prompts/).

## 1. Splitting the project so five people can work at once (Sep 16)

> So we've just created a new project for our data science class,
> focusing on prompt engineering in GitHub. The project involves creating
> a website where students from our international school can list
> apartments in different cities—Milan, Madrid, Geneva, Paris, and
> Marseille—for other students to take over when they move to another
> country. To make the project equitable, we plan to divide it into
> smaller parts so everyone can work on something specific. I will then
> consolidate everything into the main project.

Follow-up:

> create a branch with everyone their tasks and just leave the back end
> to me and create a txt file for everyone else explaning what they need
> to know and do mostly give them the front end and easy things

**Output.** One shared contract, `tasks/00-EVERYONE-READ-THIS-FIRST.txt`,
holding the `Listing` type everyone codes against, plus one task file per
person with the files they own, a step-by-step plan, a `DONE WHEN`
checklist and a **starter prompt**.

**Why it worked.** Every page depends on the same data shape. Fixing the
shape first meant four people could build four pages in parallel without
waiting for my backend, then swap mock data for real queries later
without touching their components.

## 2. Writing prompts for the others

The starter prompt in each task file is the prompt engineering I am most
pleased with, because I can measure it: it was written once and used by
someone else. Every one follows the same pattern:

1. **Stack first** — "Next.js 16 App Router, TypeScript, Tailwind CSS."
2. **The shared type, pasted in**, so the model cannot invent field names.
3. **One file, named by its path**, with its props.
4. **Hard constraints** — "No external UI libraries", "This is a client
   component", "params is a Promise".
5. **The acceptance test** — the task file's `DONE WHEN` list.

Evidence from the others' logs:

- Alejandro: *"Correct on the first try — giving it the exact shared type
  plus hard constraints … left little room to improvise"*
  ([prompts-alejandromiranda.md](prompts-alejandromiranda.md)).
- Leo: *"Without them the AI would have invented field names and its own
  formatting"* ([prompts-leo.md](prompts-leo.md)).

Later, when Alejandro's branch had the wrong base and a placeholder git
identity, I asked for a prompt he could run himself rather than fixing
it for him:

> give me a prompt that I can give to alejandro so he fixes the problem

## 3. The skeleton, with a rule for every commit (Sep 17)

> for all the commits and different git actions use good practice and
> professional approach now go back to the squelleton building

> ensure that no one can instantly push or merge into the main branch
> without my consent.

**Output.** PR #1 (Next.js 16 skeleton, shared types, mock data), PR #2
(`CODEOWNERS`), and branch protection on `main`: every change goes
through a pull request.

**Lesson.** Stating the working rules once ("conventional commits, one
change per commit, branch and PR") and saving them as a standing
instruction was worth more than correcting each commit afterwards.

## 4. Integrating three merges at once (Sep 22)

> now there are 3 merges all in all on the main make no overlapping
> features fix dependencies and help me make it all work

**Output.** PR #7. The AI found overlaps no single PR showed on its own:
four pages each rendering their own `<main>` inside the layout's `<main>`,
a Google Fonts call that broke the build without network access, and
a stray submodule entry committed by accident.

## 5. The backend, and a prompt that leaked a secret (Sep 22)

> let's start the backend and then we can see for Andrea

Then the Neon setup, pasted from Neon's own onboarding:

> Set up this Neon project in the current working directory.
> 1. `npm i -g neon@latest && neon login` … 4. `neon link --project-id
> aged-grass-45469358 --branch production -y` … 7. `neon deploy` and then
> there's this postgresql://neondb_owner:`[REDACTED]`@…

**What went wrong.** I pasted the live connection string, password
included, into the chat. The assistant flagged it straight away and told
me to rotate the password, and I did. Since then the connection strings
live only in the git-ignored `.env.local`.

**What else went wrong.** The first migration failed with `P1001: Can't
reach database server`. See
[documentation/challenges.md](../documentation/challenges.md#1-the-school-network-blocks-postgres):
the school network blocks port 5432.

> it's done now verifie everything and run the project on a localhost
> with all the features

> connect the backend to the current local host

**Output.** PR #9: Prisma schema and migration, seed script, the
`/api/listings` routes, and every page reading from Postgres instead of
mock data.

## 6. The redesign (Sep 24)

> There are some dependency problems and merger problems. Fix them and
> we're gonna rework the frontend design. No mistakes, and use the design
> skills for the front end. Make it great, colors of Albert school, you
> can look it up on the internet, same colors, same theme, and give
> examples. Make it look a bit like Airbnb.

**Output.** PR #11. The colours come from albertschool.com itself (navy
`#202448`, sky `#2eaee0`, deep `#035ca0`). They became tokens in
`globals.css`, with five written rules ("blue means action", "one font",
…) so everyone's pages stay consistent.

**What made it work.** Three concrete anchors in one prompt: a source to
look up (the school site), a reference product (Airbnb), and a tool to
use (a design skill). Without them "make it great" gives a generic
template.

## 7. The hero wheel (Sep 24) — four versions

Documented step by step, with an evaluation table, in
[`prompts/`](../prompts/): v1 → v4.

## 8. The presentation (Sep 27)

> make a presentation of like three minutes on exactly what I did and
> more in details on the challenges, the roadmap, explain the tools that
> were used … We wanted to use this but it wasn't available, so show that
> there were some fallbacks, some storytelling, and create like an
> architecture.

**Evaluation against the brief.** The first draft of the speaker notes
was 810 words: about five and a half minutes, not three. The assistant
counted them, said so, and cut them to 538 words. "Three minutes" was a
constraint that could be checked, so it was checked.

## 9. Auditing the repository against the guidelines (Sep 30)

I pasted an AI-generated checklist of what the repository was missing.
One item said a prompt-injection case was "already documented". Checking
the repository found no such write-up. The feature it referred to exists
only in the open PR #15, and nobody had written up a case for it. This is
recorded as a hallucination in
[documentation/llm-failure-modes.md](../documentation/llm-failure-modes.md).

## What didn't work

- **Vague prompts cost rounds.** "Fix this, it looks like shit" said what
  was wrong, not what right looks like. The prompts that worked first
  time named a reference (a screen recording, a site, a product).
- **A screenshot of the wrong window.** One complaint ("I don't want it to
  look like a phone") was about the test browser, which had been left at
  phone width, not about the site. See sycophancy in
  [documentation/llm-failure-modes.md](../documentation/llm-failure-modes.md).
- **Pasting a secret into a prompt.** Rotated the same day.
- **Merging is a human step.** The coding agent is not allowed to merge
  into `main` without a review, so every merge was done by hand on GitHub.
  That is the rule we wanted, even when it was slower.
