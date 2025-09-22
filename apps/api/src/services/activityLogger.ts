import { prisma } from '../lib/prisma';
import { Request } from 'express';

export interface ActivityLogData {
  userId: string;
  activityType:
    | 'login'
    | 'logout'
    | 'page_view'
    | 'action'
    | 'session_timeout'
    | 'session_extended'
    | 'session_warning';
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * ActivityLogger centralizes persistence of user activity events. It hides the
 * underlying storage implementation (Prisma) behind static methods and
 * therefore adheres to the Single Responsibility principle. Consumers do not
 * need to know how activities are saved; they just call into this service.
 */
export class ActivityLogger {
  static async logActivity(data: ActivityLogData) {
    try {
      await prisma.userActivity.create({
        data: {
          userId: data.userId,
          activityType: data.activityType,
          description: data.description,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
  static getClientInfo(req: Request) {
    return {
      ipAddress: req.ip || req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string),
      userAgent: req.headers['user-agent'] || 'Unknown',
    };
  }
  static async logLogin(userId: string, req: Request, metadata?: Record<string, any>) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'login',
      description: 'User logged in successfully',
      metadata: { ...metadata, timestamp: new Date().toISOString(), sessionId: (req as any).sessionID || 'unknown' },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logLogout(userId: string, req: Request, reason?: string) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'logout',
      description: reason || 'User logged out',
      metadata: { reason, timestamp: new Date().toISOString(), sessionId: (req as any).sessionID || 'unknown' },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logPageView(userId: string, req: Request, page: string) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'page_view',
      description: `User viewed page: ${page}`,
      metadata: { page, url: req.originalUrl, timestamp: new Date().toISOString() },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logSessionTimeout(userId: string, req: Request, timeoutMinutes: number) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'session_timeout',
      description: `Session timed out after ${timeoutMinutes} minutes of inactivity`,
      metadata: { timeoutMinutes, timestamp: new Date().toISOString(), sessionId: (req as any).sessionID || 'unknown' },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logSessionExtended(userId: string, req: Request, newTimeoutMinutes: number) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'session_extended',
      description: `Session extended to ${newTimeoutMinutes} minutes`,
      metadata: { newTimeoutMinutes, timestamp: new Date().toISOString(), sessionId: (req as any).sessionID || 'unknown' },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logSessionWarning(userId: string, req: Request, warningMinutes: number) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'session_warning',
      description: `Session warning shown - ${warningMinutes} minutes until timeout`,
      metadata: { warningMinutes, timestamp: new Date().toISOString(), sessionId: (req as any).sessionID || 'unknown' },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async logAction(userId: string, req: Request, action: string, details?: Record<string, any>) {
    const info = this.getClientInfo(req);
    await this.logActivity({
      userId,
      activityType: 'action',
      description: `User performed action: ${action}`,
      metadata: { action, details, timestamp: new Date().toISOString() },
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
    });
  }
  static async getUserActivity(userId: string, limit: number = 50) {
    return prisma.userActivity.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }
  static async getActivitySummary(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const activities = await prisma.userActivity.findMany({
      where: { userId, createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
    });
    const summary = {
      totalActivities: activities.length,
      loginCount: activities.filter((a) => a.activityType === 'login').length,
      pageViews: activities.filter((a) => a.activityType === 'page_view').length,
      actions: activities.filter((a) => a.activityType === 'action').length,
      sessionTimeouts: activities.filter((a) => a.activityType === 'session_timeout').length,
      sessionExtensions: activities.filter((a) => a.activityType === 'session_extended').length,
      lastActivity: activities[0]?.createdAt || null,
      activityByDay: {} as Record<string, number>,
    };
    activities.forEach((a) => {
      const day = a.createdAt.toISOString().split('T')[0];
      summary.activityByDay[day] = (summary.activityByDay[day] || 0) + 1;
    });
    return summary;
  }
}