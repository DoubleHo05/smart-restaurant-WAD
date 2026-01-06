import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'super_admin' },
      update: {},
      create: {
        name: 'super_admin',
        description: 'Super Administrator with full system access',
      },
    }),
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', description: 'Restaurant Administrator' },
    }),
    prisma.role.upsert({
      where: { name: 'waiter' },
      update: {},
      create: { name: 'waiter', description: 'Waiter staff' },
    }),
    prisma.role.upsert({
      where: { name: 'kitchen' },
      update: {},
      create: { name: 'kitchen', description: 'Kitchen staff' },
    }),
    prisma.role.upsert({
      where: { name: 'customer' },
      update: {},
      create: { name: 'customer', description: 'Customer' },
    }),
  ]);

  // Create super admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@restaurant.com' },
    update: {},
    create: {
      email: 'superadmin@restaurant.com',
      password_hash: hashedPassword,
      full_name: 'Super Admin',
      status: 'active',
    },
  });

  // Assign super_admin role
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: superAdmin.id,
        role_id: roles[0].id,
      },
    },
    update: {},
    create: {
      user_id: superAdmin.id,
      role_id: roles[0].id,
    },
  });

  console.log('✅ Seed completed!');
  console.log('📧 Super Admin Email: superadmin@restaurant.com');
  console.log('🔑 Super Admin Password: Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
