# Device-5F: 8K Micro-Context Repair Summary

## Scope

Repaired the existing learner-facing 8K micro-contexts identified by `docs/DEVICE_5E_8K_MICRO_CONTEXT_CLAIM_AUDIT.md`. The repair was limited to the runtime curriculum source in `lib/phase-eight-content.ts` and this summary document.

No UI, route, Device Lab architecture/data, sourcebook, extraction, Supabase/Auth/Admin/cloud sync logic, or unrelated curriculum content was changed.

## Changed Files

- `lib/phase-eight-content.ts`
  - Repaired the seed records and runtime overrides for Days 57, 64, 70, 71, 80, 85, and 88.
  - Kept Day 48 unchanged after confirming it does not introduce a filter count, named filter, surface setting, or performance claim.
- `docs/DEVICE_5F_8K_MICRO_CONTEXT_REPAIR_SUMMARY.md`
  - Records the repair scope, claim controls, verification, and remaining limits.

The runtime export files below were inspected but did not require edits:

- `lib/listening-content.ts`
- `lib/words-content.ts`
- `lib/speaking-content.ts`
- `lib/review-content.ts`
- `lib/content-plan.ts`

## Repaired Days and Risks Addressed

| Day | Repair | Risk addressed | Result |
|---:|---|---|---|
| 48 | No text change; regression review only | A future edit could introduce a filter count or surface-specific setting | Descriptive clarification language remains limited to selected light group and motorized/selected filter |
| 57 | Reframed WSQ/TIFF as an example case request | “The report needs WSQ” sounded like a universal manufacturer/device rule | WSQ and TIFF remain export-format vocabulary; the request is explicitly case-specific and not a general device rule |
| 64 | Reframed capture/archive/report as source-listed example language | Feature vocabulary sounded like an exact SOP | The lesson now says the source describes/lists the capabilities and that the example is not a full operating procedure |
| 70 | Added the complete two-part source warning across transcript, key lines, words, review, Speak prompt, listening output, mini goal, and self-check | UVC risk and supplied-darkroom requirement were incomplete; “workflow ready” could imply safety clearance | Learner-facing content states that UVC can be harmful to the human body according to the source and must be used with the supplied darkroom; it also states this is not complete safety training |
| 71 | Added source attribution and scoped the no-powder/no-chemicals wording to the workflow | “It is chemical-free” was too broad and unattributed | Contactless and powder/chemical-free statements are source-described workflow language; 45.9MP “8K” camera wording is retained without performance or pixel-dimension expansion |
| 80 | Replaced generic AFIS/WSQ decision language with manual AFIS preparation language and an explicit limitation | WSQ was presented as potentially correct for AFIS without source support; generic wording could imply interoperability | The unsupported WSQ–AFIS link is removed; the lesson uses manual AFIS submission workflow language and states that direct AFIS integration is not documented in the available source |
| 85 | Removed “try another mode” and “change the light first” recommendations | Presentation features had been turned into unsupported troubleshooting and UV operation advice | The lesson now uses clarification language, confirms the selected mode, states that exact settings are absent from the source, and refers the learner to an operator procedure |
| 88 | Made metadata/reporting statements conditional | Date stamp and geotag were stated as present without an actual record | The software-listed features are described separately from the case record; reporting uses `if recorded`, `when recorded`, and `where enabled` conditions |

## Runtime Repair Coverage

The learner-facing source path was repaired at every relevant transformation point in `lib/phase-eight-content.ts`:

- Day plan `theme` and `speakingGoal`
- Listening `transcript`, `keyLines`, and `miniTaskTr`
- Four technical seed word items and their example sentences
- Three seed review items and model answers
- `deviceSpeakingPromptByDay`
- `deviceListeningOutputByDay`
- `deviceMiniGoalByDay`
- Day 70 safety-specific Speak self-check items

The following runtime transformations remain unchanged and were considered during verification:

- `phaseEightDayPlans` feeds `learningTrackPlan` and the Today page.
- `phaseEightListeningDrills` uses the per-day listening-output overrides rather than the raw seed `outputPrompt`.
- `phaseEightDayWords` is expanded to eight words by `expandDailyWords()`; the appended boosters are general speaking vocabulary and do not add 8K facts.
- `phaseEightSpeakingPractices` uses the per-day Speak and mini-goal overrides and the repaired key lines.
- `phaseEightReviewDrills` is wrapped by `withProductionReviewItem()`; the added production item does not introduce a new 8K claim.

## Claims Deliberately Avoided

The repair does not add or normalize any of the following:

- “World’s first”, “only”, “best”, or “strongest” product language
- “No image distortion”
- “Third-level identification”
- Accuracy, success-rate, guaranteed detection, or evidence-preservation claims
- Remote scanning or “up to 3 meters”
- Crime-gun accreditation, certification, or an unnamed agency
- Direct, automatic, API-based, or certified AFIS integration
- Guaranteed AFIS matching or identification
- WSQ as a universal or source-proven AFIS requirement
- A filter count or resolution of the seven-filter/eight-filter conflict
- Named filters or surface-specific light/filter settings
- A universal troubleshooting order
- A claim that metadata is present without an actual record
- New named surface examples
- Contactless LITE or other-device claims attributed to 8K

## Verification Notes

Manual/scripted source checks confirmed:

- Days 48, 57, 64, 70, 71, 80, 85, and 88 each still exist exactly once in the Phase Eight seed array.
- The target-day source blocks and their runtime override entries do not contain the blocked product/superlative, accreditation, distortion, identification, or three-meter language listed above.
- No filter count was introduced.
- Day 70 includes both `harmful to the human body` and `supplied darkroom` language.
- Day 80 no longer contains WSQ and uses `manual AFIS submission workflow`; it explicitly states that direct AFIS integration is not documented in the available source.
- Day 85 no longer contains “change the light first”, “try another UV”, or “try another light” instructions.
- Day 88 uses conditional metadata language.
- Runtime export files were not changed because their existing map/append/wrapper behavior already carries the repaired Phase Eight records into the learner-facing arrays.

Phase-completion command results:

- Targeted runtime claim verification: **passed**.
- Summary whitespace verification: **passed**.
- `git diff --check`: **passed**.
- `npm run lint`: **not run** because `npm` is unavailable in the current environment.
- `npm run build`: **not run** because `npm` is unavailable in the current environment.

## Remaining Follow-Up Items

- The device-specific extraction lists seven named filters while the High-Tech overview lists an eight-filter system. The conflict remains unresolved and is not present in the repaired curriculum text.
- The available source still does not provide exact light/filter settings, a complete operator procedure, or surface-specific troubleshooting instructions.
- Day 70 remains a narrow source warning, not complete UVC safety/compliance training.
- The available source still does not document direct AFIS integration or establish WSQ as the correct AFIS format.
- Detailed UVC, AFIS, troubleshooting, and professional reporting instruction should remain reserved for a future source-aware Device Lab and stronger manuals/safety documents.
- A full runtime lint/build should be repeated in an environment with npm if it is unavailable in the current session.

## Final Readiness Verdict

The repaired 8K micro-contexts are ready for the main 90-day curriculum at their current lightweight communication-practice depth, subject to successful repository lint/build verification in an npm-capable environment.

Day 48 remains safe as descriptive clarification practice. Days 57, 64, 70, 71, 80, 85, and 88 now preserve the newer source-index and claim-control boundaries. Operational depth has not been expanded; UVC, AFIS, detailed troubleshooting, and case reporting remain limited or deferred to future Device Lab work.

Device-6 may proceed as a separate minimal static-data phase. These repaired micro-contexts must not be copied into Device Lab without preserving their attribution, safety, not-documented, and actual-record controls.
