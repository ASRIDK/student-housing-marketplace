# v1 — Initial prompt: "put apartment photos in this component"

**Date:** 24 Sep 2026 · **Tool:** Claude Code · **Commit:** `f82fd06`

## Problem

The home page opened on a plain text headline. We wanted something that
shows, in the first second, that this site is about real apartments, and
we had found a 3D "works wheel" component (a ring of cards that opens into
a rotating drum as you scroll) built for a design portfolio.

## Prompt

A standard component-integration template (check the project supports
shadcn conventions, Tailwind and TypeScript; copy the component into
`/components/ui`; install what it needs), followed by the full source of
`works-wheel.tsx` and its demo, and this instruction at the end:

> Here's a hero we can add, but instead of like sci-fi photos, what I want
> you to do is put apartment photos and venues and all that where it's
> like four different apartments. No problem, yeah, just on that, thanks.

**Technique:** zero-shot, with the code as context. No reference for what
the result should look like, no constraints on layout.

## Output

- The component vendored into `src/components/ui/works-wheel.tsx`, with
  the `cn` helper and the colour aliases it expects.
- A `FeaturedWheel` with **four hard-coded Unsplash interior photos**, each
  linking to a listing, labelled "Open now".
- The wheel placed **under** the existing headline, in a 32rem-high box.
- The listing grid below still used **random placeholder photos**
  (`picsum.photos`), which is often landscapes and city views.

## Evaluation

What we saw on screen, and what we measured afterwards:

- The cards sit tangent to the ring, which was fine for abstract artwork
  but turns a photo of a room **on its side or upside down**.
- The four wheel photos were not the photos of the listings they opened:
  you clicked a bright living room and landed on a listing illustrated
  with a random placeholder image.
- The ring is 2.73 card-heights tall, **1.04× the height of its stage**,
  so the top and bottom cards were always cut off.
- The hero did not fill the first screen.

Scores are in the table in [README.md](README.md#evaluation).

## What to change

Say what "right" looks like, not only what is wrong: full screen, real
interiors everywhere (not just on the wheel), and the same photo on the
card as on the listing.
