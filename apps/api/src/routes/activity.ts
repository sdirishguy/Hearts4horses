import express, { Request, Response } from 'express';
import { ActivityLogger } from '../services/activityLogger';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Log page view
router.post('/page-view', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { page } = req.body;
    const userId = (req as any).user.userId;

    if (!page) {
      return res.status(400).json({ error: 'Page parameter is required' });
    }

    await ActivityLogger.logPageView(userId, req, page);
    
    res.json({ message: 'Page view logged successfully' });
  } catch (error) {
    console.error('Error logging page view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log user action
router.post('/action', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { action, details } = req.body;
    const userId = (req as any).user.userId;

    if (!action) {
      return res.status(400).json({ error: 'Action parameter is required' });
    }

    await ActivityLogger.logAction(userId, req, action, details);
    
    res.json({ message: 'Action logged successfully' });
  } catch (error) {
    console.error('Error logging action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log session timeout
router.post('/session-timeout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { timeoutMinutes } = req.body;
    const userId = (req as any).user.userId;

    await ActivityLogger.logSessionTimeout(userId, req, timeoutMinutes || 30);
    
    res.json({ message: 'Session timeout logged successfully' });
  } catch (error) {
    console.error('Error logging session timeout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log session extension
router.post('/session-extended', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { newTimeoutMinutes } = req.body;
    const userId = (req as any).user.userId;

    await ActivityLogger.logSessionExtended(userId, req, newTimeoutMinutes || 30);
    
    res.json({ message: 'Session extension logged successfully' });
  } catch (error) {
    console.error('Error logging session extension:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log session warning
router.post('/session-warning', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { warningMinutes } = req.body;
    const userId = (req as any).user.userId;

    await ActivityLogger.logSessionWarning(userId, req, warningMinutes || 5);
    
    res.json({ message: 'Session warning logged successfully' });
  } catch (error) {
    console.error('Error logging session warning:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activity history
router.get('/history', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const activities = await ActivityLogger.getUserActivity(userId, limit);
    
    res.json({ 
      activities,
      total: activities.length
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity summary
router.get('/summary', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const days = parseInt(req.query.days as string) || 30;

    const summary = await ActivityLogger.getActivitySummary(userId, days);
    
    res.json({ summary });
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
