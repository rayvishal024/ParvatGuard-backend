import { db } from '../config/database';

export interface PathCoordinate {
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  name: string;
  description?: string | null;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  path_coordinates?: PathCoordinate[] | null;
  difficulty?: string | null;
  estimated_duration_hours?: number | null;
  region?: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function findAllTrips(): Promise<Trip[]> {
  return db('trips').orderBy('name', 'asc');
}

export async function findTripById(id: string): Promise<Trip | undefined> {
  return db('trips').where({ id }).first();
}

