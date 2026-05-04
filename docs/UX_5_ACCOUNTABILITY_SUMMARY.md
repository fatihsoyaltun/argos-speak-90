# UX-5 Accountability Widgets Summary

## Purpose

This phase added supportive admin accountability signals using only data already available to the admin pages.

No schema changes, new Supabase tables, RLS changes, cloud sync changes, learner page changes, or persistent leaderboard logic were added.

## Metrics Added

### /admin

- Synced 24h
- Needs sync
- Speak missing
- Review missing
- Needs-attention user list
- Per-member accountability tags

### /admin/users/[userId]

- Recent sync state
- Active-day module gaps
- Speak second try presence
- Review completion state
- Journal weak point / next review note presence
- Supportive suggested admin action

## How Metrics Are Derived

- Synced 24h: `user_status.last_seen_at` is within the last 24 hours.
- Needs sync: `user_status.last_seen_at` is missing or older than 3 days.
- Needs attention: existing admin attention reasons, including no sync or stale activity.
- Speak missing: active day has a `day_progress` row and `speak_done` is false.
- Review missing: active day has a `day_progress` row and `review_done` is false.
- Module gaps: active-day `day_progress` booleans for listen, words, speak, and review.
- Speak second try presence: active-day `practice_entries.speak_second_try` has text.
- Journal note presence: active-day `practice_entries.difficult_part` or `next_review_note` has text.
- Review needs attention: active-day `review_answers.is_correct` contains a false value.

## Intentionally Not Added

- No weekly points.
- No rank ordering.
- No persistent leaderboard.
- No streak database fields.
- No punitive labels.
- No journal weak point count on `/admin`, because the overview page does not reliably receive practice entry rows.
- No hidden admin scoring model or AI evaluation.

## Mobile QA Checklist

- Open `/admin` on a phone viewport.
- Confirm the accountability cards fit without horizontal overflow.
- Confirm counts are readable and do not look like a leaderboard.
- Confirm each member card shows no more than a few clear tags.
- Confirm `Detayları gör` remains readable.
- Open `/admin/users/[userId]`.
- Confirm the Coaching signals section appears near the top.
- Confirm sync, module gaps, second try, review, and journal signals are readable.
- Confirm the suggested admin action uses supportive wording.
- Confirm expandable archive sections still open normally.

## Risks Avoided

- Did not create a competitive ranking system before the product has enough pilot data.
- Did not fake journal metrics on the overview page.
- Did not change Supabase queries or RLS behavior.
- Did not punish users for missing data; labels are framed as coaching signals.
- Did not touch learner pages, storage keys, curriculum, or cloud sync behavior.
