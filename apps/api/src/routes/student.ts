import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get student profile
router.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true,
        guardianStudents: {
          include: {
            guardian: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      throw createError('Student profile not found', 404);
    }

    res.json({
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// Update student profile
router.put('/profile', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { firstName, lastName, phone, experienceLevel, notes } = req.body;

    const student = await prisma.student.update({
      where: { userId: req.user.id },
      data: {
        experienceLevel,
        notes,
        user: {
          update: {
            firstName,
            lastName,
            phone
          }
        }
      },
      include: {
        user: true
      }
    });

    res.json({
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// Get available slots for booking
router.get('/slots', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { from, to, lessonTypeId } = req.query;

    const where: any = {
      status: 'open',
      date: {}
    };

    if (from) {
      where.date.gte = new Date(from as string);
    }
    if (to) {
      where.date.lte = new Date(to as string);
    }
    if (lessonTypeId) {
      where.lessonTypeId = lessonTypeId;
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      include: {
        lessonType: true,
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        horse: {
          select: {
            id: true,
            name: true,
            breed: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    res.json({
      data: slots
    });
  } catch (error) {
    next(error);
  }
});

// Book a lesson
router.post('/bookings', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { slotId, paymentSource, notes } = req.body;

    // Get student
    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      throw createError('Student profile not found', 404);
    }

    // Check if slot is available
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
      include: {
        lessonType: true
      }
    });

    if (!slot || slot.status !== 'open') {
      throw createError('Slot not available', 400);
    }

    // If using package, check if student has available lessons
    if (paymentSource === 'package') {
      const studentPackage = await prisma.studentPackage.findFirst({
        where: {
          studentId: student.id,
          lessonTypeId: slot.lessonTypeId,
          status: 'active',
          remainingLessons: { gt: 0 },
          expiresAt: { gt: new Date() }
        }
      });

      if (!studentPackage) {
        throw createError('No available lesson package found', 400);
      }

      // Create booking and update package
      const [booking] = await prisma.$transaction([
        prisma.lessonBooking.create({
          data: {
            slotId,
            studentId: student.id,
            paymentSource: 'package',
            notes
          },
          include: {
            slot: {
              include: {
                lessonType: true,
                instructor: true
              }
            }
          }
        }),
        prisma.studentPackage.update({
          where: { id: studentPackage.id },
          data: { remainingLessons: { decrement: 1 } }
        }),
        prisma.availabilitySlot.update({
          where: { id: slotId },
          data: { status: 'booked' }
        })
      ]);

      res.json({
        data: booking
      });
    } else {
      // Single lesson purchase - create booking with held status
      const booking = await prisma.lessonBooking.create({
        data: {
          slotId,
          studentId: student.id,
          paymentSource: 'single',
          notes
        },
        include: {
          slot: {
            include: {
              lessonType: true,
              instructor: true
            }
          }
        }
      });

      // Update slot to held status
      await prisma.availabilitySlot.update({
        where: { id: slotId },
        data: { status: 'held' }
      });

      res.json({
        data: booking
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get student's bookings
router.get('/bookings', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      throw createError('Student profile not found', 404);
    }

    const where: any = { studentId: student.id };
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.lessonBooking.findMany({
      where,
      include: {
        slot: {
          include: {
            lessonType: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            horse: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        progressNotes: {
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.lessonBooking.count({ where });

    res.json({
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Cancel a booking
router.patch('/bookings/:id/cancel', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      throw createError('Student profile not found', 404);
    }

    const booking = await prisma.lessonBooking.findFirst({
      where: {
        id,
        studentId: student.id
      },
      include: {
        slot: true
      }
    });

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    if (booking.status !== 'booked') {
      throw createError('Cannot cancel this booking', 400);
    }

    // Check if it's within cancellation window (e.g., 24 hours)
    const lessonDate = new Date(booking.slot.date);
    const now = new Date();
    const hoursUntilLesson = (lessonDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilLesson < 24) {
      throw createError('Cannot cancel within 24 hours of lesson', 400);
    }

    // Cancel booking and update slot
    const [updatedBooking] = await prisma.$transaction([
      prisma.lessonBooking.update({
        where: { id },
        data: { status: 'cancelled' }
      }),
      prisma.availabilitySlot.update({
        where: { id: booking.slotId },
        data: { status: 'open' }
      })
    ]);

    // If it was a package booking, refund the lesson
    if (booking.paymentSource === 'package') {
      await prisma.studentPackage.updateMany({
        where: {
          studentId: student.id,
          lessonTypeId: booking.slot.lessonTypeId,
          status: 'active'
        },
        data: {
          remainingLessons: { increment: 1 }
        }
      });
    }

    res.json({
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
});

// Get student's packages
router.get('/packages', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id }
    });

    if (!student) {
      throw createError('Student profile not found', 404);
    }

    const packages = await prisma.studentPackage.findMany({
      where: { studentId: student.id },
      include: {
        lessonType: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: packages
    });
  } catch (error) {
    next(error);
  }
});

export default router;
