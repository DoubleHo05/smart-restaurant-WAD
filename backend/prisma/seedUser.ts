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
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create roles
  // Thứ tự trong mảng roles:
  // [0]: super_admin, [1]: admin, [2]: waiter, [3]: kitchen, [4]: customer
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

  // Common password for seeding
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  // ==========================================
  // 2. Create SUPER ADMIN User
  // ==========================================
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

  // Assign super_admin role (roles[0])
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

  // ==========================================
  // 3. Create RESTAURANT ADMIN User (Mới thêm)
  // ==========================================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password_hash: hashedPassword, // Dùng chung pass Admin@123
      full_name: 'Restaurant Manager',
      status: 'active',
    },
  });

  // Assign admin role (roles[1])
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: roles[1].id, // Lưu ý: roles[1] là admin
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: roles[1].id,
    },
  });

  console.log('✅ Seed completed!');
  console.log('-----------------------------------');
  console.log('📧 Super Admin: superadmin@restaurant.com');
  console.log('📧 Restaurant Admin: admin@restaurant.com');
  console.log('🔑 Password (All): Admin@123');
  console.log('-----------------------------------');
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
