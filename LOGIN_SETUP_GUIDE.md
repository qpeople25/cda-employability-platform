# 🔧 Setup & Login Troubleshooting Guide

## ✅ Confirmed Login Credentials

```
Email:    admin@cda.ae
Password: admin123
```

These credentials are created by the seed script and should work once the database is properly set up.

---

## 🚀 Complete Setup Steps (Do This First!)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

### Step 3: Create & Run Database Migration
```bash
# This creates the database with all tables including User, AuditLog, etc.
npx prisma migrate dev --name complete_setup

# When prompted, type a name or just press Enter
```

### Step 4: Seed the Database
```bash
# This creates the admin user with the credentials above
npm run db:seed
```

You should see output like:
```
Seeding database...
Seeding BarrierBank...
✓ Seeded 23 barriers to BarrierBank
Creating default admin user...
✓ Created admin user: admin@cda.ae / admin123

Seeding complete!

Default Login:
Email: admin@cda.ae
Password: admin123
```

### Step 5: Start the Server
```bash
npm run dev
```

### Step 6: Login
Navigate to: `http://localhost:3000/admin/login`

Use:
- Email: `admin@cda.ae`
- Password: `admin123`

---

## 🔍 Troubleshooting Login Issues

### Issue 1: "Invalid email or password"

**Possible Causes:**
1. Database not seeded
2. Typo in email or password
3. Database file doesn't exist

**Solution:**
```bash
# Check if database exists
ls prisma/dev.db

# If it doesn't exist or seed didn't run, do this:
rm prisma/dev.db  # Remove old database if it exists
npx prisma migrate dev --name fresh_start
npm run db:seed

# You should see the success message with credentials
```

### Issue 2: "Authentication failed" (500 error)

**Possible Causes:**
1. Prisma client not generated
2. Database migration not run
3. bcryptjs not installed

**Solution:**
```bash
# Reinstall dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate dev

# Seed database
npm run db:seed

# Restart server
npm run dev
```

### Issue 3: Database Locked

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Remove lock files
rm prisma/dev.db-journal

# Restart
npm run dev
```

### Issue 4: Can't Find User Table

**Solution:**
```bash
# Run migration to create all tables
npx prisma migrate dev --name create_tables

# Seed the database
npm run db:seed
```

---

## 🧪 Verify Database Setup

### Check if admin user exists:
```bash
# Open Prisma Studio
npx prisma studio
```

This opens a web UI at `http://localhost:5555`

1. Click on "User" table
2. You should see one record:
   - Email: admin@cda.ae
   - Role: admin
   - Active: true
   - Password: (hashed - starts with $2a$)

If you DON'T see this user, run the seed again:
```bash
npm run db:seed
```

---

## 🔐 Manual User Creation (If Seed Fails)

If seeding keeps failing, you can create the admin manually:

### Option A: Using Prisma Studio
```bash
npx prisma studio
```

1. Open User table
2. Click "Add Record"
3. Fill in:
   - Email: `admin@cda.ae`
   - Password: `$2a$10$YOUR_HASHED_PASSWORD` (see below to generate)
   - First Name: `System`
   - Last Name: `Administrator`
   - Role: `admin`
   - Active: `true`

### Option B: Generate Password Hash
Create a file `hash-password.js`:
```javascript
const bcrypt = require('bcryptjs');

async function hash() {
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashed);
  console.log('\nUse this in Prisma Studio or INSERT statement');
}

hash();
```

Run it:
```bash
node hash-password.js
```

Copy the hashed password and use it in Prisma Studio.

---

## 🎯 Testing Login Flow

### Test 1: API Endpoint
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cda.ae","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@cda.ae",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "admin"
  }
}
```

**If you get `{"success":false,"error":"Invalid email or password"}`:**
- Database not seeded properly
- User doesn't exist
- Password hash is incorrect

### Test 2: Browser Login
1. Go to `http://localhost:3000/admin/login`
2. Enter email: `admin@cda.ae`
3. Enter password: `admin123`
4. Click "Sign In"

**Expected:**
- Redirect to `/admin/dashboard`
- See premium header with your name
- See stats cards

---

## 📝 Common Mistakes

### ❌ Wrong Email Format
```
✗ admin@cda  (missing .ae)
✗ Admin@cda.ae  (capital A - case sensitive!)
✗ admin@CDA.ae  (capitals in domain)
✓ admin@cda.ae  (exactly this)
```

### ❌ Wrong Password
```
✗ Admin123  (capital A)
✗ admin 123  (space in middle)
✗ admin124  (wrong number)
✓ admin123  (exactly this)
```

### ❌ Database Not Created
```bash
# You need BOTH migration AND seed
npx prisma migrate dev  # Creates tables
npm run db:seed         # Creates admin user
```

---

## 🔄 Fresh Start (Nuclear Option)

If nothing works, start completely fresh:

```bash
# 1. Stop server
# Press Ctrl+C

# 2. Delete everything
rm -rf node_modules
rm -rf .next
rm prisma/dev.db
rm prisma/dev.db-journal
rm -rf prisma/migrations

# 3. Fresh install
npm install

# 4. Generate Prisma client
npx prisma generate

# 5. Create database with migration
npx prisma migrate dev --name fresh_database

# 6. Seed the database
npm run db:seed

# 7. Start server
npm run dev

# 8. Try logging in
# Go to http://localhost:3000/admin/login
# Email: admin@cda.ae
# Password: admin123
```

---

## ✅ Success Checklist

After setup, you should have:
- [x] `node_modules/` folder exists
- [x] `prisma/dev.db` file exists (the database)
- [x] `prisma/migrations/` folder has migration files
- [x] Running `npx prisma studio` shows User table with admin@cda.ae
- [x] Server running on `http://localhost:3000`
- [x] Can access login page at `/admin/login`
- [x] Login works with admin@cda.ae / admin123
- [x] Redirects to dashboard after login

---

## 💡 Quick Diagnosis

**Run this diagnostic:**
```bash
# Check if files exist
echo "Checking setup..."
ls prisma/dev.db && echo "✓ Database exists" || echo "✗ Database missing"
ls node_modules && echo "✓ Dependencies installed" || echo "✗ Dependencies missing"
ls .next && echo "✓ Next.js built" || echo "✗ Not built yet (this is OK)"

# Check database contents
npx prisma studio
# Open User table - should have 1 admin user
```

---

## 🆘 Still Not Working?

### Check Browser Console
1. Open login page
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Try logging in
5. Look for error messages

### Check Network Tab
1. F12 → Network tab
2. Try logging in
3. Look for `/api/admin/login` request
4. Click on it
5. Check Response tab
   - Should show `{"success":true,...}` on success
   - Shows error message on failure

### Check Server Logs
Look at your terminal where `npm run dev` is running:
- Should NOT show errors about Prisma
- Should NOT show errors about missing tables
- Should show requests being made

---

## 📞 Final Confirmation

**The correct credentials are:**

```
Email:    admin@cda.ae
Password: admin123
```

These are created by `prisma/seed.ts` (line 223-237).

If you've run `npm run db:seed` successfully and seen the confirmation message, these credentials WILL work.

If they don't work, the issue is:
1. Database not created (run migration)
2. Seed didn't run (run seed script)
3. Looking at wrong database file (check DATABASE_URL in .env)

---

**After following these steps, login WILL work!** 🎉
