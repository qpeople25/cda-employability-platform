# Multi-Coach System - Implementation Roadmap

## What Has Changed So Far

### ✅ Completed:
1. **Database Schema** - Updated `prisma/schema.prisma`
   - Added `User` model for coaches and admins
   - Added `CoachAssignment` model for participant-coach linking
   - Added `coachId` to Session model
   - Added all necessary relationships

2. **Seed File** - Updated `prisma/seed.ts`
   - Creates default admin user (admin@cda.ae / admin123)
   - Hashes passwords with bcrypt
   - Seeds BarrierBank as before

3. **Dependencies** - Updated `package.json`
   - Added `bcryptjs` for password hashing
   - Added `@types/bcryptjs` for TypeScript support

## What Still Needs to Be Done

### Critical Path Implementation:

#### 1. Authentication System (2-3 hours)
**Files to Update:**
- `lib/auth.ts` - Rewrite for User model and password verification
- `app/api/admin/login/route.ts` - Update for email/password auth
- `app/admin/login/page.tsx` - Add email field to login form

#### 2. Coach Management (2 hours)
**New Files to Create:**
- `app/admin/coaches/page.tsx` - Coach management page
- `app/api/admin/coaches/route.ts` - Coach CRUD API
- `components/admin/CoachManagement.tsx` - Coach management UI

**Features:**
- Create new coach accounts
- List all coaches with stats
- Activate/deactivate coaches
- Reset passwords

#### 3. Assignment Management (2 hours)
**New Files to Create:**
- `app/admin/assignments/page.tsx` - Assignment management page
- `app/api/admin/assignments/route.ts` - Assignment API
- `components/admin/AssignmentManager.tsx` - Assignment UI

**Features:**
- View all participants with their coach assignments
- Assign/reassign coaches to participants
- Bulk assignment functionality
- Unassigned participants filter

#### 4. Coach Dashboard (2 hours)
**New Files to Create:**
- `app/coach/dashboard/page.tsx` - Coach-specific dashboard
- `components/coach/CoachDashboard.tsx` - Coach dashboard UI

**Features:**
- Show only assigned participants
- Stats: my participants, my sessions
- Quick access to start sessions
- Upcoming touchpoints view

#### 5. Filtered Queries (1-2 hours)
**Files to Update:**
- `app/participants/page.tsx` - Filter by role
- `app/participants/[id]/session/page.tsx` - Check assignment
- All data export routes - Filter by coach if not admin

#### 6. Session Updates (1 hour)
**Files to Update:**
- `app/api/sessions/save/route.ts` - Capture coachId from logged-in user

#### 7. Enhanced Bulk Import (1 hour)
**Files to Update:**
- `app/api/admin/upload/route.ts` - Handle optional coachEmail column
- Excel template - Add coachEmail example

## Quick Start Implementation

### Step 1: Database Migration
```bash
# Navigate to project
cd C:\Projects\employability-platform

# Install new dependencies
npm install

# Generate Prisma client with new schema
npx prisma generate

# Create migration
npx prisma migrate dev --name add_multi_coach_system

# Seed with default admin
npm run db:seed
```

### Step 2: Test Current State
```bash
# Start server
npm run dev

# Try logging in as admin
# Email: admin@cda.ae
# Password: admin123
# This will FAIL because auth.ts needs updating
```

### Step 3: Update Auth System
You'll need to update the authentication files to work with the new User model. The current simple password-based system needs to become an email/password system.

## Decision Point

You have two options:

### Option A: Phased Implementation (Recommended)
1. I provide you with the fully updated codebase incrementally
2. You test each phase before moving to the next
3. More controlled, easier to debug
4. Takes 4-6 hours total

### Option B: Complete Rewrite
1. I rewrite ALL files at once
2. You get the complete multi-coach system
3. Requires thorough testing all at once
4. Same time commitment but riskier

## My Recommendation

**Implement in phases:**

**Phase 1 (Today):**
- Database migration ✅
- Updated seed ✅
- Test migration works

**Phase 2 (Next Session):**
- Update auth system
- Update login page
- Create coach management
- Test admin can create coaches

**Phase 3 (Following Session):**
- Create assignment system
- Update participant queries
- Create coach dashboard
- Test coach access control

**Phase 4 (Final Session):**
- Enhanced bulk import
- Data exports filtering
- Complete testing
- Documentation

## What You Should Do Now

### Immediate Next Steps:

1. **Run the migration:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name add_multi_coach
   npm run db:seed
   ```

2. **Check the database:**
   ```bash
   npx prisma studio
   ```
   You should see:
   - User table (with 1 admin)
   - CoachAssignment table (empty)
   - Session table (with new coachId column)

3. **Decide on approach:**
   - Do you want me to provide all updated files now?
   - Or implement phase by phase?

## File Checklist

### Files Changed (Available Now):
- [x] prisma/schema.prisma
- [x] prisma/seed.ts
- [x] package.json

### Files That Need Updating:
- [ ] lib/auth.ts
- [ ] app/api/admin/login/route.ts
- [ ] app/admin/login/page.tsx
- [ ] app/participants/page.tsx
- [ ] app/participants/[id]/session/page.tsx
- [ ] app/api/sessions/save/route.ts
- [ ] app/api/admin/upload/route.ts
- [ ] app/admin/dashboard/page.tsx
- [ ] components/admin/AdminDashboardClient.tsx

### New Files Needed:
- [ ] app/coach/dashboard/page.tsx
- [ ] app/admin/coaches/page.tsx
- [ ] app/admin/assignments/page.tsx
- [ ] app/api/admin/coaches/route.ts
- [ ] app/api/admin/assignments/route.ts
- [ ] components/admin/CoachManagement.tsx
- [ ] components/admin/AssignmentManager.tsx
- [ ] components/coach/CoachDashboard.tsx

## Estimated Timeline

**If implementing all at once:** 4-6 hours of development + 2-3 hours testing
**If implementing in phases:** Same time but spread over multiple sessions

## Questions to Answer

1. **Do you want all files now or phased implementation?**
2. **Do you already have test participants/sessions in your database?**
3. **How many coaches do you need (6-10)?**
4. **Do you want coaches to be able to reset their own passwords?**
5. **Should admins be able to delete coaches or just deactivate?**

## Contact

Reply with:
- Your preference (all at once vs phased)
- Answers to the questions above
- Any specific requirements for coach/admin features

I'll then provide the complete updated codebase based on your needs!
