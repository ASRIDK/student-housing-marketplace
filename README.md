# StudentSwap — apartment handover for international students

A website where students from our school can list their apartment in
**Milan, Madrid, Geneva, Paris or Marseille** so that another student can
take it over when they move to a different campus.

Class: Data Science — Prompt Engineering with GitHub.

## Tech stack

| Part          | Tool                                | Owner   |
|---------------|-------------------------------------|---------|
| Framework     | Next.js 16 (App Router) + TypeScript| Taoufik (skeleton) |
| Styling       | Tailwind CSS                        | everyone |
| Database      | Neon Postgres (via Prisma)          | Taoufik |
| Photos        | Vercel Blob                         | Taoufik |
| Auth          | Email + password (school domain)    | Taoufik |
| Hosting       | Vercel (auto-deploys from GitHub)   | Taoufik |

## Who does what

| GitHub user                     | Branch                     | Task                                   |
|---------------------------------|----------------------------|----------------------------------------|
| Taoufik (lead)                  | `main`                     | Skeleton, database, API, auth, deploy, merging PRs |
| alejandromirandadefrutos7-sudo  | `feature/browse-listings`| Home page: listing cards + filters      |
| leovurchio06-gif                | `feature/listing-detail`       | Listing detail page + "My listings"     |
| comedevalk-cyber                | `feature/listing-form`        | "Post a listing" / "Edit listing" form  |
| Andrea-CALLIES                  | `feature/layout-auth-ui`    | Site layout, navbar, login/signup pages |

Every student has a personal instruction file in `tasks/`.
**Read `tasks/00-EVERYONE-READ-THIS-FIRST.txt` before anything else.**

## Running the project

```bash
npm install
cp .env.example .env.local   # ask Taoufik for the database connection strings
npm run dev                  # http://localhost:3000
```

Node 22 or newer is required. The app reads from a Neon Postgres database
through the Neon serverless driver (port 443), so it works on networks that
block the usual Postgres port.

Before opening a pull request, make sure these all pass:

```bash
npm run lint        # code style
npm run typecheck   # TypeScript
npm test            # unit tests (Vitest)
npm run build       # production build
```

Shared code lives in `src/lib/`: `types.ts` (the `Listing` shape), `format.ts`
(`formatDate`, `formatRent`, `formatRooms`), `listings.ts` (every database
query) and `mock-data.ts` (the ten listings used to seed the database).

## Database and API

| Command | What it does |
|---|---|
| `npm run db:migrate` | create/apply a migration after editing `prisma/schema.prisma` |
| `npm run db:seed` | load the ten mock listings (safe to re-run) |
| `npm run db:studio` | browse the database in the browser |

Server components call `src/lib/listings.ts` directly. Client code (the
listing form) uses the JSON API — every error is `{ "error": "..." }`:

| Method | Route | Notes |
|---|---|---|
| GET | `/api/listings?city=&maxRent=&availableFrom=&sort=` | active listings; `sort` = newest, cheapest, expensive |
| GET | `/api/listings/:id` | 404 if unknown |
| POST | `/api/listings` | body = listing fields, 201 on success |
| PUT | `/api/listings/:id` | any subset of the fields, owner only |
| PATCH | `/api/listings/:id/status` | `{ "status": "active" \| "taken" }`, owner only |

Until login exists, write requests in development identify the caller with an
`x-user-id` header set to a seeded user id (`u-1` … `u-10`). The header is
ignored in production.
