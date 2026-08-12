import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { ApiResponse } from '../types/api.types';

/**
 * Generic Validation Middleware
 * Ye incoming req ko Zod schema ke against check karega.
 */
export const validate = (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Schema ke against data validate karna
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Agar sab sahi hai, toh request ko aage Controller tak bhej do
      next();
    } catch (error) {
      // Agar validation fail hui (ZodError)
      if (error instanceof ZodError) {
        // Zod v3 uses `issues` instead of `errors`
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const response: ApiResponse<unknown> = {
          success: false,
          message: 'Validation failed',
          error: formattedErrors, // Array of specific field errors
        };

        res.status(400).json(response);
        return; // Zaroori hai taaki aage ka code execute na ho
      }
      
      // Koi aur unexpected error
      next(error);
    }
  };