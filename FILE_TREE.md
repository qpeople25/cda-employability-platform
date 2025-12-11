# Complete File Tree

```
employability-platform/
│
├── app/
│   ├── api/
│   │   ├── exports/
│   │   │   └── cda/
│   │   │       ├── participants.csv/
│   │   │       │   └── route.ts
│   │   │       ├── sessions.csv/
│   │   │       │   └── route.ts
│   │   │       └── barriers.csv/
│   │   │           └── route.ts
│   │   ├── participants/
│   │   │   └── route.ts
│   │   └── sessions/
│   │       └── save/
│   │           └── route.ts
│   │
│   ├── participants/
│   │   ├── [id]/
│   │   │   └── session/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   │
│   ├── participants/
│   │   └── CreateParticipantDialog.tsx
│   │
│   └── session/
│       ├── CoachingConversationTab.tsx
│       ├── PlanSummaryTab.tsx
│       ├── ProfileTab.tsx
│       ├── SessionPageClient.tsx
│       └── SessionRightPanel.tsx
│
├── lib/
│   ├── barriers.ts
│   ├── constants.ts
│   ├── prisma.ts
│   ├── scoring.ts
│   └── utils.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── types/
│   └── index.ts
│
├── .env
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── setup.sh
├── tailwind.config.ts
└── tsconfig.json
```

## File Descriptions

### Root Configuration Files
- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration for Tailwind
- **next.config.js**: Next.js configuration
- **.env**: Environment variables (DATABASE_URL)
- **.gitignore**: Git ignore patterns
- **README.md**: Comprehensive project documentation
- **setup.sh**: Automated setup script

### App Directory (Next.js 14 App Router)

#### API Routes
- **api/participants/route.ts**: POST endpoint to create participants
- **api/sessions/save/route.ts**: POST endpoint to save/update sessions
- **api/exports/cda/participants.csv/route.ts**: CSV export for participants
- **api/exports/cda/sessions.csv/route.ts**: CSV export for sessions
- **api/exports/cda/barriers.csv/route.ts**: CSV export for barriers

#### Pages
- **page.tsx**: Root page (redirects to /participants)
- **layout.tsx**: Root layout with navigation
- **participants/page.tsx**: Participants list page (server component)
- **participants/[id]/session/page.tsx**: Session builder page (server wrapper)
- **globals.css**: Global CSS with Tailwind directives

### Components Directory

#### UI Components (shadcn/ui)
- **badge.tsx**: Badge component for severity tags
- **button.tsx**: Button component
- **dialog.tsx**: Modal dialog component
- **input.tsx**: Input field component
- **label.tsx**: Label component
- **select.tsx**: Dropdown select component
- **tabs.tsx**: Tabs component
- **textarea.tsx**: Textarea component

#### Participant Components
- **CreateParticipantDialog.tsx**: Dialog form to create new participants

#### Session Components
- **SessionPageClient.tsx**: Main session page client component with state management
- **ProfileTab.tsx**: Profile information tab
- **CoachingConversationTab.tsx**: Domain scoring and barrier selection tab
- **PlanSummaryTab.tsx**: Barriers summary and action planning tab
- **SessionRightPanel.tsx**: Right sidebar with readiness metrics

### Lib Directory
- **prisma.ts**: Prisma client singleton
- **scoring.ts**: Readiness index and category calculation functions
- **constants.ts**: Domain configurations, emirates, age ranges, etc.
- **barriers.ts**: Barrier suggestion logic and mapping
- **utils.ts**: Utility functions (CSV generation, date formatting, cn helper)

### Prisma Directory
- **schema.prisma**: Database schema (Participant, Session, BarrierBank, Barrier models)
- **seed.ts**: Database seeding script for BarrierBank

### Types Directory
- **index.ts**: TypeScript type definitions and interfaces

## Key Technologies Used

- Next.js 14 with App Router
- TypeScript
- Prisma ORM with SQLite
- Tailwind CSS
- Radix UI (via shadcn/ui)
- React Server Components
- API Routes
