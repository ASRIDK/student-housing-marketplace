# v4 — Evaluation prompt: review the result against a design rubric

**Date:** 29 Sep 2026 · **Tool:** Claude Code with a front-end design skill

## Problem

v3 passed every criterion we had written. We wanted to know what our
criteria did not cover, before presenting.

## Prompt

> review the website design with the taste skill

The "skill" is a written design rubric the assistant loads before
answering. It tells it to look at the rendered page, not the code, and to
check it against a list of the habits that make a page look generated:
colour used as decoration, headings that break badly, no clear next
action, motion that fires before the page is ready, and so on.

**What changed from v3:** v1–v3 asked the AI to **produce**; v4 asks it
to **judge**, against a rubric we did not write. That keeps us from
marking our own homework.

## Output

The assistant opened the site at laptop (1512×900) and phone (390px)
widths and returned six ranked findings:

1. The five city badge colours are the loudest thing on the page and
   carry no information the word does not already carry.
2. The hero has no call to action.
3. The headline breaks badly inside the ring ("Take" alone at the end of a
   line), and the centred four-line blurb is hard to read.
4. The index of place names in the top-right corner reads as debug output.
5. On first paint the wheel shows for a moment as an exploded stack before
   settling into a ring.
6. The one listing without a photo sits in the top row with a passive
   "Photos coming soon".

It also checked two things and rejected them as non-issues. "Sept" next to
"Oct" is correct British English, not a bug. And the campus tabs that go
past the edge of a phone scroll sideways; they do not overflow the page.

## Evaluation

Five of the six findings are things v1–v3's criteria could not catch,
because nobody wrote a criterion for them. The rubric found them in one
pass.

## Next

These findings are listed under
[Future improvements](../README.md#future-improvements). Findings 1 to 3
are the ones worth doing first.
