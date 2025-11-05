import { Router } from "express";
import { searchPlaces, proxyTile } from "../controllers/mapController";
import { apiLimiter } from "../middleware/rateLimiter";

const router = Router();

// Apply general API rate limiter
router.use(apiLimiter);

// Nominatim search proxy
router.get("/search", searchPlaces);

// OSM tile proxy
router.get("/tiles/:z/:x/:y.png", proxyTile);

export default router;
