# Device-5D: Device Lab Architecture Plan

## Purpose and Phase Boundary

This document defines the information architecture, module boundaries, evidence controls, safety gates, and future navigation model for a source-aware ForenScope Device Lab.

It is an architecture plan only. It does not create routes, components, data files, curriculum lessons, assessments, progress tracking, or cloud behavior.

This plan is based only on:

- `docs/DEVICE_SOURCE_INDEX.md`
- `docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/CONTACTLESS_LAB_ULTRA_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/HIGH_TECH_FORENSIC_IMAGING_SOLUTIONS_PRESENTATION_EXTRACTION.md`

The source presentations are product and marketing materials. They are not operator manuals, complete safety guides, SOPs, validation reports, or certification records. Device Lab must preserve that limitation at every layer.

## 1. Architecture Outcome

Device Lab should be a small, static, local-first learning area organized around source-owned device modules. Its architecture must make five things explicit before any module can be released:

1. Which device, SKU, family, or company-level source owns each statement.
2. What evidence level supports each statement.
3. Whether the statement is descriptive, operational, safety-sensitive, or blocked.
4. Which source location supports it and which missing documents limit it.
5. Whether the module is ready, controlled, deferred, or blocked.

The architecture must not normalize the current presentations into a uniform all-device curriculum. Source depth differs by device, so module availability must differ as well.

## 2. Non-Goals

Device-5D does not authorize:

- A `/device-lab` route or any other application route
- React components, UI changes, or navigation changes
- Curriculum integration or changes to the existing learning flow
- Static Device Lab data files or TypeScript schemas
- Supabase, authentication, admin, analytics, or cloud sync changes
- Local progress, scoring, leaderboards, badges, or completion logic
- Pronunciation scoring tied to technical correctness
- Full safety training or operator certification
- Performance, accuracy, success-rate, admissibility, or proficiency claims
- Direct, automatic, API-based, or certified AFIS integration claims
- Automatic device or light/filter recommendations
- Automatic claim generation or AI-authored device facts
- An all-device final examination
- Editing or replacing any source extraction or sourcebook

## 3. Governing Architecture Principles

### 3.1 Source ownership is mandatory

Every learner-facing claim must belong to exactly one declared scope:

- A specific device
- A specific SKU
- A named device family
- A company/category-level statement
- A catalog-only statement
- An unresolved attribution

Company, category, catalog, family, and unresolved statements must never be silently promoted to device facts.

### 3.2 Claims are smaller than modules

A module can contain claims with different evidence levels. Readiness cannot be assigned from the module title alone. Each factual or capability statement must retain its own evidence classification and source reference.

### 3.3 Missing evidence is not a negative fact

If a source does not document software, safety, AFIS, reporting, wavelengths, compatibility, or another feature, Device Lab must represent that condition as `not documented`, not as `not supported` or `not available`.

### 3.4 Demonstrations are examples, not validation

Presentation photos and videos may support carefully framed demonstration language. They do not establish sensitivity, accuracy, repeatability, universal surface compatibility, forensic admissibility, or recommended operating settings.

### 3.5 Safety is deny-by-default

No safety instruction can be released unless the indexed source explicitly supports the exact warning or instruction. The only currently source-supported safety content is the narrow 8K UVC warning and supplied-darkroom instruction. This is not complete UVC safety training.

### 3.6 Shared structure does not mean shared claims

Devices may use the same module template, such as an intro or customer Q&A, but their claims, examples, limits, and source references remain device-specific. Copying content across devices is prohibited unless each target device has independent support.

### 3.7 Release scope follows evidence readiness

The first release should expose only approved modules. Deferred and blocked modules may exist in the future data model for governance, but they must not appear as usable learner lessons.

### 3.8 Source records remain immutable inputs

Extraction files and the source index are reference inputs. Future Device Lab content may point to them but must not rewrite, resolve, or overwrite them.

## 4. Conceptual Information Architecture

The future Device Lab hierarchy should be:

```text
Device Lab
├── 8K
│   └── approved 8K modules
├── t-ZOOM Plus DNA
│   └── approved t-ZOOM Plus DNA modules
├── SuperSpectral family
│   ├── Force identity and Force-owned specifications
│   ├── Core identity and Core-owned specifications
│   └── Force/Core comparison modules
├── Contactless LITE
│   └── approved Contactless LITE modules
└── Contactless LAB ULTRA
    └── approved LAB ULTRA modules when released
```

The High-Tech catalog overview is not a learner-facing device. It should remain an internal cross-reference for inventory, naming, attribution boundaries, and conflict review.

### 4.1 Future navigation model

The conceptual navigation flow is:

```text
Device Lab home → device or family page → approved module → source/limits note
```

This flow describes future information relationships, not current route implementation.

If routes are authorized in a later phase, the architecture should support these conceptual destinations:

- Device Lab home
- One page per device or device family
- One page per released module
- A compact source-and-limit view associated with each module

Route names, URL slugs, tabs, cards, and visual treatment belong to a later UI phase.

### 4.2 Device and family boundaries

| Architecture node | Ownership rule |
| --- | --- |
| 8K | Use only 8K-device-supported claims; keep the seven-versus-eight-filter conflict unresolved |
| t-ZOOM Plus DNA | Exclude bare `t-ZOOM` slides 17 and 22 until product attribution is confirmed |
| SuperSpectral family | Preserve Force and Core as separate SKUs; allow family-level demonstrations only when Force/Core ownership is unresolved |
| SuperSpectral Force | Use Force-owned specifications and Force-attributed accessories only |
| SuperSpectral Core | Use Core-owned specifications only; do not inherit Force optional-lens compatibility |
| Contactless LITE | Keep separate from 8K and Contactless LAB ULTRA; do not inherit catalog-wide application claims |
| Contactless LAB ULTRA | Keep separate from Contactless LITE and 8K; optional items must remain explicitly optional |
| High-Tech catalog overview | Internal source-control input only; never a device module |

## 5. Shared Module System

Device Lab should use shared module types so navigation and future rendering remain consistent. The content inside each module remains source-owned.

| Module type | Purpose | Architectural rule |
| --- | --- | --- |
| Intro | Controlled identity, category, and purpose language | Strip superlatives; preserve product name and attribution |
| Customer demo | Short, source-backed product explanation | Describe supported features and examples without performance guarantees |
| Components | Named hardware and included/optional parts | Preserve included versus optional status and device ownership |
| Light and filter | Descriptive light/filter terminology | May explain printed systems; must not become an operating or exposure procedure without manuals and safety sources |
| Spectral vocabulary | UV/VIS/IR or multispectral terminology | Use only printed ranges, bands, labels, or carefully scoped source wording |
| Comparison | Source-supported differences between named SKUs | Compare documented facts only; missing data must display as not documented |
| Demonstrated surfaces/applications | Presentation examples | Label every example as a manufacturer presentation demonstration, not validated performance |
| Workflow language | Source-supported capture/export sequence | Do not fill missing procedural steps by inference |
| Reporting language | Neutral source-supported reporting vocabulary | Keep case-specific settings as placeholders; do not create an SOP |
| Customer Q&A | Claim-controlled answers to common questions | Answers must carry attribution and explicit limits where needed |
| Troubleshooting clarification | Source-backed clarification language | Defer when only inferred filter/light cycling or generic adjustments are available |
| Safety notice | Exact source-backed warning or instruction | Separate gate; currently limited to the 8K UVC warning |
| Demo challenge | Communication task based on supported facts/examples | Must not imply operator proficiency, validated device selection, or correct forensic outcome |

### 5.1 Shared module shell

Every future module should have the same conceptual sections:

1. Module identity and owning device/family
2. Learning purpose
3. Source-backed content blocks
4. Claim and attribution notices where required
5. Safety state
6. Source and slide references
7. Known limits and missing-document dependencies
8. Release status

This is a content architecture contract, not a UI layout specification.

## 6. Device-Specific Module Architecture

### 6.1 8K

The 8K is the strongest source group for software/export language and the only group with an explicit safety warning and AFIS-preparation sequence.

Supported architecture areas:

- Intro
- Customer demo
- Light and filter terminology
- UV/VIS/IR vocabulary
- Narrow UVC safety notice
- Capture, export, archive, stamping, enhancement, and reporting vocabulary
- Manual AFIS preparation language
- Device-labeled demonstrated surfaces
- Claim-controlled customer Q&A

Required controls:

- Preserve the device extraction's seven named filters in its source context; do not resolve the catalog's eight-filter conflict.
- Describe AFIS only as manual preparation/submission language.
- Do not convert the single UVC warning into complete safety training.
- Exclude marketing superlatives, performance guarantees, named accreditation claims, and universal evidence-preservation claims.

### 6.2 t-ZOOM Plus DNA

Supported architecture areas:

- Intro
- Components and changeable lenses
- Two ring-light systems
- Filter and multispectral vocabulary
- Software and connectivity overview
- Device-labeled presentation examples
- Claim-controlled customer Q&A
- Cautious reporting vocabulary

Required controls:

- Do not imply DNA extraction, profiling, testing, or on-device analysis.
- Do not assign bare `t-ZOOM` slides 17 and 22 to t-ZOOM Plus DNA.
- Treat `6 meters to 600 microns`, AUTO Search, and Smart Button behavior as unresolved.
- Keep safety instruction blocked.
- Treat contactless/no-chemical wording as company-level unless separately supported at device level.

### 6.3 SuperSpectral Force/Core

Supported architecture areas:

- Separate Force and Core intros
- Force/Core specification comparison
- Sensor, storage, display, light-system, filter, and spectral-range comparison
- Force-attributed optional-lens terminology with a caution state
- Family-level manufacturer demonstration gallery
- Claim-controlled customer Q&A

Required controls:

- Preserve Force and Core as distinct SKUs.
- Do not assign application slides 17–29 to either SKU when ownership is not stated.
- Do not infer Core compatibility with Force optional lenses.
- Preserve the separate Force light-system descriptions without collapsing their counts or architecture.
- Keep SuperSpectral SAFE content out of scope.
- Keep safety, Case Management System behavior, Illuminated Darkroom behavior, and performance claims blocked or deferred.

### 6.4 Contactless LITE

Supported architecture areas:

- Intro
- Camera and resolution vocabulary
- Four-LED light-system terminology
- Autofocus and source-stated distance language
- Battery, charging, and TF-card vocabulary
- Device-labeled reflective/hard-surface demonstrations
- Claim-controlled customer Q&A

Required controls:

- Do not import 8K or Contactless LAB ULTRA features.
- Do not use the overview-only 4K video claim.
- Do not infer wavelength bands from the word `multispectral`.
- Do not assign company/category body-fluid, blood, GSR, document/art, or Touch-DNA claims to this device.
- Keep software, reporting, AFIS, safety, and operational troubleshooting deferred or blocked.

### 6.5 Contactless LAB ULTRA

Supported architecture areas:

- Intro
- Components and configuration
- In-light and out-light terminology
- Control-panel vocabulary
- Optional accessories
- Device-labeled demonstrated surfaces
- Claim-controlled customer Q&A

Required controls:

- Keep Capture One, laptop, mouse, and keyboard explicitly optional.
- Treat `UV365` as printed source wording, not a complete wavelength specification.
- Do not add Canon R7 specifications that are absent from the source.
- Do not attribute the brand-level NJSP reference as device certification.
- Keep battery, software workflow, reporting, AFIS, safety, and performance claims blocked or deferred.

## 7. Source and Claim Metadata Contract

Device-6 should translate this conceptual contract into a static local data model. No data model is created in this phase.

### 7.1 Source record

Each source record should be able to represent:

| Field concept | Purpose |
| --- | --- |
| Source identifier | Stable internal reference |
| Source title | Human-readable source name |
| Extraction path | Exact repository path to the extraction |
| Source type | Device presentation, family presentation, or catalog overview |
| Product scope | Device, SKU, family, company/category, catalog, or unresolved |
| Slides inspected | Completeness context from the extraction |
| Source strength | Controlled summary of documented areas and gaps |
| Source limitations | Missing, ambiguous, conflicting, or summary-only conditions |

### 7.2 Claim record

Each claim should be able to represent:

| Field concept | Purpose |
| --- | --- |
| Claim identifier | Stable internal reference |
| Owning product scope | Device, SKU, family, company/category, catalog, or unresolved |
| Claim text | Approved neutral wording, not raw marketing copy by default |
| Evidence level | One of the controlled evidence labels |
| Source reference | Source identifier plus slide or extraction location |
| Attribution requirement | Whether manufacturer/source attribution must be shown |
| Demonstration flag | Whether the claim is based on a presentation example |
| Safety relevance | None, descriptive-light content, safety-sensitive, or safety instruction |
| Release state | Ready, ready with controls, deferred, or blocked |
| Block reason | Conflict, missing source, separate product, marketing, safety gap, or other indexed reason |
| Missing-document dependency | Manual, datasheet, safety document, SOP, validation data, certification record, or clarification |

### 7.3 Controlled evidence labels

The architecture must preserve the labels already established by the source index:

- **verified technical fact** — explicitly printed in the source; not independently laboratory-validated
- **source-stated capability** — manufacturer-stated function without independent validation in the presentation
- **marketing claim** — promotional, superlative, comparative, or otherwise unsupported positioning language
- **unclear / needs verification** — incomplete, ambiguous, conflicting, or under-documented
- **separate product / out of scope** — content that must not be transferred to the indexed device

Architecture behavior by evidence label:

| Evidence label | Default learner behavior |
| --- | --- |
| Verified technical fact | Eligible when product scope and source location are clear |
| Source-stated capability | Eligible with attribution or careful wording when the statement could imply validation |
| Marketing claim | Excluded from lesson facts by default; retain internally for claim control |
| Unclear / needs verification | Blocked until clarified or replaced by an adequate source |
| Separate product / out of scope | Never available to the target device |

### 7.4 Attribution scopes

The future model should distinguish:

- `device`: supported for one named product
- `sku`: supported for Force or Core individually
- `family`: supported only at a named family level
- `company_or_category`: applies to ForenScope or a broad device category
- `catalog`: inventory or overview context only
- `unresolved`: ownership cannot yet be assigned safely

The names are conceptual. Device-6 may choose implementation-friendly values without changing their meaning.

## 8. Module Readiness and Lifecycle

### 8.1 Release states

| State | Meaning | Learner availability |
| --- | --- | --- |
| Ready | Source supports the module and no material claim or safety conflict remains | May be released after content QA |
| Ready with controls | Usable only with attribution, demonstration framing, narrow scope, or an explicit limit | May be released only when every control is represented |
| Deferred | Potentially useful, but the current source is too incomplete for reliable module content | Not shown as a lesson |
| Blocked | Conflicted, unsafe, misattributed, marketing-only, or explicitly unsupported by the indexed evidence | Must not be released |

### 8.2 Status propagation

A module inherits the most restrictive state of any required claim. A blocked claim cannot be hidden inside an otherwise ready module. It must be removed from the module or keep the module blocked.

A module may be `ready with controls` only when its required controls are explicit and reviewable, for example:

- Manufacturer attribution
- Device/family ownership note
- Demonstration-only framing
- Manual-AFIS-only wording
- Exact narrow safety warning
- Missing-document limitation

### 8.3 Reassessment triggers

A deferred or blocked item may be reconsidered only when a new authoritative document directly addresses its reason for restriction. Relevant triggers include:

- Device-specific safety manual
- Operator/user manual
- Technical datasheet
- Software/export/reporting manual
- AFIS interface or preparation documentation
- Validation/performance study
- Certification/accreditation record
- Device-specific SOP
- Product/version or slide-attribution clarification

New evidence should create a new source record and a reviewed claim update. It must not erase the older source context or silently resolve conflicts.

## 9. Safety Gate Architecture

### 9.1 Safety states

Every module should declare one of these conceptual safety states:

- `not_safety_instruction`: descriptive language only
- `descriptive_light_content`: names lights, filters, or spectral ranges without telling the learner how to operate safely
- `source_warning_only`: contains an exact, narrow source-backed warning
- `blocked_missing_safety_source`: would require safety or exposure guidance absent from the sources

### 9.2 Current device safety decisions

| Device group | Current safety state | Architecture decision |
| --- | --- | --- |
| 8K | One explicit UVC warning and supplied-darkroom instruction | Allow one narrow `source_warning_only` module; do not call it complete safety training |
| t-ZOOM Plus DNA | No safety instruction in the source | Block safety modules |
| SuperSpectral Force/Core | No safety instruction in the source | Block safety modules |
| Contactless LITE | No safety instruction in the source | Block safety modules |
| Contactless LAB ULTRA | No safety instruction in the source | Block safety modules |

### 9.3 Separation of descriptive and operational content

Light names, filter names, printed wavelength ranges, and control labels may be used descriptively where the source index marks them safe. They must not be converted into:

- Exposure limits
- PPE instructions
- Eye or skin safety procedures
- Safe-distance rules
- Recommended operating combinations
- Surface-specific operating settings
- A substitute for manufacturer safety training

## 10. Conflict Handling

Conflicts remain data, not editorial problems to solve by preference.

| Current conflict | Required architecture treatment |
| --- | --- |
| 8K seven named filters versus overview eight-filter statement | Store both with separate sources; release only the seven named device-deck filters in that source context; do not assert a universal count |
| Contactless LITE 4K appears only in overview | Keep blocked for device training pending device-specific confirmation |
| Catalog naming/version variants | Preserve source wording and context; do not infer chronology, replacement, or equivalence |
| Accreditation wording lacks model-specific authoritative evidence | Keep as internal unverified/brand-level context; exclude as confirmed device fact |
| Catalog application icons have ambiguous ownership | Do not assign icons to devices; use only device-labeled demonstrations |
| Bare `t-ZOOM` slides 17 and 22 | Keep unresolved and unavailable to Plus DNA modules |
| SuperSpectral application slides do not name Force or Core | Keep at family-level manufacturer-demonstration scope |
| Force light descriptions do not explain their relationship | Preserve both descriptions without merging architecture or counts |
| Contactless LITE multispectral wording lacks bands | Retain the word only as source-stated; do not infer spectral range |
| LAB ULTRA `UV365` label lacks a separate specification | Preserve as printed wording, not a complete technical specification |
| High-Tech extraction is summary-only and references absent fuller sections | Use only as a limited internal cross-reference |

## 11. First Device Lab Release Scope

The first implementation should contain only the seven modules recommended by the source index.

| Priority | Module | Initial state | Required controls |
| ---: | --- | --- | --- |
| 1 | 8K Intro | Ready with controls | Controlled purpose; no superlatives or unverified accreditation |
| 2 | 8K Customer Demo | Ready with controls | Manufacturer attribution where needed; no performance guarantee; manual AFIS wording only if included |
| 3 | 8K UVC Safety | Ready with controls | Exact warning and supplied-darkroom instruction only; label as incomplete safety coverage |
| 4 | Contactless LITE Intro | Ready with controls | Source-stated range and contactless wording; no 4K, wavelengths, or category-wide applications |
| 5 | Contactless LITE Reflective Surfaces Demo | Ready with controls | Device-labeled demonstrations only; no success-rate implication |
| 6 | t-ZOOM Plus DNA Intro | Ready with controls | Visualization purpose only; exclude bare-t-ZOOM slides, exact zoom, safety, and DNA-analysis claims |
| 7 | SuperSpectral Force/Core Comparison | Ready with controls | Compare printed SKU facts only; unresolved applications and Core lens compatibility excluded |

Contactless LAB ULTRA is not part of the first seven-module release. A later components-only module may be considered after the first scope is validated, while its workflow, reporting, safety, and performance areas remain deferred or blocked.

## 12. Device-Level Readiness Map

| Module area | 8K | t-ZOOM Plus DNA | SuperSpectral Force/Core | Contactless LITE | Contactless LAB ULTRA |
| --- | --- | --- | --- | --- | --- |
| Intro | Ready with controls | Ready with controls | Ready with controls | Ready with controls | Ready with controls, later scope |
| Customer demo | Ready with controls | Ready with controls | Ready with controls | Ready with controls | Ready with controls, later scope |
| Components/specifications | Ready with controls | Ready with controls | Ready with controls | Ready with controls | Ready with controls, later scope |
| Light/filter explanation | Ready with controls | Ready with controls | Ready with controls | Ready with controls | Ready with controls, later scope |
| Workflow | Ready with controls | Deferred/cautious | Deferred | Deferred | Deferred |
| Export/reporting | Ready with controls | Ready with controls, cautious | Deferred | Deferred | Deferred |
| AFIS preparation | Ready with controls, manual only | Deferred | Deferred | Deferred | Deferred |
| Safety instruction | Ready with controls, narrow warning only | Blocked | Blocked | Blocked | Blocked |
| Troubleshooting | Deferred/cautious | Deferred | Deferred | Deferred | Deferred |
| Demonstration gallery | Ready with controls | Ready with controls, device-labeled only | Ready with controls at family level | Ready with controls | Ready with controls, later scope |
| Final challenge | Deferred/cautious | Deferred/cautious | Deferred/cautious | Deferred/cautious | Ready with controls, later scope |

This map is an architecture planning view. It does not create curriculum or approve lesson copy.

## 13. Content Assembly Rules for Device-6 and Device-7

When later phases create data and UI, they should follow this assembly order:

1. Select the owning device, SKU, or family.
2. Select only claims eligible for that owner.
3. Attach exact source and slide references.
4. Apply evidence and attribution behavior.
5. Apply safety state and block rules.
6. Record conflicts and missing-document limits.
7. Determine the module's most restrictive release state.
8. Run source-control QA before learner release.

The rendered lesson must be assembled from approved claims. A prose lesson should not be written first and justified with sources afterward.

## 14. Progress and Assessment Boundary

Device Lab should remain local-first when progress is authorized in a later phase. The architecture may eventually support module completion and review state, but source readiness and learner completion are separate concepts:

- Source readiness answers whether a module is safe to publish.
- Learner completion answers whether a released module has been completed.

Progress must never unlock blocked source content. Assessment must test language use based on released material, not forensic competence, evidence admissibility, device performance, or safe-operation certification.

No progress model, storage key, scoring rule, or cloud record is defined in Device-5D.

## 15. QA and Release Gates

A future module is eligible for release only when all applicable checks pass.

### 15.1 Source-control gate

- Every factual/capability statement has a source reference.
- Every statement has an owning device, SKU, family, or broader scope.
- No claim crosses into another device without independent support.
- Catalog-only or company-level wording is not presented as a device fact.
- Demonstrations are labeled as examples, not validated outcomes.
- Missing evidence is represented as not documented.

### 15.2 Claim-control gate

- Marketing superlatives are excluded from lesson facts.
- Unclear and out-of-scope claims are not rendered.
- Performance, accuracy, success-rate, admissibility, and universal-preservation guarantees are absent.
- Certification/accreditation is not stated as confirmed without authoritative device-specific evidence.
- AFIS wording is limited to the source-supported manual 8K preparation sequence.
- t-ZOOM Plus DNA content does not imply DNA analysis.

### 15.3 Safety gate

- The module declares a safety state.
- Descriptive light/filter content is not presented as safe-operation guidance.
- No absent PPE, exposure, distance, or compliance instruction is invented.
- The 8K warning stays exact in meaning, narrow in scope, and visibly incomplete as safety coverage.

### 15.4 Product-boundary gate

- Force and Core specifications remain separate where the source separates them.
- SuperSpectral SAFE remains out of scope.
- Contactless LITE, Contactless LAB ULTRA, and 8K remain separate products.
- Bare `t-ZOOM` examples remain unresolved.
- Optional accessories remain labeled optional.

### 15.5 Phase-boundary gate

- No cloud, admin, authentication, or analytics dependency is introduced.
- No blocked module is exposed as a lesson.
- No source file is edited to make implementation easier.
- Later-phase behavior is not implemented ahead of approval.

## 16. Device-6 Handoff

After this architecture is approved, Device-6 may define a static, local, evidence-aware data model. Its scope should be limited to:

- Source records
- Device, SKU, and family records
- Claim records
- Module records
- Source references
- Evidence, attribution, safety, release, and dependency states
- The seven first-release module definitions
- Validation rules that prevent cross-device and blocked-claim leakage

Device-6 should not create learner prose beyond the minimum needed to validate the model, and should not implement routes, UI, progress, Supabase, auth, admin, or cloud sync.

## 17. Later Phase Sequence

| Phase | Outcome |
| --- | --- |
| Device-6 | Static local Device Lab data model with evidence and safety controls |
| Device-7 | Minimal `/device-lab` UI for only the approved first-release modules |
| Device-8 | Local-only module completion and review state |
| Device-9 | Separately authorized cloud/admin tracking, if still needed |
| Device-10 | Source expansion and controlled reassessment of deferred/blocked modules |

## 18. Architecture Acceptance Criteria

Device-5D is complete when this plan:

- Separates shared module structure from device-specific claims.
- Defines device, SKU, family, company/category, catalog, and unresolved ownership.
- Defines conceptual source, claim, module, evidence, attribution, safety, and readiness metadata.
- Keeps the High-Tech overview out of learner-facing modules.
- Preserves all indexed device boundaries and unresolved conflicts.
- Applies deny-by-default safety gating.
- Limits the first release to the seven source-index modules.
- Leaves routes, data files, UI, curriculum, progress, and cloud behavior unchanged.
- Provides a bounded handoff for Device-6.

## 19. Final Recommendation

Proceed to Device-6 only after this architecture is reviewed as a governance contract, not as curriculum approval.

The Device Lab should begin as a narrow source-aware system whose module availability reflects the actual evidence for each device. The first implementation must favor traceability and explicit limits over completeness. Broader workflows, safety training, troubleshooting, performance assessment, certification language, direct AFIS claims, and cross-device recommendations must remain deferred until the missing authoritative documents are available and reviewed.
