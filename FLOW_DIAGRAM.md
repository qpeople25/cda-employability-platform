# Application Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    COACH LOGS INTO SYSTEM                        │
│                    (Or Direct Access in MVP)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PARTICIPANTS LIST PAGE                        │
│  - View all participants                                         │
│  - See assessment status (Assessed / Not Assessed)               │
│  - Create new participant                                        │
│  - Export data to CSV                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Click "Start Assessment" or
                           │ "View Session"
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION BUILDER PAGE                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  TAB 1: PROFILE                                            │  │
│  │  - View participant demographics (read-only)              │  │
│  │  - Mark consent obtained checkbox                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  TAB 2: COACHING CONVERSATION                             │  │
│  │                                                            │  │
│  │  For each of 8 domains:                                   │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ 1. MOTIVATION (Personal Mindset & Motivation)       │  │  │
│  │  │    - Slider: Score 1-7                              │  │  │
│  │  │    - Textarea: Evidence notes                       │  │  │
│  │  │    - Auto-suggestions (if score ≤ 3):              │  │  │
│  │  │      • Low Motivation [Add]                         │  │  │
│  │  │      • Unrealistic Expectations [Add]               │  │  │
│  │  │    - Button: Add Manual Barrier                     │  │  │
│  │  │    - Show added barriers with severity tags         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  (Repeat for Career, Job Search, Employability,          │  │
│  │   Learning, Financial, Resilience, Support)               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  TAB 3: PLAN & SUMMARY                                    │  │
│  │  - View all barriers grouped by category                  │  │
│  │  - Set 2 short-term goals (optional)                      │  │
│  │  - Set 1 long-term goal (optional)                        │  │
│  │  - Schedule next touchpoint date                          │  │
│  │  - Add general session notes                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  RIGHT PANEL: LIVE SUMMARY                                │  │
│  │  - Participant name & demographics                        │  │
│  │  - Readiness Index: 72/100 [progress bar]                │  │
│  │  - Category: B (Close to work-ready)                      │  │
│  │  - Mini bars showing all 8 domain scores                  │  │
│  │  - Next touchpoint date picker                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [Save Session Button]                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Click "Save Session"
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATION & PROCESSING                       │
│  - Check all 8 domains have scores (1-7)                        │
│  - Check all evidence notes ≥ 15 characters                     │
│  - Calculate readiness index                                     │
│  - Assign readiness category (A/B/C)                             │
│  - Save session to database                                      │
│  - Save all barriers to database                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUCCESS & REDIRECT                            │
│  - Show "Session saved successfully!" message                    │
│  - Redirect to Participants List                                 │
│  - Participant now shows as "Assessed"                           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Export Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              COACH CLICKS "EXPORT DATA" BUTTON                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    THREE CSV EXPORTS AVAILABLE                   │
│                                                                   │
│  1. /api/exports/cda/participants.csv                            │
│     ├─ All participant demographics                              │
│     ├─ participant_id, names, gender, age, education, emirate   │
│     └─ Created timestamps                                        │
│                                                                   │
│  2. /api/exports/cda/sessions.csv                                │
│     ├─ All coaching sessions                                     │
│     ├─ session_id, participant_id, occurred_at                   │
│     ├─ readiness_index, readiness_category                       │
│     └─ All 8 domain scores                                       │
│                                                                   │
│  3. /api/exports/cda/barriers.csv                                │
│     ├─ All identified barriers                                   │
│     ├─ barrier_row_id, session_id, participant_id               │
│     ├─ barrier_code, label, category                             │
│     ├─ severity, source (auto/manual), dimension                │
│     └─ status, notes                                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IMPORT INTO POWER BI                          │
│  - Three related tables                                          │
│  - Join on participant_id and session_id                         │
│  - Create dashboards and reports                                 │
│  - Analyze barriers, readiness trends, demographics              │
└─────────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌──────────────────────┐
│    Participant       │
│──────────────────────│
│ id (PK)              │
│ firstName            │
│ lastName             │
│ gender               │
│ ageRange             │
│ education            │
│ emirate              │
│ phone                │
│ email                │
│ createdAt            │
└──────────┬───────────┘
           │
           │ 1:Many
           │
           ▼
┌──────────────────────┐
│      Session         │
│──────────────────────│
│ id (PK)              │
│ participantId (FK)   │───────┐
│ occurredAt           │       │
│ sessionType          │       │
│                      │       │
│ scoreMotivation      │       │
│ scoreCareer          │       │
│ score... (x8)        │       │
│                      │       │
│ notesMotivation      │       │
│ notesCareer          │       │
│ notes... (x8)        │       │
│                      │       │
│ readinessIndex       │       │
│ readinessCategory    │       │
│                      │       │
│ shortTermGoal1       │       │
│ shortTermGoal2       │       │
│ longTermGoal         │       │
│ nextTouchpoint       │       │
│ consentObtained      │       │
└──────────┬───────────┘       │
           │                   │
           │ 1:Many            │
           │                   │
           ▼                   │
┌──────────────────────┐       │
│      Barrier         │       │
│──────────────────────│       │
│ id (PK)              │       │
│ sessionId (FK)       │───────┘
│ participantId (FK)   │
│ barrierBankId (FK)   │───────┐
│ severity             │       │
│ source               │       │
│ dimension            │       │
│ notes                │       │
│ status               │       │
└──────────────────────┘       │
                               │
                               │ Many:1
                               │
                               ▼
                    ┌──────────────────────┐
                    │    BarrierBank       │
                    │──────────────────────│
                    │ id (PK)              │
                    │ code (unique)        │
                    │ label                │
                    │ category             │
                    │ description          │
                    │ defaultSeverity      │
                    │ dimension            │
                    │ active               │
                    └──────────────────────┘
```

## Readiness Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            COACH CHANGES A DOMAIN SCORE                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                REAL-TIME CALCULATION TRIGGERED                   │
│                                                                   │
│  For each of 8 domains:                                          │
│    normalized_score = (score / 7) * weight                       │
│                                                                   │
│  Domain Weights:                                                 │
│    Motivation:     (score/7) * 15%                               │
│    Career:         (score/7) * 15%                               │
│    Job Search:     (score/7) * 15%                               │
│    Employability:  (score/7) * 15%                               │
│    Learning:       (score/7) * 10%                               │
│    Financial:      (score/7) * 10%                               │
│    Resilience:     (score/7) * 10%                               │
│    Support:        (score/7) * 10%                               │
│                                                                   │
│  readinessIndex = sum of all normalized scores (0-100)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                CATEGORY DETERMINATION                            │
│                                                                   │
│  IF readinessIndex >= 80 AND no domain score <= 3:              │
│     Category = A (Work-ready)                                    │
│                                                                   │
│  ELSE IF readinessIndex < 60:                                    │
│     Category = C (Needs significant support)                     │
│                                                                   │
│  ELSE:                                                           │
│     Category = B (Close to work-ready)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              UPDATE RIGHT PANEL DISPLAY                          │
│  - Show readiness index: 72/100                                  │
│  - Show category badge: Category B                               │
│  - Update progress bar color and width                           │
│  - Display category description                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Barrier Suggestion Logic

```
┌─────────────────────────────────────────────────────────────────┐
│          COACH SETS DOMAIN SCORE TO 3 OR BELOW                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              SYSTEM CHECKS BARRIER MAPPINGS                      │
│                                                                   │
│  IF score <= 3:                                                  │
│    Look up dimension in DIMENSION_BARRIER_SUGGESTIONS map        │
│    Fetch relevant barriers from BarrierBank                      │
│    Display as suggestion chips below the domain                  │
│                                                                   │
│  Example:                                                        │
│    Motivation score = 3                                          │
│    → Suggest: "Low Motivation", "Unrealistic Expectations"      │
│                                                                   │
│    Job Search score = 2                                          │
│    → Suggest: "No CV", "No Job Portal Activity",                │
│                 "Low Interview Confidence"                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              COACH CLICKS SUGGESTION                             │
│  - Add barrier to session                                        │
│  - Set severity to default (from BarrierBank)                    │
│  - Mark source as "auto"                                         │
│  - Link to dimension                                             │
│  - Show in "Added Barriers" section                              │
└─────────────────────────────────────────────────────────────────┘
```

This visual flow helps understand how users interact with the system and how data flows through the application!
