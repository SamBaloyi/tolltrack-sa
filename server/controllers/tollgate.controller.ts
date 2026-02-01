import * as TollgateService from "../services/tollgate.service";

export function listTollGatesHandler() {
  const data = TollgateService.listTollGates();
  return { success: true, data };
}

export function getTollGateHandler({ params }: any) {
  const id = Number(params.id);
  const tg = TollgateService.getTollGate(id);
  if (!tg) return { success: false, error: "Toll gate not found" };
  return { success: true, data: tg };
}

export function searchTollGatesHandler({ params }: any) {
  const data = TollgateService.searchTollGates(params.query);
  return { success: true, data };
}
