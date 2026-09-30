# Design system

StudentSwap uses Albert School's own colours, taken from albertschool.com,
with a photo-first, marketplace-style layout. Every token lives at the top
of [`src/app/globals.css`](../src/app/globals.css). Use the Tailwind
classes, never a raw hex value.

## Colours

| Token | Hex | Class | Use it for |
|---|---|---|---|
| navy | `#202448` | `bg-navy` `text-navy` | Navbar, footer, headings, primary buttons |
| sky | `#2eaee0` | `bg-sky` | Only things you can act on, focus rings |
| deep | `#035ca0` | `text-deep` | Text links and hover states |
| mist | `#eaeff6` | `bg-mist` | Quiet backgrounds, chips, image placeholders |
| ink | `#12142b` | `text-ink` | Body text |
| slate | `#5b6480` | `text-slate` | Secondary text |
| line | `#dfe4ee` | `border-line` | Borders and dividers |

Each campus also has one colour, used only by `<CityBadge />`.

## Rules

- **Blue means action.** Never colour plain text `sky`: if it is blue, it
  is clickable.
- **One font.** Inter, self-hosted in `src/app/fonts/`, so the build never
  calls Google Fonts. Hierarchy comes from weight and size: add `display`
  to big headings and `title` to section headings for the right letter
  spacing.
- **The layout owns the shell.** `layout.tsx` renders the only `<main>`.
  Each page sets its own width and padding (`mx-auto max-w-6xl px-5
  sm:px-8`).
- **One badge per campus.** Use `<CityBadge city={...} />`; don't invent
  colours.
- **Rounded, not shadowed.** Cards use `rounded-2xl` or `rounded-3xl` and
  a border. Keep shadows for things that float above the page.

## Shared code

| File | What it holds |
|---|---|
| `src/lib/types.ts` | The `Listing` type and the list of cities |
| `src/lib/format.ts` | `formatDate`, `formatRent`, `formatRooms`, `formatWindow` |
| `src/lib/listings.ts` | Every database query |
| `src/lib/mock-data.ts` | The ten listings used to seed the database |
| `src/lib/utils.ts` | `cn()`, for merging Tailwind classes |

## The hero wheel

`src/components/ui/works-wheel.tsx` is a third-party component, vendored
and changed locally in four documented places so that it works with
photographs: cards lean at most 26° instead of turning on their side, the
card size fits the ring inside the stage, and the centre label accepts
markup. Each change is commented in the file. The reasons are in
[`prompts/`](../prompts/).
