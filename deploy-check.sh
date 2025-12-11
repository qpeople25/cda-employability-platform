#!/bin/bash

echo "🚀 CDA Employability Platform - Deployment Setup"
echo "================================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized"
    echo "   Run: git init"
    exit 1
fi

echo "✅ Git initialized"

# Check if remote is set
if ! git remote | grep -q origin; then
    echo "❌ No GitHub remote configured"
    echo "   1. Create repo on GitHub"
    echo "   2. Run: git remote add origin https://github.com/YOUR_USERNAME/cda-employability-platform.git"
    exit 1
fi

echo "✅ GitHub remote configured"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Uncommitted changes detected"
    echo "   Run: git add . && git commit -m 'Ready for deployment'"
    exit 1
fi

echo "✅ All changes committed"

# Check if pushed to GitHub
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if ! git ls-remote --exit-code --heads origin $BRANCH &>/dev/null; then
    echo "⚠️  Branch not pushed to GitHub"
    echo "   Run: git push -u origin $BRANCH"
    exit 1
fi

echo "✅ Code pushed to GitHub"
echo ""
echo "🎯 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables:"
echo "   - DATABASE_URL (from Vercel Postgres or Supabase)"
echo "   - SESSION_SECRET (random string)"
echo "   - NODE_ENV=production"
echo "4. Click Deploy"
echo ""
echo "After deployment:"
echo "   vercel env pull"
echo "   npx prisma migrate deploy"
echo "   npm run db:seed"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
