# Device-6: Static Device Lab Data Model Summary

## Scope

Created a minimal, typed, static Device Lab data layer under `lib/device-lab/`. The model is deny-by-default: learner content is separated from blocked claims, every learner claim and vocabulary item carries source references, and release status is evaluated independently from device metadata.

This phase does not create UI, routes, Device Lab progress, local storage, Supabase tables, authentication behavior, admin tracking, analytics, or changes to the main 90-day curriculum.

## Changed Files

- `lib/device-lab/types.ts`
  - Defines device, evidence, claim-control, release, module, source, prompt, vocabulary, claim, blocked-claim, module, and device registry contracts.
- `lib/device-lab/shared-claim-control.ts`
  - Defines reusable blocked claims and the forbidden learner-facing phrase register.
- `lib/device-lab/8k.ts`
  - Defines controlled 8K claims, vocabulary, and three initial modules.
- `lib/device-lab/contactless-lite.ts`
  - Defines controlled Contactless LITE claims, vocabulary, device-specific blocked claims, and two initial modules.
- `lib/device-lab/validation.ts`
  - Defines exported validation and assertion helpers.
- `lib/device-lab/devices.ts`
  - Defines the six-device registry, lookup helpers, learner-ready filtering, and import-time validation assertion.
- `lib/device-lab/index.ts`
  - Exposes the public Device Lab model, data, and utilities.
- `docs/DEVICE_6_STATIC_DATA_MODEL_SUMMARY.md`
  - Records the phase scope, controls, validation, and handoff.

No existing source, sourcebook, curriculum, UI, route, storage, sync, auth, or admin file was edited.

## Data Model Overview

The core model contains:

- `DeviceSlug` for six explicitly registered device/catalog scopes.
- `EvidenceLevel` separating verified technical facts, source-stated capabilities, marketing, unclear, catalog/company, and out-of-scope statements.
- `ClaimControlLevel` separating safe, cautious, blocked, under-sourced, and conflict states.
- `ReleaseStatus` separating learner-ready, controlled draft, blocked, and deferred content.
- `ProductScope` as a discriminated union for device, family, company/category, catalog, and unresolved ownership.
- `SafetyRelevance` separating descriptive content, the narrow source warning, and missing-safety-source blocks.
- `SourceReference`, `DeviceLabClaim`, `BlockedClaim`, `DeviceLabVocabularyItem`, `DeviceLabPrompt`, `DeviceLabModule`, and `DeviceLabDevice` contracts.

Each `DeviceLabClaim` requires:

- Stable ID and controlled text
- Product scope
- Evidence level
- Claim-control level
- Release status
- At least one source reference
- Attribution decision
- Explicit learner-facing permission
- Demonstration flag
- Safety relevance
- Optional block/missing-evidence details

Each module keeps `sourceBackedClaims` and `blockedClaims` in separate collections. Blocked claims are governance data; they are not learner lesson facts.

## Modules Created

| Device | Module | Kind | Release status | Main control |
|---|---|---|---|---|
| 8K | 8K Intro | `intro` | `learner_ready` | Camera and spectrum stay source-scoped; contactless and powder/chemical-free workflow retain manufacturer attribution |
| 8K | 8K Customer Demo | `customer_demo` | `draft_controlled` | Short, non-brochure explanation; no performance, certification, range, or integration claim |
| 8K | 8K UVC Source Warning | `safety` | `draft_controlled` | Exact two-part source warning plus explicit incomplete-safety-coverage limit |
| Contactless LITE | Contactless LITE Intro | `intro` | `draft_controlled` | 32.5MP CMOS/RAW, four LED groups, non-contact wording, and attributed 20cm–5m source range |
| Contactless LITE | Contactless LITE Reflective Surfaces Demo | `customer_demo` | `draft_controlled` | Sixteen named device-labeled presentation examples; no validation or success implication |

The unlabeled phone-case image is deliberately excluded from the first demo text. Its surface identification remains a visual inference and would require an explicit caveat if used later.

## Claims Deliberately Blocked

The shared claim-control registry preserves these blocks:

- World-first, first-and-only, or equivalent positioning
- Strongest, unique, best, ultimate, or equivalent comparative marketing
- Accreditation/certification without a named authority, certificate, device scope, and validity
- Direct, automatic, API-based, or certified AFIS integration without documentation
- Performance, accuracy, sensitivity, specificity, success-rate, or admissibility guarantees
- Safety instructions absent from the device source
- DNA extraction, profiling, or analysis by t-ZOOM Plus DNA
- Contactless LITE body-fluid, blood, GSR, or Touch-DNA uses
- SuperSpectral SAFE content assigned to Force/Core
- Catalog/company claims assigned to devices without device-specific support

Contactless LITE also has device-specific blocks for:

- Software, reporting, AFIS, cloud, archive, and AI features absent from its device presentation
- Overview-only 4K video wording
- A specific multispectral wavelength range not supplied by the device source

Blocked claim objects include affected devices, the reason for the block, and evidence required to reconsider it.

## Devices Registered as Metadata Only

The following registry entries have no learner modules in Device-6:

- t-ZOOM Plus DNA — `deferred`
- SuperSpectral Force/Core — `deferred`
- Contactless LAB ULTRA — `deferred`
- High-Tech catalog overview — `blocked` and internal-only

Their entries retain safe training areas, cautious areas, blocked claims, missing documents, and recommended future module kinds. No t-ZOOM or SuperSpectral learner content file was created.

## Registry Utilities

`lib/device-lab/devices.ts` exports:

- `deviceLabDevices`
- `getDeviceLabDevice(slug)`
- `getDeviceLabModules(slug)`
- `getLearnerReadyDeviceLabModules(slug)`
- `deviceLabValidationResult`

`getLearnerReadyDeviceLabModules` filters by module release status. In this phase, the filter exposes the 8K Intro only; controlled drafts remain unavailable to a future learner UI until separately approved.

## Validation Approach

`validateDeviceLabDevices()` and `assertDeviceLabDataValid()` verify:

- The six required registry devices are present and device slugs are unique.
- Module IDs are unique and modules belong to their registry device.
- Only 8K and Contactless LITE contain modules in Device-6.
- Every module has at least one complete source reference and claim-control notes.
- Every source-backed claim has complete source references and matching device ownership.
- Learner-ready/draft-controlled modules do not place blocked, deferred, under-sourced, or conflicted claims in `sourceBackedClaims`.
- Claims explicitly disallowed for learner-facing text cannot enter releasable modules.
- Blocked claims remain separate and include the module's owning device.
- Every vocabulary item has complete source references.
- Every speaking prompt has claim-control notes and forbidden-claim IDs.
- Learner-facing module text does not contain the configured forbidden phrases.

`devices.ts` calls the assertion when the static registry is imported, so invalid data fails closed instead of silently becoming available.

Because the current environment does not provide Node.js/npm or another JavaScript runtime, the TypeScript validation helper could not be executed here. A separate static scan confirmed that forbidden phrases occur only in internal blocked-claim/validation definitions, not in `8k.ts` or `contactless-lite.ts` learner module data. Full type/lint/build execution remains required in an npm-capable environment.

Phase-completion verification results:

- Static Device Lab data check: **passed**.
  - Five module IDs are present exactly once.
  - Six device/catalog slugs are present exactly once.
  - Four devices are metadata-only.
  - One module is learner-ready; four remain controlled drafts.
  - No empty `sourceReferences` array was found.
  - No configured forbidden phrase was found in the two learner-module files.
- New-file whitespace check: **passed**.
- `git diff --check`: **passed**.
- `npm run lint`: **not run** because npm is unavailable.
- `npm run build`: **not run** because npm is unavailable.
- Runtime execution of `assertDeviceLabDataValid`: **not run** because no JavaScript runtime is available.

## What Was Not Implemented

- `/device-lab` or any other route
- UI components, navigation, cards, or visual design
- Device Lab local progress or storage keys
- Cloud sync, Supabase schema, admin tracking, or analytics
- Module completion, scoring, badges, or assessments
- t-ZOOM, SuperSpectral, Contactless LAB ULTRA, or catalog learner modules
- AFIS preparation module
- Light/filter operating instructions or automatic recommendations
- Full UVC or other device safety training
- Source extraction or sourcebook edits
- Main 90-day curriculum changes

## Remaining Source Limits

- 8K seven-filter versus overview eight-filter conflict remains unresolved and is not used in the first modules.
- Direct AFIS integration remains undocumented.
- The 8K UVC module is a narrow source warning, not a safety course.
- Contactless LITE safety, software, reporting, AFIS, wavelength bands, and device-specific 4K evidence remain absent.
- Presentation surface examples are demonstrations, not independent validation.
- Operator manuals, technical datasheets, safety documents, SOPs, validation data, and named certification records remain priority sources.

## Next Recommended Phase

Before Device-7, run TypeScript, lint, build, and the exported Device Lab validation helper in an npm-capable environment and perform a human content review of the five modules.

If those checks pass, proceed to Device-7 as a minimal UI prototype that:

- Reads only from the public `lib/device-lab` exports
- Shows only `learner_ready` modules by default
- Keeps controlled drafts behind an explicit development/review boundary
- Displays source/claim limits without exposing internal blocked-claim prose as lesson facts
- Adds no progress, cloud, admin, or scoring behavior

## Final Readiness Verdict

Device-6 establishes the requested minimal source-controlled data layer. It contains five modules across 8K and Contactless LITE, registers all six device/catalog scopes, and keeps blocked, deferred, and metadata-only content separate from learner-ready claims.

The model is ready for npm-capable type/lint/build validation and human claim-control review. Device-7 should not begin until those checks pass; when it begins, it should remain a read-only prototype over the existing static registry.
