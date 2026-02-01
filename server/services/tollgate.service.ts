import * as TollGateModel from "../models/tollgate.model";

export function listTollGates(): ReturnType<
  typeof TollGateModel.getAllTollGates
> {
  return TollGateModel.getAllTollGates();
}

export function getTollGate(
  id: number,
): ReturnType<typeof TollGateModel.getTollGateById> {
  return TollGateModel.getTollGateById(id);
}

export function searchTollGates(
  query: string,
): ReturnType<typeof TollGateModel.searchTollGates> {
  return TollGateModel.searchTollGates(query);
}

export function getTollGatesForIds(
  ids: number[],
): ReturnType<typeof TollGateModel.getTollGatesByIds> {
  return TollGateModel.getTollGatesByIds(ids);
}

export function calculateRouteCost(
  tollGateIds: number[],
  vehicleClass: number,
): { tollgates: any[]; totalCost: number; count: number } {
  const feeColumn = `class${vehicleClass}_fee` as keyof any;
  const tollgates = TollGateModel.getTollGatesByIds(tollGateIds);

  const enriched = tollgates.map((tg: any) => ({
    id: tg.id,
    name: tg.name,
    route: tg.route,
    location: tg.location,
    fee: tg[feeColumn],
  }));

  const totalCost = enriched.reduce(
    (sum: number, t: any) => sum + (t.fee || 0),
    0,
  );

  return { tollgates: enriched, totalCost, count: enriched.length };
}
