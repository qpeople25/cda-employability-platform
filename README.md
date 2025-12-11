# CDA Employability Coach Platform

A comprehensive web application for employability coaches to assess and support 2,400 unemployed Emiratis through structured coaching sessions, barrier identification, and data analytics.

## Features

- **Participant Management**: Create and manage participant profiles with demographic information
- **Admin Panel**: Bulk import participants via Excel/CSV upload with validation
- **Coaching Sessions**: Conduct structured baseline assessments with 8 employability domains
- **Barrier Identification**: Identify and track barriers to employment with severity grading
- **Readiness Scoring**: Automatic calculation of readiness index (0-100) and categorization (A/B/C)
- **Data Export**: Power BI-ready CSV exports for participants, sessions, and barriers
- **Coach-focused UI**: Clean, professional interface optimized for coaching workflow

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma + SQLite
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Ready for Vercel or any Node.js host

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or extract the project**

```bash
cd employability-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Push the Prisma schema to create the SQLite database
npx prisma db push

# Seed the BarrierBank with initial data
npm run db:seed
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Database Management

### View Database Contents

```bash
# Open Prisma Studio to view/edit data
npx prisma studio
```

### Reset Database

```bash
# Clear all data and reseed
npx prisma migrate reset
npm run db:seed
```

### Create Migration

```bash
# After schema changes
npx prisma migrate dev --name your_migration_name
```

## Application Structure

### Key Pages

- `/participants` - List all participants, create new participants
- `/participants/[id]/session` - Conduct/review coaching session for a participant
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin panel with bulk import and statistics

### API Routes

- `POST /api/participants` - Create new participant
- `POST /api/sessions/save` - Save or update a coaching session
- `GET /api/exports/cda/participants.csv` - Export participants data
- `GET /api/exports/cda/sessions.csv` - Export sessions data
- `GET /api/exports/cda/barriers.csv` - Export barriers data

## Coaching Session Workflow

### 1. Profile Tab
- View participant demographics
- Mark consent obtained for assessment

### 2. Coaching Conversation Tab
- Score each of 8 domains (1-7 scale)
- Document behavioral evidence for each score
- Auto-suggested barriers appear when score ≤ 3
- Manually add additional barriers as needed
- Set severity level for each barrier (High/Medium/Low)

### 3. Plan & Summary Tab
- Review all identified barriers grouped by category
- Set short-term goals (2) and long-term goal (1)
- Schedule next touchpoint date
- Add general session notes

### Right Panel
- Real-time readiness index calculation
- Category assignment (A/B/C)
- Visual progress bars for each domain
- Quick access to next touchpoint date

## 8 Employability Domains

1. **Personal Mindset & Motivation** (15%)
2. **Career Awareness & Direction** (15%)
3. **Job Search Skills & Application Readiness** (15%)
4. **Employability & Workplace Skills** (15%)
5. **L&D Engagement** (10%)
6. **Financial Independence & Responsibility** (10%)
7. **Confidence, Resilience & Self-Management** (10%)
8. **Social Support & Environment** (10%)

## Readiness Scoring

### Formula
For each domain: `(score / 7) * weight`, then sum all domains to get 0-100

### Categories
- **Category A**: Index ≥ 80 AND no domain score ≤ 3 (Work-ready)
- **Category C**: Index < 60 (Needs significant support)
- **Category B**: Everything else (Close to work-ready)

## Barrier Bank

The system includes 23+ pre-configured barriers across categories:
- Mindset (low motivation, unrealistic expectations, anxiety)
- Career (lack of direction, limited experience)
- Job Search (no CV, no portal activity, low interview confidence)
- Employability (poor communication, time management, digital literacy)
- Learning (low engagement)
- Financial (pressure, dependency, no budgeting)
- Structural (childcare, transport, caregiving, health)
- Social Support (limited support, cultural constraints, environmental instability)

## Data Export for Power BI

### Participants Export
Contains: participant_id, demographics, created_at

### Sessions Export
Contains: session_id, participant_id, readiness metrics, all domain scores

### Barriers Export
Contains: barrier details, severity, source (auto/manual), dimension, notes

All exports use proper CSV escaping and are compatible with Power BI import.

## Future Enhancements

While out of scope for MVP, the data model supports:
- Multiple sessions per participant (follow-up assessments)
- Session types (baseline, follow_up)
- Barrier status tracking (active, resolved)
- Coach authentication
- Better-Off Calculator integration
- Goal tracking and outcomes measurement

## Project Structure

```
employability-platform/
├── app/
│   ├── api/
│   │   ├── exports/cda/       # CSV export endpoints
│   │   ├── participants/      # Participant CRUD
│   │   └── sessions/          # Session save logic
│   ├── participants/
│   │   ├── [id]/session/      # Session builder page
│   │   └── page.tsx           # Participants list
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── participants/          # Participant-related components
│   └── session/               # Session tab components
├── lib/
│   ├── prisma.ts              # Database client
│   ├── scoring.ts             # Readiness calculations
│   ├── constants.ts           # Domain definitions
│   ├── barriers.ts            # Barrier suggestion logic
│   └── utils.ts               # Helper functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Barrier bank seeding
└── types/
    └── index.ts               # TypeScript types
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

## Support & Feedback

For issues or feature requests, please document them for the development team.

## License

Proprietary - CDA Dubai Community Development Authority
