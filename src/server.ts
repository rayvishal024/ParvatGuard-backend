import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import pinoHttp from "pino-http";
import { healthCheck } from "./config/database";
import logger from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

// Routes
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import contactRoutes from "./routes/contacts";
import tripRoutes from "./routes/trips";
import alertRoutes from "./routes/alerts";
import mapRoutes from "./routes/map";
import tripPlannerRoutes from "./routes/tripPlanner";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(
  pinoHttp({
    logger,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      }
      return "info";
    },
  })
);

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbHealthy = await healthCheck();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? "ok" : "unhealthy",
    timestamp: new Date().toISOString(),
    database: dbHealthy ? "connected" : "disconnected",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/profile/contact", contactRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip-planner", tripPlannerRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/map", mapRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ParvatGuard API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      profile: "/api/profile",
      contacts: "/api/profile/contact",
      trips: "/api/trips",
      alerts: "/api/alert",
    },
  });
});

// Global rate limiter for all routes
app.use(apiLimiter);

// Error handler (must be last)
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`ParvatGuard API server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
