import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { ActivityLogger } from '../services/activityLogger';

const router = Router();

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

// Get user profile
router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        guardian: {
          include: {
            guardianStudents: {
              include: {
                student: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        },
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, email, phone, currentPassword, newPassword } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId }
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email address is already in use' });
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          phone,
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      });
    } else {
      // Update without password change
      await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          phone,
          updatedAt: new Date()
        }
      });
    }

    // Log profile update activity
    await ActivityLogger.logAction(userId, req, 'profile_updated', {
      fieldsUpdated: Object.keys(req.body).filter(key => key !== 'currentPassword' && key !== 'newPassword')
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
