import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { logAlert, getAlertHistory } from '../controllers/alertController';
import { authenticate } from '../middleware/auth';
import { alertLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);
router.use(alertLimiter);

const logAlertSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid('SOS', 'LOW_BATTERY', 'MANUAL').required(),
    payload: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required(),
      message: Joi.string().optional(),
      timestamp: Joi.string().optional(),
      battery_level: Joi.number().optional(),
    }).required(),
    delivery_method: Joi.string().optional(),
  }),
};

router.post('/log', celebrate(logAlertSchema), logAlert);
router.get('/history', getAlertHistory);

export default router;

