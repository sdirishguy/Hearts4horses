import { prisma } from '../lib/prisma';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { format } from 'date-fns';
import { BookingStatus } from '@prisma/client';

class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio | null = null;

  constructor() {
    // Email setup
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // SMS setup (optional)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  // Send email notification
  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const result = await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'Hearts4Horses <noreply@hearts4horses.com>',
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text || params.html.replace(/<[^>]*>/g, '')
      });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  // Send SMS notification
  async sendSMS(phone: string, message: string) {
    if (!this.twilioClient) {
      console.log('SMS not configured, skipping:', message);
      return { success: false, reason: 'SMS not configured' };
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS send error:', error);
      throw error;
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(bookingId: string) {
    const booking = await prisma.lessonBooking.findUnique({
      where: { id: bookingId },
      include: {
        student: { include: { user: true } },
        slot: {
          include: {
            lessonType: true,
            instructor: true,
            horse: true
          }
        }
      }
    });

    if (!booking) throw new Error('Booking not found');

    const lessonDate = format(new Date(booking.slot.date), 'EEEE, MMMM d, yyyy');
    const lessonTime = format(new Date(booking.slot.startTime), 'h:mm a');

    // Email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4B352A; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Lesson Confirmation</h1>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h2 style="color: #4B352A;">Hi ${booking.student.user.firstName}!</h2>
          <p>Your lesson has been confirmed:</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #CA7842; margin-top: 0;">Lesson Details</h3>
            <p><strong>Date:</strong> ${lessonDate}</p>
            <p><strong>Time:</strong> ${lessonTime}</p>
            <p><strong>Type:</strong> ${booking.slot.lessonType.name}</p>
            <p><strong>Instructor:</strong> ${booking.slot.instructor?.firstName} ${booking.slot.instructor?.lastName}</p>
            ${booking.slot.horse ? `<p><strong>Horse:</strong> ${booking.slot.horse.name}</p>` : ''}
          </div>
          
          <div style="background: #FFF9E6; padding: 15px; border-radius: 8px; border-left: 4px solid #CA7842;">
            <h4 style="margin-top: 0; color: #CA7842;">Remember to:</h4>
            <ul>
              <li>Arrive 15 minutes early</li>
              <li>Wear long pants and closed-toe shoes</li>
              <li>Bring your helmet (or borrow one of ours)</li>
              <li>Check weather conditions</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px; color: #666;">
            Need to cancel or reschedule? Please give us at least 24 hours notice.
          </p>
        </div>
        <div style="background: #4B352A; color: white; padding: 15px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Hearts4Horses | (555) 123-4567 | info@hearts4horses.com</p>
        </div>
      </div>
    `;

    // Send email
    await this.sendEmail({
      to: booking.student.user.email,
      subject: `Lesson Confirmed - ${lessonDate} at ${lessonTime}`,
      html: emailHtml
    });

    // Send SMS if available
    if (booking.student.user.phone) {
      await this.sendSMS(
        booking.student.user.phone,
        `Hearts4Horses: Lesson confirmed for ${lessonDate} at ${lessonTime} with ${booking.slot.instructor?.firstName}. Reply STOP to opt out.`
      );
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: booking.student.userId,
        title: 'Lesson Confirmed',
        content: `Your ${booking.slot.lessonType.name} lesson on ${lessonDate} at ${lessonTime} has been confirmed.`,
        type: 'booking_confirmation',
        priority: 'medium',
        dataJson: { bookingId }
      }
    });
  }

  // Send lesson reminder
  async sendLessonReminder(bookingId: string) {
    const booking = await prisma.lessonBooking.findUnique({
      where: { id: bookingId },
      include: {
        student: { include: { user: true } },
        slot: { include: { lessonType: true, instructor: true } }
      }
    });

    if (!booking) return;

    const lessonDate = format(new Date(booking.slot.startTime), 'h:mm a');
    
    // SMS reminder
    if (booking.student.user.phone) {
      await this.sendSMS(
        booking.student.user.phone,
        `Hearts4Horses Reminder: You have a lesson tomorrow at ${lessonDate}. See you soon!`
      );
    }

    // Email reminder
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #CA7842; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Lesson Reminder</h2>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <h3>Hi ${booking.student.user.firstName}!</h3>
          <p>Just a friendly reminder about your lesson tomorrow:</p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Time:</strong> ${lessonDate}</p>
            <p><strong>Lesson:</strong> ${booking.slot.lessonType.name}</p>
            <p><strong>Instructor:</strong> ${booking.slot.instructor?.firstName}</p>
          </div>
          <p>See you at the barn!</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: booking.student.user.email,
      subject: 'Lesson Reminder - Tomorrow',
      html: emailHtml
    });
  }

  // Batch send reminders for tomorrow's lessons
  async sendDailyReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const bookings = await prisma.lessonBooking.findMany({
      where: {
        slot: {
          date: {
            gte: tomorrow,
            lte: tomorrowEnd
          }
        },
        status: { in: [BookingStatus.booked, BookingStatus.completed] }
      }
    });

    const results = [];
    for (const booking of bookings) {
      try {
        await this.sendLessonReminder(booking.id);
        results.push({ bookingId: booking.id, success: true });
      } catch (error) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, error);
        results.push({ bookingId: booking.id, success: false, error });
      }
    }

    return results;
  }
}

export const notificationService = new NotificationService();