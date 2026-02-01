import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import db from "./db";
import { registerTollgateRouter } from "./routes/tollgate.router";
import { registerCalculateRouter } from "./routes/calculate.router";
import { registerTripRouter } from "./routes/trip.router";
import { registerSavedRouteRouter } from "./routes/saved-route.router";

const app = new Elysia().use(cors());

// Register modular routers (controllers handle logic)
registerTollgateRouter(app);
registerCalculateRouter(app);
registerTripRouter(app);
registerSavedRouteRouter(app);

app.listen(3001);

console.log(
  `🚗 Toll Gate Tracker API running at http://localhost:${app.server?.port}`,
);
