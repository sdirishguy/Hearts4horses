import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample lesson types
  const lessonTypes = await Promise.all([
    prisma.lessonType.upsert({
      where: { id: 'lesson-type-1' },
      update: {},
      create: {
        id: 'lesson-type-1',
        name: 'Beginner Riding',
        durationMinutes: 60,
        priceCents: 7500, // $75.00
        maxStudents: 1,
        requiresHorse: true
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'lesson-type-2' },
      update: {},
      create: {
        id: 'lesson-type-2',
        name: 'Intermediate Riding',
        durationMinutes: 60,
        priceCents: 8500, // $85.00
        maxStudents: 1,
        requiresHorse: true
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'lesson-type-3' },
      update: {},
      create: {
        id: 'lesson-type-3',
        name: 'Advanced Riding',
        durationMinutes: 90,
        priceCents: 12000, // $120.00
        maxStudents: 1,
        requiresHorse: true
      }
    })
  ]);

  // Create sample products (packages)
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'package-1' },
      update: {},
      create: {
        id: 'package-1',
        name: 'Starter Package',
        slug: 'starter-package',
        type: 'merch',
        priceCents: 30000, // $300.00
        description: 'Perfect for beginners - 4 lessons to get you started',
        media: [],
        isActive: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'package-2' },
      update: {},
      create: {
        id: 'package-2',
        name: 'Standard Package',
        slug: 'standard-package',
        type: 'merch',
        priceCents: 50000, // $500.00
        description: 'Most popular - 8 lessons for steady progress',
        media: [],
        isActive: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'package-3' },
      update: {},
      create: {
        id: 'package-3',
        name: 'Premium Package',
        slug: 'premium-package',
        type: 'merch',
        priceCents: 80000, // $800.00
        description: 'Best value - 12 lessons for serious riders',
        media: [],
        isActive: true
      }
    })
  ]);

  // Create sample horses
  const horses = await Promise.all([
    prisma.horse.upsert({
      where: { id: 'horse-1' },
      update: {},
      create: {
        id: 'horse-1',
        name: 'Thunder',
        breed: 'Quarter Horse',
        temperament: 'calm',
        isActive: true
      }
    }),
    prisma.horse.upsert({
      where: { id: 'horse-2' },
      update: {},
      create: {
        id: 'horse-2',
        name: 'Storm',
        breed: 'Arabian',
        temperament: 'spirited',
        isActive: true
      }
    })
  ]);

  // Create sample availability slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const slots = await Promise.all([
    prisma.availabilitySlot.upsert({
      where: { id: 'slot-1' },
      update: {},
      create: {
        id: 'slot-1',
        date: tomorrow,
        startTime: new Date(tomorrow.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        endTime: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        lessonTypeId: 'lesson-type-1',
        horseId: 'horse-1',
        capacity: 1,
        status: 'open'
      }
    }),
    prisma.availabilitySlot.upsert({
      where: { id: 'slot-2' },
      update: {},
      create: {
        id: 'slot-2',
        date: tomorrow,
        startTime: new Date(tomorrow.getTime() + 14 * 60 * 60 * 1000), // 2 PM
        endTime: new Date(tomorrow.getTime() + 15 * 60 * 60 * 1000), // 3 PM
        lessonTypeId: 'lesson-type-2',
        horseId: 'horse-2',
        capacity: 1,
        status: 'open'
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${lessonTypes.length} lesson types`);
  console.log(`Created ${products.length} products`);
  console.log(`Created ${horses.length} horses`);
  console.log(`Created ${slots.length} availability slots`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
