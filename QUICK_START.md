# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Terminal/Command line access
- A code editor (VS Code recommended)

## Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd employability-platform
npm install
```

### Step 2: Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Seed barrier data
npm run db:seed
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: http://localhost:3000

## First Use

### 1. Create Your First Participant
- Click "Create Participant" button
- Fill in the form:
  - First Name: Ahmed
  - Last Name: Al Mansoori
  - Gender: Male
  - Age Range: 25-29
  - Education: Bachelor's Degree
  - Emirate: Dubai
- Click "Create Participant"

### 2. Start an Assessment
- Click "Start Assessment" next to Ahmed
- You'll see three tabs:
  1. **Profile** - Verify info, mark consent
  2. **Coaching Conversation** - Score & document
  3. **Plan & Summary** - Review & plan

### 3. Complete the Assessment

**In Profile Tab:**
- Check "Consent obtained" checkbox

**In Coaching Conversation Tab:**
For each of the 8 domains:
- Move the slider to score 1-7
- Write behavioral evidence (at least 15 characters)
- If score ≤ 3, click suggested barriers to add them
- Or click "Add Manual Barrier" for custom barriers

**In Plan & Summary Tab:**
- Review all barriers
- Optionally add goals
- Set next touchpoint date if needed

### 4. Save the Session
- Click "Save Session" button (top right)
- You'll be redirected back to participants list
- Notice the participant now shows as "Assessed"

## Viewing the Data

### Option 1: In the Browser
- View participants list at http://localhost:3000/participants
- Click "View Session" to see/edit assessments

### Option 2: Prisma Studio
```bash
npx prisma studio
```
- Opens at http://localhost:5555
- Browse all database tables
- View/edit data directly

### Option 3: Export CSV
- Click "Export Data" on participants page
- Choose from 3 CSV files:
  - participants.csv
  - sessions.csv
  - barriers.csv
- Import into Excel or Power BI

## Example Scoring Scenarios

### High-Performing Participant (Category A)
- All scores: 6-7
- Readiness Index: ~90
- Few or no barriers
- Category: A (Work-ready)

### Mid-Level Participant (Category B)
- Mixed scores: 4-6
- Some scores at 3
- Readiness Index: 60-79
- Several moderate barriers
- Category: B (Close to work-ready)

### Participant Needing Support (Category C)
- Many low scores: 1-3
- Readiness Index: <60
- Multiple high-severity barriers
- Category: C (Needs significant support)

## Common Tasks

### Reset Everything
```bash
npx prisma migrate reset
npm run db:seed
```

### Update Barrier Bank
Edit `prisma/seed.ts`, then:
```bash
npm run db:seed
```

### View Logs
Check the terminal where `npm run dev` is running

### Stop Server
Press `Ctrl + C` in terminal

## Troubleshooting

### Error: "Module not found"
```bash
npm install
npx prisma generate
```

### Error: "Database doesn't exist"
```bash
npx prisma db push
npm run db:seed
```

### Port 3000 already in use
```bash
# Kill the process
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Prisma Studio won't open
```bash
npx prisma studio --port 5556
```

## Next Steps

1. ✅ Create multiple participants
2. ✅ Complete assessments with different score patterns
3. ✅ Experiment with barrier suggestions
4. ✅ Export data and view in Excel
5. ✅ Try updating an existing session

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set DATABASE_URL environment variable
4. Deploy!

### Other Platforms
- The app works on any Node.js hosting
- Ensure DATABASE_URL is set
- Run build: `npm run build`
- Run production: `npm start`

## Need Help?

- Check README.md for detailed docs
- Review **ADMIN_GUIDE.md** for bulk import instructions
- Review IMPLEMENTATION_SUMMARY.md for features
- View FILE_TREE.md for file locations
- See FLOW_DIAGRAM.md for how it works

---

**You're ready to go! 🎉**

The platform is fully functional and ready to assess participants. Start with the steps above and explore the features.
