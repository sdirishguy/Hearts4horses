import express, { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Attach guards at router level to enforce admin access on all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Schemas for validating announcement and horse payloads
const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  isPublished: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

const horseSchema = z.object({
  name: z.string().min(1, 'Horse name is required'),
  breed: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.string().optional(),
  temperament: z.enum(['calm', 'spirited', 'green', 'steady', 'energetic', 'lazy']).optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
});

// -----------------------------------------------------------------------------
// Announcements Management

// GET /announcements - Return all announcements in descending order of creation
router.get(
  '/announcements',
  asyncHandler(async (req: Request, res: Response) => {
    const announcements = await prisma.announcement.findMany({
      include: { author: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = announcements.map((a) => ({
      ...a,
      authorName: `${a.author.firstName} ${a.author.lastName}`,
    }));
    res.json({ announcements: formatted });
  })
);

// POST /announcements - Create a new announcement
router.post(
  '/announcements',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, content, priority, isPublished, expiresAt } = announcementSchema.parse(req.body);
    const authorId = req.user!.userId;
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        authorId,
        priority: priority || 'medium',
        isPublished: isPublished ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    res.status(201).json({
      announcement: {
        ...announcement,
        authorName: `${announcement.author.firstName} ${announcement.author.lastName}`,
      },
    });
  })
);

// PUT /announcements/:id - Update an existing announcement
router.put(
  '/announcements/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, priority, isPublished, expiresAt } = announcementSchema.parse(req.body);
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        priority: priority || 'medium',
        isPublished: isPublished ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
    res.json({
      announcement: {
        ...announcement,
        authorName: `${announcement.author.firstName} ${announcement.author.lastName}`,
      },
    });
  })
);

// DELETE /announcements/:id - Remove an announcement permanently
router.delete(
  '/announcements/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted successfully' });
  })
);

// -----------------------------------------------------------------------------
// Horse Management

// GET /horses - List all horses sorted alphabetically
router.get(
  '/horses',
  asyncHandler(async (req: Request, res: Response) => {
    const horses = await prisma.horse.findMany({ orderBy: { name: 'asc' } });
    res.json({ horses });
  })
);

// POST /horses - Create a new horse record
router.post(
  '/horses',
  asyncHandler(async (req: Request, res: Response) => {
    const payload = horseSchema.parse(req.body);
    const horse = await prisma.horse.create({
      data: {
        name: payload.name,
        breed: payload.breed,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
        sex: payload.sex,
        temperament: payload.temperament as any || null,
        weight: payload.weight ? parseFloat(payload.weight) : null,
        height: payload.height ? parseFloat(payload.height) : null,
        bio: payload.bio,
        isActive: payload.isActive ?? true,
      },
    });
    res.status(201).json({ message: 'Horse created successfully', data: horse });
  })
);

// PUT /horses/:id - Update a horse record
router.put(
  '/horses/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = horseSchema.parse(req.body);
    const horse = await prisma.horse.update({
      where: { id },
      data: {
        name: payload.name,
        breed: payload.breed,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
        sex: payload.sex,
        temperament: payload.temperament as any || null,
        weight: payload.weight ? parseFloat(payload.weight) : null,
        height: payload.height ? parseFloat(payload.height) : null,
        bio: payload.bio,
        isActive: payload.isActive,
      },
    });
    res.json({ message: 'Horse updated successfully', data: horse });
  })
);

// DELETE /horses/:id - Remove a horse record
router.delete(
  '/horses/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.horse.delete({ where: { id } });
    res.json({ message: 'Horse deleted successfully' });
  })
);

export default router;