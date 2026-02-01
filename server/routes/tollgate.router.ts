import { Elysia } from "elysia";
import * as TollgateController from "../controllers/tollgate.controller";

export function registerTollgateRouter(app: Elysia) {
  app
    .get("/api/tollgates", TollgateController.listTollGatesHandler)
    .get("/api/tollgates/:id", TollgateController.getTollGateHandler)
    .get(
      "/api/tollgates/search/:query",
      TollgateController.searchTollGatesHandler,
    );
}
