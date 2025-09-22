import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler and forwards any rejected promise to the
 * Express error handler. Without this helper each route must wrap its
 * implementation in a try/catch block and manually call next(error).
 *
 * Using this helper keeps route implementations simple (KISS) and avoids
 * repetitive error handling (DRY). Unhandled rejections will be passed
 * to the central error handler defined in {@link errorHandler} so that
 * sensitive information is never leaked to the client.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): (req: Request, res: Response, next: NextFunction) => void {
  return function asyncUtilWrap(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}