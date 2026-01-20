import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding restaurants...');

  // Get super admin user
  const superAdmin = await prisma.user.findFirst({
    where: { email: 'superadmin@restaurant.com' },
  });

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@restaurant.com' },
  });

  if (!superAdmin) {
    throw new Error(
      'Super admin user not found. Please run seedUser.ts first.',
    );
  }

  if (!admin) {
    throw new Error('Admin user not found. Please run seedUser.ts first.');
  }

  // Create sample restaurants - Restaurant 1 owned by admin
  const restaurant1 = await prisma.restaurant.upsert({
    where: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
    update: { owner_id: admin.id }, // Update to admin ownership
    create: {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      name: 'Smart Restaurant - Downtown',
      address: '123 Main Street, District 1, Ho Chi Minh City',
      phone: '0283 123 4567',
      owner_id: admin.id, // Owned by admin
      status: 'active',
    },
  });

  // Restaurant 2 owned by superadmin
  const restaurant2 = await prisma.restaurant.upsert({
    where: { id: 'a1ffcd00-0d1c-4fe9-9c7e-7cc0ce491b22' },
    update: { owner_id: superAdmin.id }, // Keep superadmin ownership
    create: {
      id: 'a1ffcd00-0d1c-4fe9-9c7e-7cc0ce491b22',
      name: 'Smart Restaurant - Central Park',
      address: '456 Le Lai Street, District 3, Ho Chi Minh City',
      phone: '0283 765 4321',
      owner_id: superAdmin.id, // Owned by superadmin
      status: 'active',
    },
  });

  console.log('✅ Restaurants seeded:');
  console.log(`  - ${restaurant1.name} (Owner: admin@restaurant.com)`);
  console.log(`  - ${restaurant2.name} (Owner: superadmin@restaurant.com)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding restaurants:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
