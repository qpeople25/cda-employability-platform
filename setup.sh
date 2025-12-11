#!/bin/bash

echo "🚀 Setting up CDA Employability Coach Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Setup Prisma
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push --skip-generate
echo ""

# Seed the database
echo "🌱 Seeding BarrierBank data..."
npm run db:seed
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
echo "To view the database, run:"
echo "  npx prisma studio"
