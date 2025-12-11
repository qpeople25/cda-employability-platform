@echo off
echo.
echo 🚀 CDA Employability Platform - Deployment Checklist
echo ====================================================
echo.

REM Check if git is initialized
if not exist .git (
    echo ❌ Git not initialized
    echo    Run: git init
    exit /b 1
)
echo ✅ Git initialized

REM Check if there are uncommitted changes
git status --short > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git status check failed
    exit /b 1
)

for /f %%i in ('git status --short ^| find /c /v ""') do set changes=%%i
if %changes% gtr 0 (
    echo ⚠️  Uncommitted changes detected
    echo    Run: git add . ^&^& git commit -m "Ready for deployment"
    exit /b 1
)
echo ✅ All changes committed

echo.
echo 🎯 Ready for deployment!
echo.
echo Next Steps:
echo ============
echo.
echo 1. Create PostgreSQL Database:
echo    Option A: Vercel Postgres
echo      - Go to vercel.com/dashboard
echo      - Storage → Create Database → Postgres
echo      - Copy connection string
echo.
echo    Option B: Supabase
echo      - Go to supabase.com
echo      - New Project → cda-employability
echo      - Copy connection string from Settings → Database
echo.
echo 2. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/cda-employability-platform.git
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to vercel.com/new
echo    - Import your GitHub repo
echo    - Add environment variables:
echo      * DATABASE_URL = [your PostgreSQL connection string]
echo      * SESSION_SECRET = [random secret string]
echo      * NODE_ENV = production
echo    - Click Deploy
echo.
echo 4. After Deployment:
echo    npm install -g vercel
echo    vercel login
echo    vercel link
echo    vercel env pull
echo    npx prisma migrate deploy
echo    npm run db:seed
echo.
echo 📚 See DEPLOYMENT.md for detailed instructions
echo.
pause
