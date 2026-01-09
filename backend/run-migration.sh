#!/bin/bash

echo "🗄️  Running Database Migration: Create Users Table"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Load DATABASE_URL from .env
export $(grep DATABASE_URL .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not found in .env"
    exit 1
fi

echo "📝 Migration SQL:"
echo "─────────────────────────────────────────────"
cat prisma/migrations/003_create_users_table.sql
echo "─────────────────────────────────────────────"
echo ""

read -p "Do you want to run this migration? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Running migration..."
    
    # Run the migration using psql
    psql "$DATABASE_URL" -f prisma/migrations/003_create_users_table.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Migration completed successfully!"
        echo ""
        echo "Verifying table creation..."
        psql "$DATABASE_URL" -c "\d users"
    else
        echo ""
        echo "❌ Migration failed!"
        exit 1
    fi
else
    echo "Migration cancelled."
fi
