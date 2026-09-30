# v2 — Structured feedback: full screen, real photos, nothing from the city

**Date:** 24 Sep 2026 · **Tool:** Claude Code · **Commits:** `86b536e`, `1b2896e`, `d617b04`

## Problem

v1 worked technically but did not look like a product (see
[v1](v1_initial_prompt.md#evaluation)).

## Prompt

A screenshot of the page, and:

> Fix this, it looks like shit. I don't want to look like a phone. I
> wanted... I want the hero to take the whole screen, also put it
> somewhere in the middle or somewhere else. I want the photos to be
> better, align the photos of the announcements and apartments with real
> photos, please don't use [the] photos from the city. I don't care, fix
> your AI slop, please.

**What changed from v1:** four explicit requirements instead of one:

1. the hero takes the **whole screen**;
2. the wheel moves to the **middle or elsewhere**;
3. **every** photo, on the wheel and in the listings, is a real apartment;
4. **no** city photos.

## Output

- `86b536e` — all 19 listing photos replaced with Unsplash apartment
  interiors, each one loaded and looked at to make sure it shows a flat,
  not a skyline or a show home.
- `d617b04` — the hero fills the screen, and the wheel is built from the
  database (the four newest listings that have a photo), so every card
  shows the same photo as the listing it opens.
- `1b2896e` — each picture turned back by the same angle its card is
  turned, so every room stays the right way up.

## Evaluation

- Photos: fixed everywhere, and the wheel and the listings now agree.
- **New failure:** with every picture turned back upright, the cards no
  longer followed the circle. The ring stopped reading as a ring and
  looked like rectangles scattered on a page. The fix answered the
  complaint literally and broke the thing that made the component worth
  having. See *sycophancy* in
  [documentation/llm-failure-modes.md](../documentation/llm-failure-modes.md).
- Still clipped top and bottom; the "Open now" label still sat in the
  centre of the ring.
- "I don't want it to look like a phone" turned out to be about the test
  browser, which had been left at phone width, not about the site.

## What to change

Stop describing the result and **show** it: a reference that answers
"what should the middle of the ring say, and how should it move?"
