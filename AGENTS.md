# AGENTS.md — argos-speak-90 Repository Guide

## 1. Purpose

This file provides durable project instructions for Codex/Work agents working in this repository. It keeps individual prompts smaller and allows each phase to run in a fresh chat without losing repository rules.

- Prefer one Codex chat/task per phase.
- Continue the same chat only for debugging or small revisions inside the same phase.
- Start a new chat for each new phase to avoid context bloat and stale decisions.
- Every task must read and follow this `AGENTS.md`.

## 2. Project Summary

- `argos-speak-90` is a Next.js, TypeScript, and Tailwind CSS web app for a 90-day, speaking-first English learning program.
- The learner goal is practical English before January 2027 Netherlands work travel.
- The app includes a main 90-day curriculum and a future parallel Professional English / Device Lab track.
- Device Lab teaches ForenScope device introductions, customer demonstrations, safe technical explanations, cautious reporting, and question-and-answer practice.
- The project uses source-controlled ForenScope claims. Marketing claims and unsupported technical claims must not become learner-ready content.

## 3. Current Architecture

- Next.js App Router code lives under `app/`.
- Reusable components live under `components/`.
- Main learning content and runtime arrays live under `lib/`.
- Device Lab static data lives under `lib/device-lab/`.
- Documentation lives under `docs/`.
- ForenScope source extractions live under `docs/sources/forenscope/`.

Do not assume raw seed files are final learner-facing content when builder functions transform runtime exports. When auditing curriculum, inspect the runtime export paths, not only the raw source arrays.

## 4. Phase Isolation Rules

- Do only the requested phase.
- Do not modify unrelated files.
- Do not combine phases.
- Do not “clean up” nearby code unless explicitly requested.
- Do not add routes, UI, progress, cloud, or admin changes unless the phase explicitly asks for them.
- Documentation-only phases must not change app code.
- Data-model phases must not change UI or runtime behavior unless explicitly requested.
- UI prototype phases must not add persistence, cloud, or admin behavior unless explicitly requested.

## 5. New Chat Policy

Use a new Codex chat for every new phase, such as Device-7, Device-8, Device-9, a security audit, curriculum repair, or a dependency audit.

Use the same chat only for:

- build errors from the current phase
- lint errors from the current phase
- small follow-up edits to the same patch
- review feedback on the same patch

Before a new phase, the working tree should be clean. Each phase should end with a commit-ready patch and a clear report.

## 6. Git Workflow

- Start by checking `git status`.
- If the working tree is not clean, report it before editing.
- Keep commits phase-scoped.
- Do not mix unrelated documentation and code changes in the same patch.
- After changes, report all changed files.
- Do not run `npm audit fix` or `npm audit fix --force` unless explicitly requested.
- Do not commit automatically.

## 7. Verification Commands

For code or TypeScript changes, run:

```text
npm run lint
npm run build
git diff --check
```

For documentation-only changes, run:

```text
git diff --check
```

If npm or Node.js is unavailable, report that clearly and still run `git diff --check`. Do not claim lint or build passed unless it actually passed in the current environment.

## 8. Main Curriculum Rules

- Do not claim guaranteed B1 proficiency.
- Do not claim expert-level technical-sales fluency.
- The main 90-day curriculum is speaking-first and must not become a device brochure.
- Preserve the daily Listen / Words / Speak / Review / Journal logic unless a phase explicitly changes it.
- Keep completion metrics separate from speaking proficiency.
- Avoid adding technical density to early days.
- Existing 8K micro-contexts were repaired in Device-5F and must remain claim-controlled.

## 9. Device Lab Rules

- Device Lab is a parallel Professional English track, not a replacement for the main 90-day path.
- Static Device Lab data currently lives under `lib/device-lab/`.
- Do not add `/device-lab` routes unless a Device UI phase explicitly asks for them.
- Do not add Device Lab progress, storage, cloud, or admin tracking unless explicitly requested.
- Deny by default: no learner-ready claim without a source reference, product scope, evidence label, claim-control level, and release status.
- Blocked or deferred claims must not be displayed as learner targets.
- Marketing superlatives must not become learning content.

## 10. ForenScope Claim-Control Rules

Never turn the following into learner-ready factual claims unless a later verified source explicitly supports them:

- world's first or first-and-only claims
- strongest, unique, best, or similar marketing phrases
- accreditation or certification without a named agency or certificate
- direct AFIS integration unless documented
- performance, accuracy, sensitivity, or success-rate guarantees
- safety instructions not present in the source
- DNA extraction or analysis by t-ZOOM Plus DNA
- Contactless LITE body fluid, blood, GSR, or Touch DNA claims
- SuperSpectral SAFE content assigned to SuperSpectral Force/Core
- catalog-level claims assigned to individual devices without explicit support

Use cautious wording such as “the source states,” “the manufacturer states,” “demonstrated in the presentation,” and “not documented in the available source.” Presentation examples are not validation studies. Missing evidence means “not documented,” not “false.”

## 11. Device-Specific Boundaries

### 8K

- Direct AFIS integration is blocked.
- The filter-count conflict must not be silently resolved.
- The UVC warning must state that it is harmful to the human body and that the supplied darkroom must be used when UVC is used.

### t-ZOOM Plus DNA

- DNA analysis and extraction claims are blocked.
- Safety instructions are blocked without a safety source.
- Bare t-ZOOM attribution remains cautious.

### SuperSpectral Force/Core

- SuperSpectral SAFE is out of scope.
- Safety instructions are blocked without a source.
- Force/Core application ownership remains cautious.

### Contactless LITE

- Body fluid, blood, GSR, and Touch DNA claims are blocked.
- The world's first claim is blocked.
- Software, reporting, AFIS, cloud, and AI claims are blocked unless source-supported.

### Contactless LAB ULTRA

- It must remain distinct from Contactless LITE and 8K.
- Use only claims supported by its extraction.

### High-Tech catalog

- It is useful for catalog, index, and conflict discovery.
- It is not a device-specific source unless a slide explicitly ties the claim to that device.

## 12. UI/UX Rules

- Design mobile-first.
- Avoid walls of text.
- Use compact cards and progressive disclosure.
- Do not add Device Lab to bottom navigation unless explicitly requested.
- Prefer one conservative entry point from Settings or the Pilot guide for early prototypes.
- Do not show blocked claims with the same visual weight as safe claims.

## 13. Supabase/Auth/Admin/Cloud Rules

- Do not modify the Supabase schema, RLS, Auth, Admin, or cloud sync unless the phase explicitly asks for it.
- Preserve same-team visibility assumptions.
- Admin features are for coaching, not punishment.
- Manual cloud sync is the current model.
- Device Lab cloud and admin tracking is future work.

## 14. TTS Rules

- ElevenLabs API keys must remain server-side.
- Do not expose API keys or environment values.
- Do not add Device Lab TTS or audio unless explicitly requested.
- If changing TTS code, preserve structured errors and avoid increasing abuse or cost risk.

## 15. Reporting Format

Every Codex task final report must include:

- changed files
- what was changed
- what was intentionally not changed
- verification commands and results
- risks or follow-up items
- recommended next phase

For source or content work, also include:

- sources inspected
- claims blocked or kept cautious
- learner-facing risk assessment

## 16. Stop Conditions

Stop and ask or report before proceeding if:

- the working tree is dirty with unrelated files
- required source files are missing
- the prompt contains placeholders instead of full content
- the requested change would mix phases
- the requested change would introduce unsupported device claims
- build or lint fails
- Supabase, Auth, Admin, or cloud changes seem necessary but were not requested

After creating or updating `AGENTS.md`, run `git diff --check`, report changed files, and do not commit automatically.
