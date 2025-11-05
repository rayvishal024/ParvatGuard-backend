import { Request, Response, NextFunction } from "express";
import { db } from "../config/database";

export async function createTrip(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      userId,
      start,
      destination,
      distance,
      duration,
      offlineMapPath,
      routeGeoJSON,
    } = req.body || {};
    if (!userId || !start || !destination) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const [trip] = await db("user_trips")
      .insert({
        user_id: userId,
        start_lat: start.lat,
        start_lng: start.lon ?? start.lng,
        dest_lat: destination.lat,
        dest_lng: destination.lon ?? destination.lng,
        distance_km: distance,
        duration_text: duration,
        offline_map_path: offlineMapPath,
        route_geojson: routeGeoJSON || null,
      })
      .returning("*");

    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
}

export async function getUserTrips(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const trips = await db("user_trips")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
    res.json({ success: true, trips });
  } catch (error) {
    next(error);
  }
}

// Lightweight proxy to OSRM (optional)
export async function getTripRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { start, destination } = req.body || {};
    if (!start || !destination) {
      res
        .status(400)
        .json({ success: false, message: "Missing start/destination" });
      return;
    }
    const url = `https://router.project-osrm.org/route/v1/driving/${
      start.lon ?? start.lng
    },${start.lat};${destination.lon ?? destination.lng},${
      destination.lat
    }?overview=full&geometries=geojson`;
    const upstream = await fetch(url);
    const json = await upstream.json();
    res.json(json);
  } catch (error) {
    next(error);
  }
}
