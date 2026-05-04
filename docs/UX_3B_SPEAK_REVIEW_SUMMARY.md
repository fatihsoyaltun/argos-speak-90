# UX-3B Speak and Review Density Summary

## Purpose

This pass reduces mobile vertical density on Speak and Review while preserving the existing curriculum, local progress behavior, review checking, and app architecture.

## Speak Changes

- Added a compact `TaskStepper` for `Prompt -> First try -> Second try -> Check`.
- Kept the main speaking prompt visible.
- Kept both `First try` and `Second try better` textareas visible and easy to use.
- Moved the detailed speaking guidance into an `ExpandableCard`.
- Moved the pilot rubric into an `ExpandableCard`, default closed.
- Moved target lines into an `ExpandableCard`, default closed.
- Moved the full self-check checklist into an `ExpandableCard`.
- Kept one visible reminder near the second try: `İkinci deneme ilkinden daha net olmalı.`

## Review Changes

- Added a compact top `ProgressStrip` for checked, correct, and remaining review items.
- Moved the production self-check/rubric into an `ExpandableCard`, default closed.
- Made review task cards slightly more compact while keeping the answer input, check button, and feedback visible.
- Added compact status pills for review type and checked result.
- Tightened the review summary card spacing without changing the summary values.

## Behavior Preserved

- Speak first try still saves/restores through the existing local progress field.
- Speak second try still saves/restores through the existing local progress field.
- Speak completion still marks the day task only when saving the second try.
- Review answers still save/restore through the existing review answer map.
- Review checked state and result still persist.
- Review correctness checking logic is unchanged.
- Day changes still load the correct saved Speak and Review state.
- No storage keys, Supabase/Auth/Admin/cloud sync logic, audio logic, or curriculum content were changed.

## Mobile QA Checklist

1. Open `/speak` on a narrow phone width.
2. Confirm the prompt, first try, and second try are visible without opening accordions.
3. Type in `First try`, navigate away/back or change day and return, and confirm it restores.
4. Type in `Second try`, save, and confirm the saved message appears.
5. Open/close speaking guidance, pilot rubric, target lines, and self-check.
6. Tap self-check items and confirm they still toggle visually.
7. Open `/review` on a narrow phone width.
8. Confirm the progress strip updates after checking review items.
9. Type an answer, tap `Kontrol et`, and confirm success/correction feedback still appears.
10. Change day and return; confirm answers, checked state, and result restore correctly.
11. Confirm bottom navigation does not cover the final summary or buttons.

## Risks Avoided

- Main practice inputs were not hidden behind closed accordions.
- Review validation logic was not changed.
- Local progress shape and storage keys were not changed.
- No unrelated learner pages were edited in this phase.
- Admin, cloud sync, Supabase, auth, and audio/TTS code were not touched.
