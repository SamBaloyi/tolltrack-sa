import db from "../db";

export type Trip = {
  id?: number;
  user_id: string;
  start_location: string;
  end_location: string;
  route_name?: string | null;
  vehicle_class: number;
  total_cost: number;
  toll_gates_passed: any[];
  date: string;
  notes?: string | null;
};

export function insertTrip(trip: Trip) {
  return db
    .query(
      `
    INSERT INTO trips (user_id, start_location, end_location, route_name, vehicle_class, total_cost, toll_gates_passed, date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      trip.user_id,
      trip.start_location,
      trip.end_location,
      trip.route_name || null,
      trip.vehicle_class,
      trip.total_cost,
      JSON.stringify(trip.toll_gates_passed),
      trip.date,
      trip.notes || null,
    );
}

export function getTripsByUser(userId: string) {
  const trips = db
    .query("SELECT * FROM trips WHERE user_id = ? ORDER BY date DESC")
    .all(userId);
  return trips.map((t: any) => ({
    ...t,
    toll_gates_passed: JSON.parse(t.toll_gates_passed),
  }));
}

export function deleteTrip(id: number) {
  return db.query("DELETE FROM trips WHERE id = ?").run(id);
}

export function getTripStats(userId: string, year?: string, month?: string) {
  let dateFilter = "";
  const params: any[] = [userId];

  if (year && month) {
    dateFilter = "AND strftime('%Y-%m', date) = ?";
    params.push(`${year}-${month.padStart(2, "0")}`);
  } else if (year) {
    dateFilter = "AND strftime('%Y', date) = ?";
    params.push(year);
  }

  const stats = db
    .query(
      `
    SELECT 
      COUNT(*) as total_trips,
      SUM(total_cost) as total_spent,
      AVG(total_cost) as avg_cost,
      MIN(total_cost) as min_cost,
      MAX(total_cost) as max_cost
    FROM trips 
    WHERE user_id = ? ${dateFilter}
  `,
    )
    .get(...params);

  const monthlyStats = db
    .query(
      `
    SELECT 
      strftime('%Y-%m', date) as month,
      COUNT(*) as trips,
      SUM(total_cost) as spent
    FROM trips 
    WHERE user_id = ?
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `,
    )
    .all(userId);

  return { overall: stats, monthly: monthlyStats };
}
