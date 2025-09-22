import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with production data...');

  // Create roles
  console.log('Creating roles...');
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { key: 'admin' },
      update: {},
      create: { key: 'admin' }
    }),
    prisma.role.upsert({
      where: { key: 'student' },
      update: {},
      create: { key: 'student' }
    }),
    prisma.role.upsert({
      where: { key: 'guardian' },
      update: {},
      create: { key: 'guardian' }
    }),
    prisma.role.upsert({
      where: { key: 'instructor' },
      update: {},
      create: { key: 'instructor' }
    }),
    prisma.role.upsert({
      where: { key: 'owner' },
      update: {},
      create: { key: 'owner' }
    }),
    prisma.role.upsert({
      where: { key: 'manager' },
      update: {},
      create: { key: 'manager' }
    }),
    prisma.role.upsert({
      where: { key: 'staff' },
      update: {},
      create: { key: 'staff' }
    })
  ]);

  // Create lesson types - production pricing
  console.log('Creating lesson types...');
  const lessonTypes = await Promise.all([
    prisma.lessonType.upsert({
      where: { id: 'private-30' },
      update: {},
      create: {
        id: 'private-30',
        name: 'Private 30 Minutes',
        durationMinutes: 30,
        priceCents: 5500, // $55.00
        maxStudents: 1,
        requiresHorse: true
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'private-60' },
      update: {},
      create: {
        id: 'private-60',
        name: 'Private 60 Minutes',
        durationMinutes: 60,
        priceCents: 9500, // $95.00
        maxStudents: 1,
        requiresHorse: true
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'group-60' },
      update: {},
      create: {
        id: 'group-60',
        name: 'Group Lesson (60 min)',
        durationMinutes: 60,
        priceCents: 4500, // $45.00 per student
        maxStudents: 4,
        requiresHorse: true
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'ground-work' },
      update: {},
      create: {
        id: 'ground-work',
        name: 'Ground Work & Horse Care',
        durationMinutes: 45,
        priceCents: 4000, // $40.00
        maxStudents: 2,
        requiresHorse: false
      }
    }),
    prisma.lessonType.upsert({
      where: { id: 'trail-ride' },
      update: {},
      create: {
        id: 'trail-ride',
        name: 'Trail Ride',
        durationMinutes: 90,
        priceCents: 12000, // $120.00
        maxStudents: 3,
        requiresHorse: true
      }
    })
  ]);

  // Create lesson packages - production pricing
  console.log('Creating lesson packages...');
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'starter-package' },
      update: {},
      create: {
        name: '4-Lesson Starter Package',
        slug: 'starter-package',
        type: 'merch',
        priceCents: 35000, // $350.00 ($87.50 per lesson)
        description: 'Perfect for beginners wanting to try horseback riding. Includes 4 private 30-minute lessons.',
        media: [],
        isActive: true
      }
    }),
    prisma.product.upsert({
      where: { slug: 'standard-package' },
      update: {},
      create: {
        name: '8-Lesson Standard Package',
        slug: 'standard-package',
        type: 'merch',
        priceCents: 68000, // $680.00 ($85 per lesson)
        description: 'Our most popular package. 8 private 30-minute lessons for consistent progress.',
        media: [],
        isActive: true
      }
    }),
    prisma.product.upsert({
      where: { slug: 'premium-package' },
      update: {},
      create: {
        name: '12-Lesson Premium Package',
        slug: 'premium-package',
        type: 'merch',
        priceCents: 96000, // $960.00 ($80 per lesson)
        description: 'Best value for committed riders. 12 private 30-minute lessons.',
        media: [],
        isActive: true
      }
    }),
    prisma.product.upsert({
      where: { slug: 'summer-camp' },
      update: {},
      create: {
        name: 'Summer Horse Camp (1 Week)',
        slug: 'summer-camp',
        type: 'merch',
        priceCents: 45000, // $450.00
        description: 'Week-long summer camp including daily lessons, horse care, and fun activities.',
        media: [],
        isActive: true
      }
    })
  ]);

  // Create form templates - production forms
  console.log('Creating form templates...');
  const formTemplates = await Promise.all([
    prisma.formTemplate.upsert({
      where: { key: 'liability_waiver' },
      update: {},
      create: {
        key: 'liability_waiver',
        title: 'Liability Waiver and Release Form',
        schemaJson: {
          type: 'object',
          properties: {
            participantName: { type: 'string', title: 'Participant Full Name' },
            dateOfBirth: { type: 'string', format: 'date', title: 'Date of Birth' },
            parentGuardianName: { type: 'string', title: 'Parent/Guardian Name (if under 18)' },
            address: { type: 'string', title: 'Address' },
            city: { type: 'string', title: 'City' },
            state: { type: 'string', title: 'State' },
            zipCode: { type: 'string', title: 'ZIP Code' },
            phoneNumber: { type: 'string', title: 'Phone Number' },
            emailAddress: { type: 'string', format: 'email', title: 'Email Address' },
            emergencyContactName: { type: 'string', title: 'Emergency Contact Name' },
            emergencyContactPhone: { type: 'string', title: 'Emergency Contact Phone' },
            emergencyContactRelationship: { type: 'string', title: 'Relationship to Participant' },
            medicalConditions: { type: 'string', title: 'Medical Conditions/Allergies' },
            medications: { type: 'string', title: 'Current Medications' },
            physicianName: { type: 'string', title: 'Physician Name' },
            physicianPhone: { type: 'string', title: 'Physician Phone' },
            insuranceProvider: { type: 'string', title: 'Insurance Provider' },
            insurancePolicyNumber: { type: 'string', title: 'Policy Number' },
            acknowledgmentOfRisk: { type: 'boolean', title: 'I acknowledge that horseback riding involves inherent risks' },
            releaseOfLiability: { type: 'boolean', title: 'I release Hearts4Horses from all liability' },
            medicalAuthorization: { type: 'boolean', title: 'I authorize emergency medical treatment if necessary' },
            agreeToTerms: { type: 'boolean', title: 'I have read and agree to all terms and conditions' }
          },
          required: [
            'participantName',
            'dateOfBirth',
            'address',
            'city',
            'state',
            'zipCode',
            'phoneNumber',
            'emergencyContactName',
            'emergencyContactPhone',
            'acknowledgmentOfRisk',
            'releaseOfLiability',
            'medicalAuthorization',
            'agreeToTerms'
          ]
        },
        renderVersion: 1
      }
    }),
    prisma.formTemplate.upsert({
      where: { key: 'photo_release' },
      update: {},
      create: {
        key: 'photo_release',
        title: 'Photo and Video Release Form',
        schemaJson: {
          type: 'object',
          properties: {
            participantName: { type: 'string', title: 'Participant Name' },
            parentGuardianName: { type: 'string', title: 'Parent/Guardian Name (if under 18)' },
            grantPermission: { type: 'boolean', title: 'I grant permission for photos/videos to be taken' },
            useForWebsite: { type: 'boolean', title: 'May be used on Hearts4Horses website' },
            useForSocialMedia: { type: 'boolean', title: 'May be used on social media platforms' },
            useForMarketing: { type: 'boolean', title: 'May be used in marketing materials' },
            useForNews: { type: 'boolean', title: 'May be shared with news media' },
            agreeToTerms: { type: 'boolean', title: 'I agree to the photo/video release terms' }
          },
          required: ['participantName', 'grantPermission', 'agreeToTerms']
        },
        renderVersion: 1
      }
    }),
    prisma.formTemplate.upsert({
      where: { key: 'student_intake' },
      update: {},
      create: {
        key: 'student_intake',
        title: 'New Student Intake Form',
        schemaJson: {
          type: 'object',
          properties: {
            ridingExperience: { 
              type: 'string', 
              title: 'Previous Riding Experience',
              enum: ['none', 'beginner', 'intermediate', 'advanced']
            },
            ridingGoals: { type: 'string', title: 'Riding Goals' },
            preferredDays: {
              type: 'array',
              title: 'Preferred Lesson Days',
              items: {
                type: 'string',
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
              }
            },
            preferredTimes: {
              type: 'string',
              title: 'Preferred Time',
              enum: ['morning', 'afternoon', 'evening', 'flexible']
            },
            physicaLimitations: { type: 'string', title: 'Physical Limitations or Concerns' },
            fearsConcerns: { type: 'string', title: 'Any Fears or Concerns about Horses' },
            additionalNotes: { type: 'string', title: 'Additional Notes or Requests' }
          },
          required: ['ridingExperience', 'ridingGoals']
        },
        renderVersion: 1
      }
    })
  ]);

  // Create initial admin user (should be changed immediately in production)
  console.log('Creating initial admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hearts4horses.com' },
    update: {},
    create: {
      email: 'admin@hearts4horses.com',
      password: await bcrypt.hash('ChangeMe123!', 10), // Must be changed on first login
      firstName: 'Admin',
      lastName: 'User',
      phone: '555-0100',
      isActive: true
    }
  });

  // Assign admin role
  await prisma.userRole.upsert({
    where: { 
      userId_roleId: { 
        userId: adminUser.id, 
        roleId: roles.find(r => r.key === 'admin')!.id 
      } 
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: roles.find(r => r.key === 'admin')!.id
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the admin password immediately!');
  console.log('    Email: admin@hearts4horses.com');
  console.log('    Temporary Password: ChangeMe123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });