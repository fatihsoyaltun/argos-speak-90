# Actual Curriculum Verification

## Purpose

This document records the verification of the actual exported curriculum content used by the app at runtime.

The goal was to confirm whether the effective Day 1-90 content really includes the Quality-2 and Quality-3 repairs, rather than relying only on raw seed snippets inside the phase content files.

## Actual Source Of Truth

The app uses these final exported arrays:

- `/listen` uses `listeningDrills` from `lib/listening-content.ts`.
- `/words` uses `dayWords` from `lib/words-content.ts`.
- `/speak` uses `speakingPractices` from `lib/speaking-content.ts`.
- `/review` uses `reviewDrills` from `lib/review-content.ts`.
- `/today` uses `learningTrackPlan` from `lib/content-plan.ts` plus `listeningDrills`.

The phase files feed those final exports:

- `lib/phase-seven-content.ts`
- `lib/phase-eight-content.ts`

Important nuance: raw seed snippets inside `phase-seven-content.ts` and `phase-eight-content.ts` are not always the final rendered content. Some runtime content is transformed by exported builder functions or wrapper logic before it reaches the app.

Examples:

- Days 43-90 listening content is exported through `phaseEightListeningDrills`, which uses `buildPhaseEightListeningOutput(day)`.
- Review content is exported through `reviewDrills`, which wraps base review content with production-style review items.
- Vocabulary content is exported through `dayWords`, which expands each day to the expected daily word count.

## Verification Results

| Check | Result |
| --- | --- |
| Listening Day 1-90 exists | PASS |
| Words Day 1-90 exists | PASS |
| Speaking Day 1-90 exists | PASS |
| Review Day 1-90 exists | PASS |
| Exactly 8 vocabulary items per day | PASS |
| At least one production-style review item per day | PASS |
| Milestone criteria visible on Days 14, 42, 70, 90 | PASS |
| Days 43-90 listening output scaled | PASS with nuance |

## Listening Scale Nuance

Many Days 43-90 listening prompts may still visibly start with `Write 2 sentences`.

This does not automatically mean the old weak prompt is still active. The effective runtime prompts now require stronger actions, such as:

- identify the main point
- apply one useful phrase to the user's own life/work
- summarize the main point
- add a short reaction
- add a next step
- mention a weak point
- set a real-world speaking goal

So the check passes, with the nuance that the phrase `Write 2 sentences` remains in some prompts while the task demand is stronger than a generic two-sentence answer.

## Sample Days Checked

### Day 14

- Milestone speaking requires 2-4 short sentences.
- It asks for one personal detail, one simple reason or preference, and one next speaking goal.
- Review includes a production-style item asking for one personal milestone sentence with a weak point and next goal.

### Day 42

- Milestone speaking requires 3-5 sentences.
- It asks for one clarification/help/request pattern, one reason or next step, and a clearly better second try.
- Review includes a production-style weak-point and next-goal item.

### Day 43

- Listening asks the learner to identify the main point and apply one useful phrase to life/work.
- Speaking asks for 4-5 sentences with one reason from the learner's own life.
- Review includes a production-style own-words rewrite with a reason.

### Day 48

- Clarification language is present in vocabulary.
- Listening asks for main point and personal/work application.
- Review includes a production-style clarification question.

### Day 70

- Milestone speaking requires 4-5 sentences.
- It asks the learner to explain a small problem or decision, include one reason or example, and improve one sentence in the second try.
- Listening asks for the main instruction, one polite phrase, and one step to check again.

### Day 71

- Listening asks for summary plus short reaction or next step.
- Speaking uses a mini role-play and requires a follow-up question.
- Review includes a production-style summary and realistic next step.

### Day 86

- Soft opinion language is present.
- Speaking asks for a clear, polite short message reply with a realistic next step.
- Review includes a production-style soft opinion with a short reason.

### Day 90

- Final milestone speaking requires 4-6 sentences or 60-75 seconds.
- It asks for a situation summary, opinion with reason, next step, and one weak point to keep improving.
- Listening asks for main progress point, weak point, and real-world speaking goal.
- Review includes a production-style weak-point and next-goal item.

## Final Verdict

PASS.

The reported curriculum repairs are reflected in the effective runtime exports used by the app.

No immediate content fixes are required before device-source integration.
