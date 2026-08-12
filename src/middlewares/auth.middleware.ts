import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { ApiResponse } from '../types/api.types';

/**
 * Middleware to protect routes that require authentication
 */
export const requireAuth = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  try {
    // 1. Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse<unknown> = {
        success: false,
        message: 'Authentication required. No token provided.',
      };
      res.status(401).json(response);
      return;
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using our utility
    const decodedPayload = JwtUtil.verifyToken(token);

    // 4. Attach decoded payload (id, role) to the request object
    req.user = decodedPayload;

    // 5. Proceed to the next middleware or controller
    next();
  } catch (error: any) {
    console.error('JWT Verification Error:', error.message);
    
    const response: ApiResponse<unknown> = {
      success: false,
      message: 'Invalid or expired token',
    };
    
    res.status(401).json(response);
  }
};

/**
 * Role-based authorization middleware (Optional God-Level Feature)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const response: ApiResponse<unknown> = {
        success: false,
        message: 'Forbidden: You do not have permission to access this resource',
      };
      res.status(403).json(response);
      return;
    }
    next();
  };
};