import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

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
      data: horses
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

// Student Management

// Get all students
router.get('/students', async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isActive: true
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
        },
        bookings: {
          include: {
            slot: {
              include: {
                lessonType: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 bookings
        }
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    res.json({
      data: students
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student details
router.get('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isActive: true
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
        },
        bookings: {
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
              date: 'desc'
            }
          }
        },
        packages: {
          include: {
            lessonType: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      data: student
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calendar/Scheduling

// Get all availability slots
router.get('/slots', async (req: Request, res: Response) => {
  try {
    const { date, instructorId, lessonTypeId } = req.query;
    
    const where: any = {};

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }

    if (instructorId) {
      where.instructorId = instructorId;
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
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
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
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create availability slot
router.post('/slots', async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, instructorId, lessonTypeId, capacity, horseId } = req.body;

    if (!date || !startTime || !endTime || !lessonTypeId) {
      return res.status(400).json({ 
        error: 'Date, start time, end time, and lesson type are required' 
      });
    }

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        instructorId,
        lessonTypeId,
        capacity: capacity || 1,
        horseId,
        status: 'open'
      },
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
    });

    res.status(201).json({
      message: 'Slot created successfully',
      data: slot
    });

  } catch (error) {
    console.error('Create slot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update availability slot
router.put('/slots/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, instructorId, lessonTypeId, capacity, horseId, status } = req.body;

    const slot = await prisma.availabilitySlot.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        instructorId,
        lessonTypeId,
        capacity,
        horseId,
        status
      },
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
    });

    res.json({
      message: 'Slot updated successfully',
      data: slot
    });

  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete availability slot
router.delete('/slots/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if slot has bookings
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id },
      include: {
        bookings: true
      }
    });

    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    if (slot.bookings.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete slot with existing bookings' 
      });
    }

    await prisma.availabilitySlot.delete({
      where: { id }
    });

    res.json({
      message: 'Slot deleted successfully'
    });

  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lesson types
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

// Create lesson type
router.post('/lesson-types', async (req: Request, res: Response) => {
  try {
    const { name, durationMinutes, priceCents, maxStudents, requiresHorse } = req.body;

    if (!name || !durationMinutes || !priceCents) {
      return res.status(400).json({ 
        error: 'Name, duration, and price are required' 
      });
    }

    const lessonType = await prisma.lessonType.create({
      data: {
        name,
        durationMinutes: parseInt(durationMinutes),
        priceCents: parseInt(priceCents),
        maxStudents: maxStudents ? parseInt(maxStudents) : 1,
        requiresHorse: requiresHorse !== false
      }
    });

    res.status(201).json({
      message: 'Lesson type created successfully',
      data: lessonType
    });

  } catch (error) {
    console.error('Create lesson type error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
