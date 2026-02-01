import * as SavedRouteModel from "../models/saved-route.model";

export function saveRoute(route: any) {
  return SavedRouteModel.insertSavedRoute(route);
}

export function fetchSavedRoutes(userId: string) {
  return SavedRouteModel.getSavedRoutesByUser(userId);
}

export function removeSavedRoute(id: number) {
  return SavedRouteModel.deleteSavedRoute(id);
}
