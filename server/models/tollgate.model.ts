import db from "../db";

export type TollGate = {
  id?: number;
  name: string;
  route: string;
  location: string;
  latitude?: number;
  longitude?: number;
  class1_fee: number;
  class2_fee: number;
  class3_fee: number;
  class4_fee: number;
  direction?: string;
};

export function getAllTollGates(): TollGate[] {
  return db.query("SELECT * FROM toll_gates ORDER BY route, name").all() as TollGate[];
}

export function getTollGateById(id: number): TollGate | null {
  return db.query("SELECT * FROM toll_gates WHERE id = ?").get(id) as TollGate | null;
}

export function searchTollGates(query: string): TollGate[] {
  return db
    .query(
      "SELECT * FROM toll_gates WHERE name LIKE ? OR route LIKE ? OR location LIKE ? ORDER BY route, name",
    )
    .all(`%${query}%`, `%${query}%`, `%${query}%`) as TollGate[];
}

export function getTollGatesByIds(ids: number[]): TollGate[] {
  if (!ids || ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(",");
  return db
    .query(
      `SELECT id, name, route, location, class1_fee, class2_fee, class3_fee, class4_fee FROM toll_gates WHERE id IN (${placeholders})`,
    )
    .all(...ids) as TollGate[];
}
