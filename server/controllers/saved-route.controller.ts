import * as RouteService from "../services/route.service";

export async function saveRouteHandler({ body }: any) {
  const result = await RouteService.saveRoute(body);
  return { success: true, data: { id: result.lastInsertRowid, ...body } };
}

export function getSavedRoutesHandler({ params }: any) {
  const routes = RouteService.fetchSavedRoutes(params.userId);
  return { success: true, data: routes };
}

export function deleteSavedRouteHandler({ params }: any) {
  RouteService.removeSavedRoute(Number(params.id));
  return { success: true };
}
