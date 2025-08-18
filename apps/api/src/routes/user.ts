import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user notifications
router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 most recent
    });

    // Add timeAgo field for frontend
    const notificationsWithTimeAgo = notifications.map(notification => {
      const timeDiff = Date.now() - new Date(notification.createdAt).getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      let timeAgo = '';
      if (days > 0) {
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = 'Just now';
      }

      return {
        ...notification,
        timeAgo
      };
    });

    res.json({
      notifications: notificationsWithTimeAgo
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user announcements
router.get('/announcements', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get published announcements that haven't expired
    const announcements = await prisma.announcement.findMany({
      where: {
        isPublished: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        userNotifications: {
          where: {
            userId: userId
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 10 // Limit to 10 most recent
    });

    // Add timeAgo and isRead fields for frontend
    const announcementsWithTimeAgo = announcements.map(announcement => {
      const timeDiff = Date.now() - new Date(announcement.publishedAt).getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      let timeAgo = '';
      if (days > 0) {
        timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = 'Just now';
      }

      const isRead = announcement.userNotifications.length > 0 && 
                    announcement.userNotifications[0].isRead;

      return {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        from: `${announcement.author.firstName} ${announcement.author.lastName}`,
        isRead,
        timeAgo,
        priority: announcement.priority
      };
    });

    res.json({
      announcements: announcementsWithTimeAgo
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const notificationId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark announcement as read
router.patch('/announcements/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const announcementId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await prisma.userNotification.upsert({
      where: {
        userId_announcementId: {
          userId,
          announcementId
        }
      },
      update: {
        isRead: true,
        readAt: new Date()
      },
      create: {
        userId,
        announcementId,
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({ message: 'Announcement marked as read' });

  } catch (error) {
    console.error('Mark announcement read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user messages
router.get('/messages', requireAuth, async (req: Request, res: Response) => {
  try {
    // For now, return sample messages
    // In a real app, you'd fetch from a messages table
    const messages = [
      {
        id: 'msg_1',
        from: 'Instructor Sarah',
        subject: 'Lesson Feedback',
        content: 'Great progress today! Your posture has improved significantly.',
        isRead: false,
        timeAgo: '1 day ago'
      },
      {
        id: 'msg_2',
        from: 'Admin',
        subject: 'Payment Confirmation',
        content: 'Your payment for the 10-lesson package has been received. Thank you!',
        isRead: true,
        timeAgo: '3 days ago'
      }
    ];

    res.json({
      messages: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
