import * as TollgateService from "../services/tollgate.service";

export function calculateRouteHandler({ body }: any) {
  const { tollGateIds, vehicleClass } = body as {
    tollGateIds: number[];
    vehicleClass: number;
  };
  if (!tollGateIds || !vehicleClass || vehicleClass < 1 || vehicleClass > 4) {
    return { success: false, error: "Invalid request parameters" };
  }

  const result = TollgateService.calculateRouteCost(tollGateIds, vehicleClass);
  return { success: true, data: { ...result, vehicleClass } };
}
