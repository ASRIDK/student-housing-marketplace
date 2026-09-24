# Prompts — Côme (feature/listing-form)

Prompts used to build `ListingForm.tsx`, `validation.ts`, and the
`/listings/new` and `/listings/[id]/edit` pages, before Taoufik's
skeleton was merged.

## What worked

**Starting prompt** (from tasks/comedevalk-cyber.txt, adapted):

> Next.js 16 App Router, TypeScript, Tailwind, no form libraries. Here
> is the Listing type: <pasted from 00-EVERYONE-READ-THIS-FIRST.txt>.
> Create a client component src/components/ListingForm.tsx that takes
> an optional `initial?: Listing` prop. Fields: city select,
> neighbourhood, rent + currency select (auto CHF for Geneva), rooms,
> available from, available until with an open-ended checkbox,
> description with character counter, photo file input with previews
> (max 5). Validate with functions from '@/lib/validation' and show
> errors under fields. On submit, log the data object and redirect to
> /my-listings.

This produced a good first draft. Follow-ups that improved it:

- "Errors should only show after the field is blurred or the form is
  submitted, not while the user is still typing." — fixed premature
  red error messages.
- "The photo preview cleanup effect only revokes URLs from the initial
  render because of the empty dependency array — fix the stale
  closure." — caught a real bug: object URLs added after mount were
  never revoked on unmount. Fixed with a ref that tracks the latest
  photo list.
- "Use next/link for the Cancel link instead of a plain `<a>` tag." —
  matches the project's Next.js conventions.

## What didn't work / had to be corrected

- First version of the description counter didn't trim whitespace
  before checking the 20-character minimum, so 20 spaces would count
  as valid. Fixed by trimming in `validateDescription`.
- Initial `useEffect` cleanup for object URLs had a stale-closure bug
  (see above) — always double-check cleanup functions that read state
  set after the effect's dependency array is frozen.
- Manual re-read caught a second bug: the "max 5 photos" check only
  counted newly-added files, ignoring `initial.photos` already on the
  listing in edit mode — so editing a listing with 3 existing photos
  let you add 5 more (8 total). Fixed by counting
  `existingPhotoUrls.length + photos.length` together.
- The `<input type="file">` never reset its own value after reading
  the files, so re-selecting the exact same file a second time didn't
  fire `onChange`. Fixed with `input.value = ""` at the end of the
  handler.

## Bonus: localStorage draft

Added the "finish early" bonus from the task file: the form
auto-saves its text fields (not photos — `File` objects aren't
JSON-serialisable, and nothing is uploaded yet anyway) to
`localStorage` on every change, keyed by mode
(`studentswap:listing-draft:new` or `:edit:<id>`). It restores on
mount if a draft exists, and clears itself on successful submit or
Cancel. Useful prompt:

> "Add a localStorage draft-save bonus to ListingForm: persist `values`
> (not the photo files) on every change under a key that depends on
> whether we're in new or edit mode, restore it on mount if present,
> and clear it after a successful submit or when Cancel is clicked.
> Guard every localStorage call for SSR (`typeof window === 'undefined'`)
> and for private-browsing/quota errors."

## Working without the skeleton

Taoufik's Next.js skeleton (package.json, layout, real
`src/lib/types.ts` / `src/lib/mock-data.ts`) wasn't merged yet when
this branch was built. To keep moving:

- Wrote minimal placeholder `src/lib/types.ts` and
  `src/lib/mock-data.ts` matching the shared shape documented in
  `00-EVERYONE-READ-THIS-FIRST.txt` exactly, so the form code type-checks.
  These are meant to be overwritten by Taoufik's real versions.
- Since there was no `package.json` yet, sanity-tested the pure logic
  in `src/lib/validation.ts` directly with `npx tsx` (no Next.js
  needed) instead of waiting to run `npm run build`. Useful prompt:
  > "Write a standalone script that imports validateListingForm and
  > isListingFormValid and checks boundary cases (rent 0/9999/10000,
  > rooms 0/10/11, description 19/20/2000/2001 chars, availableUntil
  > before/equal to availableFrom, openEnded skipping the check).
  > Run it with tsx, no Next.js project needed."
