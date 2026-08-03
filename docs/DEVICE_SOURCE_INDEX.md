# Device-5C: ForenScope Device Source Index

## Purpose and Control Status

This document consolidates the available ForenScope presentation extractions before Device Lab architecture or curriculum integration. It is a source-control index, not curriculum, a device manual, a safety guide, or authorization to build Device Lab routes or data files.

Evidence labels retain the meanings established during source intake:

- **verified technical fact** — explicitly printed in the source; not independently laboratory-validated
- **source-stated capability** — a manufacturer-stated function without independent validation in the presentation
- **marketing claim** — promotional, superlative, comparative, or otherwise unsupported positioning language
- **unclear / needs verification** — incomplete, ambiguous, conflicting, or under-documented
- **separate product / out of scope** — content that must not be transferred to the indexed device

## 1. Executive Summary

The source-intake phase is complete for the six presentation/source groups currently available in scope: 8K, t-ZOOM Plus DNA, SuperSpectral Force/Core, Contactless LITE, Contactless LAB ULTRA, and the High-Tech catalog overview. This does not mean that every product named in the broader ForenScope catalog has a device extraction.

The available evidence is sufficient to begin **controlled Device Lab architecture planning**. It is not sufficient for unrestricted curriculum integration or a uniform all-device training model. The sources differ substantially:

- 8K has the strongest documented software/export workflow, the only explicit device safety instruction, and the only AFIS-preparation sequence.
- t-ZOOM Plus DNA has strong hardware, light/filter, software, connectivity, and application examples, but no safety guidance and unresolved product-name attribution on two slides.
- SuperSpectral Force/Core has strong printed specifications and comparison potential, but ambiguous application attribution, missing safety guidance, and undocumented software components.
- Contactless LITE has useful camera, illumination, battery, range, and reflective-surface demonstrations, but almost no software/reporting information and no safety guidance.
- Contactless LAB ULTRA has useful component, light/filter, control-panel, and surface-demonstration content, but minimal software/export detail and no safety guidance.
- The High-Tech overview is useful as a catalog cross-reference only. Its device claims must not overwrite device-specific extractions.

The next step is Device-5D architecture planning with source status, device ownership, claim level, safety status, and module readiness represented explicitly.

## 2. Source Inventory

| Device / source group | Extraction file | Presentation type | Slides inspected | Source strength | Safe for curriculum? | Main caution |
| --- | --- | --- | ---: | --- | --- | --- |
| 8K | `docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md` | Device presentation with product-family and company slides | 40 | Moderate-high: detailed hardware, software, export, safety, and demo examples | Limited yes, with evidence labels | Marketing/performance claims, seven-versus-eight-filter conflict, and direct AFIS claims must stay controlled |
| t-ZOOM Plus DNA | `docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md` | Device presentation with company-level claims and ambiguous bare “t-ZOOM” slides | 27 | Moderate: strong components, light/filter systems, software, connectivity, and examples | Limited yes, with attribution | Safety is absent; slides 17 and 22 are not confirmed as Plus DNA; no DNA analysis is demonstrated |
| SuperSpectral Force/Core | `docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md` | Two-device family presentation plus separate SuperSpectral SAFE section | 40 | Moderate-high: strong printed Force/Core specifications | Limited yes, with Force/Core ownership preserved | Application slides do not identify Force versus Core; SuperSpectral SAFE is separate and out of scope |
| Contactless LITE | `docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md` | Device presentation with catalog/company content and separate 8K slides | 36 | Moderate: useful camera, illumination, power, range, and surface examples | Limited yes, mainly intro and reflective-surface language | Software/reporting and safety are absent; catalog-wide body-fluid/blood/GSR/Touch-DNA claims are not device-supported |
| Contactless LAB ULTRA | `docs/sources/forenscope/CONTACTLESS_LAB_ULTRA_PRESENTATION_EXTRACTION.md` | Device presentation with company/category introduction | 24 | Moderate for hardware/control panel; limited for workflow and compliance | Limited yes, for components and illustrative demos | No complete workflow, reporting, AFIS, safety, or validated performance evidence |
| High-Tech catalog overview | `docs/sources/forenscope/HIGH_TECH_FORENSIC_IMAGING_SOLUTIONS_PRESENTATION_EXTRACTION.md` | Cross-device catalog overview with deeper 8K and Contactless LITE content | 42 | Limited for device facts; useful for inventory and conflict discovery | No as a standalone curriculum source | Summary-only extraction; includes conflicting/overview-only device claims and catalog naming variants |

## 3. Device-by-Device Index

### 3.1 8K

#### A. Source-Supported Product Name

- 8K
- 8K Latent Fingerprint Detection Tablet
- 8K mobile compact system
- 8K System

#### B. Aliases and Naming Variants

- “8K ANDROID Latent Fingerprint Tablet” is the presentation filename/title wording.
- “8K Android” appears in catalog/overview material.
- Do not replace the source-supported device names with the catalog shorthand.

#### C. Product Category

Forensic imaging device for latent fingerprint detection and imaging, presented as a mobile compact system.

#### D. Safe Training Areas

- Controlled product introduction
- 45.9MP camera wording, without inferring exact pixel dimensions
- UVA/UVB/UVC/VIS/IR vocabulary
- Ten named light groups
- Seven named filters from the device-specific extraction, pending conflict resolution with the catalog overview
- Android control-software vocabulary
- RAW/TIFF capture, RAW video, listed export formats, stamps, geo-tag, archive, enhancement, reporting, and live-zoom vocabulary
- Demonstrated surface vocabulary, explicitly framed as presentation examples
- Manual AFIS preparation/submission language
- Exact UVC warning: UVC can be harmful to the human body and should be used with the supplied darkroom

#### E. Blocked or Cautious Claims

- “World’s first and only” — marketing claim
- “No image distortion” — marketing claim; no guarantee
- “Third level identification” — marketing claim without validation data
- Remote scanning up to three meters — source-stated but unverified range
- US crime-gun accreditation — unclear; no certificate or named accrediting body in the 8K deck
- Direct, automatic, or certified AFIS integration — not documented
- Accuracy, success-rate, universal-detection, or evidence-preservation guarantees — not documented
- Any Contactless LITE feature transferred to 8K — blocked

#### F. Missing Documents

- Operator manual and exact settings per surface
- Technical datasheet, including sensor model, true pixel dimensions, battery runtime, weight, and dimensions
- Complete UVC safety/compliance document
- AFIS integration/preparation documentation
- Accreditation certificate naming the authority and scope
- Validation/performance data

#### G. Recommended Device Lab Modules

- 8K Intro
- 8K Customer Demo
- 8K Light and Filter System
- 8K UV/VIS/IR Vocabulary
- 8K UVC Safety — limited to the exact source warning
- 8K Capture, Export, and Reporting Vocabulary
- 8K Manual AFIS Preparation
- 8K Demonstrated Surfaces
- 8K Customer Q&A

#### H. Follow-Up Questions

- Does the device have seven or eight motorized filters, and are the overview and device deck describing different configurations?
- What are the true output pixel dimensions and sensor model behind the “8K” label?
- What test conditions support the three-meter scanning statement?
- Is there a documented or certified AFIS interface, or only manual preparation?
- Which authority, certificate, and scope support the crime-gun accreditation statement?
- What complete UVC safety procedure accompanies the supplied darkroom?

### 3.2 t-ZOOM Plus DNA

#### A. Source-Supported Product Name

- t-ZOOM Plus DNA

#### B. Aliases and Naming Variants

- “t-ZOOM PLUS DNA”
- “t-ZOOM+” in a video filename
- “t-ZOOM” on slides 17 and 22
- “t ZOOM PLUS DNA” in the High-Tech catalog overview

The bare “t-ZOOM” application slides may refer to shorthand or a separate base model. Their attribution to t-ZOOM Plus DNA remains unconfirmed.

#### C. Product Category

Multispectral forensic imaging system positioned by the source as a “DNA LAB system.” The presentation demonstrates trace visualization, not DNA extraction or analysis.

#### D. Safe Training Areas

- Controlled product introduction
- Seven listed components
- Macro-Micro and Power Macro lens vocabulary
- Eight-channel Power Macro and fifteen-channel Macro-Micro ring-light systems
- Seven named filters
- UV/VIS/IR and real-time UVC/UVB/UVA vocabulary
- Android, image archive, enhancement, reporting, stamping, USB/email export, and connectivity vocabulary
- Device-labeled visualization examples, presented as single demonstrations
- Customer Q&A with company-level contactless attribution caveat

#### E. Blocked or Cautious Claims

- “Ultimate DNA LAB,” “unique,” and “strongest illumination” — marketing claims
- “6 meters to 600 microns” zoom range — unclear / needs verification
- AUTO Search and Smart Button behavior — undefined
- Contactless/no-chemical language — company-level, not confirmed on a device-labeled slide
- Slides 17 and 22 GSR examples — attribution to Plus DNA unconfirmed
- DNA extraction, DNA profiling, or on-device DNA analysis — blocked
- Accuracy, sensitivity, false-positive, validation, certification, or accreditation claims — absent
- Safety instructions — absent and blocked

#### F. Missing Documents

- User/operator manual
- Technical datasheet with sensor, resolution, zoom, spectral boundaries, dimensions, and battery information
- UV/IR safety document
- Certification/accreditation evidence
- SOPs and validation/performance data per application
- Product clarification for t-ZOOM, t-ZOOM+, and t-ZOOM Plus DNA
- Definitions for Illuminated Darkroom versus Darkroom, AUTO Search, and Smart Button

#### G. Recommended Device Lab Modules

- t-ZOOM Plus DNA Intro
- Components and Changeable Lenses
- Two Ring-Light Systems
- Filter and Multispectral Vocabulary
- Software and Connectivity Overview
- Device-Labeled Application Examples
- Claim-Controlled Customer Q&A
- Reporting Vocabulary — cautious
- Troubleshooting Clarification — draft/cautious only

#### H. Follow-Up Questions

- Are t-ZOOM, t-ZOOM+, and t-ZOOM Plus DNA the same device or separate models?
- Do slides 17 and 22 belong to t-ZOOM Plus DNA?
- What does the “6 meters to 600 microns” range measure?
- What do AUTO Search and Smart Button do?
- How do Illuminated Darkroom and Darkroom differ?
- What safety requirements apply to the UV and IR light sources?
- Does any source document DNA sampling, extraction, or analysis, rather than visualization/localization only?

### 3.3 SuperSpectral Force/Core

#### A. Source-Supported Product Names

- SuperSpectral Force
- SuperSpectral Core

These are two SKUs in one family line and must retain separate specifications.

#### B. Aliases and Naming Variants

- “SUPERSPECTRAL FORCE” / “SuperSpectral Force”
- “SUPERSPECTRAL CORE” / “SuperSpectral Core”
- Generic “SUPERSPECTRAL” on a portfolio slide does not distinguish Force from Core
- “SUPERSPECTRAL FORCE” and “SUPERSPECTRAL CORE” appear as name-only catalog entries in the High-Tech overview

#### C. Product Category

“Superspectral Ultra High Resolution Mobile Forensic Imaging System,” with distinct Force and Core hardware configurations.

#### D. Safe Training Areas

- Force/Core product comparison
- Force 200MP versus Core 64MP sensor vocabulary
- Shared 330–1100nm UV/VIS/IR range
- Shared printed battery capacity/runtime wording with runtime caveat
- 4K video, RAW imaging, continuous autofocus, and 10x digital zoom
- Force versus Core storage and display differences
- Force light-system and twelve-filter vocabulary
- Core light-system and nine-filter vocabulary
- Force-attributed optional lens names, with capability attribution
- Manufacturer-demonstrated applications, without assigning ambiguous slides to one SKU

#### E. Blocked or Cautious Claims

- “Force of truth,” “essential power,” and “strongest illumination” — marketing claims
- Application slides 17–29 — ambiguous Force/Core ownership
- IR Anti-Stokes and Contactless Lens performance — manufacturer-stated, not validated
- Core support for Force optional lenses — unconfirmed
- Case Management System and Illuminated Darkroom behavior — undocumented
- Metadata overlay behavior — visual inference only
- Battery runtime conditions — missing
- Safety/exposure/compliance instructions — absent
- Accuracy, sensitivity, detection-limit, or admissibility claims — absent
- SuperSpectral SAFE slides 30–40 — separate product / out of scope

#### F. Missing Documents

- User manual and Case Management System workflow
- Technical datasheet for dimensions, ports, and optical/digital zoom details
- UV/IR safety and compliance document
- Certification/accreditation evidence
- SOPs and validation/performance data by application
- Core optional-lens compatibility statement
- Definitions for Illuminated Darkroom, White+, NBP, and LBP

#### G. Recommended Device Lab Modules

- SuperSpectral Force Intro
- SuperSpectral Core Intro
- Force/Core Comparison
- Sensor, Storage, and Display Comparison
- Spectral Range and Filter Comparison
- Force and Core Light-System Comparison
- Force Optional Lenses — cautious
- Manufacturer Demonstration Gallery — Force/Core ownership left unresolved
- Customer Q&A
- Professional Settings Language — cautious

#### H. Follow-Up Questions

- Which application slides belong to Force, Core, or both?
- Does Core support the IR Anti-Stokes Lens or Contactless Lens?
- How do the Force slide-6 Top/Spot/Oblique systems relate to the slide-13 ring-light counts?
- What functions do the Case Management System and Illuminated Darkroom provide?
- What does White+ mean, and how are NBP/LBP defined?
- What safety requirements apply across the 330–1100nm operating range?

### 3.4 Contactless LITE

#### A. Source-Supported Product Name

- Contactless LITE

#### B. Aliases and Naming Variants

- Contactless LITE Evidence Imaging System
- CONTACTLESS LITE
- Contactless Lite

Contactless LITE is separate from 8K and Contactless LAB ULTRA.

#### C. Product Category

Forensic imaging device in the Forensic Science/Fingerprint Detection Set family, positioned for non-contact fingerprint/evidence imaging on reflective surfaces and on-site investigations.

#### D. Safe Training Areas

- Controlled product introduction
- 32.5MP CMOS and RAW vocabulary
- Five listed resolution modes
- One-touch autofocus and monochrome/color modes
- Source-stated 20cm–5m imaging range
- Four named LED groups and control-button vocabulary
- Battery and USB Type-C charging vocabulary
- TF-card transfer vocabulary
- Sixteen named plus one unlabeled hard/reflective-surface demonstration slides
- Reflective-surface customer demo language, framed as presentation examples

#### E. Blocked or Cautious Claims

- “World’s first” and the circular “1” badge — marketing/unclear
- “100% Contactless,” no contamination/damage, and environment-friendly language — manufacturer/category-level; attribute and do not guarantee
- Body-fluid, blood, GSR, document/art, or Touch-DNA claims — category-level and not demonstrated as Contactless LITE-specific
- “Multispectral” technical range — no wavelengths/bands supplied
- Four-K video — appears only in the High-Tech overview and is absent from the device extraction
- Software, app, archive, cloud, AI, reporting, or AFIS features — not documented
- Safety instructions — absent and blocked

#### F. Missing Documents

- User manual and step-by-step capture workflow
- Full technical datasheet, including dimensions, weight, IP rating, temperature range, and LED bands
- LED/electrical safety document
- Certification/accreditation evidence
- SOPs and validated settings per surface
- Validation/performance data
- Software/export/reporting documentation

#### G. Recommended Device Lab Modules

- Contactless LITE Intro
- Camera and Resolution Vocabulary
- Four-LED Light System
- Autofocus and Distance Language
- Battery and TF-Card Vocabulary
- Reflective Surfaces Demo
- Customer Q&A
- Basic Troubleshooting Clarification — cautious

#### H. Follow-Up Questions

- Does Contactless LITE support 4K video, and where is that specification documented device-specifically?
- What wavelength bands define the four LED groups and the “multispectral” description?
- What software, file formats, archive, and reporting workflow are supported?
- What safety guidance applies to the illumination system?
- Are any body-fluid, blood, GSR, or Touch-DNA uses supported by a Contactless LITE-specific source?
- What does the circular “1” badge mean?

### 3.5 Contactless LAB ULTRA

#### A. Source-Supported Product Name

- Contactless LAB ULTRA

#### B. Aliases and Naming Variants

- The extraction reports no separate device alias in the deck.
- “CONTACTLESS LAB ULTRA” appears as watermark/capitalization.
- The High-Tech overview contains the name as a catalog entry only.

Contactless LAB ULTRA is separate from Contactless LITE and 8K.

#### C. Product Category

Contactless multispectral imaging system positioned for lab investigations.

#### D. Safe Training Areas

- Controlled product introduction
- Canon R7 named-component vocabulary
- Multispectral light lens, adjustable mirror system, and control-panel vocabulary
- Four in-lights, seven out-lights, and six filters
- Named in-light/out-light colors and source-stated general-use notes
- Mountable/removable control panel and its listed controls
- HDMI output and TF-card data-export vocabulary
- Optional Capture One, laptop, mouse, and keyboard, clearly labeled optional
- Eight surface demonstrations, framed as illustrative examples

#### E. Blocked or Cautious Claims

- “Unique multispectral technologies,” “100% Contactless,” and “best evidence image” — marketing/category-level language
- Company-wide application list — not LAB ULTRA-specific
- NJSP crime-gun/accreditation reference — brand-level and underlying document unverified
- Any resolution, sensitivity, magnification, or wavelength figure beyond printed labels — absent
- LAB ULTRA-specific battery specification — not established
- Software workflow beyond optional Capture One, HDMI, and TF-card export — absent
- AFIS, case management, reporting, metadata, cloud, or AI claims — absent
- Safety/PPE/exposure instructions — absent and blocked
- Performance, accuracy, success-rate, or admissibility claims — absent

#### F. Missing Documents

- User manual and light/filter selection procedure
- Technical datasheet for camera, lens, filters, wavelengths, battery, weight, and dimensions
- UV/light safety document
- NJSP source and certification/accreditation evidence
- Lab imaging SOP
- Validation/performance data
- Capture One/export/reporting/software manual

#### G. Recommended Device Lab Modules

- Contactless LAB ULTRA Intro
- Components and Configuration
- In-Lights and Out-Lights
- Control Panel Vocabulary
- Optional Accessories
- Demonstrated Surfaces
- Customer Q&A with attribution caveats
- Minimal Troubleshooting Clarification — cautious

#### H. Follow-Up Questions

- What resolution and sensor specifications apply to the Canon R7 configuration?
- What are the six filter names and wavelength ranges?
- Is UV365 a label or a confirmed 365nm specification in the product datasheet?
- What battery and power system is supplied with LAB ULTRA?
- What Capture One integration, export formats, and reporting workflow are supported?
- What does the cited NJSP material actually validate, and does it name LAB ULTRA?
- What safety requirements apply to UV365 and the colored light sources?

### 3.6 High-Tech Catalog Overview

#### A. Source-Supported Source Name

- High-Tech Forensic Imaging Solutions overview

The extraction describes deeper content for 8K Android and Contactless LITE, plus name-only catalog entries for other products.

#### B. Aliases and Naming Variants

The overview uses catalog forms such as “8K Android,” “t ZOOM PLUS DNA,” “SUPERSPECTRAL FORCE,” “SUPERSPECTRAL CORE,” and versioned names such as SAFE PRO 3 and CSI PRO 3. These must not overwrite device-supported names or older catalog variants.

#### C. Product Category

Multi-product catalog across Forensic Medicine, Document & Art Examination, and Forensic Science.

#### D. Safe Training Areas

- Catalog inventory and solution-area vocabulary
- Company history wording, clearly labeled company-level
- Cross-source conflict discovery
- Separate-product and attribution exercises

#### E. Blocked or Cautious Claims

- Any catalog-level claim assigned to a device without explicit support
- Eight-filter statement for 8K until reconciled with the seven-filter device extraction
- Contactless LITE 4K claim until device-specific confirmation
- Unnamed US accreditation statement
- “World’s first multispectral coaxial” superlative
- Illegible badge and ambiguous distance/notation claims
- Application icons assigned to 8K when later demonstrations belong to Contactless LITE
- Name-only catalog entries treated as technical device sources

#### F. Missing Documents

- Full structured extraction sections referenced by the summary but not present in the saved catalog extraction
- Original overview presentation retained in the repository
- Device-specific sources for each name-only catalog product
- Version-history or catalog-date documentation
- Reconciliation evidence for the filter, video, naming, accreditation, and icon-attribution issues

#### G. Recommended Device Lab Modules

- None as a device-training module
- Use only as an internal source inventory, attribution-boundary, and conflict-review input

#### H. Follow-Up Questions

- Why does this overview list eight 8K filters while the device deck lists seven?
- Where is Contactless LITE 4K video documented device-specifically?
- Which catalog versions are current, and which names are historical?
- Which device, if any, is covered by the unnamed accreditation claim?
- Can the complete slide map and claim-control sections referenced by the overview summary be supplied?

## 4. Safe Training Areas Matrix

The matrix assesses **language-training source readiness**, not operational competence or forensic validation.

| Training area | 8K | t-ZOOM Plus DNA | SuperSpectral Force/Core | Contactless LITE | Contactless LAB ULTRA |
| --- | --- | --- | --- | --- | --- |
| 30-second intro | Safe | Safe | Safe | Safe | Safe |
| 90-second customer demo | Safe | Safe | Safe | Safe | Safe |
| Light/filter explanation | Safe | Safe | Safe | Safe | Safe |
| UV/VIS/IR or multispectral explanation | Safe | Safe | Safe | Cautious | Cautious |
| Contactless / non-contact explanation | Cautious | Cautious | Cautious | Safe | Cautious |
| Workflow explanation | Cautious | Cautious | Cautious | Cautious | Cautious |
| Export/reporting explanation | Safe | Cautious | Not enough source data | Not enough source data | Not enough source data |
| AFIS preparation explanation | Safe | Not enough source data | Not enough source data | Not enough source data | Not enough source data |
| Safety instruction | Safe | Blocked | Blocked | Blocked | Blocked |
| Troubleshooting dialogue | Cautious | Cautious | Cautious | Cautious | Cautious |
| Professional reporting language | Safe | Cautious | Cautious | Cautious | Not enough source data |
| Final demo challenge | Cautious | Cautious | Cautious | Cautious | Safe |

### Matrix Notes

- **Safe** means the source supports a controlled language module. It does not mean the claim is independently validated.
- **Cautious** means attribution, device ownership, demonstration framing, or procedure limits must remain visible.
- **Blocked** means the module must not be built from the current source.
- **Not enough source data** means the source does not document the requested area sufficiently.
- 8K safety readiness is limited to the explicit UVC warning and supplied-darkroom instruction. It is not full UVC safety training.
- 8K AFIS readiness means manual preparation/submission language only, not direct integration.
- Contactless LAB ULTRA’s final demo challenge is limited to communication based on its eight demonstrated surfaces and printed component controls, not an operating-proficiency assessment.

## 5. Blocked Claims Register

| Claim | Affected device/source | Why blocked | Evidence needed to unblock |
| --- | --- | --- | --- |
| “World’s first,” “first and only,” or equivalent | 8K; Contactless LITE; High-Tech overview | Unverified superlatives with no comparative evidence | Independent comparative evidence and precisely scoped claim documentation |
| “Strongest,” “unique,” “best,” “ultimate,” or equivalent | t-ZOOM Plus DNA; SuperSpectral Force/Core; Contactless LAB ULTRA; catalog/company material | Marketing/comparative wording without test method or benchmark | Defined comparison set, method, metrics, conditions, and independent evidence |
| Accreditation/certification as a confirmed device fact | 8K; Contactless LAB ULTRA; High-Tech overview; company-level sources | Certificate, issuing authority, model scope, or underlying cited document is missing/unverified | Certificate or authoritative record naming device, authority, scope, and validity |
| Direct, automatic, API-based, or certified AFIS integration | All devices; especially 8K | 8K shows a manual preparation/submission workflow only; other sources do not document AFIS | Interface specification, supported AFIS names, certification, and workflow documentation |
| Performance, accuracy, sensitivity, specificity, success-rate, false-positive, or admissibility claims | All device groups | Presentations provide specs or demonstrations, not validated performance datasets | Test protocol, sample size, conditions, results, independent validation, and scope |
| Safety instructions beyond the exact source warnings | All devices | Only 8K contains an explicit UVC warning; other device sources contain no safety procedure | Device-specific safety manual, exposure limits, classifications, PPE/enclosure rules, and compliance evidence |
| DNA extraction, profiling, or analysis by t-ZOOM Plus DNA | t-ZOOM Plus DNA | Source shows visualization/localization examples, not DNA laboratory analysis | Device-specific technical/validation documentation explicitly describing the DNA function |
| Body-fluid, blood, GSR, or Touch-DNA use by Contactless LITE | Contactless LITE | Claims appear at general ForenScope category level, not on Contactless-LITE-labeled demonstrations | Contactless LITE manual, datasheet, validated demonstrations, or device-specific application documentation |
| SuperSpectral SAFE capabilities assigned to Force/Core | SuperSpectral Force/Core | Slides 30–40 are explicitly a separate product | Force/Core-specific source explicitly confirming the same feature |
| Catalog application icons assigned to an individual device | High-Tech overview; 8K; Contactless LITE | Icon ownership is ambiguous and later demonstrations may belong to another product | Device-labeled slides or device-specific manual/datasheet supporting each application |
| Contactless LITE or 8K claims assigned to the other product | 8K; Contactless LITE | They are separate products despite appearing together in a family set | Device-specific source for the target product |
| Contactless LAB ULTRA claims assigned to Contactless LITE, or vice versa | Contactless LITE; Contactless LAB ULTRA | Similar names do not establish shared hardware, software, workflow, or performance | Device-specific documentation confirming each shared claim separately |
| Bare “t-ZOOM” application slides assigned to t-ZOOM Plus DNA | t-ZOOM Plus DNA | Slides 17 and 22 omit “Plus DNA”; attribution is unresolved | Product/version confirmation from ForenScope or another authoritative source |
| Core compatibility with Force optional lenses | SuperSpectral Core | No Core component slide confirms those lenses | Core datasheet/component list or compatibility documentation |
| Unqualified evidence-preservation or “no damage” guarantees | 8K; t-ZOOM Plus DNA; Contactless LITE; category-level sources | Manufacturer contactless claims do not independently prove every evidence outcome | Validated handling study and scoped evidence-preservation procedure |

## 6. Conflict and Follow-Up Notes

| Conflict or follow-up | Sources | Current treatment |
| --- | --- | --- |
| High-Tech overview says 8K has an eight-filter motorized system; the 8K device extraction lists seven named filters. | High-Tech overview; 8K extraction | Unresolved. Keep the device extraction’s seven named filters within its source context; do not assert a universal count. |
| High-Tech overview includes Contactless LITE 4K video; the Contactless LITE device extraction does not list 4K video. | High-Tech overview; Contactless LITE extraction | Overview-only claim. Do not use until device-specific confirmation is available. |
| Catalog model/name/version differences include SAFE PRO 3 versus other catalog variants, CSI PRO 3 versus other variants, “t ZOOM PLUS DNA” versus t-ZOOM Plus DNA, and “8K Android” versus source-supported 8K names. | High-Tech overview; Contactless LITE catalog slide; SuperSpectral catalog slide; device extractions | Preserve each source’s wording and date/context. Do not overwrite device-supported names or infer model succession. |
| Accreditation wording varies from unnamed US accreditation to a brand-level NJSP crime-gun reference. Neither establishes model-specific certification in the indexed sources. | High-Tech overview; 8K extraction; Contactless LAB ULTRA extraction | Keep brand-level, attributed, and unverified. Obtain the underlying authoritative record. |
| High-Tech application icons near 8K include surfaces later demonstrated under Contactless LITE; overlapping surfaces also occur in device-specific decks. | High-Tech overview; 8K extraction; Contactless LITE extraction | Do not infer icon ownership or exclusive device capability. Use only device-labeled demonstrations. |
| t-ZOOM slides 17 and 22 use bare “t-ZOOM,” while most device slides use t-ZOOM Plus DNA. | t-ZOOM Plus DNA extraction | Attribution unresolved; keep those examples blocked for Plus DNA-specific training. |
| SuperSpectral application slides 17–29 do not label Force or Core individually. | SuperSpectral Force/Core extraction | Use as family-level manufacturer demonstrations only; do not assign to one SKU. |
| Force light-system descriptions use Top/Spot/Oblique lists on one slide and separate ring-light counts on another, without explaining their relationship. | SuperSpectral Force/Core extraction | Preserve both descriptions; do not collapse them into one architecture or count. |
| Contactless LITE is called multispectral, but the device extraction gives no wavelength bands; the overview’s 4K addition does not solve that gap. | Contactless LITE extraction; High-Tech overview | Keep multispectral as source-stated and avoid inferred spectral ranges. |
| Contactless LAB ULTRA uses UV365 as a printed label, but no separate wavelength specification is provided. | Contactless LAB ULTRA extraction | Treat UV365 as source wording, not a complete spectral specification. |
| General “ForenScope devices” contactless, battery, environment, and application claims recur across decks but are not consistently device-specific. | 8K, t-ZOOM, Contactless LITE, Contactless LAB ULTRA, and catalog sources | Attribute as category/company-level unless a device-labeled slide independently supports the claim. |
| The saved High-Tech overview extraction is a short summary that references a fuller extraction and “§10,” but those sections are not present in the saved file. | High-Tech overview extraction | Treat it as a limited catalog cross-reference. Request the complete structured extraction before relying on it for architecture details. |

## 7. Missing Document Priorities

1. **Safety documents for UV/IR/light systems**
   - Highest priority because four device groups use UV, IR, or multispectral light without a source-backed safety procedure.
   - 8K also needs a complete safety/compliance document beyond its single UVC warning.

2. **Technical datasheets**
   - Needed to resolve 8K filter count, Contactless LITE 4K, exact spectral ranges, sensor/lens details, battery data, dimensions, and compatibility questions.

3. **User/operator manuals**
   - Needed for exact capture sequences, light/filter selection, settings per surface, controls, error states, and safe operation.

4. **Software/export/reporting manuals**
   - Needed for t-ZOOM software functions, SuperSpectral Case Management System, Contactless LITE software gaps, LAB ULTRA Capture One/export behavior, metadata, formats, archives, and reporting.

5. **AFIS integration/preparation documentation**
   - Needed to define the 8K manual preparation workflow and establish whether any direct or certified interface exists.

6. **Validation/performance data**
   - Needed for sensitivity, specificity, success rates, detection limits, repeatability, surface claims, and admissibility-related language.

7. **Certification/accreditation evidence**
   - Needed to verify brand- or device-level claims, issuing agencies, model scope, certificate numbers, and validity.

8. **SOPs per application area**
   - Needed before demonstrations can become operating instruction or proficiency assessment.

## 8. Recommended First Device Lab Scope

The first Device Lab implementation should remain small, static, source-aware, and limited to modules with the clearest evidence boundaries:

1. **8K Intro**
   - Product identity and controlled purpose statement.

2. **8K Customer Demo**
   - Camera, UV/VIS/IR, light/filter, contactless, and software vocabulary with manufacturer attribution.

3. **8K UVC Safety**
   - Only the exact source-backed warning that UVC can be harmful and should be used with the supplied darkroom.
   - Do not present this as complete UVC safety certification or operator training.

4. **Contactless LITE Intro**
   - Product identity, camera, LED groups, autofocus, source-stated distance range, battery, and TF-card vocabulary.

5. **Contactless LITE Reflective Surfaces Demo**
   - Device-labeled hard/reflective-surface examples only, framed as presentation demonstrations.

6. **t-ZOOM Plus DNA Intro**
   - Product identity, components, multispectral vocabulary, and high-level visualization purpose.
   - Exclude bare-t-ZOOM slides, safety instruction, exact zoom, and DNA-analysis claims.

7. **SuperSpectral Force/Core Comparison**
   - Source-printed sensor, storage, display, light-system, and filter differences.
   - Keep ambiguous application slides and optional-lens compatibility outside the comparison facts.

Safety-sensitive and underdocumented areas must remain narrow because the presentations are marketing/device-overview sources rather than complete safety manuals, operating procedures, or validation reports. Contactless LAB ULTRA can follow after its software, safety, and workflow gaps are better understood, or be limited to a later components-only module.

## 9. What Should Not Be Implemented Yet

- Full leaderboard
- Performance scoring
- Pronunciation scoring tied to technical correctness
- Automatic claim generation
- Full safety training
- Certification or accreditation claims
- Direct AFIS claims
- Automated device recommendations based on surface/evidence type
- Accuracy, success-rate, or proficiency scoring based on presentation demonstrations
- Cross-device feature comparison that treats missing data as “no feature”
- All-device final exam before source gaps and attribution conflicts are resolved

## 10. Next Implementation Phases

| Phase | Recommended outcome |
| --- | --- |
| **Device-5D: Device Lab Architecture Plan** | Define shared versus device-specific modules, source/claim metadata, safety gating, and navigation without building routes. |
| **Device-6: Static Device Lab data model** | Create a local-first, evidence-aware schema after architecture approval. |
| **Device-7: Minimal `/device-lab` UI prototype** | Implement only the selected source-ready modules. |
| **Device-8: Local progress** | Add local-only module completion and review state after the prototype is validated. |
| **Device-9: Cloud/admin tracking** | Consider only in a separately authorized phase after local behavior and governance requirements are clear. |
| **Device-10: Source expansion** | Add manuals, datasheets, safety documents, SOPs, validation evidence, and certification records; then reassess blocked modules. |

## 11. Final Recommendation

The project is ready for **Device Lab architecture planning** with strict source and claim controls.

It is not ready for broad curriculum integration, full safety training, performance assessment, automatic claim generation, direct AFIS claims, or an all-device examination. Device-5D should treat every module as a source-owned unit with explicit device scope, evidence level, safety status, blocked claims, and missing-document dependencies.
