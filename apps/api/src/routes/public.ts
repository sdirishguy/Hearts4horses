import express, { Request, Response } from 'express';

const router = express.Router();

// Get all horses
router.get('/horses', async (req: Request, res: Response) => {
  const horses = [
    {
      id: '1',
      name: 'Spirit',
      breed: 'Arabian',
      temperament: 'spirited',
      bio: 'Beautiful Arabian with a gentle spirit. Perfect for intermediate riders.',
      isActive: true
    },
    {
      id: '2',
      name: 'Shadow',
      breed: 'Quarter Horse',
      temperament: 'calm',
      bio: 'Reliable Quarter Horse. Great for beginners and trail riding.',
      isActive: true
    },
    {
      id: '3',
      name: 'Thunder',
      breed: 'Thoroughbred',
      temperament: 'spirited',
      bio: 'Former racehorse with a heart of gold. Excellent for advanced riders.',
      isActive: true
    }
  ];

  res.json({
    data: horses
  });
});

// Get lesson types and pricing
router.get('/services', async (req: Request, res: Response) => {
  const lessonTypes = [
    {
      id: '1',
      name: 'Private Lesson (30 min)',
      durationMinutes: 30,
      priceCents: 4500,
      description: 'One-on-one instruction with a certified instructor'
    },
    {
      id: '2',
      name: 'Private Lesson (60 min)',
      durationMinutes: 60,
      priceCents: 7500,
      description: 'Extended one-on-one instruction for more advanced training'
    },
    {
      id: '3',
      name: 'Group Lesson (60 min)',
      durationMinutes: 60,
      priceCents: 5500,
      description: 'Group instruction with 2-4 students of similar skill level'
    },
    {
      id: '4',
      name: 'Summer Camp (Full Day)',
      durationMinutes: 480,
      priceCents: 15000,
      description: 'Full day camp including riding, horse care, and activities'
    }
  ];

  res.json({
    data: lessonTypes
  });
});

// Get testimonials
router.get('/testimonials', async (req: Request, res: Response) => {
  const testimonials = [
    {
      id: '1',
      studentName: 'Sarah Johnson',
      rating: 5,
      content: 'Amazing experience! My daughter has learned so much and loves coming to lessons every week.',
      isPublished: true
    },
    {
      id: '2',
      studentName: 'Mike Chen',
      rating: 5,
      content: 'The instructors are patient and knowledgeable. I\'ve improved my riding skills tremendously.',
      isPublished: true
    },
    {
      id: '3',
      studentName: 'Emma Davis',
      rating: 5,
      content: 'Best riding school in the area! The horses are well-cared for and the facilities are beautiful.',
      isPublished: true
    }
  ];

  res.json({
    data: testimonials
  });
});

export default router;
