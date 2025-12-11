# Manual Setup Instructions (If Automated Setup Fails)

## The Problem You're Experiencing

The error `Cannot convert undefined or null to object` during `prisma generate` means the `.env` file is missing or the `DATABASE_URL` is not set.

## Step-by-Step Manual Setup

### Step 1: Verify You're in the Right Directory

Open Command Prompt and navigate to the project:

```cmd
cd C:\Projects\employability-platform
```

Verify you see these files:
```cmd
dir
```

You should see: `package.json`, `prisma` folder, `app` folder, etc.

### Step 2: Create .env File Manually

**Option A: Using Command Prompt**
```cmd
echo DATABASE_URL="file:./dev.db" > .env
```

**Option B: Using Notepad**
1. Open Notepad
2. Type exactly this (one line):
   ```
   DATABASE_URL="file:./dev.db"
   ```
3. Save as `.env` (with the dot at the beginning) in the project root folder
   - Important: When saving, choose "All Files (*.*)" as file type
   - Make sure it's saved as `.env` not `.env.txt`

**Option C: Using VS Code**
1. Open VS Code in the project folder: `code .`
2. Create new file: `.env`
3. Add this line:
   ```
   DATABASE_URL="file:./dev.db"
   ```
4. Save the file

### Step 3: Verify .env File Exists

```cmd
type .env
```

Should output:
```
DATABASE_URL="file:./dev.db"
```

If you get "File not found", the .env file wasn't created properly. Try again.

### Step 4: Delete node_modules and package-lock.json

```cmd
rmdir /s /q node_modules
del package-lock.json
```

### Step 5: Install Dependencies

```cmd
npm install
```

This might take 2-3 minutes. Wait for it to complete.

### Step 6: Generate Prisma Client

```cmd
npx prisma generate
```

This should work now. If it still fails, check the error message carefully.

### Step 7: Create Database

```cmd
npx prisma db push
```

This creates the SQLite database file (`dev.db`) in the `prisma` folder.

### Step 8: Seed the Database

```cmd
npm run db:seed
```

This adds the 23 barriers to the BarrierBank table.

### Step 9: Start the Server

```cmd
npm run dev
```

Open your browser to: http://localhost:3000

## Common Issues and Solutions

### Issue 1: "Cannot find module '@prisma/client'"

**Solution:**
```cmd
npx prisma generate
npm install
```

### Issue 2: ".env file not found"

**Solution:** Make sure the file is named `.env` (with a dot) and is in the root folder, not in a subfolder.

Check with:
```cmd
dir /a .env
```

The `/a` flag shows hidden files. You should see `.env` listed.

### Issue 3: "Error: P1003: Database does not exist"

**Solution:**
```cmd
npx prisma db push
```

### Issue 4: Permission Denied

**Solution:** Run Command Prompt as Administrator:
1. Press Windows key
2. Type "cmd"
3. Right-click "Command Prompt"
4. Select "Run as administrator"
5. Navigate to your project and try again

### Issue 5: "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH.
1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (20.x)
3. Restart Command Prompt
4. Verify: `node --version`

### Issue 6: Port 3000 Already in Use

**Solution:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

Or use a different port:
```cmd
set PORT=3001
npm run dev
```

## Alternative: Use PowerShell

If Command Prompt continues to fail, try PowerShell:

```powershell
# Navigate to project
cd C:\Projects\employability-platform

# Create .env file
Set-Content -Path ".env" -Value 'DATABASE_URL="file:./dev.db"'

# Verify
Get-Content .env

# Continue with setup
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Verification Checklist

Before running `npm run dev`, verify:

- [ ] `.env` file exists in root folder
- [ ] `.env` contains: `DATABASE_URL="file:./dev.db"`
- [ ] `node_modules` folder exists
- [ ] `prisma/dev.db` file exists (created by `db push`)
- [ ] `node_modules/.prisma/client` folder exists (created by `generate`)

Check these with:
```cmd
dir .env
type .env
dir node_modules
dir prisma\dev.db
dir node_modules\.prisma\client
```

## Still Having Issues?

### Debug Information to Collect:

1. **Node version:**
   ```cmd
   node --version
   npm --version
   ```

2. **Check .env file:**
   ```cmd
   type .env
   ```

3. **Check Prisma:**
   ```cmd
   npx prisma --version
   ```

4. **Check package.json:**
   ```cmd
   type package.json
   ```

5. **List files in root:**
   ```cmd
   dir
   ```

### Last Resort: Start Fresh

If nothing works:

1. Delete the entire project folder
2. Re-extract the ZIP to `C:\Projects\employability-platform`
3. Open Command Prompt as Administrator
4. Follow the manual steps above carefully
5. Don't skip any steps

## Contact Information

If you continue to have issues, provide:
- The exact error message
- Output of `node --version`
- Output of `type .env`
- Screenshot of your project folder

---

**Most Common Solution:** The `.env` file is either missing or incorrectly formatted. Creating it manually usually solves 90% of setup issues.
