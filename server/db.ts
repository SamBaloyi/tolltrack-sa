import Database from "bun:sqlite";
import { readFileSync, existsSync } from "fs";

// Initialize SQLite database
const dbFilePath = new URL("tollgate.db", import.meta.url).pathname;
const dbFileExists = existsSync(dbFilePath);
export const db = new Database(dbFilePath);

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS toll_gates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    route TEXT NOT NULL,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    class1_fee REAL NOT NULL,
    class2_fee REAL NOT NULL,
    class3_fee REAL NOT NULL,
    class4_fee REAL NOT NULL,
    direction TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    route_name TEXT,
    vehicle_class INTEGER NOT NULL,
    total_cost REAL NOT NULL,
    toll_gates_passed TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS saved_routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    toll_gates TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

// Seed initial toll gate data (kept minimal here; can be extended)
let shouldSeed = !dbFileExists;
if (!shouldSeed) {
  try {
    const seedData = db
      .query(`SELECT COUNT(*) as count FROM toll_gates`)
      .get() as {
      count: number;
    };
    shouldSeed = seedData.count === 0;
  } catch (e) {
    // If query fails for any reason, attempt to seed
    shouldSeed = true;
  }
}

if (shouldSeed) {
  const raw = JSON.parse(
    readFileSync(new URL("./data/tollgates.json", import.meta.url), "utf-8"),
  ) as any;
  const tollGates = Array.isArray(raw) ? raw : (raw.tollGates ?? []);

  const insertStmt = db.prepare(`
    INSERT INTO toll_gates (name, route, location, latitude, longitude, class1_fee, class2_fee, class3_fee, class4_fee, direction)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const tg of tollGates) {
    insertStmt.run(
      tg.name,
      tg.route,
      tg.location,
      tg.lat,
      tg.lng,
      tg.c1,
      tg.c2,
      tg.c3,
      tg.c4,
      tg.dir,
    );
  }
}

export default db;
