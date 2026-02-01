import { Elysia } from "elysia";
import * as CalculateController from "../controllers/calculate.controller";

export function registerCalculateRouter(app: Elysia) {
  app.post("/api/calculate-route", CalculateController.calculateRouteHandler);
}
