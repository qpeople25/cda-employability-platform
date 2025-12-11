# Multi-Coach System Architecture Guide

## Overview

This document describes the changes needed to transform the platform from a single-admin system to a multi-coach system with role-based access control.

## Key Changes

### 1. Database Schema Changes

**New Models:**
- `User` - Replaces simple admin auth with full user management
- `CoachAssignment` - Links coaches to their assigned participants

**Modified Models:**
- `Session` - Now includes `coachId` to track who conducted the session
- `Participant` - Linked to coaches via `CoachAssignment`

### 2. User Roles

**Admin Role:**
- Full system access
- Manage coaches (create, edit, deactivate)
- Assign participants to coaches
- Bulk import participants
- View all data and statistics
- Export all data

**Coach Role:**
- View only assigned participants
- Conduct sessions for assigned participants
- Cannot see other coaches' participants
- Cannot manage users or assignments
- Limited exports (only their participants)

### 3. Authentication Flow

**New Login System:**
- Email + Password authentication (replaces simple password)
- Password hashing with bcrypt
- Role-based session management
- Separate dashboards for Admin vs Coach

**Login Process:**
1. User enters email + password
2. System verifies credentials against User table
3. Creates session with userId and role
4. Redirects to appropriate dashboard:
   - Admin → `/admin/dashboard`
   - Coach → `/coach/dashboard`

### 4. Coach Dashboard Features

**For Coaches:**
- View assigned participants only
- Quick stats (my participants, my sessions, upcoming touchpoints)
- Start/continue sessions with assigned participants
- Cannot create new participants (admin only)
- Cannot see unassigned participants

### 5. Admin Dashboard Features (Enhanced)

**User Management:**
- Create coach accounts
- List all coaches
- Activate/deactivate coaches
- Reset coach passwords

**Assignment Management:**
- View all participants
- Assign participants to coaches
- Bulk assign from Excel (participant + coach email)
- View coach workload (# of participants per coach)
- Reassign participants to different coaches

**Bulk Import Enhanced:**
- Optional `coachEmail` column in Excel
- Auto-assign during import if coach email provided
- Validation: coach must exist and be active

### 6. Filtered Queries

**Key Principle:** Coaches see ONLY their assigned participants

**Implementation:**
```typescript
// For coaches
const myParticipants = await prisma.participant.findMany({
  where: {
    assignments: {
      some: {
        coachId: currentUser.id
      }
    }
  }
});

// For admins
const allParticipants = await prisma.participant.findMany(); // No filter
```

## Database Migration Steps

### Step 1: Update Schema

The new `prisma/schema.prisma` includes:
- User model
- CoachAssignment model
- Session.coachId field
- All necessary relations

### Step 2: Migration Commands

```bash
# Generate migration
npx prisma migrate dev --name add_multi_coach_system

# This will:
# 1. Create User table
# 2. Create CoachAssignment table
# 3. Add coachId to Session table
# 4. Update all relations
```

### Step 3: Data Migration

**For Existing Data:**
If you have existing sessions without coachId:

```sql
-- Option 1: Assign all to a default coach
UPDATE Session SET coachId = 'default-coach-id' WHERE coachId IS NULL;

-- Option 2: Delete old sessions (if in testing phase)
DELETE FROM Session;
DELETE FROM Barrier;
```

### Step 4: Seed New Users

```bash
npm run db:seed
```

This creates:
- Default admin: admin@cda.ae / admin123

## Implementation Files

### Files That Need Major Updates:

1. **lib/auth.ts** - Complete rewrite for User-based auth
2. **app/api/admin/login/route.ts** - Updated for email/password
3. **app/admin/login/page.tsx** - Add email field
4. **app/participants/page.tsx** - Filter by coach assignments
5. **app/participants/[id]/session/page.tsx** - Pass coachId to session
6. **app/api/sessions/save/route.ts** - Include coachId in session
7. **app/api/admin/upload/route.ts** - Handle optional coachEmail

### New Files Needed:

1. **app/coach/dashboard/page.tsx** - Coach-specific dashboard
2. **app/admin/coaches/page.tsx** - Coach management UI
3. **app/admin/assignments/page.tsx** - Assignment management UI
4. **app/api/admin/coaches/route.ts** - CRUD for coaches
5. **app/api/admin/assignments/route.ts** - Manage assignments
6. **components/admin/CoachManagement.tsx** - Coach management UI
7. **components/admin/AssignmentManager.tsx** - Assignment UI
8. **components/coach/CoachDashboard.tsx** - Coach dashboard

## Excel Upload Format (Enhanced)

### New Optional Column: coachEmail

**Example:**

| firstName | lastName | gender | ... | emirate | coachEmail |
|-----------|----------|--------|-----|---------|------------|
| Ahmed     | Al Mansoori | Male | ... | Dubai | coach1@cda.ae |
| Fatima    | Al Mazrouei | Female | ... | Abu Dhabi | coach1@cda.ae |
| Mohammed  | Al Hashimi | Male | ... | Sharjah | coach2@cda.ae |

**Behavior:**
- If `coachEmail` is provided and coach exists → Auto-assign
- If `coachEmail` is blank → No assignment (admin assigns later)
- If `coachEmail` is invalid → Validation error

## Security Considerations

### Password Storage
- All passwords hashed with bcrypt (salt rounds: 10)
- Never store plain text passwords
- Password reset requires admin action

### Session Management
- HttpOnly cookies
- Role stored in session
- Verify role on every protected route
- Auto-logout after 24 hours

### Authorization Checks

**Every protected route must:**
1. Verify user is logged in
2. Check user role (admin vs coach)
3. For coaches: verify they have access to requested resource

**Example Middleware:**
```typescript
async function requireAuth(role?: 'admin' | 'coach') {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (role && user.role !== role) {
    throw new Error('Unauthorized');
  }
  return user;
}
```

## UI/UX Changes

### Navigation Bar

**For Admins:**
- Dashboard
- Participants
- Coaches
- Assignments
- Logout

**For Coaches:**
- My Dashboard
- My Participants
- Logout

### Participant List

**Admin View:**
- All participants
- Shows assigned coach name
- "Assign Coach" button
- Unassigned participants highlighted

**Coach View:**
- Only assigned participants
- No "Create Participant" button
- Shows "You have X participants"

### Session Page

**Both Roles:**
- Same session builder interface
- CoachId automatically captured from logged-in user
- Cannot view sessions from other coaches

## Testing Checklist

### As Admin:
- [ ] Create coach account
- [ ] Assign participants to coach
- [ ] View all participants
- [ ] View all sessions (any coach)
- [ ] Bulk import with coach assignments
- [ ] Export all data

### As Coach:
- [ ] Login with coach credentials
- [ ] See only assigned participants
- [ ] Cannot see unassigned participants
- [ ] Cannot see other coach's participants
- [ ] Create session for assigned participant
- [ ] Cannot access admin functions

## Default Accounts After Seeding

**Admin:**
- Email: admin@cda.ae
- Password: admin123
- Role: admin

**Test Coaches (you need to create these via admin UI):**
- Email: coach1@cda.ae
- Email: coach2@cda.ae
- etc.

## Gradual Rollout Strategy

### Phase 1: Database Migration
1. Update schema
2. Run migration
3. Seed default admin
4. Test admin login

### Phase 2: Create Coaches
1. Build coach management UI
2. Create 6-10 coach accounts
3. Test coach login

### Phase 3: Assignments
1. Build assignment UI
2. Assign existing participants to coaches
3. Test filtered views

### Phase 4: Enhanced Import
1. Update Excel upload to handle coachEmail
2. Test bulk import with assignments
3. Validate coach email checking

### Phase 5: Coach Dashboard
1. Build coach-specific dashboard
2. Test coach session workflow
3. Verify coaches can't see others' data

## Benefits

1. **Scalability**: Support unlimited coaches
2. **Security**: Clear access control per role
3. **Accountability**: Track which coach conducted each session
4. **Workload Management**: See coach capacity
5. **Data Integrity**: Coaches can't accidentally access wrong participants
6. **Audit Trail**: Know who did what

## Migration from Current System

If you already have data:

1. **Backup database:**
   ```bash
   cp prisma/dev.db prisma/dev.db.backup
   ```

2. **Run migration:**
   ```bash
   npx prisma migrate dev --name add_multi_coach
   ```

3. **Create default admin:**
   ```bash
   npm run db:seed
   ```

4. **Login as admin** and create coach accounts

5. **Assign existing participants** to coaches

## Next Steps

To implement this system:

1. ✅ Update `prisma/schema.prisma` (DONE)
2. ✅ Add bcryptjs dependency (DONE)
3. ✅ Update seed file (DONE)
4. ⏳ Update auth.ts with User-based auth
5. ⏳ Update all API routes
6. ⏳ Create coach management UI
7. ⏳ Create assignment management UI
8. ⏳ Create coach dashboard
9. ⏳ Update participant queries with filters
10. ⏳ Update session save to include coachId
11. ⏳ Test thoroughly

**Estimated Implementation Time:** 4-6 hours for full implementation

This is a significant architectural change but necessary for proper multi-coach support!
