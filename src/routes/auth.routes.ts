import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
// Flow: Request -> Validate Data -> AuthController -> Service -> Repo -> DB
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (Requires valid JWT)
 */
router.get('/me', requireAuth, AuthController.getProfile);

export default router;