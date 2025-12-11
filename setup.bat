@echo off
echo ========================================
echo CDA Employability Platform Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo DATABASE_URL="file:./dev.db" > .env
    echo .env file created!
    echo.
) else (
    echo .env file already exists.
    echo.
)

REM Verify .env file contents
echo Checking DATABASE_URL...
type .env
echo.

REM Clear any existing installation
echo Cleaning previous installation...
if exist node_modules (
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del package-lock.json
)
echo.

REM Install dependencies
echo Installing dependencies (including xlsx for Excel support)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo.

REM Push database schema
echo Creating database...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo.

REM Seed database
echo Seeding BarrierBank data...
call npm run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database seed failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser.
echo.
pause
