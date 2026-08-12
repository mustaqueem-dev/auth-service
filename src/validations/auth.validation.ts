import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
    
    email: z
      .string({ error: 'Email is required' })
      .email('Invalid email format'),
    
    password: z
      .string({ error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password is too long')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: 'Email is required' })
      .email('Invalid email format'),
    
    password: z
      .string({ error: 'Password is required' })
      .min(1, 'Password cannot be empty') // Login pe hum length check ki jagah bas strict presence check karte hain
  })
});