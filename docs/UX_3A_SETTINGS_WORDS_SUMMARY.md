# UX-3A Settings and Words Density Summary

## Purpose

This pass reduces mobile vertical density on Settings and Words without changing app logic, curriculum content, storage keys, cloud sync behavior, or TTS behavior.

## Settings Changes

- Cloud account status is now the first compact section so sign-in/account access stays easy to find.
- Cloud sync controls remain visible through the existing `CloudSyncPanel`.
- Active day reset, clear local progress, and Journal access are grouped as local device controls.
- Audio, Supabase, and program length status are condensed into a `ProgressStrip`.
- Pilot guide is now a compact link card.
- Privacy and admin visibility guidance moved into an `ExpandableCard`.
- Export/import JSON controls moved into an `Advanced local data` `ExpandableCard`.

## Words Changes

- The instruction block is now an `ExpandableCard` instead of a full open card.
- A compact header includes a visible shortcut to the writing practice.
- A `ProgressStrip` shows day, word count, and audio readiness.
- Each vocabulary card is smaller and keeps the English word, pronunciation, Turkish meaning, and word audio visible.
- Example sentence and example audio moved into a compact per-word details section.
- Writing practice keeps the same local save/restore behavior and now has a stable anchor target.

## Behavior Preserved

- Active day behavior is unchanged.
- Words TTS still uses the existing TTS helper/cache.
- Only one word/example audio can play at a time.
- Day change and unmount still stop Words audio through the existing cleanup effect.
- Words writing practice still saves to the same local progress field.
- Settings export/import format is unchanged.
- Settings clear local progress still uses the existing Argos-owned storage cleanup.
- Cloud sync logic and buttons are unchanged.

## Mobile QA Checklist

1. Open `/settings` on a narrow phone width.
2. Confirm cloud account and cloud sync controls are visible near the top.
3. Open and close `Gizlilik ve admin görünürlüğü`.
4. Open `Advanced local data` and test copy/download/import UI still appears.
5. Use `Reset Day 1` and confirm active day updates.
6. Use `Clear local progress` only with test data and confirm local progress clears.
7. Open `/words` on a narrow phone width.
8. Confirm all 8 words and Turkish meanings are easy to scan.
9. Tap a word audio button, then tap another word audio button; only one audio should play.
10. Open an example details row and play the example sentence audio.
11. Use the `Yazma pratiğine geç` shortcut and save a sentence.
12. Change day, return, and confirm the correct day words and saved local answer behavior remain stable.

## Risks Avoided

- No storage keys were changed.
- No Supabase/Auth/Admin logic was touched.
- No curriculum content was changed.
- No review checking behavior was touched.
- No Listen audio/TTS logic was touched.
- No admin pages were edited.
