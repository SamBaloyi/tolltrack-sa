import { Elysia } from "elysia";
import * as SavedRouteController from "../controllers/saved-route.controller";

export function registerSavedRouteRouter(app: Elysia) {
  app
    .post("/api/saved-routes", SavedRouteController.saveRouteHandler)
    .get(
      "/api/saved-routes/:userId",
      SavedRouteController.getSavedRoutesHandler,
    )
    .delete(
      "/api/saved-routes/:id",
      SavedRouteController.deleteSavedRouteHandler,
    );
}
