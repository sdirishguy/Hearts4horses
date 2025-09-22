import cron from 'node-cron';
import { notificationService } from '../services/notification.service';
import { bookingService } from '../services/booking.service';

class Scheduler {
  start() {
    // Send daily lesson reminders at 6 PM
    cron.schedule('0 18 * * *', async () => {
      console.log('Sending daily lesson reminders...');
      try {
        const results = await notificationService.sendDailyReminders();
        console.log('Reminders sent:', results);
      } catch (error) {
        console.error('Failed to send reminders:', error);
      }
    });

    // Generate weekly slots every Sunday at midnight
    cron.schedule('0 0 * * 0', async () => {
      console.log('Generating weekly slots...');
      try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        await bookingService.generateWeeklySlots(nextWeek);
        console.log('Weekly slots generated');
      } catch (error) {
        console.error('Failed to generate slots:', error);
      }
    });

    console.log('✅ Scheduler started');
  }
}

export const scheduler = new Scheduler();