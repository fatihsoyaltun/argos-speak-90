# ForenScope Source Extraction — SuperSpectral Force & Core
Source: docs/sources/forenscope/originals/[PRESENTATION_FILE_NAME] ("SuperSpectral Family.pptx", 40 slides)
Extraction date: 2026-07-31

**Evidence label definitions used below**
- `verified technical fact` — a specific, literal spec explicitly printed in the deck; "verified" = confirmed present in source, not independently lab-tested
- `source-stated capability` — a functional capability the manufacturer states the device has, with no independent validation shown in the deck
- `marketing claim` — tagline/superlative/promotional phrase with no technical substantiation
- `unclear / needs verification` — ambiguous, inconsistent, or under-specified
- `separate product / out of scope` — belongs to a different ForenScope product line

## 1. Slide Map
| # | Content | Scope |
|---|---|---|
| 1 | Cover: "Since 2002" / "Innovation in Forensics" | Company-level |
| 2 | Company background (20+ yrs, 6 continents/~100 countries), mfg locations (Istanbul, Netherlands, Hong Kong) | Company-level |
| 3 | "SOLUTIONS" full product catalog (SuperSpectral, t-Zoom Plus, CSI Pro 3, 8K Android, Contactless Lite, Contactless Lab Ultra, T-65 ALS 2, Pocket Power, SAFE Ultra, SAFE & SAFE Pro, SuperSpectral SAFE, DOCEX MSC Tablet) | **Other products — out of scope** |
| 4 | SuperSpectral FORCE hero/marketing slide | Force |
| 5 | Force spec list | Force |
| 6 | Force light systems (Macro Micro Lens) | Force |
| 7 | Force motorized filters | Force |
| 8 | SuperSpectral CORE hero/marketing slide | Core |
| 9 | Core spec list | Core |
| 10 | Core light systems (Power Lens) | Core |
| 11 | Core motorized filters | Core |
| 12 | "Components of SuperSpectral Force" | Force |
| 13 | Light & Filter System of SuperSpectral Force (detail) | Force |
| 14 | Unique Fingerprint Lens 1: IR Anti-Stokes Lens | Force (per slide 12 attribution) |
| 15 | Unique Fingerprint Lens 2: Contactless Lens | Force (per slide 12 attribution) |
| 16 | "Application Areas" section header | Force/Core (ambiguous which) |
| 17–29 | Demo photo slides (blood, semen, GSR, drugs, accelerant, document, bruise, fingerprint, currency) | Force/Core (no per-slide device label — see caveats) |
| 30 | SuperSpectral SAFE hero/divider | **Separate product — out of scope** |
| 31–40 | SuperSpectral SAFE components, light/filter system, application demos | **Separate product — out of scope** |

## 2. Product Identity
- **Product names:** SuperSpectral Force; SuperSpectral Core (two SKUs in one family line)
- **Aliases on slides:** "SUPERSPECTRAL FORCE" / "SuperSpectral Force"; "SUPERSPECTRAL CORE" / "SuperSpectral Core"; generic "SUPERSPECTRAL" node on the portfolio slide (3) doesn't distinguish Force vs. Core
- **Product category** (slide 4/8, source-stated): "Superspectral Ultra High Resolution Mobile Forensic Imaging System"
- **Intended purpose:** forensic evidence imaging — blood, body fluids, GSR, fibres/hair, tooth/bone, bruises/bite marks, fingerprints, documents, drugs (per icons and demo captions)
- **Target users/use cases:** forensic science / crime scene investigation (CSI) — slide 13 explicitly says "CSI"; company positions itself broadly in "Forensic Science and Forensic Medicine" (slide 2)
- **Positioning statements (marketing):**
  - "THE FORCE OF TRUTH IN EVERY PIXEL" (Force, slide 4) — `marketing claim`
  - "ESSENTIAL POWER FORENSIC PRECISION" (Core, slide 8) — `marketing claim`
  - "The Strongest Illumination System which creates a brand-new examination method in CSI" (slide 13) — `marketing claim`

## 3. Verified Technical Facts Table

| Fact | Slide | Evidence level | Claim-control note |
|---|---|---|---|
| Force sensor: 200MP | 5 | verified technical fact | numeric spec only, no independent datasheet |
| Force/Core spectral range: 330–1100 nm UV/VIS/IR | 5, 9 | verified technical fact | identical figure on both devices |
| Force display: 6.8'' | 5 | verified technical fact | — |
| "Full HD + Resulation" [sic] | 5, 9 | unclear / needs verification | typo; unclear if display or video resolution |
| Force storage: 1TB | 5 | verified technical fact | — |
| Battery: 51.8Wh, "up to 4-5 hours" | 5, 9 | source-stated capability | runtime estimate, no test conditions given |
| 4K video / RAW imaging / continuous autofocus / 10x digital zoom | 5, 9 | verified technical fact | zoom is explicitly digital, not optical |
| Force: 3 light systems in "Macro Micro Lens" — Top (12 groups), Spot (6 groups), Oblique (7 groups) | 6 | verified technical fact | full group lists transcribed in source |
| Force: 12 motorized filters (Vis-Pass, 415/450/470/495/532/550/570/590/620/715/850nm bands) | 7 | verified technical fact | NBP/LBP labels shown on slide, not defined elsewhere in deck |
| Force components (6 items): Force System, Power Macro Ring Light + Macro/Micro Ring Light, IR Anti-Stokes Lens (optional), Contactless Lens (optional), Case Management System, Illuminated Darkroom | 12 | verified technical fact | last two items named only — no further description anywhere in deck |
| "12 filters... fully automatic via integration into software" | 13 | source-stated capability | no UI/workflow shown |
| Power Macro Ring Light: 8 groups; Macro & Micro Ring Light (darkroom): 12 groups | 13 | verified technical fact | relationship to slide 6's Top/Spot/Oblique lists is not explained — `unclear/needs verification` |
| IR Anti-Stokes Lens: non-destructive fingerprint imaging on money/documents/banknotes without damage; supports "secret investigations"; removes background/writing | 14 | source-stated capability | no validation data shown |
| Contactless Lens: fingerprint exam on reflective surfaces (mirror, glass, screens, tiles, windows) without chemicals/powder, via coaxial light | 15 | source-stated capability | slide 28 appears to demo this but doesn't name the lens |
| Core sensor: 64MP | 9 | verified technical fact | notably lower than Force's 200MP |
| Core display: 6.9'' | 9 | verified technical fact | slightly larger than Force despite lower tier — flagged, not an error |
| Core storage: 256GB | 9 | verified technical fact | vs. Force's 1TB |
| Core: 2 light systems in "Power Lens" — IN (12 groups incl. "White+"), OUT (8 groups) | 10 | verified technical fact | "White+" undefined — `unclear/needs verification`; Core uses a different lens architecture name than Force, not a stripped Force |
| Core: 9 motorized filters (Vis-Pass, 415/450/495/532/550/570/590/715nm) | 11 | verified technical fact | narrower band set than Force (missing 470/620/850nm) |
| No "Components of SuperSpectral Core" slide exists | — | unclear / needs verification | cannot confirm Core supports IR Anti-Stokes Lens, Contactless Lens, Case Management System, or Illuminated Darkroom |
| Company: "over 20 years" in Forensic Science/Medicine; "Since 2002" | 1, 2 | marketing claim | company-level, not device-specific |
| "available on 6 continents and near 100 countries" | 2 | marketing claim | unverifiable distribution claim |
| Mfg locations: Istanbul, Netherlands, Hong Kong | 2 | unclear / needs verification | not tied explicitly to Force/Core |

## 4. Hardware / Imaging / Optics / Sensors
- Sensors: Force 200MP vs. Core 64MP; shared 330–1100nm UV/VIS/IR range
- Optics: Force = "Macro Micro Lens" (3-light-system ring: top/spot/oblique); Core = "Power Lens" (2-light-system: IN/OUT)
- Filters: motorized wheel — 12 positions (Force) vs. 9 (Core), named by pass-band wavelength
- Optional lenses (Force-attributed only): IR Anti-Stokes Lens, Contactless Lens
- Illumination: Power Macro Ring Light (8 groups) + Macro & Micro Ring Light darkroom system (12 groups) — Force, slide 13
- Form factor: handheld terminal + camera head + separate battery grip (observed in hero images, slides 4/8) — no weight/dimensions stated anywhere
- Storage/display/battery: see table above

## 5. Software and Workflow
- "Case Management System" is named as Force component #5 (slide 12) but has **zero further description** — no screenshots, no capture/export/report workflow shown. Flag as documentation gap.
- Filter automation is software-driven per slide 13 ("fully automatic via integration into the software") — `source-stated capability`, no UI shown.
- Visual-only observation (not text claim): demo photos on slide 17 carry an on-image metadata overlay — timestamp, GPS coordinates, and a filter/light code (e.g., "F1: LP715 F2: Monocolor"). This suggests the capture output embeds settings/location metadata, but no menu or software screen is shown anywhere in the deck to confirm the feature. `unclear / needs verification`.
- No connectivity, cloud sync, export format, or report-generation feature is described in text anywhere in the Force/Core section.

## 6. Application Areas and Demonstrated Scenarios

| Scenario | Claimed/demonstrated result | Slide | Safe English phrase (draft) | Caveat |
|---|---|---|---|---|
| Blood & semen on colored underwear | Before/after photo pair; stains visible under filtered spectral image | 17 | "In this demonstration, blood and semen staining on colored fabric became visible under filtered spectral imaging." | Single vendor demo photo; no independent validation |
| Semen on multicolored surface | Photo demo, caption only | 18 | "Demo imagery shows semen staining made visible on a multicolored surface." | Caption-only, no method shown |
| Semen on dark underwear | Photo demo, caption only | 19 | "Demo imagery shows semen staining detected on dark fabric." | Caption-only |
| Blood on cotton fabric | Photo demo | 20 | "Demo imagery shows blood traces on cotton fabric." | Caption-only |
| Blood traces on black t-shirt | Photo demo | 21 | "Demo imagery shows blood traces on a black garment." | Caption-only |
| GSR on black t-shirt | Photo demo | 22 | "Demo imagery shows gunshot residue detection on a black garment." | Detection method/chemistry not explained |
| Drugs – Ecstasy | Photo demo | 23 | "Demo imagery is captioned as an Ecstasy sample." | No confirmation methodology described |
| Drug – TUSI (MDMA+Ketamine) | Photo demo | 24 | "Demo imagery is captioned as a TUSI (MDMA+ketamine) sample." | Caption-only |
| Accelerant | Photo demo | 25 | "Demo imagery is captioned as an accelerant application area." | Accelerant type/surface not specified |
| Document exam on a cheque | Photo demo | 26 | "Demo imagery shows a document-examination scenario on a cheque." | Specific findings not described |
| Bruise examination | Photo demo | 27 | "Demo imagery shows a bruise-examination scenario." | Caption-only |
| Fingerprint on phone screen | Single high-detail fingerprint image, captioned "imaged without powder or chemicals" | 28 | "Demo imagery shows a fingerprint recovered from a phone screen without powder or chemicals." | Doesn't explicitly name Contactless Lens; single photo, no process shown |
| US Dollar / Euro / Pound | Three demo images by currency | 29 | "Demo imagery is captioned by currency (US Dollar, Euro, Pound)." | Content of images (what feature is shown) not stated in text — `unclear/needs verification` |

## 7. Safety and Compliance Notes
**None found.** No safety warnings, exposure limits, certifications, or usage requirements appear anywhere in the Force/Core section of the deck (slides 1–29). This is a documentation gap, not an omission on my part — flagged in Section 10.

## 8. Demo Language Candidates (drafts, source-backed, NOT final curriculum)
- **A2 simple:** "This device is a special camera that uses different colors of light to find things you can't see normally — like blood, fingerprints, or writing on paper."
- **B1 customer demo:** "SuperSpectral Force/Core is a handheld forensic imaging camera combining a high-resolution sensor with UV, visible, and infrared light sources and up to 12 motorized filters, letting an examiner switch lighting and filtering to look for evidence such as blood, body fluids, gunshot residue, and fingerprints without chemicals."
- **Technical operator instruction:** "Select the light group appropriate to the surface (Top/Spot/Oblique on Force, IN/OUT on Core) and the matching narrow- or long-band-pass filter; filter selection is software-controlled once configured."
- **Troubleshooting/clarification:** "If a stain isn't visible, try a different light group or wavelength filter — the deck lists up to 12 (Force) or 9 (Core) filter options across the 330–1100 nm range."
- **Professional reporting language:** "Examination was conducted using a SuperSpectral [Force/Core] mobile forensic imaging system operating across a 330–1100 nm UV/VIS/IR range with [specific light/filter configuration] to visualize [evidence type]." — leave bracketed fields; do not assert unverified case specifics.
- **Customer Q&A:** Q: "Can this replace chemical fingerprint processing?" A: "The manufacturer states the optional Contactless Lens can image fingerprints on reflective surfaces without powder or chemicals (per product deck) — validate against your lab's own protocols."

## 9. Risk and Claim-Control Section
**Safe customer-facing claims:** sensor resolution, spectral range, filter/light-group counts and names, storage, screen size, battery capacity, 4K/RAW/autofocus/zoom specs — all plainly printed specs.

**Cautious claims (attribute, don't assert as fact):** icon-based capability claims (Blood/Fluid/GSR/Fibres/Tooth-Bone/Bruise detection icons, slides 4/8) — no method or limits explained; IR Anti-Stokes and Contactless Lens performance claims; all demo photos (17–29) — present as "manufacturer demonstration," not proven forensic performance.

**Claims blocked until verification:** battery runtime conditions; "Case Management System" and "Illuminated Darkroom" functionality (undocumented); Core's compatibility with optional lenses; any accuracy/sensitivity/detection-limit statistic (none exist in deck); any safety/exposure/compliance statement (none exist).

**Marketing phrases to exclude from curriculum:** "THE FORCE OF TRUTH IN EVERY PIXEL"; "ESSENTIAL POWER FORENSIC PRECISION"; "The Strongest Illumination System which creates a brand-new examination method in CSI"; "near 100 countries" / "6 continents."

## 10. Missing Documents
- User manual (menu structure, Case Management System workflow)
- Technical datasheet (weight, dimensions, IP rating, ports, optical vs. digital zoom breakdown)
- Safety document (UV/IR exposure limits, LED/laser classification, CE/FCC compliance)
- Certification/accreditation evidence (forensic validation, lab accreditation, court admissibility)
- SOPs per application area (blood, semen, GSR, fingerprints, documents, drugs)
- Validation/performance data (sensitivity, specificity, comparative studies)
- Clarification: does Core support the Force-listed optional lenses?
- Definition of "Case Management System," "Illuminated Darkroom," "White+" light group, NBP/LBP abbreviations

## 11. Device Training Potential (suggested packs only)
- 30-second intro: device + headline spec (sensor + spectral range)
- 90-second demo: capability icons + one demo photo (blood on fabric)
- Workflow explanation: light-system/filter-selection logic (Force Top/Spot/Oblique vs. Core IN/OUT)
- Safety instruction: **blocked** — no source safety content exists
- Troubleshooting dialogue: choosing a different filter/light group when a stain doesn't appear
- Customer Q&A: Force vs. Core differences; chemical-free fingerprint claims
- Reporting summary: neutral device+settings language (Section 8)
- Final demo challenge: match light/filter combo to evidence type using the deck's own examples

## 12. Final Extraction Verdict
- **Sufficient for sourcebook?** Partially — hardware specs (sensor, spectral range, filters, light systems, storage, battery, video) are clearly and consistently source-backed for both Force and Core.
- **Safe for curriculum integration?** Only the plain spec facts and clearly-attributed capability/application claims (framed as "manufacturer states"). Icon claims and demo photos require "per manufacturer demonstration" framing, not proven-performance language.
- **Must remain blocked:** safety/compliance content (none exists), Case Management System & Illuminated Darkroom functionality (undocumented), any accuracy/validation statistics (none exist), Core's optional-lens compatibility (unconfirmed), and all SuperSpectral SAFE content (slides 30–40 — separate product, explicitly out of scope).
