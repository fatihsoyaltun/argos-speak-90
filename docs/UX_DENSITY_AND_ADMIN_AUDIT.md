# UX Density and Admin Dashboard Audit

## Purpose

This audit reviews the current Argos Speak 90 mobile experience and admin dashboard UX with one goal: reduce vertical scrolling and page density while keeping the app mobile-first, premium, practical, and speaking-first.

This is a planning document only. It does not change app code, curriculum content, UI, Supabase/Auth/Admin logic, or cloud sync behavior.

## Source Files Inspected

- `app/page.tsx`
- `app/today/page.tsx`
- `app/listen/page.tsx`
- `app/words/page.tsx`
- `app/speak/page.tsx`
- `app/review/page.tsx`
- `app/journal/page.tsx`
- `app/settings/page.tsx`
- `app/admin/page.tsx`
- `app/admin/users/[userId]/page.tsx`
- `components/app-shell.tsx`
- `components/listening-drill.tsx`
- `components/words-practice.tsx`
- `components/speaking-practice.tsx`
- `components/review-practice.tsx`
- `components/cloud-sync-panel.tsx`
- `components/ui.tsx`

## 1. Executive Verdict

The app is readable and consistent, but several pages are too vertically stacked for real phone use. The main issue is not visual quality; it is density management. Most pages present every instruction, card, list, form, and status block at once.

### What Feels Too Dense

- Listen has too many full cards before the user reaches the response input.
- Words renders 8 large vocabulary cards, each with nested meaning and example blocks plus audio buttons.
- Speak stacks hero, instructions, prompt, first try, second try, pilot rubric, target lines, and self-check.
- Review stacks instructions, production rubric, 4 review cards, textareas, feedback states, and summary.
- Journal stacks progress, saved answers, review answers, and three note fields.
- Settings is the densest utility page: pilot guide, local controls, cloud sync, status cards, account, privacy, export/import, JSON textareas.
- Admin detail is the densest admin page: learner card, 90-day grid, recent progress rows, practice entries, and review summary all appear as full sections.

### Urgent UX Changes

1. Settings: split or collapse utility sections first. It is currently the largest mixed-purpose page.
2. Words: reduce 8 repeated word cards into a tighter mobile vocabulary pattern.
3. Speak: make the active writing/speaking task primary and collapse support material.
4. Review: show one review task at a time or use compact task accordions.
5. Admin user detail: reduce the wall-of-text and focus on recent status first.

### Pages That Should Not Be Touched Yet

- Home should not be prioritized. It is short and mostly fine.
- Bottom navigation should not be redesigned in this pass; it already uses horizontal overflow for stability.
- Auth/Login/Account should not be part of UX-1 follow-up unless a specific issue appears.
- Today should receive only light density improvements after shared compact components exist.
- Admin data fetching and RLS logic should not be changed during UX cleanup.

## 2. Mobile Density Problems

## Today

### What Causes Vertical Scrolling

- Large `PageHeader` typography.
- Separate `DayNavigator`.
- Large dark Next Step card.
- Full `StepList` with five large action cards.
- Bottom navigation requires large bottom padding in `AppShell`.

### What Can Be Collapsed

- `StepList` descriptions can be hidden behind a compact row or small secondary text.
- The Next Step focus paragraph can be shortened on mobile.

### What Should Stay Visible

- Day number and day theme.
- Previous/Next day control.
- Main next action CTA.
- Five-step flow, but in compact form.

### What Should Move Into Accordion/Details

- Full daily flow descriptions.
- Session explanation text.

### What Should Be Sticky Or Compact

- The active day control should be compact and consistent across pages.
- The primary "Start listening" CTA can stay near the top, not sticky yet.

## Listen

### What Causes Vertical Scrolling

- Route-level header and day navigator.
- Large audio/status card.
- Separate instruction card.
- Full transcript card.
- Key lines list.
- Mini task card.
- Textarea card.

### What Can Be Collapsed

- "Ne yapacaksın?" instruction card can become a compact details block.
- Key lines can start collapsed after the first line.
- Mini task can merge into the response card.

### What Should Stay Visible

- Audio controls.
- Transcript.
- Current output prompt.
- Response textarea.

### What Should Move Into Accordion/Details

- Detailed Turkish guidance.
- Full key-line list.
- TTS fallback/explanation details after the main status.

### What Should Be Sticky Or Compact

- Transcript header audio button is useful and should stay.
- A compact sticky bottom action could show `Dinle / Devam et / Kaydet` only if it does not fight the bottom nav.

## Words

### What Causes Vertical Scrolling

- Instruction card.
- Eight full word cards.
- Each word card contains word header, pronunciation badge, word audio, meaning block, example block, example audio, and possible error message.
- Writing practice card appears after all words.

### What Can Be Collapsed

- Example sentence detail can be collapsible per word.
- Audio error details can appear inline but compact.
- Instruction card can become a one-line hint.

### What Should Stay Visible

- All 8 words should remain quickly scannable.
- Turkish meaning should remain visible.
- Word audio button should remain easy to tap.
- Writing practice should not be buried too far below.

### What Should Move Into Accordion/Details

- Example sentence and example audio.
- Extra guidance text.

### What Should Be Sticky Or Compact

- A compact progress strip like `1/8 words reviewed`.
- Writing practice could be a sticky or early "Use one word" card after the first 4 words, then repeated link at bottom.

## Speak

### What Causes Vertical Scrolling

- Hero card.
- Separate instruction card.
- Prompt card.
- First try textarea.
- Second try textarea.
- Pilot rubric.
- Target lines.
- Self-check checklist.

### What Can Be Collapsed

- Pilot rubric should be collapsed by default.
- Target lines can be compact chips or a collapsible helper.
- Self-check can appear after saving second try, or be collapsed.

### What Should Stay Visible

- Speaking prompt.
- First try.
- Second try.
- Save button.
- A small second-try improvement reminder.

### What Should Move Into Accordion/Details

- Full speaking tips.
- Pilot rubric.
- Target lines.
- Full self-check list.

### What Should Be Sticky Or Compact

- A compact task stepper: `Prompt -> First try -> Second try -> Check`.
- Save button can remain near the second try textarea rather than global sticky.

## Review

### What Causes Vertical Scrolling

- Instruction and production self-check card.
- Four full review task cards.
- Each task includes prompt, type badge, textarea, button, and feedback.
- Summary card after all tasks.

### What Can Be Collapsed

- Production self-check can collapse under "How to check open answers".
- Completed review task cards can collapse to a status row.
- Model answer/correction can be compact.

### What Should Stay Visible

- Current task prompt.
- Answer textarea.
- `Kontrol et` button.
- Checked/correct count.

### What Should Move Into Accordion/Details

- Self-check rubric.
- Completed task detail.
- Expected answer correction text after the result is acknowledged.

### What Should Be Sticky Or Compact

- Summary count could move near the top as a compact progress strip.
- One task visible at a time would reduce cognitive load.

## Journal

### What Causes Vertical Scrolling

- Header and day navigator.
- Saved work summary card.
- Saved answers section with four blocks.
- Review answers section.
- Three daily note textareas.

### What Can Be Collapsed

- Saved answers can be grouped under module tabs or accordions.
- Review answers can show only count first, details on expand.
- Note fields can be one compact Journal card with progressive disclosure.

### What Should Stay Visible

- Active day.
- Completion summary.
- Last updated time.
- Daily note fields, but preferably one at a time.

### What Should Move Into Accordion/Details

- Saved Listen/Words/Speak answers.
- Review answer details.

### What Should Be Sticky Or Compact

- Day navigator.
- Completion chips.
- Daily note save status, if added later.

## Settings

### What Causes Vertical Scrolling

- Page header.
- Team privacy notice.
- Pilot guide card.
- Active day/local progress card.
- Cloud sync panel.
- Audio/practice/cloud/account/program status grid.
- Local-first explanation blocks.
- Export/import card with JSON textareas and file input.

### What Can Be Collapsed

- Privacy notice after first read.
- Export/import section.
- Advanced status cards.
- Import JSON controls.

### What Should Stay Visible

- Cloud account status.
- Cloud sync status and primary sync action.
- Active day reset.
- Local progress safety note.

### What Should Move Into Accordion/Details

- Export/import.
- Privacy notice.
- Pilot guide.
- Technical status details.

### What Should Be Sticky Or Compact

- Cloud sync primary action can be visually prominent but not sticky.
- Account status should be compact at top.

## 3. Proposed Mobile-First Layout Principles

1. Compact hero/header: reduce large page titles after the first screen. Use `Day 48 · Listen` style headers and smaller descriptions.
2. Progress stepper: show a compact day/task stepper near the top for `Listen -> Words -> Speak -> Review`.
3. Collapsible lesson details: instructions, rubrics, and target lines should use accordions/details.
4. Sticky primary action area: use only for one clear action when needed; avoid fighting the fixed bottom nav.
5. Smaller vertical rhythm: reduce repeated `space-y-6/7/8`, repeated `p-5/p-6`, and oversized repeated headings inside dense task surfaces.
6. One task visible at a time when possible: especially Review and Speak.
7. Do not hide important practice input: textareas and save/check buttons must remain easy to find.
8. Preserve readable tap targets: compact does not mean tiny.
9. Prefer summary-first cards: show current state first, details below or collapsed.
10. Keep desktop calm: desktop can use two-column layouts, but mobile should drive the structure.

## 4. Page-By-Page Redesign Plan

## Today

- Make the day header more compact.
- Keep `DayNavigator`, but reduce spacing around it.
- Convert `StepList` into a compact flow list with optional detail expansion.
- Keep the dark Next Step card but reduce its paragraph height.
- Do not add new data or logic.

## Listen

- Merge "Ne yapacaksın?" and "Mini task" into one compact guidance strip.
- Keep transcript and audio control visible.
- Collapse key lines behind "Yakalaman gereken cümleler".
- Place response card closer to transcript.
- Keep audio error/fallback states compact.

## Words

- Change word cards into compact rows:
  - word + pronunciation + word audio visible
  - Turkish meaning visible
  - example sentence hidden in a details row or expanded tap area
- Add a small `8 words` progress strip.
- Move writing practice higher or add a shortcut after the first visible word group.
- Keep exactly 8 items and audio controls unchanged logically.

## Speak

- Keep prompt and first/second try as the core visible path.
- Collapse Pilot rubric and target lines.
- Show target lines as small optional chips or one collapsed helper card.
- Move self-check after save or into an accordion.
- Preserve second-try improvement.

## Review

- Add a compact review progress strip at top.
- Show one active review card at a time, or collapse completed cards.
- Keep production self-check collapsed by default.
- Keep feedback states clear but compact.
- Preserve local saving and check behavior.

## Journal

- Summary card at top: `Day`, `completed modules`, `last update`.
- Group saved answers under module accordions.
- Show review answers as summary count first.
- Keep daily notes visible but use compact labels and shorter default rows.
- Avoid turning Journal into a long archive wall.

## Settings

- Top card: account/cloud status + primary sync action.
- Move Pilot guide and privacy notice into collapsible cards.
- Move Export/Import into an "Advanced local data" details section.
- Keep reset/clear controls visible but visually separated as local device controls.
- Avoid showing raw JSON textarea until export/import is requested.

## 5. Admin Dashboard Audit

## `/admin`

The current `/admin` page already has KPI cards and member cards, but it can become easier to scan.

### Simplify With

- Top KPI cards:
  - Total members
  - Active today
  - Active last 7 days
  - Needs attention
- Today active count:
  - Derivable if `last_seen_at` is today.
- At-risk users:
  - Already partly derivable from `attentionReasons`.
  - Expand rule from `3+ days` to show a clearer status tag.
- Needs sync users:
  - Derivable from stale `user_status.updated_at` or missing sync.
- Weekly leaderboard:
  - Partly derivable from current `day_progress` if updated rows include enough timestamps.
  - Better later with a dedicated weekly points/snapshot model.
- Compact member table/card:
  - Mobile: one compact card row per member.
  - Tablet/desktop: table with columns for name, active day, completed, last sync, status, detail.
- Clear status tags:
  - `Synced today`
  - `No sync`
  - `2+ days inactive`
  - `Needs review`
- Detail link readability:
  - Keep explicit high-contrast button style.

### Suggested `/admin` Layout

1. Compact admin header.
2. KPI strip.
3. "Needs attention" list first if any.
4. Compact members list/table.
5. Privacy note collapsed or placed at bottom after first use.

## `/admin/users/[userId]`

The detail page has the right data but too much vertical weight.

### Improve With

- Last 7 days summary:
  - Show 7 compact day cells with module completion.
- Module completion grid:
  - Use a small `Listen / Words / Speak / Review` grid for recent days.
- Review/Speak/Journal sections:
  - Split into collapsible sections.
  - Show latest item preview only.
- Reduce wall-of-text:
  - Truncate long written answers with "Show more".
  - Display one recent day at a time.
- Keep mobile readable:
  - Use status chips and small cards before long text.

### Suggested Detail Layout

1. Learner summary card with role, active day, last sync, completed days.
2. Last 7 days module grid.
3. At-risk/needs attention notes.
4. Recent written practice preview.
5. Collapsible review answers.
6. Full 90-day grid collapsed under "All days".

## 6. Competition and Tracking Proposal

This should stay simple and supportive. It should encourage consistency without turning the app into a game that distracts from speaking practice.

## Metrics Derivable From Current Data

| Metric | Can derive now? | Data source |
| --- | --- | --- |
| Active day | Yes | `user_status.active_day` |
| Last sync | Yes | `user_status.updated_at`, `last_seen_at` |
| Completed modules | Yes | `day_progress.listen_done`, `words_done`, `speak_done`, `review_done` |
| Total completed days | Yes | `user_status.total_completed_days` or completed `day_progress` rows |
| Review completion | Yes | `day_progress.review_done`, `review_answers.checked_at` |
| Speak second try completion | Partly | `practice_entries.speak_second_try` presence |
| Journal weak point entry | Partly | `practice_entries.difficult_part` presence |
| At-risk flag if no sync for 2 days | Yes | `user_status.updated_at` or `last_seen_at` |
| Needs sync users | Yes | stale/missing `user_status.updated_at` |

## Metrics That Need Later Schema Or Rules

| Metric | Why later |
| --- | --- |
| Streak | Needs reliable per-day completion dates and streak rules. |
| Weekly points | Needs stable point model and week boundaries. |
| Leaderboard history | Needs weekly snapshots or derived date filtering. |
| Speak quality score | Should not be fake-scored without teacher/AI review. |
| Review quality score | Current review checking is simple; open production answers need human/admin judgment. |

## Simple Accountability Model

Suggested future point rules:

- 1 point for Listen completed.
- 1 point for Words completed.
- 2 points for Speak completed.
- 1 extra point if Speak second try is filled.
- 1 point for Review completed.
- 1 point for Journal weak point entry.
- At-risk flag if no sync for 2 days.
- No negative scoring.

Use this as team accountability, not punishment.

## 7. Implementation Phases

## UX-2: Shared Compact Components / Accordions

- Add shared `CompactSection`, `ExpandableCard`, `ProgressStrip`, and `TaskStepper` patterns.
- Do not refactor every page yet.
- Add accessible details/summary behavior or controlled accordions.

## UX-3: Learner Page Density Reduction

- Apply compact layout to Listen, Words, Speak, Review, Journal, and Settings.
- Preserve local progress saving and audio behavior.
- Keep one task visible where it helps.

## UX-4: Admin Dashboard Simplification

- Reorganize `/admin` into KPI strip, needs-attention list, compact member list.
- Reorganize `/admin/users/[userId]` into learner summary, last 7 days, collapsible details.
- Do not change Supabase data access.

## UX-5: Leaderboard / Accountability Widgets

- Add simple derived widgets only if current data supports them.
- Avoid schema changes until the team validates what they actually need.
- Keep tone supportive, not punitive.

## UX-6: Final Mobile QA

- Test narrow mobile width.
- Test phone scrolling, bottom nav overlap, form focus, textareas, and long content.
- Test tablet and desktop scanability.
- Test admin with empty, light, and heavy team data.

## 8. Risk Section

### Risk: Hiding Learning Instructions Too Much

If instructions are collapsed too aggressively, beginners may feel lost.

Mitigation:

- Keep one-sentence instruction visible.
- Collapse only deeper explanation.
- Use clear labels like "How to do this".

### Risk: Breaking Local Progress Saving

Changing task layout may accidentally remount forms or lose local state.

Mitigation:

- Keep storage keys and save functions untouched.
- Avoid changing component keys unless intentional.
- Test day switching and return-to-page behavior.

### Risk: Making Admin Too Gamified

Leaderboards can motivate, but they can also make learning feel punitive.

Mitigation:

- Use supportive labels.
- Avoid negative public rankings.
- Show at-risk signals privately to admin.

### Risk: Over-Editing Many Pages At Once

The app has several stateful pages. Broad UI rewrites can break audio, local storage, review state, and cloud sync.

Mitigation:

- Implement shared compact components first.
- Roll out page by page.
- Run lint/build after every phase.
- Manually inspect each changed route on phone.

## 9. Recommendation

Implement UX-2 first.

Why:

- The same density pattern appears across many pages: large cards, repeated headings, repeated instruction blocks, and long lists.
- Shared compact/accordion patterns will reduce risk before touching individual pages.
- It avoids many one-off fixes.
- It gives UX-3 and UX-4 a stable foundation.

Recommended first implementation order:

1. UX-2: shared compact section and accordion/details components.
2. UX-3A: Settings and Words density reduction.
3. UX-3B: Speak, Review, Listen density reduction.
4. UX-4: Admin dashboard and detail simplification.
5. UX-5: simple derived accountability widgets.
6. UX-6: final mobile QA.

## Top 5 UX Problems

1. Settings mixes too many unrelated utility controls in one long page.
2. Words repeats large nested cards eight times before the writing task.
3. Speak shows every support layer at once instead of guiding the user through the active task.
4. Review displays all tasks as full cards, making active recall feel heavier than necessary.
5. Admin user detail shows useful data as a long vertical archive instead of a summary-first coaching dashboard.

## Final Verdict

The current UI is solid enough to build on, but it needs density management before serious team use. The safest next step is not a redesign; it is a compact component system followed by page-by-page reduction of repeated cards, instructions, and long text sections.
