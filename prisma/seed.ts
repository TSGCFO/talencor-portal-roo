import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo recruiter account
  const demoRecruiter = await prisma.recruiter.upsert({
    where: { email: 'demo@talentcore.com' },
    update: {},
    create: {
      email: 'demo@talentcore.com',
      name: 'Demo Recruiter',
      password: await hashPassword('demo123'),
      role: 'recruiter',
    },
  });

  console.log('✅ Created demo recruiter:', demoRecruiter.email);

  // Create admin recruiter account
  const adminRecruiter = await prisma.recruiter.upsert({
    where: { email: 'admin@talentcore.com' },
    update: {},
    create: {
      email: 'admin@talentcore.com',
      name: 'Admin User',
      password: await hashPassword('admin123'),
      role: 'admin',
    },
  });

  console.log('✅ Created admin recruiter:', adminRecruiter.email);

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Demo Credentials:');
  console.log('Email: demo@talentcore.com');
  console.log('Password: demo123');
  console.log('\n📋 Admin Credentials:');
  console.log('Email: admin@talentcore.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });