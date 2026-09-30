# v3 — Reference-driven prompt: exact copy plus a screen recording

**Date:** 24 Sep 2026 · **Tool:** Claude Code · **PR:** #13 (`50e3f8f`, `e8232c6`)

## Problem

v2 had the right photos but the wrong composition: the ring no longer read
as a ring, it was clipped, and its centre said "Open now" instead of
saying what the site is for.

## Prompt

> Someone is leaving your campus. Take their keys.
> Apartments handed over student to student in Milan, Madrid, Geneva,
> Paris and Marseille. You get the place, the landlord keeps a tenant,
> nobody pays an agency. I want you to put this instead of the open now so
> that it's better for me. As you can say in the prompt and inspire
> yourself on how you're gonna approach things. […] check out the
> animation and how it looks apply what I said if you have any questions
> ask them away

Attached: a **screen recording** of the original component's demo.

**What changed from v2:**

- **The exact words** to put in the ring, so there is nothing to invent.
- **A reference to copy** (the recording) instead of adjectives. This is
  the visual equivalent of few-shot prompting: one example of the target
  instead of a description of it.
- **Permission to ask questions**, so a guess is not the only option.

The assistant pulled frames out of the recording to study how the ring,
the label and the drum move, before touching the code.

## Output

- The headline and the blurb sit **inside** the ring and fade as it opens
  into the drum.
- Cards **lean up to 26°** instead of lying flat or turning on their side:
  the circle reads again, and no room is ever sideways.
- Card height 0.38 → 0.35 of the stage, so the ring is 0.96× the stage:
  **nothing clipped**.
- **Every** photographed listing on the wheel, not four. The component
  only shrinks its cards when it has more of them, and nine is what opens a
  hole in the middle big enough for a headline.

## Evaluation

All seven criteria met (see [README.md](README.md#evaluation)).

**We deviated from the brief once, on purpose.** The v1 brief said "four
apartments". With four, the cards stay full size and close the centre, so
the headline v3 asked for cannot fit. The assistant used every listing and
said so, rather than following the brief silently or ignoring it.

## What to change

Seven out of seven on our own criteria, and the page could still be
better. That is a sign the criteria were missing something. v4 asks the AI
to judge the page against a wider standard.
