# Argos Speak 90 Pilot Readiness QA

## 1. Current System Summary

- 90-day speaking-first curriculum repaired and verified.
- 8K device English micro-context integrated only into selected work/technical days.
- Supabase Auth works for team sign-in/sign-up.
- Local-first progress and manual cloud sync are available.
- Admin dashboard works with same-team visibility through existing RLS.
- Accountability coaching widgets are available for admins.
- Mobile density has been reduced across key learner and admin pages.
- ElevenLabs TTS works when the correct voice ID and env vars are configured.

## 2. Pre-Pilot Technical Checklist

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `git status` is clean before deployment.
- [ ] Latest Vercel deploy is successful.
- [ ] Production env var `ELEVENLABS_API_KEY` is present.
- [ ] Production env var `ELEVENLABS_VOICE_ID` is present.
- [ ] Production env var `ELEVENLABS_MODEL_ID` is present.
- [ ] Production env var `NEXT_PUBLIC_SUPABASE_URL` is present.
- [ ] Production env var `NEXT_PUBLIC_SUPABASE_ANON_KEY` is present.
- [ ] Supabase RLS policies are active.
- [ ] Admin user has `role = admin`.
- [ ] Admin user has a valid `team_id`.
- [ ] Test member has `role = member`.
- [ ] Test member has the same `team_id` as the admin.

## 3. Route QA Checklist

### `/`

- [ ] Home page loads on phone.
- [ ] Main CTA text is visible in normal, hover/focus, and active states.
- [ ] CTA opens `/today`.

Expected result: user can start the app without confusion.

### `/today`

- [ ] Active day is visible.
- [ ] Previous/Next day controls work.
- [ ] Today's flow points to Listen, Words, Speak, and Review.
- [ ] Dark card CTA text is readable.

Expected result: user understands what to do today.

### `/listen`

- [ ] Correct day content renders.
- [ ] Transcript is readable.
- [ ] Audio controls are visible when TTS is configured.
- [ ] Mini output answer saves locally and reloads after navigation.
- [ ] Day change updates content.

Expected result: user can listen, read, write a short response, and return later.

### `/words`

- [ ] Exactly 8 vocabulary items appear for the active day.
- [ ] Word meaning is visible without opening details.
- [ ] Example sentence opens in compact details.
- [ ] Word audio and example audio work.
- [ ] Writing practice saves locally and reloads.

Expected result: user can learn and use the day's vocabulary without heavy scrolling.

### `/speak`

- [ ] Prompt is visible.
- [ ] First try textarea saves and reloads.
- [ ] Second try textarea saves and reloads.
- [ ] Task stepper progresses when user writes.
- [ ] Rubric/target lines/self-check details open correctly.

Expected result: user produces a first answer, improves it, and can review the support material.

### `/review`

- [ ] Review tasks render for the active day.
- [ ] Answers can be typed and checked.
- [ ] Feedback/correction remains readable.
- [ ] Production-style review item is visible.
- [ ] Progress summary updates.

Expected result: user practices active recall and sees simple feedback.

### `/journal`

- [ ] Current active day is visible.
- [ ] Saved Listen/Words/Speak answers are visible or expandable.
- [ ] Review answers are summarized.
- [ ] Daily note fields save and reload.
- [ ] Difficult part and next review note save and reload.

Expected result: user can review what they wrote and record weak points.

### `/settings`

- [ ] Active day status is visible.
- [ ] Reset active day works.
- [ ] Clear local progress only clears Argos-owned progress.
- [ ] Cloud account status is correct.
- [ ] Cloud sync controls are visible when signed in.
- [ ] Export/import local progress still works.
- [ ] Pilot guide link opens.

Expected result: user understands local/cloud progress and can manage data safely.

### `/pilot`

- [ ] Pilot guide opens from Settings.
- [ ] Daily workflow is clear.
- [ ] Cloud sync instruction is clear.
- [ ] Admin visibility/privacy wording is clear.

Expected result: pilot users know how to work each day.

### `/login`

- [ ] Supabase not configured state is clear if env vars are missing.
- [ ] Sign-in works for an existing user.
- [ ] Sign-up works for a new user.
- [ ] Sign-up consent checkbox is required only for sign-up.
- [ ] Successful auth redirects to `/account`.

Expected result: team member can create or enter an account.

### `/account`

- [ ] Signed-in email is visible.
- [ ] Role/team status is visible if available.
- [ ] Sign out works.
- [ ] Cloud sync limitation note is clear.
- [ ] Admin link appears only for admin users.

Expected result: user can confirm account state and sign out safely.

### `/admin`

- [ ] Non-admin users cannot see team data.
- [ ] Admin sees team overview.
- [ ] KPI cards fit on phone.
- [ ] Coaching/accountability signals are visible.
- [ ] Member cards are readable.
- [ ] `Detayları gör` links are readable and open detail pages.

Expected result: admin can scan team progress quickly.

### `/admin/users/[userId]`

- [ ] Admin can open same-team user detail.
- [ ] User outside admin team is not visible.
- [ ] Coaching signals appear near the top.
- [ ] Last 7 synced days summary is readable.
- [ ] Practice preview is readable.
- [ ] Expandable archive sections open.
- [ ] Long answers wrap cleanly on mobile.

Expected result: admin can review one user's progress without a wall of text.

## 4. Audio QA Checklist

- [ ] Listen page Play starts audio.
- [ ] Listen page Pause preserves current time.
- [ ] Listen page Resume continues from paused time.
- [ ] Listen page Replay starts from the beginning.
- [ ] Transcript highlighting remains stable and does not shift layout.
- [ ] Day change stops audio and clears highlight.
- [ ] Leaving `/listen` stops audio.
- [ ] Words page word audio plays only the selected word.
- [ ] Words page example audio plays the full example sentence.
- [ ] Starting another word/example stops the current audio.
- [ ] Audio errors show clear Turkish message if ElevenLabs rejects the request.
- [ ] Missing/invalid ElevenLabs config does not show broken controls.

## 5. Cloud Sync QA Checklist

- [ ] Save local Listen output.
- [ ] Save local Words output.
- [ ] Save Speak first and second try.
- [ ] Save Review answers and checked state.
- [ ] Save Journal difficult part and next review note.
- [ ] Press `Cloud’a yedekle`.
- [ ] Clear local progress.
- [ ] Press `Cloud’dan geri yükle`.
- [ ] Confirm restored data appears on learner pages.
- [ ] Press `Senkronize et`.
- [ ] Repeat restore test in another browser/device.
- [ ] Confirm admin sees synced active day, module progress, written answers, and journal notes.

## 6. Admin QA Checklist

- [ ] Signed-out user is redirected or shown login guidance.
- [ ] Non-admin member sees blocked Turkish message.
- [ ] Admin with no `team_id` sees setup warning.
- [ ] Admin sees only same-team members.
- [ ] Admin sees coaching signal cards.
- [ ] Admin sees needs-attention users when applicable.
- [ ] Member detail page opens.
- [ ] Full 90-day grid expandable section works.
- [ ] Practice entries expandable section works.
- [ ] Review answers expandable section works.
- [ ] User not in same team is not visible.

## 7. Curriculum QA Checklist

- [ ] Day 14 milestone includes concrete output criteria.
- [ ] Day 42 milestone includes clarification/help/request criteria.
- [ ] Day 70 milestone includes problem/decision and second-try improvement criteria.
- [ ] Day 90 milestone includes summary, opinion/reason, next step, and weak point criteria.
- [ ] 8K micro-context appears on Day 48.
- [ ] 8K micro-context appears on Day 57.
- [ ] 8K micro-context appears on Day 64.
- [ ] 8K micro-context appears on Day 70.
- [ ] 8K micro-context appears on Day 71.
- [ ] 8K micro-context appears on Day 80.
- [ ] 8K micro-context appears on Day 85.
- [ ] 8K micro-context appears on Day 88.
- [ ] Review production item is visible on sample days.
- [ ] Speak first/second try works on sample days.
- [ ] Journal weak point entry appears in admin detail after cloud sync.

## 8. Pilot Operating Rules

- Users must add at least one personal detail in open answers.
- Users should not copy target lines as their full answer.
- Second try should be clearer, longer, or more accurate than first try.
- Users should end each day with `Cloud’a yedekle` or `Senkronize et`.
- Admin reviews synced written answers for coaching, not punishment.
- Missing work should be handled with supportive follow-up, not public ranking.

## 9. Go / No-Go Criteria

### GO

Pilot can start if:

- Login/sign-up works.
- Local progress saving works.
- Cloud backup/restore/sync works.
- Listen and Words TTS work or fail gracefully.
- Admin can see same-team users.
- Admin user detail pages open.
- Mobile pages have no critical overflow or invisible button text.

### NO-GO

Delay pilot if:

- Login fails.
- Cloud sync fails.
- TTS playback fails without clear fallback.
- Admin access fails for the correct admin user.
- Admin can see users outside their team.
- Core learner routes cannot save or reload local progress.

## 10. Known Limitations

- The app does not guarantee full B1 attainment.
- Curriculum is early B1-oriented in familiar daily/work contexts.
- No automatic AI scoring yet.
- No live pronunciation scoring.
- No voice recording or speech-to-text yet.
- SuperSpectral content is not integrated yet.
- Leaderboard and streak system are not implemented yet.
- Admin data freshness depends on users pressing cloud sync.
- Local progress can be lost if browser data is cleared before cloud backup.

## Final Recommendation

Run a small controlled pilot first. Use one admin and one or two test members, complete Day 1 and one later sample day, sync progress, and verify the admin detail view before inviting the full team.
