# Prompts

How we used prompts to build StudentSwap, and how they improved.

Every important prompt follows the same loop:

**Problem → Prompt → Output → Evaluation → Improvement**

## The home page hero, in four versions

One problem followed from first attempt to final review. Each file says
what the prompt was, what it produced, how we judged it, and what we
changed next.

| Version | File | Technique | What changed |
|---|---|---|---|
| v1 | [v1_initial_prompt.md](v1_initial_prompt.md) | Zero-shot, code as context | "Put apartment photos in this component" |
| v2 | [v2_structured_prompt.md](v2_structured_prompt.md) | Explicit requirements | Four stated requirements instead of one |
| v3 | [v3_reference_prompt.md](v3_reference_prompt.md) | Reference example + exact copy | A screen recording to copy, the exact words to use |
| v4 | [v4_final_prompt.md](v4_final_prompt.md) | Rubric-based evaluation | The AI judges the result instead of producing it |

## Evaluation

Each criterion is something you can check on the page, not an opinion.

| Criterion | How we check it | v1 | v2 | v3 |
|---|---|:-:|:-:|:-:|
| Listing photos are real interiors, not placeholders | Out of 19 photos | 0 / 19 | 19 / 19 | 19 / 19 |
| A wheel card shows the flat it opens | Card photo = the listing's first photo | ✗ | ✓ | ✓ |
| No room is sideways or upside down | Largest tilt of a photo on the ring | up to 180° | 0° | 26° |
| The ring reads as a ring | Cards follow the circle | ✓ | ✗ | ✓ |
| Nothing is clipped | Ring height ÷ stage height | 1.04 | 1.04 | 0.96 |
| The hero fills the first screen | Hero height = viewport height | ✗ | ✓ | ✓ |
| The pitch sits inside the ring, as in the reference | Headline in the ring's centre | ✗ | ✗ | ✓ |
| **Criteria met** | | **1 / 7** | **4 / 7** | **7 / 7** |

v4 then found six problems that none of these seven criteria covers (no
call to action, a flash of broken layout on load, badge colours used as
decoration…). A perfect score on your own rubric usually means the rubric
is incomplete.

## What we learned about prompting

- **Show, don't describe.** v2's adjectives ("better", "whole screen")
  took several rounds; v3's screen recording took one.
- **Give the exact content.** When v3 supplied the headline word for word,
  there was nothing left to invent.
- **Constraints beat wishes.** The starter prompts in the task files
  (stack, shared type, one file, hard constraints, a "done when" list)
  produced working components on the first try for the teammates who
  used them (see their logs below).
- **Judge with a rubric you did not write.** v4 found what our own
  criteria could not.

## Each member's prompt log

| Member | Log | Area |
|---|---|---|
| Taoufik | [tasks/prompts-taoufik.md](../tasks/prompts-taoufik.md) | Skeleton, backend, integration, front-end |
| Alejandro | [tasks/prompts-alejandromiranda.md](../tasks/prompts-alejandromiranda.md) | Browse page |
| Leo | [tasks/prompts-leo.md](../tasks/prompts-leo.md) | Listing page, "My listings" |
| Côme | [tasks/prompts-come.md](../tasks/prompts-come.md) | Listing form |

To add a log, copy [TEMPLATE.md](TEMPLATE.md) to
`tasks/prompts-<your-name>.md` and open a pull request.

The four known LLM failure modes, with the cases we hit, are in
[documentation/llm-failure-modes.md](../documentation/llm-failure-modes.md).
