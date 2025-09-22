import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Centralized error handler middleware. It inspects known error types (Zod
 * validation errors, Prisma client errors, our own AppError) and produces
 * appropriate HTTP responses. All other errors return a generic 500.
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;
  // Handle validation errors from Zod
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    details = error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
  } else if ((error as AppError).statusCode) {
    // Custom AppError thrown via createError
    statusCode = (error as AppError).statusCode!;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Map common Prisma error codes to HTTP status codes
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      default:
        message = error.message;
        break;
    }
  }
  // Log detailed error info only in development. Sensitive fields are
  // redacted from the request body to avoid leaking secrets.
  const sanitizeBody = (body: any) => {
    if (!body) return body;
    const sanitized = { ...body };
    ['password', 'token', 'confirmPassword'].forEach((key) => {
      if (sanitized[key]) sanitized[key] = '***';
    });
    return sanitized;
  };
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: sanitizeBody(req.body),
      params: req.params,
      query: req.query,
    });
  }
  res.status(statusCode).json({
    error: true,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * Create a typed AppError. Use this helper to throw controlled errors from
 * route handlers. This enables the errorHandler to distinguish between
 * operational and programmer errors.
 */
export const createError = (message: string, statusCode: number = 500): AppError => {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
};