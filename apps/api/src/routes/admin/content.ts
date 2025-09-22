import express from 'express';
import multer from 'multer';
import { authenticateToken, requireRole } from '../../middleware/auth';
import { contentService } from '../../services/content.service';
import { z } from 'zod';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// All routes require admin role
router.use(authenticateToken, requireRole(['admin', 'manager']));

// Horse management
const horseSchema = z.object({
  name: z.string(),
  breed: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.string().optional(),
  temperament: z.enum(['calm', 'spirited', 'green', 'steady']).optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  maxRiderWeight: z.number().optional(),
});

router.post('/horses', async (req, res) => {
  try {
    const data = horseSchema.parse(req.body);
    const horse = await contentService.createHorse(data);
    res.json(horse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

router.put('/horses/:id', async (req, res) => {
  try {
    const data = horseSchema.partial().parse(req.body);
    const horse = await contentService.updateHorse(req.params.id, data);
    res.json(horse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Media upload
router.post('/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const folder = req.body.folder || 'general';
    const media = await contentService.uploadMedia(req.file, folder);
    res.json(media);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Testimonials
router.post('/testimonials/:id/approve', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const testimonial = await contentService.approveTestimonial(req.params.id, userId);
    res.json(testimonial);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Events
const eventSchema = z.object({
  name: z.string(),
  description: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  capacity: z.number().optional(),
  priceCents: z.number().optional(),
  location: z.string().optional(),
});

router.post('/events', async (req, res) => {
  try {
    const data = eventSchema.parse(req.body);
    const event = await contentService.createEvent(data);
    res.json(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

router.post('/events/:id/publish', async (req, res) => {
  try {
    const event = await contentService.publishEvent(req.params.id);
    res.json(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Announcements
router.post('/announcements', async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const announcement = await contentService.createAnnouncement({
      ...req.body,
      authorId: userId
    });
    res.json(announcement);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

export default router;