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
| alejandromirandadefrutos7-sudo  | `alejandro/browse-listings`| Home page: listing cards + filters      |
| leovurchio06-gif                | `leo/listing-detail`       | Listing detail page + "My listings"     |
| comedevalk-cyber                | `come/listing-form`        | "Post a listing" / "Edit listing" form  |
| Andrea-CALLIES                  | `andrea/layout-auth-ui`    | Site layout, navbar, login/signup pages |

Every student has a personal instruction file in `tasks/`.
**Read `tasks/00-EVERYONE-READ-THIS-FIRST.txt` before anything else.**

## Running the project

```bash
npm install
cp .env.example .env.local   # ask Taoufik for the values
npm run dev                  # http://localhost:3000
```

(The `npm` commands only work once the skeleton is merged into `main`.)
