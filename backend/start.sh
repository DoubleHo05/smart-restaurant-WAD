#!/bin/bash

echo "🚀 Starting Smart Restaurant Backend..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Copy .env.example to .env and update DATABASE_URL"
    exit 1
fi

# Check if DATABASE_URL is configured
if grep -q "YOUR-PASSWORD" .env; then
    echo "⚠️  Warning: DATABASE_URL not configured!"
    echo "   Please update DATABASE_URL in .env file"
    exit 1
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo ""
echo "✅ Prisma Client generated successfully"
echo ""
echo "🔥 Starting NestJS server..."
echo "   Backend will be available at: http://localhost:3000"
echo ""

# Start the server
npm run start:dev
