# UX Compact Components

## Purpose

Phase UX-2 adds shared compact UI primitives that future density-reduction phases can use without redesigning the app page by page from scratch.

This phase is foundation-only. It does not refactor Listen, Words, Speak, Review, Journal, Settings, or Admin yet.

## Components Added

All components live in `components/ui.tsx`.

## `CompactSection`

Purpose: a smaller card-like section wrapper for dense mobile pages.

Use cases:

- Short instruction blocks.
- Compact daily summary cards.
- Small admin summary panels.
- Dense settings groups.

Supported props:

- `eyebrow`
- `title`
- optional `description`
- optional `action`
- optional `children`
- optional `className`

UX intent:

- Less padding than the current full `Card`.
- Keeps a clear label/title structure.
- Allows a small right-side action such as a status tag or button.

## `ExpandableCard`

Purpose: native collapsible card for content that should not dominate the first mobile viewport.

Use cases:

- Detailed lesson instructions.
- Rubrics.
- Target lines.
- Privacy notes.
- Export/import advanced controls.
- Admin long details.

Supported props:

- `title`
- optional `eyebrow`
- optional `description`
- `children`
- optional `defaultOpen`
- optional `className`

Accessibility notes:

- Uses native `details` and `summary`.
- The summary remains keyboard-focusable.
- Children remain in the DOM under native details behavior.
- Avoid putting a primary save/check action only inside a closed card unless the page also has a visible path to it.

## `ProgressStrip`

Purpose: compact horizontal status strip for module, task, or admin progress.

Use cases:

- `Listen / Words / Speak / Review` module completion.
- `1 / 8 words` style vocabulary progress.
- Review checked/correct progress.
- Admin sync status groups.

Supported item statuses:

- `pending`
- `active`
- `done`
- `warning`
- `synced`
- `noSync`
- `atRisk`

Accessibility notes:

- Uses an `aria-label` of `Progress`.
- Items are visible text pills, not color-only indicators.

## `TaskStepper`

Purpose: compact step indicator for task flows.

Use cases:

- Speak: `Prompt -> First try -> Second try -> Check`.
- Review: `Read -> Answer -> Check -> Repeat`.
- Listen: `Listen -> Read -> Catch lines -> Write`.

Supported step fields:

- `label`
- `status`
- optional `href`

Notes:

- Pure presentational component.
- If `href` is provided, the step renders as a normal `Link`.
- No navigation or state logic is included.

## `StatusPill`

Purpose: reusable high-contrast status tag.

Use cases:

- Admin member status.
- Cloud sync status.
- Review status.
- Module completion state.
- At-risk learner flags.

Supported statuses:

- `pending`
- `active`
- `done`
- `warning`
- `synced`
- `noSync`
- `atRisk`

Contrast rule:

- All status styles use explicit text/background/border colors.
- The component avoids inherited text color, which reduces the risk of invisible button/pill text.
- If `href` is provided, hover/focus states remain readable.

## Future Phase Usage

## UX-3: Learner Page Density Reduction

Recommended use:

- Listen:
  - `ExpandableCard` for instructions and key lines.
  - `CompactSection` for mini task + response prompt.
  - `ProgressStrip` for listen/read/write state if needed.
- Words:
  - `CompactSection` for each compact word row or grouped vocabulary area.
  - `ExpandableCard` for example sentences.
  - `ProgressStrip` for word progress.
- Speak:
  - `TaskStepper` for prompt/first try/second try/check.
  - `ExpandableCard` for pilot rubric, target lines, and self-check.
- Review:
  - `TaskStepper` or `ProgressStrip` for review progress.
  - `ExpandableCard` for production self-check and completed tasks.
- Journal:
  - `ExpandableCard` for saved answers and review answer history.
  - `CompactSection` for daily notes.
- Settings:
  - `ExpandableCard` for privacy notice, pilot guide, and export/import.
  - `StatusPill` for account, cloud, audio, and sync states.

## UX-4: Admin Dashboard Simplification

Recommended use:

- `/admin`:
  - `StatusPill` for synced/no sync/at-risk tags.
  - `CompactSection` for KPI cards and attention groups.
  - `ProgressStrip` for team completion summaries.
- `/admin/users/[userId]`:
  - `ProgressStrip` for last 7 days or recent module completion.
  - `ExpandableCard` for long practice entries, review answers, and full 90-day history.
  - `StatusPill` for role, sync state, and attention flags.

## Migration Risks To Avoid

- Do not hide core practice inputs behind closed accordions.
- Do not collapse critical save/check buttons without another visible call to action.
- Do not change storage keys while moving UI blocks.
- Do not change audio/TTS state while compacting Listen or Words.
- Do not change review answer checking while compacting Review.
- Do not change admin data fetching while reorganizing Admin.
- Avoid putting too many nested cards inside `CompactSection`.
- Keep Turkish guidance visible enough for first-time users.

## Implementation Guidance

Start with Settings or Words in UX-3 because they have the clearest density wins. Then move to Speak, Review, and Listen after the compact patterns are proven. Admin should be handled in UX-4 after learner pages establish the visual language.
