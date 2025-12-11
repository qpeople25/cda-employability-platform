# Windows Setup & Troubleshooting Guide

## If You Get "Couldn't find any pages or app directory" Error

This error means the `app` directory wasn't extracted properly. Here's how to fix it:

### Solution 1: Re-extract the ZIP File

1. **Delete the existing Platform2 folder completely**
   ```cmd
   rmdir /s /q "C:\Users\euanc\OneDrive - Q Medical Technologies Ltd\Documents - qpeople\MENA\Client Folder\Taaeen\CDA Assessment\Platform2"
   ```

2. **Download the ZIP file again** (employability-platform.zip)

3. **Extract using Windows Explorer:**
   - Right-click on `employability-platform.zip`
   - Select "Extract All..."
   - Choose your destination folder
   - Make sure "Show extracted files when complete" is checked
   - Click "Extract"

4. **Verify the structure:**
   Open the extracted folder. You should see:
   ```
   employability-platform/
   ├── app/              ← THIS MUST BE PRESENT
   ├── components/
   ├── lib/
   ├── prisma/
   ├── types/
   ├── package.json
   └── ... other files
   ```

5. **Navigate into the folder:**
   ```cmd
   cd employability-platform
   ```

6. **Verify app directory exists:**
   ```cmd
   dir app
   ```
   You should see folders like `api`, `participants`, and files like `layout.tsx`

### Solution 2: Manual File Check

If the app directory is missing after extraction:

1. **Check the ZIP contents** before extracting:
   - Open the ZIP file without extracting
   - Look for `employability-platform/app/` folder inside
   - If it's there, try extracting again

2. **Use 7-Zip (Recommended for Windows):**
   - Download 7-Zip (free): https://www.7-zip.org/
   - Right-click ZIP file → 7-Zip → Extract to "employability-platform\"
   - This is more reliable than Windows built-in extraction

### Solution 3: Check Windows Path Length

Windows has a path length limit that can cause issues:

1. **Enable Long Paths (Windows 10+):**
   - Press Win + R
   - Type: `regedit`
   - Navigate to: `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
   - Set `LongPathsEnabled` to 1

2. **Extract to a shorter path:**
   Instead of:
   ```
   C:\Users\euanc\OneDrive - Q Medical Technologies Ltd\Documents - qpeople\MENA\Client Folder\Taaeen\CDA Assessment\Platform2
   ```
   
   Try:
   ```
   C:\Projects\employability-platform
   ```

## Complete Setup Steps for Windows

### Step 1: Extract to Simple Path
```cmd
# Create a simple folder
mkdir C:\Projects
cd C:\Projects

# Extract the ZIP here (use 7-Zip or Windows Explorer)
# You should now have: C:\Projects\employability-platform
```

### Step 2: Open in VS Code
```cmd
cd C:\Projects\employability-platform
code .
```

### Step 3: Verify Structure
In VS Code's file explorer, you should see:
- ✅ app folder (with layout.tsx, page.tsx, etc.)
- ✅ components folder
- ✅ lib folder
- ✅ prisma folder
- ✅ package.json

### Step 4: Install Dependencies
```cmd
npm install
```

If you get permission errors, try:
```cmd
npm install --force
```

### Step 5: Setup Database
```cmd
npx prisma generate
npx prisma db push
npm run db:seed
```

### Step 6: Start Development Server
```cmd
npm run dev
```

### Step 7: Open Browser
Navigate to: http://localhost:3000

## Common Windows Issues

### Issue 1: Permission Denied
```cmd
# Run Command Prompt as Administrator
# Or run from PowerShell:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 2: Node Not Found
```cmd
# Verify Node.js is installed:
node --version
npm --version

# If not installed, download from: https://nodejs.org/
# Choose LTS version (20.x)
```

### Issue 3: Port 3000 Already in Use
```cmd
# Find and kill process on port 3000:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port:
set PORT=3001
npm run dev
```

### Issue 4: ENOENT Error
This means files are missing. Re-extract the ZIP to a clean folder.

### Issue 5: Module Not Found
```cmd
# Clear cache and reinstall:
rmdir /s /q node_modules
del package-lock.json
npm install
```

## Verify Installation Checklist

Run these commands to verify everything is correct:

```cmd
# 1. Check app directory exists
dir app
# Should show: api, participants, globals.css, layout.tsx, page.tsx

# 2. Check components directory
dir components
# Should show: participants, session, ui

# 3. Check prisma directory
dir prisma
# Should show: schema.prisma, seed.ts

# 4. Check package.json exists
type package.json
# Should show JSON content

# 5. Check Node modules (after npm install)
dir node_modules
# Should show many folders (next, react, etc.)
```

## Alternative: Use Git

If ZIP extraction continues to fail:

```cmd
# If you have Git installed:
git clone <repository-url>
cd employability-platform
npm install
npx prisma db push
npm run db:seed
npm run dev
```

## Still Having Issues?

### Check File Integrity
```cmd
# Count files in app directory
dir app /s /b | find /c /v ""
# Should be around 10-15 files

# List all TypeScript files
dir /s /b *.tsx *.ts
# Should show many files across app, components, lib
```

### Create app Directory Manually (Last Resort)
If the app directory is truly missing from the ZIP:

1. Create the directories:
```cmd
mkdir app\api\exports\cda\participants.csv
mkdir app\api\exports\cda\sessions.csv
mkdir app\api\exports\cda\barriers.csv
mkdir app\api\participants
mkdir app\api\sessions\save
mkdir app\participants\[id]\session
```

2. Contact me to get the individual files - this shouldn't be necessary as they're all in the ZIP.

## Getting Help

If you continue to have issues:

1. **Verify ZIP contents** - Open the ZIP and screenshot what you see
2. **Check extraction path** - Make sure it's a simple path without spaces
3. **Try 7-Zip** - Windows built-in extraction can sometimes fail
4. **Use a different location** - Try C:\Projects instead of OneDrive path

The issue is almost always related to:
- ❌ Long Windows paths (OneDrive paths are very long)
- ❌ Windows extraction issues with nested folders
- ❌ OneDrive sync interfering with extraction

**Solution: Extract to C:\Projects\employability-platform** and it should work perfectly!
