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

// Update horse status (PATCH for partial updates)
router.patch('/horses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const horse = await prisma.horse.update({
      where: { id },
      data: updateData
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

// Update horse (PUT for full updates)
router.put('/horses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, breed, dob, sex, temperament, weight, height, bio } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Horse name is required' });
    }

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
        bio
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
            isActive: true,
            createdAt: true,
            updatedAt: true
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

    // Transform the data to flatten the user properties
    const transformedStudents = students.map(student => ({
      id: student.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      phone: student.user.phone,
      userType: 'student' as const,
      isActive: student.user.isActive,
      createdAt: student.user.createdAt.toISOString(),
      updatedAt: student.user.updatedAt.toISOString(),
      totalLessons: student.bookings.length,
      lastLessonDate: student.bookings.length > 0 ? student.bookings[0].createdAt.toISOString() : undefined
    }));

    res.json({
      students: transformedStudents
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student status (PATCH for partial updates)
router.patch('/students/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update the user's isActive status
    const student = await prisma.student.update({
      where: { id },
      data: {
        user: {
          update: {
            isActive: updateData.isActive
          }
        }
      },
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
        }
      }
    });

    res.json({
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update student error:', error);
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

    // Create proper DateTime objects for time fields
    const slotDate = new Date(date);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: slotDate,
        startTime: startDateTime,
        endTime: endDateTime,
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

// Get availability slots
router.get('/slots', async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    let whereClause: any = {};
    if (date) {
      whereClause.date = new Date(date as string);
    }

    const slots = await prisma.availabilitySlot.findMany({
      where: whereClause,
      include: {
        lessonType: true,
        horse: true,
        instructor: {
          select: {
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
      orderBy: {
        date: 'asc',
        startTime: 'asc'
      }
    });

    res.json({
      slots: slots
    });

  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create availability slot
router.post('/slots', async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, lessonTypeId, capacity, status } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Date, start time, and end time are required' 
      });
    }

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date(date),
        startTime: new Date(`2000-01-01T${startTime}`),
        endTime: new Date(`2000-01-01T${endTime}`),
        lessonTypeId: lessonTypeId || null,
        capacity: capacity || 1,
        status: status || 'open'
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

// Get lesson types
router.get('/lesson-types', async (req: Request, res: Response) => {
  try {
    const lessonTypes = await prisma.lessonType.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      lessonTypes: lessonTypes
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

// Advanced Calendar System

// Get calendar settings
router.get('/calendar-settings', async (req: Request, res: Response) => {
  try {
    // For now, return default settings
    // In a real app, you'd store these in the database
    const settings = {
      workingDays: [1, 2, 3, 4, 5], // Monday-Friday
      startTime: "08:00",
      endTime: "18:00",
      timeIncrement: 30,
      timeSlots: []
    };

    res.json({
      settings: settings
    });

  } catch (error) {
    console.error('Get calendar settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update calendar settings
router.put('/calendar-settings', async (req: Request, res: Response) => {
  try {
    const { workingDays, startTime, endTime, timeIncrement } = req.body;

    // In a real app, you'd save these to the database
    const settings = {
      workingDays: workingDays || [1, 2, 3, 4, 5],
      startTime: startTime || "08:00",
      endTime: endTime || "18:00",
      timeIncrement: timeIncrement || 30,
      timeSlots: []
    };

    res.json({
      message: 'Settings updated successfully',
      settings: settings
    });

  } catch (error) {
    console.error('Update calendar settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get calendar events
router.get('/calendar-events', async (req: Request, res: Response) => {
  try {
    // For now, return sample events to demonstrate functionality
    // In a real app, you'd fetch from a calendar_events table
    const events: any[] = [
      {
        id: 'event_1',
        title: 'Sarah Johnson - Beginner Riding',
        description: 'Beginner riding lesson with safety considerations',
        startTime: '09:00',
        endTime: '10:00',
        date: new Date().toISOString().split('T')[0],
        type: 'lesson',
        blocksTime: true,
        reminderTime: '08:45',
        isReminderShown: false,
        student: {
          id: 'student_1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          safetyCriteria: ['wheelchair', 'anxiety']
        },
        lessonType: {
          id: 'lesson_1',
          name: 'Beginner Riding',
          durationMinutes: 60,
          priceCents: 7500,
          maxStudents: 1
        },
        horseName: 'Gentle Spirit',
        instructorName: 'Mike Wilson',
        safetyCriteria: ['wheelchair', 'anxiety']
      },
      {
        id: 'event_2',
        title: 'Alex Chen - Advanced Riding',
        description: 'Advanced riding lesson',
        startTime: '14:00',
        endTime: '15:30',
        date: new Date().toISOString().split('T')[0],
        type: 'lesson',
        blocksTime: true,
        reminderTime: '13:45',
        isReminderShown: false,
        student: {
          id: 'student_2',
          firstName: 'Alex',
          lastName: 'Chen',
          safetyCriteria: ['vision']
        },
        lessonType: {
          id: 'lesson_2',
          name: 'Advanced Riding',
          durationMinutes: 90,
          priceCents: 12000,
          maxStudents: 1
        },
        horseName: 'Thunder',
        instructorName: 'Lisa Rodriguez',
        safetyCriteria: ['vision']
      },
      {
        id: 'event_3',
        title: 'Staff Meeting',
        description: 'Weekly staff coordination',
        startTime: '16:00',
        endTime: '17:00',
        date: new Date().toISOString().split('T')[0],
        type: 'reminder',
        blocksTime: false,
        reminderTime: '15:55',
        isReminderShown: false
      }
    ];

    res.json({
      events: events
    });

  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create calendar event
router.post('/calendar-events', async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, date, type, blocksTime, reminderTime } = req.body;

    if (!title || !startTime || !endTime || !date) {
      return res.status(400).json({ 
        error: 'Title, start time, end time, and date are required' 
      });
    }

    // In a real app, you'd save this to a calendar_events table
    const event = {
      id: `event_${Date.now()}`,
      title,
      description,
      startTime,
      endTime,
      date,
      type: type || 'event',
      blocksTime: blocksTime !== false,
      reminderTime,
      isReminderShown: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update calendar event
router.put('/calendar-events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, date, type, blocksTime, reminderTime } = req.body;

    if (!title || !startTime || !endTime || !date) {
      return res.status(400).json({ 
        error: 'Title, start time, end time, and date are required' 
      });
    }

    // In a real app, you'd update this in a calendar_events table
    const event = {
      id,
      title,
      description,
      startTime,
      endTime,
      date,
      type: type || 'event',
      blocksTime: blocksTime !== false,
      reminderTime,
      isReminderShown: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Update calendar event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
