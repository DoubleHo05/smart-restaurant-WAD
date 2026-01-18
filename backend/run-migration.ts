import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.lhoiazdtwdviiwigctbo:Baodzvcl00@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runMigration() {
  try {
    console.log(
      '🚀 Running migration: add_email_verification_and_google_oauth',
    );

    // Add new columns
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS email_verification_token_expires_at TIMESTAMP(6),
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local';
    `);

    console.log('✅ Added new columns');

    // Make password_hash nullable
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users
      ALTER COLUMN password_hash DROP NOT NULL;
    `);

    console.log('✅ Made password_hash nullable');

    // Create indexes
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
    `);

    console.log('✅ Created indexes');

    // Add unique constraint for google_id
    await prisma
      .$executeRawUnsafe(
        `
      ALTER TABLE users
      ADD CONSTRAINT users_google_id_key UNIQUE (google_id);
    `,
      )
      .catch(() => {
        console.log('⚠️  Unique constraint already exists for google_id');
      });

    // Update existing users
    await prisma.$executeRawUnsafe(`
      UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL;
    `);

    console.log('✅ Updated existing users');
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
