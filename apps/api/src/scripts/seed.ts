import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create roles
  console.log('Creating roles...');
  const roles = [
    { key: 'owner' },
    { key: 'manager' },
    { key: 'instructor' },
    { key: 'staff' },
    { key: 'student' },
    { key: 'guardian' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { key: role.key },
      update: {},
      create: role
    });
  }

  // Create lesson types
  console.log('Creating lesson types...');
  const lessonTypes = [
    {
      name: 'Private 30',
      durationMinutes: 30,
      priceCents: 5500, // $55.00
      maxStudents: 1,
      requiresHorse: true
    },
    {
      name: 'Private 60',
      durationMinutes: 60,
      priceCents: 9500, // $95.00
      maxStudents: 1,
      requiresHorse: true
    },
    {
      name: 'Group 60',
      durationMinutes: 60,
      priceCents: 4500, // $45.00
      maxStudents: 4,
      requiresHorse: true
    },
    {
      name: 'Ground Work',
      durationMinutes: 45,
      priceCents: 4000, // $40.00
      maxStudents: 1,
      requiresHorse: false
    }
  ];

  for (const lessonType of lessonTypes) {
    await prisma.lessonType.create({
      data: lessonType
    });
  }

  // Create sample horses
  console.log('Creating sample horses...');
  const horses = [
    {
      name: 'Spirit',
      breed: 'Quarter Horse',
      sex: 'Gelding',
      temperament: 'calm' as const,
      weight: 1100,
      height: 15.2,
      bio: 'Gentle and patient, perfect for beginners. Spirit loves trail rides and is great with children.'
    },
    {
      name: 'Luna',
      breed: 'Arabian',
      sex: 'Mare',
      temperament: 'spirited' as const,
      weight: 900,
      height: 14.3,
      bio: 'Energetic and responsive, Luna is ideal for intermediate riders looking to improve their skills.'
    },
    {
      name: 'Thunder',
      breed: 'Thoroughbred',
      sex: 'Gelding',
      temperament: 'steady' as const,
      weight: 1200,
      height: 16.1,
      bio: 'Former racehorse with a heart of gold. Thunder is excellent for advanced riders and jumping lessons.'
    },
    {
      name: 'Willow',
      breed: 'Paint',
      sex: 'Mare',
      temperament: 'calm' as const,
      weight: 1050,
      height: 15.0,
      bio: 'Beautiful paint mare with a gentle disposition. Willow is wonderful for beginners and therapeutic riding.'
    },
    {
      name: 'Rusty',
      breed: 'Appaloosa',
      sex: 'Gelding',
      temperament: 'steady' as const,
      weight: 1000,
      height: 14.2,
      bio: 'Reliable and steady, Rusty is perfect for trail riding and confidence building.'
    }
  ];

  for (const horse of horses) {
    await prisma.horse.create({
      data: horse
    });
  }

  // Create sample products
  console.log('Creating sample products...');
  const products = [
    {
      name: 'Hearts4Horses T-Shirt',
      slug: 'hearts4horses-tshirt',
      type: 'merch' as const,
      priceCents: 2500, // $25.00
      stockQty: 50,
      description: 'Comfortable cotton t-shirt with the Hearts4Horses logo. Available in sizes S-XXL.',
      media: ['https://example.com/tshirt-front.jpg', 'https://example.com/tshirt-back.jpg']
    },
    {
      name: 'Hearts4Horses Hat',
      slug: 'hearts4horses-hat',
      type: 'merch' as const,
      priceCents: 2000, // $20.00
      stockQty: 30,
      description: 'Adjustable baseball cap with embroidered Hearts4Horses logo. One size fits most.',
      media: ['https://example.com/hat.jpg']
    },
    {
      name: 'Gift Certificate - 5 Lessons',
      slug: 'gift-certificate-5-lessons',
      type: 'gift_card' as const,
      priceCents: 25000, // $250.00
      description: 'Perfect gift for the horse lover in your life! Includes 5 private 30-minute lessons.',
      media: ['https://example.com/gift-card.jpg']
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  // Create sample testimonials
  console.log('Creating sample testimonials...');
  const testimonials = [
    {
      authorName: 'Sarah Johnson',
      quote: 'My daughter has been taking lessons here for 6 months and her confidence has grown so much. The instructors are patient and caring.',
      photoUrl: 'https://example.com/sarah.jpg',
      isPublished: true
    },
    {
      authorName: 'Mike Thompson',
      quote: 'As an adult beginner, I was nervous about starting riding lessons. The team here made me feel comfortable and safe from day one.',
      photoUrl: 'https://example.com/mike.jpg',
      isPublished: true
    },
    {
      authorName: 'Emily Davis',
      quote: 'The summer camp program is amazing! My kids learned so much about horse care and riding. They can\'t wait to come back next year.',
      isPublished: true
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial
    });
  }

  // Create form templates
  console.log('Creating form templates...');
  const formTemplates = [
    {
      key: 'liability_waiver',
      title: 'Liability Waiver and Release Form',
      schemaJson: {
        type: 'object',
        properties: {
          studentName: { type: 'string', title: 'Student Name' },
          dateOfBirth: { type: 'string', title: 'Date of Birth' },
          emergencyContact: { type: 'string', title: 'Emergency Contact' },
          emergencyPhone: { type: 'string', title: 'Emergency Phone' },
          medicalConditions: { type: 'string', title: 'Medical Conditions (if any)' },
          agreeToTerms: { type: 'boolean', title: 'I agree to the terms and conditions' }
        },
        required: ['studentName', 'dateOfBirth', 'emergencyContact', 'emergencyPhone', 'agreeToTerms']
      },
      renderVersion: 1
    },
    {
      key: 'photo_release',
      title: 'Photo and Video Release Form',
      schemaJson: {
        type: 'object',
        properties: {
          studentName: { type: 'string', title: 'Student Name' },
          guardianName: { type: 'string', title: 'Guardian Name (if minor)' },
          agreeToPhotos: { type: 'boolean', title: 'I agree to allow photos and videos to be taken' },
          agreeToSocialMedia: { type: 'boolean', title: 'I agree to allow photos/videos to be used on social media' },
          agreeToWebsite: { type: 'boolean', title: 'I agree to allow photos/videos to be used on the website' }
        },
        required: ['studentName', 'agreeToPhotos']
      },
      renderVersion: 1
    }
  ];

  for (const template of formTemplates) {
    await prisma.formTemplate.upsert({
      where: { key: template.key },
      update: template,
      create: template
    });
  }

  // Create sample users
  console.log('Creating sample users...');
  const bcrypt = require('bcryptjs');
  
  const users = [
    {
      email: 'admin@hearts4horses.com',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      userType: 'admin' as const,
      isActive: true
    },
    {
      email: 'student@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'John',
      lastName: 'Student',
      userType: 'student' as const,
      isActive: true
    },
    {
      email: 'guardian@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Jane',
      lastName: 'Guardian',
      userType: 'guardian' as const,
      isActive: true
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
