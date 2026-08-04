# Argos Speak 90 Tek-Faz Bootstrap Prompt

Bu prompt her yeni Codex görevinde değişmeden kullanılabilir. Faz numarası yazılmaz; kanonik planın tek `Sıradaki` fazını bulur. Aynı görevde bir sonraki faza geçmez.

## Kopyalanacak prompt

```text
Work in the argos-speak-90 repository.

First read AGENTS.md completely. Then read docs/ARGOS_SPEAK_90_PHASE_PLAN.md completely and read every research/design/summary document referenced by the next phase.

Goal:
Execute exactly one next incomplete phase from the canonical phase plan, verify it, report it, and stop.

Phase selection rules:
1. Find the single phase whose exact status is "Durum: Sıradaki".
2. If there is no such phase, if more than one phase is marked Sıradaki, or if its prerequisites are not complete, do not change files. Report the plan inconsistency and stop.
3. Do not select a later phase and do not begin the following phase in this task.

Before editing:
- Run git status and inspect all existing changes.
- Preserve user-owned or unrelated changes. If they conflict with the selected phase and cannot be safely isolated, report the conflict and stop.
- State the selected phase, its prerequisites, its allowlist, its acceptance criteria, and its do-not-do limits.
- Inspect the current implementation relevant to that phase; do not rely only on old summaries.

Execution boundaries:
- Change only files and behavior required by the selected phase.
- Follow AGENTS.md invariants for local progress, the 90-day runtime, Device Lab claim control, accessibility, TTS secrets, microphone privacy, and source files.
- Do not add adjacent features, broad refactors, generated device facts, AI scoring, transcription, cloud recording, admin tracking, autoplay, or unplanned storage migrations.
- Do not edit sourcebooks, extraction files, or files under sources/.
- Do not commit or push.

Verification:
- Run every verification command and browser/device check required by the selected phase.
- Treat lint/build as necessary but not sufficient for audio, recording, accessibility, or storage behavior.
- Run git diff --check.
- Confirm that changed files are within the selected phase scope.

Plan update:
- Only after every acceptance criterion passes, update the selected phase from "Durum: Sıradaki" to "Durum: Tamamlandı" and update the summary table.
- Mark exactly one next eligible phase as "Durum: Sıradaki".
- Do not implement that newly marked phase.
- If acceptance criteria do not pass, do not mark the phase complete. Keep or mark its status accurately, report the blocker, and stop.

Final report:
- Lead with the selected phase outcome.
- List changed files.
- Map evidence to acceptance criteria.
- List verification commands and results.
- State risks or deferred work.
- State the phase status change.
- End with: "The next phase was not started. No commit or push was performed."

Stop after this report.
```

## Neden bu yapı

OpenAI'nin Codex yönlendirmesi büyük görevlerde hedef, bağlam, çıktı ve sınırların açık olmasını; kalıcı depo talimatlarının `AGENTS.md` içinde tutulmasını önerir. Bu prompt ayrıntılı ürün kararlarını tekrar etmez; onları `AGENTS.md` ve kanonik faz planından okur. Böylece tek bir prompt bütün fazlarda kullanılabilir, fakat kapsam büyümesini ve aynı görevde faz zincirlemeyi engeller.

Kaynaklar: [OpenAI — AGENTS.md](https://developers.openai.com/codex/guides/agents-md), [OpenAI — Prompting](https://learn.chatgpt.com/docs/prompting).
