# Device Lab Expanded Release Summary (P12)

## Scope

This phase grows the published Device Lab beyond the single 8K Intro module by:

1. Promoting existing, already source-controlled `draft_controlled` modules and
   claims to `learner_ready` after a claim-control review, and
2. Adding two new devices — t-ZOOM Plus DNA and SuperSpectral Force/Core — with
   one new `learner_ready` module each, built only from
   `docs/sources/forenscope/*` extractions already indexed in
   `docs/DEVICE_SOURCE_INDEX.md` and recommended in
   `docs/DEVICE_LAB_ARCHITECTURE_PLAN.md` (Section 11, "First Device Lab Release
   Scope").

No source extraction, sourcebook, or the architecture/source-index documents
were edited. No Auth/Admin/cloud code was touched. No day/curriculum content or
day IDs changed. No AI scoring, pronunciation grading, or new safety instruction
was added.

## Before / After

| | Before this phase | After this phase |
| --- | --- | --- |
| Learner-visible devices | 1 (8K only) | 4 (8K, Contactless LITE, t-ZOOM Plus DNA, SuperSpectral Force/Core) |
| Learner-visible (`learner_ready`) modules | 1 (`8k-intro`) | 7 |
| Static device pages generated | 1 | 4 |
| Static module pages generated | 1 | 7 |

## Changed Files

- `lib/device-lab/8k.ts`
  - Promoted `eightKSoftwareFeaturesClaim`, `eightKUvcWarningClaim`, and
    `eightKSafetyCoverageLimitClaim` from `draft_controlled` to `learner_ready`.
  - Promoted the `8k-customer-demo` and `8k-uvc-source-warning` modules from
    `draft_controlled` to `learner_ready`.
- `lib/device-lab/contactless-lite.ts`
  - Promoted all five Contactless LITE Intro claims and the one Reflective
    Surfaces Demo claim from `draft_controlled` to `learner_ready`.
  - Promoted the `contactless-lite-intro` and
    `contactless-lite-reflective-surfaces-demo` modules to `learner_ready`.
- `lib/device-lab/tzoom-plus-dna.ts` (new)
  - Defines the `tzoom-plus-dna-intro` module (`learner_ready`) with five
    source-backed claims (identity, seven components, two ring-light systems,
    seven named filters, Android software/connectivity vocabulary) and five
    vocabulary items, all sourced from
    `docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md`.
  - Defines four new device-specific blocked claims (bare-"t-ZOOM" slide
    attribution, unclear zoom/AUTO-Search/Smart-Button functions, company-level
    contactless wording, and deferred application-demo content).
- `lib/device-lab/superspectral-force-core.ts` (new)
  - Defines the `superspectral-force-core-comparison` module (`learner_ready`)
    with eight source-backed claims comparing Force and Core (identity/SKUs,
    sensor, spectral range, display/storage, imaging features, filter counts,
    light-system names, and Force-only optional lenses) and five vocabulary
    items, all sourced from
    `docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md`.
  - Defines four new device-specific blocked claims (ambiguous application
    slides 17-29, Core optional-lens compatibility, undocumented Case
    Management System/Illuminated Darkroom, and unverified battery-runtime
    conditions).
- `lib/device-lab/devices.ts`
  - Wires `tzoomPlusDnaModules` and `superspectralForceCoreModules` into the
    registry (previously both were `modules: []`).
  - Updates device-level `releaseStatus` for `8k` and `contactless-lite` to
    `learner_ready` (all their modules are now ready) and for `tzoom-plus-dna`
    and `superspectral-force-core` to `draft_controlled` (one ready module each;
    other recommended module areas remain deferred).
  - Adds the new device-specific blocked claims to each device's
    `blockedClaims` list for governance visibility.
- `lib/device-lab/validation.ts`
  - Replaces the Device-6 gate that allowed learner modules only for `8k` and
    `contactless-lite` with an explicit allow-list
    (`devicesAllowedLearnerModules`) that now also includes `tzoom-plus-dna`
    and `superspectral-force-core`. `contactless-lab-ultra` and
    `high-tech-catalog` remain outside the allow-list, so any future attempt to
    add modules to them without updating this gate fails the import-time
    assertion.
- `lib/device-lab/index.ts`
  - Re-exports the two new module files.
- `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`
  - Adds the P12 phase entry (status `Tamamlandı`, no further phase left as
    `Sıradaki`).
- `docs/DEVICE_LAB_EXPANDED_RELEASE_SUMMARY.md` (this file).

No `app/` route or component file needed to change: the existing Device-7
landing/device/module pages and the Device-8 local practice panel already read
generically from `getLearnerReadyDeviceLabDevice`,
`learnerReadyDeviceLabDevices`, `getDeviceLabQuickFacts`, and
`getDeviceLabPractice`, so the newly promoted/added `learner_ready` content
became visible automatically once the data model changed.

## Why These Modules, and Not Others

`docs/DEVICE_LAB_ARCHITECTURE_PLAN.md` Section 11 already named seven modules
as the intended first release, all "ready with controls": 8K Intro, 8K Customer
Demo, 8K UVC Safety, Contactless LITE Intro, Contactless LITE Reflective
Surfaces Demo, t-ZOOM Plus DNA Intro, and SuperSpectral Force/Core Comparison.
Device-6 only wired 8K and Contactless LITE into the data model and marked four
of those five modules `draft_controlled` pending "human content review" (per
`docs/DEVICE_6_STATIC_DATA_MODEL_SUMMARY.md` and
`docs/DEVICE_7_READ_ONLY_UI_SUMMARY.md`). This phase performs that review and
completes the originally recommended seven-module first release exactly as
scoped, using only the extractions the review process had already indexed —
no new source material was introduced or interpreted.

### Review findings for the four promoted modules

- **8K Customer Demo** (`eightKSoftwareFeaturesClaim`): source-stated capability
  with a complete source reference, required attribution flag set, and a
  recorded missing-evidence note (software manual). No blocked phrase, no
  performance/AFIS/certification claim. Promoted.
- **8K UVC Source Warning** (`eightKUvcWarningClaim`,
  `eightKSafetyCoverageLimitClaim`): the exact two-part source warning plus its
  explicit "not a complete safety course" limit are both present, matching the
  architecture's `source_warning_only` narrow-safety allowance. Promoted.
- **Contactless LITE Intro** (5 claims): identity, non-contact framing, camera
  spec, LED groups, and the source-stated (not guaranteed) 20cm-5m range all
  carry complete source references and correct attribution/cautious framing.
  No 4K, wavelength-band, or biological-use claim leaked in. Promoted.
- **Contactless LITE Reflective Surfaces Demo**
  (`contactlessLiteSurfaceDemonstrationsClaim`): explicitly flagged
  `demonstrationOnly: true`, framed as presentation examples, not validated
  performance. Promoted.

### Why t-ZOOM Plus DNA Intro and SuperSpectral Force/Core Comparison, and not more

Both extractions (`TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md`,
`SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md`) contain clean,
consistently printed specifications for identity, components/SKUs,
light/filter systems, and (for t-ZOOM) software/connectivity vocabulary — the
same category of content already released for 8K and Contactless LITE. Per the
task's "prefer 1-3 solid modules over inventing breadth" instruction, this
phase stops at one module per device rather than also building the
recommended-but-lower-evidence application-demo, troubleshooting, or reporting
modules for these two devices in the same pass.

Explicitly **not** added, and why:

- **t-ZOOM Plus DNA application-demo module** (GSR/semen/blood/dead-skin/
  epithelial-cell/sweat visualization slides): each example is a single
  illustrative slide with no stated methodology or sample size, two of the
  eight examples (slides 17, 22) carry the unresolved bare-"t-ZOOM" attribution
  conflict, and the topic sits adjacent to the blocked
  DNA-extraction/analysis claim. Deferred; recorded as
  `tzoomApplicationDemoBlockedClaim`.
- **Contactless LAB ULTRA**: `docs/DEVICE_LAB_ARCHITECTURE_PLAN.md` Section 11
  already describes it as "not part of the first seven-module release" pending
  its own later components-only module; this phase does not add it. Its
  registry entry stays `deferred` with `modules: []`.
- **High-Tech catalog overview**: architecture Section 4 states this is
  "internal cross-reference" only, never a learner-facing device. Stays
  `blocked` with `modules: []`.

## Claim-Control and Blocked-Claim Coverage

Every new claim carries a complete `sourceReferences` entry (file, section,
slide/page, note), an explicit `evidenceLevel`, `claimControlLevel`, and
`releaseStatus`, and `learnerFacingTextAllowed: true` only when the content is
released. The following source-documented gaps were deliberately excluded from
learner-facing text and recorded only as governance `BlockedClaim` entries
(never rendered as lesson facts, never included in TTS text):

- t-ZOOM Plus DNA: bare-"t-ZOOM" slide 17/22 attribution, the "6 meters to 600
  microns" zoom figure, undefined AUTO Search/Smart Button behavior,
  company-level (not device-specific) contactless/no-chemical wording, and all
  application-demo content.
- SuperSpectral Force/Core: ambiguous application slides 17-29, unconfirmed
  Core compatibility with Force's optional lenses, undocumented Case Management
  System/Illuminated Darkroom behavior, and unverified battery-runtime
  conditions. SuperSpectral SAFE (a separate product, slides 30-40) stays out
  of scope via the existing `superspectralSafeTransferBlockedClaim`.
- Shared/global blocks reused unchanged: world-first/marketing superlatives,
  unnamed accreditation, direct/automatic/certified AFIS integration,
  performance/accuracy/admissibility guarantees, and any safety instruction
  beyond the existing narrow 8K UVC warning.

A forbidden-learner-facing-phrase scan
(`forbiddenLearnerFacingPhrases` in `lib/device-lab/shared-claim-control.ts`,
plus a manual `grep` sweep) confirmed no learner-facing field in the new or
promoted files contains "world's first," "DNA analysis," "DNA extraction,"
"accredited," "up to 3 meters," "direct AFIS integration," or the other listed
forbidden strings. The only literal occurrences of those strings anywhere in
`lib/device-lab/` remain inside `shared-claim-control.ts`'s own blocked-claim
registry and forbidden-phrase list, which are governance data, not
learner-facing text (`collectLearnerFacingText` in `lib/device-lab/validation.ts`
never reads `BlockedClaim.text`/`reason` or the forbidden-phrase list itself).

## Validation Results

- `assertDeviceLabDataValid(deviceLabDevices)` (imported at module-load time by
  `lib/device-lab/devices.ts`, and therefore executed during
  `next build`): **0 issues**, `valid: true`. Verified directly via a
  throwaway `tsx` script importing `lib/device-lab/devices.ts` in addition to
  the successful production build.
- `npx tsc --noEmit`: **passed**, no errors.
- `npm run lint` (ESLint via `eslint`): **passed**, 0 warnings/errors.
- `npm run build` (Next.js 16.2.4, Turbopack): **passed**.
  - Generated 4 static device pages: `/device-lab/8k`,
    `/device-lab/contactless-lite`, `/device-lab/tzoom-plus-dna`,
    `/device-lab/superspectral-force-core`.
  - Generated 7 static module pages, including the 3 existing 8K modules, the
    2 existing Contactless LITE modules, and the 2 new modules
    (`tzoom-plus-dna-intro`, `superspectral-force-core-comparison`).
- `git diff --check`: **passed** (no whitespace errors).

## Manual/Agent Browser QA (production `next start`, port 3100)

- All of `/device-lab`, `/device-lab/8k`, `/device-lab/contactless-lite`,
  `/device-lab/tzoom-plus-dna`, `/device-lab/superspectral-force-core`, all 7
  module routes, `/settings`, and `/today` returned HTTP 200.
  `/device-lab/contactless-lab-ultra` correctly returns 404 (no learner
  modules exist for it; `dynamicParams = false`).
- The Device Lab landing page lists all four devices as cards.
- The `t-ZOOM Plus DNA Intro` and `SuperSpectral Force/Core Comparison` module
  pages render the full existing template (page header/intro, Quick facts,
  Key words, Listen with listening text, Say it with a speaking prompt,
  collapsed "Türkçe yardım" and "Kaynak notları" sections) at both 320px and
  375px viewports with no horizontal overflow.
- No audio auto-played on page load on any route (the TTS provider is not
  configured in this sandbox, so the UI correctly shows its existing
  "Ses servisi şu anda kullanılamıyor" unavailable state rather than failing
  silently or auto-playing — consistent with the existing P6/P7 error-handling
  contract).
- The collapsed blocked-claim/source-reference sections stayed closed by
  default; no blocked claim text appeared in the initial page render.
- The existing 8K flow (all three modules, now all `learner_ready`) and the
  Contactless LITE flow (both modules) loaded without regression.

## Local Practice / Storage Impact

No change to `lib/device-lab/local-practice.ts` or its storage key
(`argos-device-lab-practice-v1`). The new and promoted modules are addressed
generically by `${deviceSlug}:${moduleId}`, so the existing Device-8 local
practice panel (first/second try, review, journal, autosave, per-module reset)
works for them without any code change. No cloud, admin, or scoring behavior
was added.

## Known Risks and Deferred Work

- t-ZOOM Plus DNA and SuperSpectral Force/Core each currently expose only their
  Intro/Comparison module; their `recommendedModules` metadata still lists
  further module kinds (e.g. `light_filter`, `customer_demo`) that remain
  unbuilt and should go through the same claim-control review before release.
- Contactless LAB ULTRA remains fully deferred pending its own later
  components-only module, per the existing architecture recommendation.
- The High-Tech catalog overview remains internal-only and out of the learner
  surface, per the existing architecture decision.
- The 8K seven-versus-eight-filter conflict and the direct-AFIS-integration
  block remain unresolved and unchanged; no new evidence was introduced that
  would justify revisiting them.

## Final Verdict

Device Lab now exposes four learner-visible devices (8K, Contactless LITE,
t-ZOOM Plus DNA, SuperSpectral Force/Core) and seven `learner_ready` modules,
completing the originally recommended seven-module first release scope from
`docs/DEVICE_LAB_ARCHITECTURE_PLAN.md` Section 11. All new and promoted content
is traceable to existing `docs/sources/forenscope/*` extractions with complete
source references, explicit evidence/claim-control/release-state metadata, and
no forbidden or blocked phrase in learner-facing text. Contactless LAB ULTRA
and the High-Tech catalog overview remain deferred/blocked exactly as the
architecture plan already specified.
