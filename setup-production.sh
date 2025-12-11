#!/bin/bash

# Production Database Setup Script
# Run this after deploying to production

echo "🚀 Setting up production database..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Seed database (if needed)
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Production setup complete!"
