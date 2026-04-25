# Argos Speak 90 — Codex Context

## Project
A mobile-first English speaking web app designed to help the user speak more confidently in 90 days.

## Main Goal
This is not a generic English app.
This product is focused on daily speaking practice, listening drills, vocabulary usage, repetition, and output.

## User Goal
The user wants a system that makes them practice every day without confusion.
The app should help the user move from basic English toward functional spoken English step by step.

## Product Principles
- Mobile-first
- Local-first
- Clear daily flow
- Speaking-first learning
- Real, natural English only
- No fake beginner language
- No random filler content
- Short sessions, strong repetition
- Output matters more than passive reading

## Core Flow
Each day should feel simple and clear:
1. Listen
2. Repeat
3. Words
4. Speak
5. Review

## Tech Direction
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- No backend in early phases
- No auth in early phases
- No database in early phases
- Web Speech API may be used for in-browser listening support

## Hard Rules
- Do not overbuild
- Do not add backend unless a phase explicitly requires it
- Do not add auth unless a phase explicitly requires it
- Do not add payment, dashboard, or admin logic
- Do not redesign the whole app unless explicitly asked
- Keep the app mobile-first and highly readable
- Rounded, polished, premium UI only
- Use natural English content only
- Keep components reusable
- One phase at a time

## Workflow Rules
- Read this file before making changes
- Work only on the current phase task file
- Do not jump ahead
- After each phase:
  - run lint
  - summarize changed files
  - explain what should be tested next

## UI Direction
- Calm
- Premium
- Rounded
- Strong spacing
- High readability
- Not childish
- Not flashy
- Not like a generic landing page
- Feels like a personal training system

## Initial Pages
- Today
- Listen
- Words
- Speak
- Review
- Stats
- Settings

## Done Definition for Early MVP
The MVP is useful if:
- the user can open it on phone
- the user understands what to do each day
- the user can listen, read, speak, and review inside the app
- daily progress is visible
- the app does not depend on random external links to work
