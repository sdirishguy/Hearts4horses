import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated' 
      });
    }

    const hasRequiredRole = req.user.roles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};
