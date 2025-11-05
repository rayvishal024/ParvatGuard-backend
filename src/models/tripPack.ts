import { db } from "../config/database";

export interface Tip {
  title: string;
  content: string;
}

export interface TripPack {
  id: string;
  trip_id: string;
  pack_version: string;
  map_image_url?: string | null;
  tips?: Tip[] | null;
  waypoints?: Array<{
    lat: number;
    lng?: number;
    lon?: number;
    label?: string;
  }> | null;
  gallery_urls?: string[] | null;
  guide_text?: string | null;
  offline_advisory?: string | null;
  pack_size_bytes?: number | null;
  checksum?: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function findTripPackByTripId(
  tripId: string
): Promise<TripPack | undefined> {
  return db("trip_packs")
    .where({ trip_id: tripId })
    .orderBy("created_at", "desc")
    .first();
}
