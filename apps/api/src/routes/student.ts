import express, { Request, Response } from 'express';
import { authenticateToken, requireStudent } from '../middleware/auth';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
const router = express.Router();

// Apply authentication middleware to all student routes
router.use(authenticateToken);
router.use(requireStudent);

// Get available lesson slots
router.get('/slots', async (req: Request, res: Response) => {
  try {
    const { date, lessonTypeId } = req.query;
    
    const where: any = {
      status: 'open',
      capacity: { gt: 0 }
    };

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
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
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        bookings: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate remaining capacity
    const slotsWithCapacity = slots.map(slot => ({
      ...slot,
      remainingCapacity: slot.capacity - slot.bookings.length
    }));

    res.json({
      data: slotsWithCapacity
    });

  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book a lesson
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const { slotId, notes } = req.body;
    const studentId = req.user!.userId;

    // Validate input
    if (!slotId) {
      return res.status(400).json({ error: 'Slot ID is required' });
    }

    // Check if slot exists and is available
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
      include: {
        bookings: true
      }
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.status !== 'open') {
      return res.status(400).json({ error: 'Slot is not available' });
    }

    if (slot.bookings.length >= slot.capacity) {
      return res.status(400).json({ error: 'Slot is full' });
    }

    // Check if student already has a booking for this slot
    const existingBooking = await prisma.lessonBooking.findFirst({
      where: {
        slotId,
        studentId
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'You already have a booking for this slot' });
    }

    // Create booking
    const booking = await prisma.lessonBooking.create({
      data: {
        studentId,
        slotId,
        notes,
        status: 'booked',
        paymentSource: 'package' // Default to package for now
      },
      include: {
        slot: {
          include: {
            lessonType: true,
            horse: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Lesson booked successfully',
      data: booking
    });

  } catch (error) {
    console.error('Book lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student's bookings
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;
    const { status } = req.query;

    const where: any = { studentId };
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.lessonBooking.findMany({
      where,
      include: {
        slot: {
          include: {
            lessonType: true,
            horse: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true
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
      orderBy: {
        slot: {
          date: 'asc'
        }
      }
    });

    res.json({
      data: bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel a booking
router.patch('/bookings/:bookingId/cancel', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const studentId = req.user!.userId;

    const booking = await prisma.lessonBooking.findFirst({
      where: {
        id: bookingId,
        studentId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    // Update booking status
    await prisma.lessonBooking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    });

    res.json({
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student's packages
router.get('/packages', async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const packages = await prisma.studentPackage.findMany({
      where: { studentId },
      include: {
        lessonType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      data: packages
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student's progress
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const progressNotes = await prisma.progressNote.findMany({
      where: {
        lessonBooking: {
          studentId
        }
      },
      include: {
        lessonBooking: {
          include: {
            slot: {
              include: {
                lessonType: true,
                horse: true
              }
            }
          }
        },
        instructor: {
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

    res.json({
      data: progressNotes
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const student = await prisma.student.findUnique({
      where: { userId: studentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        guardianStudents: {
          include: {
            guardian: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({
      data: student
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available lesson types
router.get('/lesson-types', async (req: Request, res: Response) => {
  try {
    const lessonTypes = await prisma.lessonType.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      data: lessonTypes
    });

  } catch (error) {
    console.error('Get lesson types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available packages for purchase
router.get('/packages/available', async (req: Request, res: Response) => {
  try {
    const packages = await prisma.product.findMany({
      where: {
        type: 'merch',
        isActive: true
      },
      orderBy: {
        priceCents: 'asc'
      }
    });

    res.json({
      data: packages
    });

  } catch (error) {
    console.error('Get available packages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchase a package
router.post('/packages/purchase', async (req: Request, res: Response) => {
  try {
    const { packageId, paymentSource } = req.body;
    const studentId = req.user!.userId;

    // Validate input
    if (!packageId) {
      return res.status(400).json({ error: 'Package ID is required' });
    }

    // Get the package details
    const product = await prisma.product.findUnique({
      where: { id: packageId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Create student package
    const studentPackage = await prisma.studentPackage.create({
      data: {
        studentId,
        lessonTypeId: packageId, // Using lessonTypeId as a placeholder
        lessonsIncluded: 5, // Default value
        remainingLessons: 5, // Default value
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        stripePaymentId: null
      }
    });

    res.status(201).json({
      message: 'Package purchased successfully',
      data: studentPackage
    });

  } catch (error) {
    console.error('Purchase package error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get progress statistics
router.get('/progress/stats', async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    // Get total lessons
    const totalLessons = await prisma.lessonBooking.count({
      where: { studentId }
    });

    // Get completed lessons
    const completedLessons = await prisma.lessonBooking.count({
      where: {
        studentId,
        status: 'completed'
      }
    });

    // Get average rating from progress notes
    const progressNotes = await prisma.progressNote.findMany({
      where: {
        lessonBooking: {
          studentId
        }
      },
      select: {
        rating: true,
        skillsJson: true,
        noteText: true
      }
    });

    const averageRating = progressNotes.length > 0 
      ? progressNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / progressNotes.length
      : 0;

    // Extract skills mastered from skillsJson (simplified for now)
    const skillsMastered = new Set<string>();
    progressNotes.forEach(note => {
      if (note.skillsJson && typeof note.skillsJson === 'object') {
        // Parse skills from JSON if available
        const skills = note.skillsJson as any;
        if (skills.strengths && Array.isArray(skills.strengths)) {
          skills.strengths.forEach((skill: string) => skillsMastered.add(skill));
        }
      }
    });

    // Get current focus from most recent progress note
    const latestProgressNote = await prisma.progressNote.findFirst({
      where: {
        lessonBooking: {
          studentId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        noteText: true
      }
    });

    const stats = {
      totalLessons,
      completedLessons,
      averageRating,
      skillsMastered: Array.from(skillsMastered),
      currentFocus: latestProgressNote?.noteText || null
    };

    res.json({
      data: stats
    });

  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
