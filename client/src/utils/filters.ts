import { TollGate } from "@/types";

/**
 * Filter toll gates by search query
 * @param {TollGate[]} tollGates - Array of toll gate objects
 * @param {string} query - Search query
 * @returns {TollGate[]} Filtered toll gates
 */
export const filterTollGatesBySearch = (
  tollGates: TollGate[],
  query: string,
): TollGate[] => {
  const lowerQuery = query.trim().toLowerCase();
  return tollGates.filter(
    (tg) =>
      tg.name.toLowerCase().includes(lowerQuery) ||
      tg.route.toLowerCase().includes(lowerQuery) ||
      tg.location.toLowerCase().includes(lowerQuery),
  );
};

/**
 * Filter toll gates by route
 * @param {TollGate[]} tollGates - Array of toll gate objects
 * @param {string} route - Route name
 * @returns {TollGate[]} Filtered toll gates
 */
export const filterTollGatesByRoute = (
  tollGates: TollGate[],
  route: string,
): TollGate[] => {
  if (!route) return tollGates;
  return tollGates.filter((tg) => tg.route === route);
};

/**
 * Get unique routes from toll gates
 * @param {TollGate[]} tollGates - Array of toll gate objects
 * @returns {string[]} Sorted array of unique route names
 */
export const getUniqueRoutes = (tollGates: TollGate[]): string[] => {
  return [...new Set(tollGates.map((tg) => tg.route))].sort();
};
