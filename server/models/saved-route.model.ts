import db from "../db";

export type SavedRoute = {
  id?: number;
  user_id: string;
  name: string;
  start_location: string;
  end_location: string;
  toll_gates: any[];
  created_at?: string;
};

export function insertSavedRoute(route: SavedRoute) {
  return db
    .query(
      `
    INSERT INTO saved_routes (user_id, name, start_location, end_location, toll_gates, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      route.user_id,
      route.name,
      route.start_location,
      route.end_location,
      JSON.stringify(route.toll_gates),
      route.created_at || new Date().toISOString(),
    );
}

export function getSavedRoutesByUser(userId: string) {
  const routes = db
    .query(
      "SELECT * FROM saved_routes WHERE user_id = ? ORDER BY created_at DESC",
    )
    .all(userId);
  return routes.map((r: any) => ({
    ...r,
    toll_gates: JSON.parse(r.toll_gates),
  }));
}

export function deleteSavedRoute(id: number) {
  return db.query("DELETE FROM saved_routes WHERE id = ?").run(id);
}
