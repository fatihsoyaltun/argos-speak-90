# UX-3C Listen and Journal Density Summary

## Purpose

This pass reduces mobile vertical density on Listen and Journal while preserving audio behavior, transcript display, local progress saving, and journal storage.

## Listen Changes

- Kept the main audio controls visible in the top listening card.
- Kept the transcript visible with the existing compact transcript audio control.
- Added a compact `TaskStepper` for `Listen -> Read -> Catch lines -> Write`.
- Moved detailed Turkish listening guidance into an `ExpandableCard`, default closed.
- Moved key lines into an `ExpandableCard`, default closed.
- Merged mini task guidance and output prompt into the response card.
- Kept TTS fallback/error messages visible but reduced their card padding.
- Kept the response textarea and save button visible.

## Journal Changes

- Kept active day, completion count, module completion strip, and last updated time visible near the top.
- Kept daily note fields visible and editable.
- Grouped saved Listen, Words, and Speak answers into an `ExpandableCard`.
- Grouped Review answers into an `ExpandableCard` with a compact saved-answer count.
- Reduced vertical spacing while preserving readable textarea sizes.

## Behavior Preserved

- Listen audio play, pause, resume, replay, cleanup, caching, and day-change behavior were not changed.
- Listen transcript rendering and spoken-word highlighting were not changed.
- Listen mini output still saves/restores through the existing local progress field.
- Journal daily note, difficult part, and next review note still save/restore through the existing fields.
- Journal saved module answers still display from the same local progress data.
- Journal review answers still display from the same local progress data.
- Active day and `updatedAt` display remain wired to the existing local progress store.
- No storage keys, curriculum content, Supabase/Auth/Admin/cloud sync, audio/TTS, or review checking logic were changed.

## Mobile QA Checklist

1. Open `/listen` on a narrow phone width.
2. Confirm the audio controls are visible and touch-friendly.
3. Confirm the transcript remains visible without opening accordions.
4. Open/close the guidance and key-lines accordions.
5. Type a listen response and save it.
6. Change day, return, and confirm the correct saved listen response loads.
7. Test play, pause, resume, replay, and day-change audio cleanup.
8. Open `/journal` on a narrow phone width.
9. Confirm active day, completion strip, and last updated are visible near the top.
10. Type in all three note fields and confirm they save/restore.
11. Open saved answers and review answer accordions and confirm existing data displays.
12. Confirm the bottom navigation does not cover journal note fields or listen save controls.

## Risks Avoided

- Main Listen practice inputs were not hidden behind closed accordions.
- Audio/TTS generation, cache, and playback state logic were not touched.
- Journal note fields stayed visible instead of being hidden in an archive.
- Local progress shape and storage keys were not changed.
- No Words, Speak, Review, Settings, Admin, Supabase, Auth, or cloud sync files were edited.
