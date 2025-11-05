import { Request, Response, NextFunction } from "express";
import { findAllTrips, findTripById } from "../models/trip";
import { findTripPackByTripId } from "../models/tripPack";
import { AppError } from "../middleware/errorHandler";
import { db } from "../config/database";

export async function getAllTrips(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const trips = await findAllTrips();
    res.json({ trips });
  } catch (error) {
    next(error);
  }
}

export async function getTripById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const trip = await findTripById(id);
    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    // Get trip pack if available
    const pack = await findTripPackByTripId(id);

    res.json({
      trip: {
        ...trip,
        pack: pack || null,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/trips?near=lat,lng
export async function getNearbyTrips(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const nearParam = (req.query.near as string) || "";
    const [latStr, lngStr] = nearParam.split(",");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radiusKm = parseFloat((req.query.radius as string) || "20");

    if (!isFinite(lat) || !isFinite(lng)) {
      throw new AppError("Invalid near parameter. Expected near=lat,lng", 400);
    }

    const trips = await db("trips")
      .select("*")
      .whereRaw(
        `(
          6371 * 2 * ASIN(
            SQRT(
              POWER(SIN(RADIANS((? - start_lat) / 2)), 2) +
              COS(RADIANS(start_lat)) * COS(RADIANS(?)) *
              POWER(SIN(RADIANS((? - start_lng) / 2)), 2)
            )
          )
        ) <= ?`,
        [lat, lat, lng, radiusKm]
      )
      .orderBy("name", "asc");

    res.json({ trips });
  } catch (error) {
    next(error);
  }
}

// GET /api/trips/:id/offline-pack
export async function getTripOfflinePack(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const trip = await findTripById(id);
    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const pack = await findTripPackByTripId(id);

    const checkpoints = (pack as any)?.waypoints || [];
    const gallery = (pack as any)?.gallery_urls || [];
    const guide_text = (pack as any)?.guide_text || null;
    const offline_advisory =
      (pack as any)?.offline_advisory ||
      `Last Updated: ${new Date().toLocaleDateString()} - Path status unknown`;

    res.json({
      id: trip.id,
      name: trip.name,
      map_image_url: pack?.map_image_url || null,
      checkpoints,
      route_polyline: trip.path_coordinates || [],
      gallery,
      guide_text,
      offline_advisory,
    });
  } catch (error) {
    next(error);
  }
}
