# Device-7: Minimal Read-Only Device Lab UI Summary

## Scope

Device-7 adds a mobile-first, read-only UI over the existing static Device Lab
registry in `lib/device-lab/`. It does not create or modify Device Lab facts,
modules, progress, persistence, scoring, audio, cloud, authentication, or admin
behavior.

## Changed Files

- `app/device-lab/page.tsx`
  - Adds the Device Lab landing page and lists all six registered device/catalog
    records.
  - Runs the exported static Device Lab validation assertion in a server/static
    context.
- `app/device-lab/[deviceSlug]/page.tsx`
  - Adds statically generated device detail pages with metadata, evidence limits,
    real module links, and `notFound()` handling.
- `app/device-lab/[deviceSlug]/[moduleId]/page.tsx`
  - Adds statically generated read-only module pages with the complete existing
    module learning and source-control fields.
  - Uses `notFound()` when the device or the module under that device does not
    exist.
- `app/device-lab/_components/device-lab-ui.tsx`
  - Adds local labels, module links, source-reference cards, a compact label key,
    and a collapsed blocked-claim governance section.
- `app/settings/page.tsx`
  - Adds the single conservative Device Lab entry point.
- `docs/DEVICE_7_READ_ONLY_UI_SUMMARY.md`
  - Records Device-7 scope, controls, QA, and handoff.

No Device Lab data file, source extraction, sourcebook, main curriculum file,
bottom navigation file, storage file, Supabase/Auth/Admin file, or TTS file was
changed.

## Routes Added

- `/device-lab`
- `/device-lab/[deviceSlug]`
- `/device-lab/[deviceSlug]/[moduleId]`

`generateStaticParams()` produces six device detail pages and five module pages.
Unknown device slugs and device/module combinations fail closed through
`notFound()`.

## Settings Entry Point

Settings now contains a compact `Professional English / Device Lab` card with
the Turkish description `Kaynak kontrollü cihaz iletişimi pratiği.` and a link
to `/device-lab`.

Device Lab was not added to bottom navigation. `/today` and `/pilot` were not
modified.

## Devices Displayed

The landing page reads all six records directly from `deviceLabDevices`:

1. 8K Latent Fingerprint Detection Tablet
2. Contactless LITE
3. t-ZOOM Plus DNA
4. SuperSpectral Force / SuperSpectral Core
5. Contactless LAB ULTRA
6. High-Tech Forensic Imaging Solutions overview

Every record shows product/category information, release status, source
strength, a safe-training-area summary, and the real module count.

t-ZOOM Plus DNA, SuperSpectral Force/Core, Contactless LAB ULTRA, and the
High-Tech catalog overview remain metadata-only. Their detail pages show a clear
deferred/blocked note and do not create fake module cards or module links.

## Modules Displayed

The UI exposes the five modules that already exist in the Device-6 registry:

- 8K Intro (`8k-intro`, `learner_ready`)
- 8K Customer Demo (`8k-customer-demo`, `draft_controlled`)
- 8K UVC Source Warning (`8k-uvc-source-warning`, `draft_controlled`)
- Contactless LITE Intro (`contactless-lite-intro`, `draft_controlled`)
- Contactless LITE Reflective Surfaces Demo
  (`contactless-lite-reflective-surfaces-demo`, `draft_controlled`)

Controlled drafts are visibly labeled `draft_controlled`; they are not presented
as fully learner-ready content. Module pages are read-only and contain no
textarea, save action, completion action, score, or audio control.

## Claim-Control and Blocked-Claim Handling

The UI includes compact labels for:

- Claim control: `safe`, `cautious`, `blocked`,
  `not_enough_source_data`, and `conflict_follow_up_needed`
- Release: `learner_ready`, `draft_controlled`, `deferred`, and `blocked`

The complete label key is behind progressive disclosure to avoid a badge wall.

Source-backed module claims are rendered separately from blocked claims. Blocked
claims appear only in a subdued, collapsed Turkish governance section named
`Kullanılmaması gereken / kaynak bekleyen iddialar`. That section explicitly
states that the claims are not learning targets. No blocked claim is inserted
into listening, vocabulary, speaking, review, or journal content.

No new claim wording or device fact was added. Existing controls remain intact,
including the blocked direct-AFIS language, unresolved 8K filter-count conflict,
narrow 8K UVC source warning, t-ZOOM DNA-analysis block, SuperSpectral SAFE
boundary, Contactless LITE biological/software/4K/spectral blocks, LAB ULTRA
product separation, and catalog-to-device transfer block.

## Why Progress, Cloud, Admin, and Scoring Were Not Added

Device-7 is a presentation-only prototype. Source readiness and learner progress
are separate concerns, and persistence is reserved for a later independently
authorized phase. Consequently this patch adds no:

- local storage key or progress state
- completion or review tracking
- score, rubric result, or proficiency claim
- Supabase schema, cloud sync, Auth, or Admin behavior
- analytics or admin tracking
- TTS, audio playback, or recording

The existing static `adminCoachingSignalTr` text is displayed because it is a
required module field. The UI clearly says it is not sent to or tracked by the
admin system.

## Sources and Guidance Inspected

- `AGENTS.md`
- `docs/DEVICE_LAB_ARCHITECTURE_PLAN.md`
- `docs/DEVICE_6_STATIC_DATA_MODEL_SUMMARY.md`
- `docs/DEVICE_SOURCE_INDEX.md`
- `docs/ARGOS_SPEAK_90_STRATEGIC_AUDIT_TR.md`
- Runtime exports and validation under `lib/device-lab/`
- Existing Settings, app-shell, navigation, global styles, and shared UI
  components

Source extraction files and sourcebooks were intentionally not edited. The UI
renders the already-reviewed Device-6 data rather than reinterpreting raw source
presentations.

## Validation and Build Results

- Device Lab validation assertion: **passed** during route import/build.
- `npm run lint`: **passed**.
- `npm run build`: **passed** with Next.js 16.2.4.
  - The sandboxed first attempt could not download the existing Geist Google
    Fonts. Re-running with network permission completed compilation, TypeScript,
    page-data collection, and all 28 static pages successfully.
  - Build output confirmed six statically generated device pages and five
    statically generated module pages.
- Browser QA: **passed** at 320, 375, and 768 px.
  - No main-content horizontal overflow.
  - The shared bottom navigation retains its existing intentional internal
    horizontal scroller.
  - No Next.js error overlay or local-page console error.
  - No Device Lab textarea or button.
  - Six device links rendered on the landing page.
  - The t-ZOOM metadata-only page rendered zero module-page links.
  - The 8K UVC module kept blocked claims collapsed and source references visible.
  - The Settings entry rendered and linked to `/device-lab`.
- `git diff --check`: **passed** after the final documentation update.

## Mobile QA Notes

The routes reuse the app's existing constrained shell and use stacked cards on
small screens. Long evidence/status labels can wrap, source paths use word
breaking, and module content switches to two-column layouts only at `sm` widths.
The landing list avoids tables, and dense claim-control material is placed behind
native `details` progressive disclosure.

At 320 px the landing page title, validation status, and first device card were
readable without main-content overflow. At 375 px the metadata-only and module
views remained single-column, and at 768 px the Settings entry and Device Lab
landing page remained within the shared content width.

## Learner-Facing Risk Assessment

Risk is controlled but not zero because four of the five visible modules retain
the explicit `draft_controlled` status. The UI mitigates this by keeping release
labels visible, presenting source/claim limits alongside content, separating and
collapsing blocked governance data, and creating no lesson content for deferred
devices. Human content review is still appropriate before treating controlled
drafts as a public learner release.

## Recommended Next Phase

Perform a human Device-7 content and accessibility review, especially of the four
`draft_controlled` modules and blocked-claim disclosure wording. If approved,
start Device-8 in a new phase/chat to design local-only Device Lab completion and
review state in a separate namespace. Do not begin Device-9 cloud/admin tracking
until the local model and privacy scope have been separately approved.
