<div align="center">

<img src="public/campuses/milan.png" width="44" alt=""> <img src="public/campuses/madrid.png" width="44" alt=""> <img src="public/campuses/geneva.png" width="44" alt=""> <img src="public/campuses/paris.png" width="44" alt=""> <img src="public/campuses/marseille.png" width="44" alt="">

# StudentSwap

**Take over a classmate's apartment when you move campus.**

A marketplace where Albert School students hand their apartment directly to
the student arriving, across Milan, Madrid, Geneva, Paris and Marseille.

[![CI](https://github.com/ASRIDK/student-housing-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/ASRIDK/student-housing-marketplace/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-Neon-00e599?logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini-4285f4?logo=googlegemini&logoColor=white)

<img src="assets/screenshots/home.jpg" alt="The StudentSwap home page: a ring of real apartment photos around the headline 'Someone is leaving your campus. Take their keys.'" width="860">

</div>

---

[Overview](#overview) ·
[Features](#features) ·
[Tech stack](#tech-stack) ·
[Architecture](#architecture) ·
[Getting started](#getting-started) ·
[Project structure](#project-structure) ·
[AI usage](#ai-usage) ·
[Challenges](#challenges) ·
[Future improvements](#future-improvements) ·
[Team](#team)

## Overview

**The problem.** Albert School students move between five campuses. Every
term, someone leaves a flat in one city while someone else arrives looking
for one — and an agency usually takes a fee in between.

**The idea.** Connect the two directly. The leaving student posts their
apartment, the arriving student takes it over, and the landlord keeps a
tenant without a gap.

StudentSwap was built as the group project of the *Prompt Engineering & Git*
course (Bachelor 2, DAT32-91, Albert School, 2026–27), using AI as a working
tool throughout and Git/GitHub as the team's shared workspace.

## Features

| | |
|---|---|
| **Browse** | Every open apartment across the five campuses, with campus tabs, a move-in date filter, a maximum-rent filter and sorting. Filters live in the URL, so a search can be shared. |
| **Listing page** | Photo gallery, rent, handover dates, a countdown to the day it is free, a share link, and a contact card that emails the current tenant. |
| **Post and edit** | A validated form with a draft that saves itself. Photos come first: **Fill in from my photos** lets AI count the rooms and draft the description, and **Write it for me** drafts the description from the facts. The student always reviews before anything is saved. |
| **My listings** | Your apartments, with editing and a button to mark each one as taken. |
| **API** | JSON endpoints with input validation and consistent errors. |
| **Responsive** | Every page works from phone to desktop. |

<p>
<img src="assets/screenshots/browse.jpg" alt="The browse grid: campus tabs with landmark icons above a grid of apartment cards" width="49%">
<img src="assets/screenshots/post.jpg" alt="The post-a-listing form: photos first, with a button to fill in the listing from them" width="49%">
</p>

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js API routes, Prisma 7, Neon Postgres, Zod |
| **AI** | Google Gemini (photo analysis and description drafting) |
| **Quality** | ESLint, Vitest, GitHub Actions |

## Architecture

<img src="assets/architecture.png" alt="StudentSwap architecture in five layers. The student browses, opens a listing, posts a place and manages their listings. The Next.js server renders pages with Server Components and handles writes in API routes, checked by Zod validation. Our code: listings.ts runs every database query, photo-analysis.ts and ai-description.ts hold the AI prompts. Data and AI: Neon Postgres and Gemini. Underneath, how code is built: branch, pull request, GitHub Actions, review and merge, main." width="100%">

Two rules hold the design together: only `src/lib/listings.ts` talks to the
database, and only the server ever holds the AI key.

**See it move.** [`documentation/architecture.html`](documentation/architecture.html)
plays the same diagram step by step from the user's point of view: browsing,
posting with photos, handing a flat over, and how code reaches `main`. Download
it and open it in a browser: Space pauses, the arrow keys step, 1–4 jump to a
chapter, and clicking a block jumps to the step that uses it.

<details>
<summary>The same architecture as a text diagram (Mermaid)</summary>

```mermaid
flowchart TD
    student(["Student in the browser"])

    subgraph next["Next.js server"]
        pages["Server Components<br/>render every page per request"]
        api["API routes<br/>/api/listings · /api/ai"]
    end

    subgraph lib["src/lib"]
        schema["Zod validation"]
        listings["listings.ts<br/>every database query"]
        ai["AI prompts<br/>photo analysis · descriptions"]
    end

    db[("Neon Postgres")]
    gemini(["Gemini API"])

    student -- "page request" --> pages
    student -- "form actions, JSON" --> api
    pages --> listings
    api --> schema --> listings
    api --> ai
    listings -- "Prisma, WebSocket on 443" --> db
    ai -- "photos and facts in, JSON out" --> gemini

    classDef user fill:#202448,stroke:#2eaee0,stroke-width:2px,color:#ffffff
    classDef server fill:#0f2a40,stroke:#2eaee0,stroke-width:2px,color:#ffffff
    classDef check fill:#33290f,stroke:#e7a92d,stroke-width:2px,color:#ffffff
    classDef code fill:#1a2040,stroke:#5b6480,stroke-width:2px,color:#ffffff
    classDef data fill:#0d302d,stroke:#14a38b,stroke-width:2px,color:#ffffff
    classDef ai fill:#231c47,stroke:#8b74e8,stroke-width:2px,color:#ffffff

    class student user
    class pages,api server
    class schema check
    class listings code
    class db data
    class ai,gemini ai

    style next fill:#141933,stroke:#2eaee0,color:#2eaee0
    style lib fill:#141933,stroke:#5b6480,color:#a8b4cf

    linkStyle 6 stroke:#14a38b,stroke-width:2px
    linkStyle 5,7 stroke:#8b74e8,stroke-width:2px
```

</details>

## Getting started

**Requirements:** Node.js 22+, a [Neon](https://neon.com) Postgres database
(the free tier is enough) and, for the AI features, a
[Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/ASRIDK/student-housing-marketplace.git
cd student-housing-marketplace
npm install

cp .env.example .env.local   # fill in the values below
npm run db:generate          # generate the Prisma client
npm run db:deploy            # create the tables
npm run db:seed              # load ten sample listings

npm run dev                  # http://localhost:3000
```

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (host contains `-pooler`) |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection string, used for migrations |
| `GEMINI_API_KEY` | Optional. Without it the site works and the AI buttons say they are not set up. |

> On networks that block port 5432, the app still works over port 443, but
> `db:deploy` needs 5432: run it once from another network.

**Checks** (run on GitHub for every pull request):

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

### API

Errors are always `{ "error": "..." }`.

| Method | Route | |
|---|---|---|
| `GET` | `/api/listings?city=&maxRent=&availableFrom=&sort=` | Open listings |
| `GET` | `/api/listings/:id` | One listing |
| `POST` | `/api/listings` | Create a listing |
| `PUT` | `/api/listings/:id` | Update a listing (owner only) |
| `PATCH` | `/api/listings/:id/status` | Mark as `active` or `taken` (owner only) |
| `POST` | `/api/ai/analyze-photos` | Photos in, room count and draft description out |
| `POST` | `/api/ai/describe` | Listing facts in, draft description out |

## Project structure

```text
.
├── .github/              CI workflow and code owners
├── assets/screenshots/   Images used in this README
├── documentation/        Challenges, LLM failure modes, design system
├── prisma/               Database schema, migrations and seed script
├── prompts/              Versioned prompt iterations and their evaluation
├── public/campuses/      Campus landmark icons
├── src/
│   ├── app/              Pages and API routes
│   ├── components/       UI components
│   └── lib/              Queries, validation, AI prompts, shared types
└── tasks/                Project briefs and prompt logs
```

## AI usage

AI was used in two ways.

**To build the project.** The team worked with AI coding assistants
(Claude Code and Claude). Every task started from a written brief with a
starter prompt: the stack, the shared data type, one file to build, hard
constraints and a "done when" checklist. Every AI output was built, tested
in the browser and reviewed in a pull request like any other code.

**Inside the product.** Two features call Gemini from the server: reading a
listing's photos to count the rooms and draft a description, and drafting a
description from the form's facts. Both return a suggestion the student
must accept, and both treat user text and text inside photos as data, never
as instructions.

| Where | What it contains |
|---|---|
| [`prompts/`](prompts/) | One prompt followed through four versions, scored on measurable criteria |
| [`tasks/`](tasks/) | The briefs and the prompt logs |
| [`documentation/llm-failure-modes.md`](documentation/llm-failure-modes.md) | Hallucination, sycophancy, prompt injection and context limits, each with a real case from the project |

## Challenges

Full write-ups: [documentation/challenges.md](documentation/challenges.md).

- **The school network blocks Postgres** (port 5432). Solved by connecting
  through Neon's serverless driver over port 443.
- **Main stopped compiling after several merges**, because a conflict was
  resolved in GitHub's web editor. Solved with an integration pass; checks
  now run on every pull request.
- **Libraries newer than the AI's knowledge** (Prisma 7, Zod 4). The
  installed version's error messages were trusted over the suggestions.
- **A 3D component built for artwork**, adapted to apartment photos over
  four prompt iterations.

## Future improvements

- Real accounts (sign-up limited to the school email domain)
- Photo upload and storage
- Deployment with a preview for every pull request
- Messaging between students
- End-to-end tests in CI

**Known limitations today:** login and sign-up are interface only (in
development, the API uses a demo user); listing photos are links rather
than uploads; the site runs locally and is not deployed yet.

## Team

Taoufik ([@ASRIDK](https://github.com/ASRIDK)) ·
Alejandro ([@alejandromirandadefrutos7-sudo](https://github.com/alejandromirandadefrutos7-sudo)) ·
Andrea ([@andrea-callies](https://github.com/andrea-callies)) ·
Leo ([@leovurchio06-gif](https://github.com/leovurchio06-gif)) ·
Côme ([@comedevalk-cyber](https://github.com/comedevalk-cyber))

Albert School, Bachelor 2 Data & AI, 2026–27. Campus icons generated with Gemini.
