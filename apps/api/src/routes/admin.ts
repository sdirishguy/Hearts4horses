import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Announcements Management

// Get all announcements (admin only)
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const announcementsWithAuthorName = announcements.map(announcement => ({
      ...announcement,
      authorName: `${announcement.author.firstName} ${announcement.author.lastName}`
    }));

    res.json({
      announcements: announcementsWithAuthorName
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new announcement
router.post('/announcements', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, content, priority, isPublished, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        authorId: userId!,
        priority: priority || 'medium',
        isPublished: isPublished !== undefined ? isPublished : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      announcement: {
        ...announcement,
        authorName: `${announcement.author.firstName} ${announcement.author.lastName}`
      }
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update announcement
router.put('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const announcementId = req.params.id;
    const { title, content, priority, isPublished, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await prisma.announcement.update({
      where: {
        id: announcementId
      },
      data: {
        title,
        content,
        priority: priority || 'medium',
        isPublished: isPublished !== undefined ? isPublished : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      announcement: {
        ...announcement,
        authorName: `${announcement.author.firstName} ${announcement.author.lastName}`
      }
    });

  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete announcement
router.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const announcementId = req.params.id;

    await prisma.announcement.delete({
      where: {
        id: announcementId
      }
    });

    res.json({ message: 'Announcement deleted successfully' });

  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Horse Management

// Get all horses
router.get('/horses', async (req: Request, res: Response) => {
  try {
    const horses = await prisma.horse.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      horses: horses
    });

  } catch (error) {
    console.error('Get horses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new horse
router.post('/horses', async (req: Request, res: Response) => {
  try {
    const { name, breed, dob, sex, temperament, weight, height, bio } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Horse name is required' });
    }

    const horse = await prisma.horse.create({
      data: {
        name,
        breed,
        dob: dob ? new Date(dob) : null,
        sex,
        temperament,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bio,
        isActive: true
      }
    });

    res.status(201).json({
      message: 'Horse created successfully',
      data: horse
    });

  } catch (error) {
    console.error('Create horse error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update horse
router.put('/horses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, breed, dob, sex, temperament, weight, height, bio, isActive } = req.body;

    const horse = await prisma.horse.update({
      where: { id },
      data: {
        name,
        breed,
        dob: dob ? new Date(dob) : null,
        sex,
        temperament,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bio,
        isActive
      }
    });

    res.json({
      message: 'Horse updated successfully',
      data: horse
    });

  } catch (error) {
    console.error('Update horse error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete horse
router.delete('/horses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.horse.delete({
      where: { id }
    });

    res.json({
      message: 'Horse deleted successfully'
    });

  } catch (error) {
    console.error('Delete horse error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
