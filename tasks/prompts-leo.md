# Prompts — Leo (feature/listing-detail)

AI assistant used: **Claude** (claude.ai chat). This file documents the prompts that drove the listing detail page (`/listings/[id]`), the "My listings" dashboard (`/my-listings`) and the bonus components, as asked in `tasks/00-EVERYONE-READ-THIS-FIRST.txt`.

Files built: `src/app/listings/[id]/page.tsx`, `src/app/listings/[id]/not-found.tsx`, `src/components/PhotoGallery.tsx`, `src/components/ContactCard.tsx`, `src/app/my-listings/page.tsx`, `src/components/MyListingRow.tsx`, plus the bonus `ShareButton.tsx` and `AvailabilityCountdown.tsx`.

## 1. Starting prompt

> We're doing a group project for the Prompt Engineering and Git course. The text below is my task. Tell me everything you need, explain what I have to do and how we should proceed. I don't know how to use GitHub or how to add a file, so explain step by step. *(written in Italian, followed by my whole task file pasted in)*

Instead of writing code right away, Claude asked for the shared project files first: `tasks/00-EVERYONE-READ-THIS-FIRST.txt`, `src/lib/mock-data.ts`, then `src/lib/format.ts`. From them it found things I would never have told it myself:

- the mock array is called `mockListings` and there is already a `getMockListing(id)` helper that returns `undefined` for unknown ids, which is exactly what `notFound()` needs;
- Andrea's layout already sets the title template `"%s — StudentSwap"`, so `generateMetadata` only returns `"2 rooms in Navigli, Milan"`;
- dates and rent must go through the shared `formatDate` / `formatRent` / `formatRooms`, so my page shows them exactly like Alejandro's cards.

**Lesson:** pasting the whole task file gave good context, but the shared files mattered even more. Without them the AI would have invented field names and its own formatting.

## 2. Detail page + dashboard

Built on the starter prompt from my task file:

> Next.js 16 App Router, TypeScript, Tailwind. Here is the Listing type: <paste>. Create src/app/listings/[id]/page.tsx. params is a Promise<{ id: string }>. Find the listing by id in the mock array exported from '@/lib/mock-data' and call notFound() if missing. Render a 2-column layout (stacked on mobile): photo gallery + details on the left, a contact card with a mailto link on the right. Add generateMetadata for the title.

Then the same pattern for the other five files, using the "DONE WHEN" checklist of my task file as the list of requirements.

Iteration: I asked for the code to be **verified before I used it**. Claude recreated the project structure, ran `npm run build` and fixed the errors first, so the six files compiled on the first try in the real project.

`"Mark as taken"` only does `console.log` with a `// TODO(api)` comment, and the fake logged-in user has a `// TODO(auth)` comment, as the task file asked. Both were later wired by Taoufik in #11.

## 3. Bonus: share button + availability countdown (PR #5)

> Add two bonus components to the listing detail page: a ShareButton that copies the current URL to the clipboard and shows "✓ Link copied!" for 1.5 seconds, and an AvailabilityCountdown that shows how many days until the apartment is available, using the `availableFrom` field of the Listing type.

Before writing the countdown, Claude checked the real type in `src/lib/types.ts`: `availableFrom` is an ISO date string. Both components passed `npm run build` with zero TypeScript errors and were tested live on `/listings/l-milan-1` before the PR.

## 4. Debugging prompts

Most of my prompts were not about code but about **why the code didn't work on my machine**. Typical prompt: a screenshot of VS Code or the terminal + "it still doesn't work, what's wrong?". Problems solved this way:

- files created in a duplicated `src/src/` folder (I included `src/` in the path while already inside it);
- several hidden `next dev` servers stuck on port 3000 → `pkill -f "next dev"`;
- `page.tsx` open in the editor but never saved to disk;
- the Next.js cache still pointing to old files → `rm -rf .next`;
- a stray `+` character corrupting every terminal command → opened a new terminal.

## What didn't work / had to be corrected

- **Copy-paste from the chat into VS Code was unreliable.** `ContactCard.tsx` kept losing the `<a` opening tag of the mailto link. First fix: restructure the JSX so `<a href={mailto}` sits on one line. Final fix: stop copy-pasting and create every file from the terminal with `cat > path << 'EOF'`. This is the method I used for everything after.
- **The AI can't see my computer.** Code verified in Claude's environment still failed locally because of wrong folders and unsaved files. Sending screenshots of the file tree and the terminal was the only way to find those problems.
- **My first prompt asked for "everything"** (explanation + code + GitHub tutorial). It worked because Claude split the job into steps and asked for files first, but a more specific first prompt with the shared files already attached would have saved a few rounds.

**Lesson:** a correct output from the AI is only half of the job. The other half is getting it into the project correctly and verifying it there (`npm run build`, then the page in the browser, on phone and laptop width).
