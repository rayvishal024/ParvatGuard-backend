import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { getProfile, updateProfile } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);
router.use(apiLimiter);

const updateProfileSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).optional(),
    phone: Joi.string().optional(),
    default_sos_message: Joi.string().optional(),
  }),
};

router.get('/', getProfile);
router.put('/', celebrate(updateProfileSchema), updateProfile);

export default router;

