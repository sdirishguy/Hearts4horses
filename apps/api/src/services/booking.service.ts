import { prisma } from '../lib/prisma';
import { addDays, setHours, setMinutes, startOfWeek, format } from 'date-fns';
import { BookingStatus } from '@prisma/client';

interface TimeSlot {
  date: Date;
  startTime: Date;
  endTime: Date;
  available: boolean;
  instructorId?: string;
  horseId?: string;
}

class BookingService {
  // Generate availability slots from templates
  async generateWeeklySlots(weekStartDate: Date) {
    const templates = await prisma.lessonBlockTemplate.findMany({
      where: { isActive: true } as any,
      include: { lessonType: true }
    });

    const weekStart = startOfWeek(weekStartDate);
    const slots: any[] = [];

    for (const template of templates) {
      const slotDate = addDays(weekStart, template.weekday);
      const [startHour, startMin] = (template.startTime as unknown as string).split(':').map(Number);

      const startTime = setMinutes(setHours(slotDate, startHour), startMin);
      const endTime = new Date(startTime.getTime() + ((template as any).lessonType.durationMinutes * 60 * 1000));

      // Check if slot already exists
      const existing = await prisma.availabilitySlot.findFirst({
        where: {
          date: slotDate,
          startTime,
          instructorId: template.instructorId
        }
      });

      if (!existing) {
        slots.push({
          date: slotDate,
          startTime,
          endTime,
          instructorId: template.instructorId,
          lessonTypeId: template.lessonTypeId,
          capacity: template.capacity,
          status: 'open'
        });
      }
    }

    if (slots.length > 0) {
      await prisma.availabilitySlot.createMany({ data: slots });
    }

    return slots;
  }

  // Get available slots for booking
  async getAvailableSlots(params: {
    startDate: Date;
    endDate: Date;
    lessonTypeId?: string;
    instructorId?: string;
  }) {
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        date: { gte: params.startDate, lte: params.endDate },
        status: 'open',
        ...(params.lessonTypeId && { lessonTypeId: params.lessonTypeId }),
        ...(params.instructorId && { instructorId: params.instructorId }),
      },
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        lessonType: true,
        horse: { select: { id: true, name: true } },
        _count: { select: { bookings: true } }
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    });

    // Filter out fully booked slots
    return slots.filter(slot => slot._count.bookings < slot.capacity);
  }

  // Book a lesson
  async bookLesson(params: {
    slotId: string;
    studentId: string;
    horseId?: string;
    packageId?: string;
    notes?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Get slot with lock
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: params.slotId },
        include: {
          lessonType: true,
          _count: { select: { bookings: true } }
        }
      });

      if (!slot) throw new Error('Slot not found');
      if (slot.status !== 'open') throw new Error('Slot not available');
      if (slot._count.bookings >= slot.capacity) throw new Error('Slot is full');

      // Check for conflicts
      const conflict = await tx.lessonBooking.findFirst({
        where: {
          studentId: params.studentId,
          slot: {
            date: slot.date,
            startTime: { lte: slot.endTime },
            endTime: { gte: slot.startTime }
          },
          status: { in: [BookingStatus.booked, BookingStatus.completed] }
        }
      });

      if (conflict) throw new Error('Student already has a booking at this time');

      // Handle payment
      let paymentSource = 'single';
      let amountPaidCents = slot.lessonType.priceCents;

      if (params.packageId) {
        const pkg = await tx.studentPackage.findUnique({
          where: { id: params.packageId }
        });

        if (!pkg || pkg.remainingLessons <= 0) {
          throw new Error('Invalid or depleted package');
        }

        // Deduct from package
        await tx.studentPackage.update({
          where: { id: params.packageId },
          data: { remainingLessons: pkg.remainingLessons - 1 }
        });

        paymentSource = 'package';
        amountPaidCents = 0;
      }

      // Create booking
      const booking = await tx.lessonBooking.create({
        data: {
          slotId: slot.id,
          studentId: params.studentId,
          lessonTypeId: slot.lessonTypeId,
          horseId: params.horseId,
          packageId: params.packageId,
          paymentSource,
          amountPaidCents,
          notes: params.notes,
          status: BookingStatus.booked
        } as any,
        include: {
          slot: { include: { instructor: true, lessonType: true } },
          student: { include: { user: true } },
          horse: true
        } as any
      });

      // Update slot if at capacity
      if (slot._count.bookings + 1 >= slot.capacity) {
        await tx.availabilitySlot.update({
          where: { id: slot.id },
          data: { status: 'booked' }
        });
      }

      return booking;
    });
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string) {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.lessonBooking.findUnique({
        where: { id: bookingId },
        include: { slot: true, package: true } as any
      });

      if (!booking) throw new Error('Booking not found');
      if (booking.status === 'cancelled') throw new Error('Already cancelled');

      // Refund to package if applicable
      if ((booking as any).packageId && (booking as any).package) {
        await tx.studentPackage.update({
          where: { id: (booking as any).packageId },
          data: { remainingLessons: ((booking as any).package as any).remainingLessons + 1 }
        });
      }

      // Update booking
      await tx.lessonBooking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.cancelled,
          cancellationReason: reason,
          cancelledAt: new Date()
        } as any
      });

      // Reopen slot if needed
      const remainingBookings = await tx.lessonBooking.count({
        where: {
          slotId: booking.slotId,
          status: { in: [BookingStatus.booked, BookingStatus.completed] }
        }
      });

      if (remainingBookings < (booking.slot as any).capacity) {
        await tx.availabilitySlot.update({
          where: { id: booking.slotId },
          data: { status: 'open' }
        });
      }

      return { success: true };
    });
  }
}

export const bookingService = new BookingService();