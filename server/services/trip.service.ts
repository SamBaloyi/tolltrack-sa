import * as TripModel from "../models/trip.model";

export function createTrip(trip: any) {
  return TripModel.insertTrip(trip);
}

export function fetchTripsByUser(userId: string) {
  return TripModel.getTripsByUser(userId);
}

export function removeTrip(id: number) {
  return TripModel.deleteTrip(id);
}

export function tripStatistics(userId: string, year?: string, month?: string) {
  return TripModel.getTripStats(userId, year, month);
}
