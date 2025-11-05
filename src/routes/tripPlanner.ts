import { Router } from "express";
import {
  createTrip,
  getUserTrips,
  getTripRoute,
} from "../controllers/tripPlannerController";
import { authenticate } from "../middleware/auth";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

router.use(apiLimiter);
router.post("/create", authenticate, createTrip);
router.get("/user/:userId", authenticate, getUserTrips);
router.post("/route", getTripRoute);

export default router;
