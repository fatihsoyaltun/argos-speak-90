# Device-5A: Multi-Device Source Intake Plan

## Purpose

This plan defines a repeatable, evidence-controlled process for extracting ForenScope device presentations before the Device Lab architecture is finalized.

This phase creates documentation only. It does not change app code, curriculum content, UI, Supabase/Auth/Admin/cloud-sync logic, or Device Lab routes.

## 1. Decision

Extract **all available ForenScope device presentations first**, one device at a time, before designing the Device Lab architecture.

The completed 8K presentation extraction and reconciliation provide the intake standard, but the 8K must not become the assumed model for every device. Each presentation needs its own extraction file, product boundary, evidence labels, safety notes, claim controls, missing-source list, and readiness verdict.

The architecture phase should begin only after:

1. Each available device presentation has a completed extraction.
2. Each extraction has passed a claim-control review.
3. Cross-device similarities and differences have been summarized in a device source index.

## 2. Why Device Lab Must Not Be Built From the 8K Alone

Building Device Lab from only the 8K source would create avoidable risks:

- **The architecture may become too 8K-specific.** The 8K emphasizes latent fingerprint imaging, UV/VIS/IR modes, light groups, filters, image export, UVC safety, and AFIS preparation. Other devices may require different concepts and navigation.
- **Device features may be mixed incorrectly.** A product-family overview does not prove that products share specifications or workflows. The 8K extraction already shows this risk with Contactless LITE, which is a separate product.
- **Shared vocabulary may be missed.** Common terms should be identified by comparison across completed extractions, not assumed from one presentation.
- **Safety needs may differ by device.** The 8K includes a source-backed UVC warning and supplied-darkroom requirement. Other devices may have different hazards, controls, or no documented safety guidance.
- **Workflow needs may differ by device.** Capture, inspection, comparison, enhancement, export, preparation, and evidence-handling steps may not be the same.
- **Reporting needs may differ by device.** Metadata, file formats, observations, measurements, comparison notes, and report outputs should not be generalized without cross-device evidence.
- **Application examples may be misunderstood as universal capabilities.** A demonstrated surface or scenario for one device does not establish support for another device.

The 8K extraction should therefore be treated as a **process baseline**, not a **universal device schema**.

## 3. Per-Device Extraction File Naming

Store normalized extraction documents in:

`docs/sources/forenscope/`

Recommended filenames:

- `docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/TZOOM_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/DOCEX_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/SUPERSPECTRAL_PRESENTATION_EXTRACTION.md`
- `docs/sources/forenscope/SAFE_PRESENTATION_EXTRACTION.md`

### Naming Rules

- Use one extraction file per device presentation.
- Use a stable uppercase device slug followed by `_PRESENTATION_EXTRACTION.md`.
- Record the exact original presentation filename inside the extraction file.
- Preserve the product names that appear on-slide; do not invent or normalize a marketing name without noting the source wording.
- If a presentation contains more than one product, identify the target product and label every other product **separate product / out of scope**.
- Do not transfer a claim, feature, surface, safety rule, or workflow from one device extraction into another.
- If two presentations cover the same device, do not silently merge them. Record both source files and reconcile conflicts explicitly.

## 4. Standard Extraction Structure

Every device extraction must use the same top-level structure.

### 0. Slide Map

- List every slide or slide range.
- Identify text-only, image-only, video-only, section-title, and product-family slides.
- Mark slides that concern a separate product or are out of scope.
- Record any slide that could not be fully inspected.

### 1. Product Identity

- Source-supported product names
- Product category
- Intended purpose
- Intended users or environments, if stated
- Product-family relationships
- Separate-product boundaries
- Marketing positioning, clearly labeled

### 2. Verified Technical Facts

Use a table containing:

- Fact or claim
- Slide reference
- Evidence label
- Caveat or validation need

Concrete specifications must remain exactly scoped to the source. Do not infer missing units, standards, compatibility, performance, or operating conditions.

### 3. Hardware / Imaging / Optics / Sensors

Extract only the categories relevant to that device:

- Physical components
- Camera or imaging system
- Light sources
- Optics and filters
- Sensors and measurement ranges
- Power and mobility
- Accessories
- Evidence-contact implications
- Hardware safety notes

If a category is not present in the source, state **not documented** rather than filling the gap from another device.

### 4. Software and Workflow

Extract:

- Operating system or control software
- Capture and inspection workflow
- File formats
- Enhancement or analysis features
- Metadata, stamps, and geo-tags
- Archive and reporting features
- Export and transfer methods
- Named integrations or submission workflows
- Manual versus automated steps

Do not describe a submission or preparation workflow as a direct integration unless the interface is documented.

### 5. Application Areas

For every shown application or surface, record:

- Surface, material, item, or scenario
- What the presentation shows or states
- Slide reference
- Safe description
- Validation caveat

Presentation images are demonstrations unless the source provides a documented test method and results. Do not convert an example into a success-rate or universal-support claim.

### 6. Demo Language Candidates

Draft cautious, source-backed candidates for:

- A2 simple explanation
- B1 customer demo
- Feature explanation
- Short workflow explanation

These are source-extraction candidates, not approved curriculum.

### 7. Troubleshooting Language Candidates

Include only:

- Source-backed checks
- Safe clarification questions
- Non-destructive, non-repair guidance supported by the source
- Clear limits where exact settings or procedures are missing

Do not invent diagnostic sequences, calibration steps, repair actions, or device settings.

### 8. Reporting Language Candidates

Provide non-definitive phrases for:

- Capture conditions
- Observations
- Recorded settings
- Metadata or stamps
- Export and archive steps
- Comparison or submission preparation

Reporting candidates must not imply that a step occurred unless it was actually recorded for the case or demonstration.

### 9. Customer Q&A

Cover:

- What the device is
- What the source says it can do
- What it does not prove
- Safety constraints
- Integration or compatibility limits
- Demonstrated applications
- Separate-product boundaries

Answers must use attribution and cautious wording when the claim is only manufacturer-stated.

### 10. Safety and Compliance Notes

Extract:

- Exact source-backed warnings
- Required accessories or enclosures
- Stated operator instructions
- Named standards, certificates, or compliance documents
- Missing safety information

Safety wording should be repeated in demo, troubleshooting, Q&A, and future-curriculum notes when relevant.

### 11. Risk and Claim-Control Section

Separate:

- Safe, source-backed device vocabulary
- Claims requiring cautious attribution
- Marketing claims
- Claims blocked pending verification
- Separate-product or out-of-scope material

### 12. Missing Documents

List the documents needed to support stronger claims or procedures, such as:

- Operator manual
- Technical datasheet
- Safety/compliance documentation
- Integration documentation
- Accreditation or certification evidence
- Test reports
- Exact settings or operating procedures

### 13. Final Extraction Verdict

State:

- What the presentation documents reliably
- What remains unverified
- Whether it is safe for limited curriculum drafting
- Which topics must remain blocked
- Which next source would improve accuracy most

## 5. Required Evidence Labels

Every important claim must use one of these labels:

| Evidence label | Definition | Use rule |
| --- | --- | --- |
| **verified technical fact** | A concrete name, component, format, count, warning, or specification is explicitly listed in the source. This does not mean independent laboratory validation. | May be reused within its exact source scope. |
| **source-stated capability** | The presentation states that the device or software can perform a function. | Attribute to the source or manufacturer and avoid guarantees. |
| **marketing claim** | Promotional, superlative, comparative, or performance language is not supported by test evidence in the presentation. | Do not use as plain factual curriculum language. |
| **unclear / needs verification** | The claim lacks essential details, documentation, test data, named interfaces, or named authorities. | Block from factual curriculum until a suitable source is obtained. |
| **separate product / out of scope** | The content belongs to another device, product, accessory, or source area outside the target extraction. | Do not mix it into the target device’s facts or language. |

If a claim has mixed status, record both its source status and validation status. For example: **source-stated capability; unverified performance range**.

## 6. Claim-Control Rules

Apply these rules to every device:

1. **No performance guarantees unless quantified in the source.** A quantified claim must still retain its stated conditions, method, units, and evidence limits.
2. **No certification or accreditation claim unless the certificate or agency is named.** Record the certificate number, scope, issuing authority, and source location when available.
3. **No direct integration claim unless documented.** A workflow that prepares or exports data for another system is not proof of a direct, automatic, certified, or API-based integration.
4. **No “world’s first,” “best,” “only,” or similar superlative as factual curriculum language.** Label it as marketing and keep it out of factual instruction unless independently verified.
5. **No surface or application success claim beyond the demonstrated example.** A presentation image does not establish a success rate, validated method, or universal device capability.
6. **No safety instruction beyond source-backed warnings unless a verified manual exists.** Do not invent exposure limits, personal protective equipment, enclosure behavior, emergency steps, or compliance procedures.
7. **No cross-device feature transfer.** Shared branding, a product-family slide, or similar appearance does not prove shared hardware, software, safety, or workflow.
8. **No unsupported accuracy, identification, preservation, or non-destructive guarantee.** Use cautious manufacturer-attributed wording when the source makes such a claim without validation.
9. **No inferred technical specification.** Do not infer sensor model, true resolution, wavelength behavior, range, battery runtime, dimensions, file compatibility, or operating settings.
10. **Keep source wording distinguishable from extraction analysis.** Quotes, paraphrases, draft demo language, and risk notes must not be presented as the same evidence type.

## 7. Device Source Index Plan

After all available presentation extractions are complete, create:

`docs/DEVICE_SOURCE_INDEX.md`

Do not create the index during Device-5A. Its conclusions must come from the completed per-device extractions.

The index should contain one row or section per device with:

| Index field | Required content |
| --- | --- |
| Device name | Source-supported primary name and accepted short name |
| Source file | Exact presentation filename and repository path |
| Extraction file | Normalized extraction path |
| Safe curriculum areas | Vocabulary, workflows, safety language, reporting, or examples safe for controlled drafting |
| Unsafe/blocked claims | Marketing, performance, certification, integration, or safety claims that must not enter curriculum |
| Missing documents | Manuals, datasheets, certificates, integration documents, test reports, or procedures still needed |
| Recommended Device Lab modules | Candidate modules supported by the source, such as overview, vocabulary, demo, workflow, safety, troubleshooting, reporting, or Q&A |

The index should also identify:

- Vocabulary genuinely shared across multiple devices
- Device-specific terminology
- Shared modules supported by more than one extraction
- Modules required by only one device
- Conflicting terminology or claims
- Safety rules that must remain device-specific
- Devices that are not ready for curriculum or UI planning

Recommended Device Lab modules in the index are **architecture inputs**, not authorization to build routes or UI.

## 8. Recommended Workflow

Process one presentation from start to finish before beginning the next:

### A. Add One Original Presentation

Add one presentation to:

`docs/sources/forenscope/originals/`

Preserve the original filename. Do not rename or modify the source presentation unless a separate archival rule requires it.

### B. Run the Extraction Prompt for That Device

Inspect the complete presentation and use the standard extraction structure in this plan. Keep other devices out of scope.

### C. Save the Extraction File

Save the normalized Markdown extraction in:

`docs/sources/forenscope/<DEVICE>_PRESENTATION_EXTRACTION.md`

### D. Verify the Diff

Run:

`git diff --check`

Also confirm that only the original source file and intended extraction document changed for that device intake.

### E. Commit the Completed Device Intake

Commit the original presentation and its completed extraction together with a device-specific commit message. Do not combine unfinished extractions for several devices in one commit.

### F. Repeat for the Next Device

Begin the next presentation only after the current extraction is saved, checked, and committed.

### G. Create the Device Source Index

After every available device presentation has a completed extraction, create `docs/DEVICE_SOURCE_INDEX.md` and compare devices without transferring unsupported claims.

### H. Plan Device Lab Architecture

Use the completed extractions and device source index to decide:

- Shared versus device-specific modules
- Common and device-specific data fields
- Safety placement
- Claim-control metadata
- Navigation and progressive disclosure
- Which devices and modules are ready for a first prototype

Do not finalize Device Lab architecture before this comparison is complete.

## 9. Recommended Extraction Order

Recommended intake sequence:

1. **8K** — completed baseline extraction and reconciliation
2. **TZOOM**
3. **DOCEX**
4. **SUPERSPECTRAL**
5. **SAFE**
6. Any remaining ForenScope presentation, one device at a time

This is an intake order, not a technical priority or claim that one device is more important than another. If source availability requires a different order, process the next complete presentation that is available, but do not extract multiple devices into one file or finalize architecture early.

## 10. Future Implementation Sequence

| Phase | Outcome |
| --- | --- |
| **Device-5A: Source intake plan** | Define the repeatable extraction and claim-control process. |
| **Device-5B: Per-device extractions** | Extract every available device presentation, one device at a time. |
| **Device-5C: Device source index** | Compare safe areas, blocked claims, missing documents, and candidate modules across devices. |
| **Device-5D: Device Lab architecture** | Design shared and device-specific information architecture from the completed evidence base. |
| **Device-6: Static data model** | Define a local-first, source-aware data model after the architecture is approved. |
| **Device-7: First UI prototype** | Build only selected, source-ready modules; do not expose blocked claims. |

Each phase should remain separate. Completion of the plan does not authorize extraction, architecture, data-model, route, or UI work from a later phase.

## 11. Final Recommendation

**Extract all available ForenScope device presentations first, one device at a time. Do not continue toward Device Lab architecture using only the 8K.**

The 8K work is valuable as a controlled extraction example, but it cannot establish the complete set of shared fields, modules, workflows, reporting needs, or safety rules. Complete the remaining per-device extractions, create `docs/DEVICE_SOURCE_INDEX.md`, and only then finalize the Device Lab architecture.
