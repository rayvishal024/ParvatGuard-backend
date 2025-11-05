import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { register, login, refreshToken } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Validation schemas
const registerSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required(),
  }),
};

const loginSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokenSchema = {
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

router.post('/register', authLimiter, celebrate(registerSchema), register);
router.post('/login', authLimiter, celebrate(loginSchema), login);
router.post('/refresh', celebrate(refreshTokenSchema), refreshToken);

export default router;

