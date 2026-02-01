import { Elysia } from "elysia";
import * as TripController from "../controllers/trip.controller";

export function registerTripRouter(app: Elysia) {
  app
    .post("/api/trips", TripController.createTripHandler)
    .get("/api/trips/:userId", TripController.getTripsHandler)
    .get("/api/trips/:userId/stats", TripController.getTripStatsHandler)
    .delete("/api/trips/:id", TripController.deleteTripHandler);
}
