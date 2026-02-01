import * as TripService from "../services/trip.service";

export async function createTripHandler({ body }: any) {
  const result = await TripService.createTrip(body);
  return { success: true, data: { id: result.lastInsertRowid, ...body } };
}

export function getTripsHandler({ params }: any) {
  const trips = TripService.fetchTripsByUser(params.userId);
  return { success: true, data: trips };
}

export function getTripStatsHandler({ params, query }: any) {
  const { year, month } = query as { year?: string; month?: string };
  const stats = TripService.tripStatistics(params.userId, year, month);
  return { success: true, data: stats };
}

export function deleteTripHandler({ params }: any) {
  TripService.removeTrip(Number(params.id));
  return { success: true };
}
