# 🚀 Deployment Guide - Production Testing

## 🎯 Recommended: Vercel Deployment (5 minutes)

The easiest and fastest way to get your platform live for testing.

---

## 📋 Prerequisites

1. ✅ GitHub account (free) - https://github.com
2. ✅ Vercel account (free) - https://vercel.com
3. ✅ PostgreSQL database (free options below)

---

## 🚀 Step-by-Step Deployment

### Step 1: Create PostgreSQL Database (Choose One)

#### Option A: Vercel Postgres (Recommended)
1. Go to https://vercel.com/dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name it: `cda-employability-db`
6. Click **"Create"**
7. **Copy the connection string** (starts with `postgresql://`)

#### Option B: Supabase (Free Alternative)
1. Go to https://supabase.com
2. **"New Project"** → Name: `cda-employability`
3. Wait 2 minutes for provisioning
4. Settings → Database → **"Connection String"** (Connection Pooling)
5. **Copy the connection string**

---

### Step 2: Push Code to GitHub

```bash
# Open terminal in your project folder
cd "C:\Projects\Employability Platform\employability-platform"

# Initialize Git
git init
git add .
git commit -m "Initial commit for deployment"

# Create GitHub repo:
# 1. Go to https://github.com/new
# 2. Name: cda-employability-platform
# 3. Make it Private
# 4. Click "Create repository"

# Push to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cda-employability-platform.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **"cda-employability-platform"**
4. Click **"Import"**

**Configure Project:**
- Framework Preset: `Next.js` (auto-detected)
- Root Directory: `./` (leave as is)
- Build Command: Leave default
- Output Directory: Leave default

5. Click **"Environment Variables"** and add:

```
DATABASE_URL
Paste your PostgreSQL connection string from Step 1

SESSION_SECRET
Generate random string or use: cda_secret_key_2024_change_this_in_production

NODE_ENV
production
```

6. Click **"Deploy"**

7. Wait 2-3 minutes ⏳

---

### Step 4: Run Database Migrations

After deployment completes:

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production.local

# Run migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

#### Option B: Via Vercel Dashboard

1. Go to your project in Vercel
2. Click **"Settings"** → **"Functions"**
3. Add a **"Build Command Override"**:
   ```
   npm run build && npx prisma migrate deploy && npm run db:seed
   ```
4. Redeploy: Click **"Deployments"** → **"..."** → **"Redeploy"**

---

### Step 5: Access Your Live Site! 🎉

Your platform is now live at:
```
https://cda-employability-platform.vercel.app
```

**Login with:**
- Email: `admin@cda.ae`
- Password: `admin123`

---

## ✅ Post-Deployment Checklist

Test everything:
- [ ] Can access the URL
- [ ] Login works
- [ ] Can create participants
- [ ] Can assign coaches  
- [ ] Can conduct coaching session
- [ ] Can save session data
- [ ] Analytics page loads
- [ ] Excel export works
- [ ] Data persists after refresh

---

## 🔐 Security - Change Default Password!

**IMPORTANT:** Change the admin password immediately!

### Method 1: Via Prisma Studio (Easiest)

```bash
# In your local project
npx prisma studio

# Opens http://localhost:5555
# 1. Click "User" table
# 2. Find admin@cda.ae
# 3. Click the row
# 4. Change email to your real email
# 5. Generate new password hash (see below)
# 6. Click "Save"
```

### Method 2: Create New Admin via Code

Update `prisma/seed.ts` (line 223-237):

```typescript
// Change this:
email: 'admin@cda.ae',
password: hashedPassword, // from admin123

// To your credentials:
email: 'your.email@cda.ae',
password: await bcrypt.hash('YourStrongPassword123!', 10),
```

Then redeploy.

---

## 🌐 Custom Domain Setup (Optional)

### Add cda.ae subdomain:

1. In Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**
2. Add domain: `employability.cda.ae`
3. Vercel shows DNS records to add
4. In your DNS provider (usually Godaddy/Namecheap):
   - Add CNAME record:
     - Name: `employability`
     - Value: `cname.vercel-dns.com`
5. Wait 5-60 minutes for DNS propagation
6. Access at: `https://employability.cda.ae`

---

## 📊 Monitor Your Deployment

### View Logs:
1. Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Click latest deployment
4. See **"Build Logs"** and **"Function Logs"**

### Check Database:
1. Vercel Dashboard → **"Storage"** → Your database
2. Click **"Data"** tab
3. View tables and data

### Analytics:
- Vercel provides free analytics
- See visitor count, performance, etc.

---

## 🔄 Update Your Live Site

Whenever you make changes:

```bash
# Make your changes locally
# Test with: npm run dev

# Commit changes
git add .
git commit -m "Updated feature XYZ"

# Push to GitHub
git push

# Vercel automatically deploys! 🚀
# Check deployment status in Vercel dashboard
```

---

## 🆘 Common Issues & Fixes

### Issue: Build Fails

**Check:**
- Environment variables are set correctly
- DATABASE_URL format is correct
- All dependencies in package.json

**Fix:**
```bash
# Redeploy with logs
vercel --debug
```

### Issue: "Prisma Client Not Generated"

**Fix:**
```bash
# In vercel.json, ensure:
{
  "buildCommand": "prisma generate && next build"
}
```

### Issue: Can't Connect to Database

**Check:**
- Connection string includes `?sslmode=require`
- Database is running (check Vercel/Supabase dashboard)
- Firewall allows connections

**Fix:**
Test connection locally:
```bash
# Add DATABASE_URL to .env.local
npx prisma db push
```

### Issue: Database Empty (No Admin User)

**Fix:**
```bash
# Run seed via Vercel CLI
vercel env pull
npx prisma db seed
```

Or add to build command in Vercel.

---

## 💡 Alternative: Railway Deployment

If Vercel doesn't work, try Railway (keeps SQLite):

```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub
# 3. New Project → Deploy from GitHub
# 4. Select your repo
# 5. Add environment variable:
#    SESSION_SECRET = your-secret-here
# 6. Deploy!
# 7. Railway gives you a URL
```

Railway is easier for SQLite but costs $5/month after free tier.

---

## 📞 Need Help?

Common command reference:

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Run command in production
vercel exec -- npm run db:seed

# Redeploy
vercel --prod

# Link to different project
vercel link
```

---

## 🎯 Quick Start Checklist

```
□ Create PostgreSQL database (Vercel or Supabase)
□ Push code to GitHub
□ Import to Vercel
□ Add environment variables (DATABASE_URL, SESSION_SECRET)
□ Deploy
□ Run migrations (vercel exec -- npx prisma migrate deploy)
□ Seed database (vercel exec -- npm run db:seed)
□ Test login
□ Change admin password
□ Share URL with team
□ Done! 🎉
```

---

## 🎊 Success!

Your platform is now live and accessible to your team for testing!

**Next Steps:**
1. Share the URL with coaches
2. Create coach accounts
3. Test with real data
4. Gather feedback
5. Iterate and improve

---

**Deployment complete!** 🚀

Need the custom domain or have issues? Check the troubleshooting section above.
