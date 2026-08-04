# Device-8: Local-Only Device Lab Practice Summary

## Scope

Device-8 adds a small browser-local practice panel to the five existing Device
Lab module detail pages. Static module content remains server-rendered and
source-controlled; only the practice panel is a Client Component.

This phase does not add cloud progress, Supabase, Auth, Admin tracking, scoring,
AI evaluation, pronunciation evaluation, audio/TTS, new modules, new device
facts, or changes to the main 90-day curriculum.

## Changed Files

- `lib/device-lab/local-practice.ts`
  - Defines the isolated Device Lab localStorage schema and safe read, write,
    and per-module reset helpers.
- `app/device-lab/_components/device-lab-practice-panel.tsx`
  - Adds the Turkish, mobile-first local practice UI and autosave behavior.
- `app/device-lab/[deviceSlug]/[moduleId]/page.tsx`
  - Keeps the page as a Server Component and mounts the practice panel below
    the existing learning, claim-control, blocked-claim, and source content.
- `docs/DEVICE_8_LOCAL_PRACTICE_SUMMARY.md`
  - Records Device-8 scope, storage, QA, and handoff.

No Device Lab static-data file, source extraction, sourcebook, Settings entry,
bottom-navigation file, `/today` file, main curriculum file, Supabase/Auth/Admin
file, or TTS file was changed.

## localStorage Key and Schema

Device Lab practice uses the namespaced key:

```text
argos-device-lab-practice-v1
```

The root value is a versioned object with a `modules` record. Each record is
stored under the stable key `${deviceSlug}:${moduleId}` and contains:

```text
deviceSlug
moduleId
reviewedAt?       ISO string
firstTryAnswer
secondTryAnswer
reviewAnswer
journalNote
completedAt?      ISO string
updatedAt         ISO string
```

Reads validate strings and timestamps defensively. Missing, malformed,
disabled, quota-limited, or otherwise unavailable localStorage falls back
safely. A failed write is reported in the panel and does not create an API
fallback. Reset deletes only the active `${deviceSlug}:${moduleId}` entry and
preserves other module records.

This key is separate from the main curriculum storage keys and is not added to
the main progress export/import or cloud-sync paths.

## Module Practice Behavior

Every real module detail page now provides:

- A reviewed marker for the existing reading/listening text
- First-try, second-try, review, and journal textareas
- Autosave on each text change
- A local completion marker
- A two-step inline reset for only the current module
- `Kaydedildi` / `Yerel kayıt güncellendi` feedback
- The explicit notice: `Bu kayıt sadece bu tarayıcıda tutulur. Cloud/admin
  senkronu yoktur.`

The controls do not judge answers, expose correct/incorrect states, calculate a
score, unlock content, or imply language or forensic proficiency.

## Routes and Components

- `/device-lab` remains the existing Device-7 landing page.
- `/device-lab/[deviceSlug]` remains the existing device metadata/module page.
- `/device-lab/[deviceSlug]/[moduleId]` gains the local practice panel beneath
  the read-only source-controlled content.
- Deferred/metadata-only devices still have no generated or placeholder module
  pages.

The optional device-page local status badges were deferred. Adding them would
require a second client-side status surface and cross-tab refresh behavior;
Device-8 keeps the persistence boundary concentrated in the module panel.

## Explicitly Not Saved or Synced

Device-8 does not save or send:

- Blocked claims, source references, or static module content
- Scores, correctness, rubrics, evaluations, or pronunciation data
- Audio, recordings, or TTS output
- Supabase, cloud-sync, Auth, Admin, or analytics records
- Main curriculum progress

Code scans confirmed that the new Device Lab files contain no `fetch`, API, or
Supabase integration.

## Claim Control

Claim control is unchanged. The panel receives only the existing module title
and existing first-try, second-try, review, and journal instructions. It adds no
answer example, model answer, device fact, blocked-claim prompt, or generated
content. Device-7 source-backed claims, cautious labels, blocked-claim
governance, and source-reference displays remain intact above the panel.

## Mobile UX

The panel uses the existing compact card system, stacked controls by default,
full-width touch targets on small screens, resizable textareas, concise status
cards, and an inline reset confirmation. Fields stay disabled only during the
initial localStorage read so a fast input cannot overwrite a restored value.

## Validation and QA Results

- `npm run lint`: **passed** after the final UI change.
- `npm run build`: **passed** with Next.js 16.2.4.
  - The first sandboxed build attempt could not download the repository's
    existing Geist fonts. The permitted network retry compiled successfully,
    completed TypeScript, and generated all 28 pages, including six device
    pages and five existing module pages.
- `git diff --check`: **passed** after the code changes.
- Browser QA on `/device-lab/8k/8k-intro`:
  - All four textareas accepted local test values.
  - Reviewed and local-completion markers updated without scoring language.
  - A fresh page/tab restored all four answers and both status markers.
  - The native reset confirmation was replaced with an inline two-step control
    after the browser test exposed brittle dialog behavior.
- Local route QA:
  - `/device-lab` returned HTTP 200.
  - `/device-lab/tzoom-plus-dna` returned HTTP 200 and contained no generated
    module-detail link.
- Static integration scans:
  - No new network/API/Supabase reference was added.
  - Device Lab remains absent from bottom navigation and `/today`.
  - The existing Settings entry is the only global Device Lab entry.

The final automated Chrome pass for the inline reset interaction was interrupted
by repeated browser-extension timeouts. The reset path is covered by the same
lint, TypeScript, production-build, and direct code-path checks, but a human
click-through of the two inline reset buttons remains the one recommended
pre-merge spot check.

## Learner-Facing Risk Assessment

Risk is low and local to the current browser profile. The main residual product
risk is user expectation: clearing browser storage, changing browser/profile,
or using another device loses this practice data. The panel states that limit
prominently and does not imply cloud or admin visibility.

No learner-facing device claim changed, and no blocked or deferred claim became
a practice target.

## Recommended Next Phase

Before any Device-9 cloud/admin work, perform the single reset click-through
noted above and review Device-8 with real local usage. If Device-9 is later
authorized, design cloud/admin visibility as a separate phase with explicit
schema, privacy, claim-readiness, and coaching boundaries; do not implicitly
sync this browser-local key.
