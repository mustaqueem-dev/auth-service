import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api.types';

// Express recognizes an error handler by its 4 arguments (err, req, res, next)
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('🔥 Unhandled Error:', err);

  const response: ApiResponse<unknown> = {
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  };

  res.status(500).json(response);
};

// 404 Route Handler
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<unknown> = {
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  };
  res.status(404).json(response);
};