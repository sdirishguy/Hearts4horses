import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticateToken, requireStudent } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Apply authentication/authorization middleware up front. This ensures all
// subsequent handlers can safely assume req.user is defined and of type
// student. Keeping this at the top also avoids repeated checks in each route.
router.use(authenticateToken);
router.use(requireStudent);

// -----------------------------------------------------------------------------
// Zod schemas for validating request payloads. Defining them here allows
// re‑use across routes and makes it obvious what shape each endpoint expects.
const bookingSchema = z.object({
  slotId: z.string().nonempty('Slot ID is required'),
  notes: z.string().optional(),
});

const purchaseSchema = z.object({
  packageId: z.string().nonempty('Package ID is required'),
  paymentSource: z.enum(['package', 'stripe', 'card']).optional(),
});

// -----------------------------------------------------------------------------
// GET /slots - Return open availability slots. Query parameters allow
// filtering by date or lesson type. Unhandled errors bubble up to the
// central errorHandler.
router.get(
  '/slots',
  asyncHandler(async (req: Request, res: Response) => {
    const { date, lessonTypeId } = req.query;

    const where: any = {
      status: 'open',
      capacity: { gt: 0 },
    };
    if (date) {
      const start = new Date(date as string);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      where.date = { gte: start, lt: end };
    }
    if (lessonTypeId) {
      where.lessonTypeId = lessonTypeId;
    }
    const slots = await prisma.availabilitySlot.findMany({
      where,
      include: {
        lessonType: true,
        horse: true,
        instructor: {
          select: { id: true, firstName: true, lastName: true },
        },
        bookings: { select: { id: true } },
      },
      orderBy: { date: 'asc' },
    });
    // Compute remaining capacity per slot on the fly
    const enriched = slots.map((slot) => ({
      ...slot,
      remainingCapacity: slot.capacity - slot.bookings.length,
    }));
    res.json({ data: enriched });
  })
);

// -----------------------------------------------------------------------------
// POST /bookings - Create a booking for the authenticated student. Input
// validation is performed with zod. Business logic checks ensure the slot is
// available and the student does not already have a booking.
router.post(
  '/bookings',
  asyncHandler(async (req: Request, res: Response) => {
    const { slotId, notes } = bookingSchema.parse(req.body);
    const studentId = req.user!.userId;
    // Fetch slot and validate it exists and is open
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
      include: { bookings: true },
    });
    if (!slot) throw createError('Slot not found', 404);
    if (slot.status !== 'open') throw createError('Slot is not available', 400);
    if (slot.bookings.length >= slot.capacity)
      throw createError('Slot is full', 400);
    // Prevent duplicate bookings
    const existing = await prisma.lessonBooking.findFirst({
      where: { slotId, studentId },
    });
    if (existing) throw createError('You already have a booking for this slot', 400);
    // Persist booking and return expanded slot details
    const booking = await prisma.lessonBooking.create({
      data: {
        studentId,
        slotId,
        lessonTypeId: slot.lessonTypeId,
        notes,
        status: 'booked',
        paymentSource: 'package',
      },
      include: {
        slot: {
          include: {
            lessonType: true,
            horse: true,
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
    res.status(201).json({ message: 'Lesson booked successfully', data: booking });
  })
);

// -----------------------------------------------------------------------------
// GET /bookings - List bookings for the authenticated student. Supports
// optional filtering by status via query parameter.
router.get(
  '/bookings',
  asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.userId;
    const { status } = req.query;
    const where: any = { studentId };
    if (status) where.status = status;
    const bookings = await prisma.lessonBooking.findMany({
      where,
      include: {
        slot: {
          include: {
            lessonType: true,
            horse: true,
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
        progressNotes: {
          include: {
            instructor: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { slot: { date: 'asc' } },
    });
    res.json({ data: bookings });
  })
);

// -----------------------------------------------------------------------------
// PATCH /bookings/:bookingId/cancel - Cancel an existing booking. Only
// bookings with status "booked" may be cancelled.
router.patch(
  '/bookings/:bookingId/cancel',
  asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const studentId = req.user!.userId;
    const booking = await prisma.lessonBooking.findFirst({
      where: { id: bookingId, studentId },
    });
    if (!booking) throw createError('Booking not found', 404);
    if (booking.status !== 'booked')
      throw createError('Booking cannot be cancelled', 400);
    await prisma.lessonBooking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
    });
    res.json({ message: 'Booking cancelled successfully' });
  })
);

// -----------------------------------------------------------------------------
// GET /packages - Retrieve a list of lesson packages owned by the student.
router.get(
  '/packages',
  asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.userId;
    const packages = await prisma.studentPackage.findMany({
      where: { studentId },
      include: { lessonType: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: packages });
  })
);

// -----------------------------------------------------------------------------
// GET /progress - Return progress notes for the student.
router.get(
  '/progress',
  asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.userId;
    const notes = await prisma.progressNote.findMany({
      where: {
        lessonBooking: { studentId },
      },
      include: {
        lessonBooking: {
          include: {
            slot: {
              include: { lessonType: true, horse: true },
            },
          },
        },
        instructor: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: notes });
  })
);

// -----------------------------------------------------------------------------
// GET /profile - Retrieve the student's profile including related guardian
// information.
router.get(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.userId;
    const student = await prisma.student.findUnique({
      where: { userId: studentId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
        guardianStudents: {
          include: {
            guardian: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
              },
            },
          },
        },
      },
    });
    if (!student) throw createError('Student profile not found', 404);
    res.json({ data: student });
  })
);

// -----------------------------------------------------------------------------
// GET /lesson-types - List all lesson types ordered alphabetically. No
// authentication beyond the student guard is required.
router.get(
  '/lesson-types',
  asyncHandler(async (req: Request, res: Response) => {
    const types = await prisma.lessonType.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: types });
  })
);

// -----------------------------------------------------------------------------
// GET /packages/available - Return a list of active package products that can
// be purchased. Only products with type `package` are returned; this avoids
// misclassifying merchandise as packages.
router.get(
  '/packages/available',
  asyncHandler(async (req: Request, res: Response) => {
    const packages = await prisma.product.findMany({
      where: { type: 'lesson_package', isActive: true },
      orderBy: { priceCents: 'asc' },
    });
    res.json({ data: packages });
  })
);

// -----------------------------------------------------------------------------
// POST /packages/purchase - Purchase a package. Validates input and ensures
// the requested product exists and is of type `package`.
router.post(
  '/packages/purchase',
  asyncHandler(async (req: Request, res: Response) => {
    const { packageId, paymentSource } = purchaseSchema.parse(req.body);
    const studentId = req.user!.userId;
    const product = await prisma.product.findUnique({ where: { id: packageId } });
    if (!product || product.type !== 'lesson_package' || !product.isActive)
      throw createError('Package not found', 404);
    // Determine lesson count from product metadata or default to 5
    const lessonsIncluded = (product as any).lessonsIncluded ?? 5;
    const studentPackage = await prisma.studentPackage.create({
      data: {
        studentId,
        lessonTypeId: (product as any).lessonTypeId ?? undefined,
        packageName: product.name,
        lessonsIncluded,
        remainingLessons: lessonsIncluded,
        pricePaidCents: product.priceCents,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        stripePaymentId: null,
      },
    });
    res.status(201).json({ message: 'Package purchased successfully', data: studentPackage });
  })
);

// -----------------------------------------------------------------------------
// GET /progress/stats - Aggregate basic progress statistics for the student.
router.get(
  '/progress/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.user!.userId;
    const totalLessons = await prisma.lessonBooking.count({ where: { studentId } });
    const completedLessons = await prisma.lessonBooking.count({ where: { studentId, status: 'completed' } });
    const notes = await prisma.progressNote.findMany({
      where: { lessonBooking: { studentId } },
      select: { overallRating: true, skillsAssessed: true, publicNotes: true },
    });
    const averageRating = notes.length
      ? notes.reduce((sum, note) => sum + (note.overallRating || 0), 0) / notes.length
      : 0;
    // Extract mastered skills from each progress note. Using a Set ensures
    // duplicates are removed.
    const skillsMastered = new Set<string>();
    for (const note of notes) {
      if (note.skillsAssessed && typeof note.skillsAssessed === 'object') {
        const skills = note.skillsAssessed as any;
        if (Array.isArray(skills.strengths)) {
          skills.strengths.forEach((skill: string) => skillsMastered.add(skill));
        }
      }
    }
    const latest = await prisma.progressNote.findFirst({
      where: { lessonBooking: { studentId } },
      orderBy: { createdAt: 'desc' },
      select: { publicNotes: true },
    });
    const stats = {
      totalLessons,
      completedLessons,
      averageRating,
      skillsMastered: Array.from(skillsMastered),
      currentFocus: latest?.publicNotes || null,
    };
    res.json({ data: stats });
  })
);

export default router;