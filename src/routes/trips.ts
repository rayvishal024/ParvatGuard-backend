import { Router } from 'express';
import { getAllTrips, getTripById, getNearbyTrips, getTripOfflinePack } from '../controllers/tripController';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Optional: require auth for trips (or make public)
// For now, we'll make it public but can be protected if needed
// router.use(authenticate);
router.use(apiLimiter);

router.get('/', getAllTrips);
router.get('/near', getNearbyTrips);
router.get('/:id', getTripById);
router.get('/:id/offline-pack', getTripOfflinePack);

export default router;

