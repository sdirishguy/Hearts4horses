import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAnnouncements() {
  try {
    console.log('🌱 Seeding announcements and notifications...');

    // Get the first admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        roles: {
          some: {
            role: {
              key: 'admin'
            }
          }
        }
      }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Please run the main seed script first.');
      return;
    }

    // Create sample announcements
    const announcements = [
      {
        title: 'New Safety Guidelines',
        content: 'We have updated our safety guidelines for all lessons. Please review the new protocols before your next lesson. Key changes include updated helmet requirements and new mounting procedures.',
        authorId: adminUser.id,
        priority: 'high' as const,
        isPublished: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        title: 'Holiday Schedule Update',
        content: 'We will be closed for Thanksgiving from November 23-25. All lessons will resume on Monday, November 27. Please plan your lessons accordingly.',
        authorId: adminUser.id,
        priority: 'medium' as const,
        isPublished: true,
        expiresAt: new Date('2024-11-26')
      },
      {
        title: 'Welcome Thunder - New Horse Arrival',
        content: 'Welcome our newest addition, Thunder! This beautiful 8-year-old gelding is perfect for intermediate riders. He has a gentle temperament and loves trail rides.',
        authorId: adminUser.id,
        priority: 'low' as const,
        isPublished: true,
        expiresAt: null
      },
      {
        title: 'Winter Weather Policy',
        content: 'As winter approaches, please note our weather policy: Lessons will be cancelled if temperatures drop below 20°F or if there is significant ice. Indoor arena lessons will continue as scheduled.',
        authorId: adminUser.id,
        priority: 'medium' as const,
        isPublished: true,
        expiresAt: new Date('2025-03-01')
      },
      {
        title: 'Upcoming Horse Show',
        content: 'Our annual spring horse show is scheduled for April 15th. Registration opens next week. This is a great opportunity for students to showcase their progress!',
        authorId: adminUser.id,
        priority: 'medium' as const,
        isPublished: true,
        expiresAt: new Date('2024-04-16')
      }
    ];

    for (const announcementData of announcements) {
      await prisma.announcement.create({
        data: announcementData
      });
    }

    console.log('✅ Created 5 sample announcements');

    // Get all students to create notifications for
    const students = await prisma.student.findMany({
      include: {
        user: true
      }
    });

    // Create sample notifications for students
    for (const student of students.slice(0, 3)) { // Only first 3 students for demo
      const notifications = [
        {
          userId: student.userId,
          title: 'Lesson Reminder',
          content: `Your lesson with Gentle Spirit is tomorrow at 3:00 PM. Please arrive 15 minutes early.`,
          type: 'lesson_reminder',
          priority: 'medium' as const,
          dataJson: { lessonId: 'demo-lesson-1', horseName: 'Gentle Spirit' }
        },
        {
          userId: student.userId,
          title: 'Package Expiring',
          content: 'Your lesson package expires in 5 days. Book your remaining lessons soon to avoid losing them!',
          type: 'package_expiry',
          priority: 'high' as const,
          dataJson: { packageId: 'demo-package-1', remainingLessons: 2 }
        },
        {
          userId: student.userId,
          title: 'Progress Update',
          content: 'Great progress on your trotting! You\'re ready to move to the next level. Schedule a consultation with your instructor.',
          type: 'system',
          priority: 'low' as const,
          dataJson: { skillLevel: 'intermediate', achievement: 'trotting_mastery' }
        }
      ];

      for (const notificationData of notifications) {
        await prisma.notification.create({
          data: notificationData
        });
      }
    }

    console.log(`✅ Created sample notifications for ${students.slice(0, 3).length} students`);

    console.log('🎉 Announcements and notifications seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding announcements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAnnouncements();
