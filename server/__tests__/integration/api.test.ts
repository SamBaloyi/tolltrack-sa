import { describe, it, expect, beforeAll } from "bun:test";

// Check if server is running
async function isServerRunning(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3001/api/tollgates", {
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const serverRunning = await isServerRunning();

console.log(serverRunning);
describe.skipIf(!serverRunning)("API Integration Tests", () => {
  const baseURL = "http://localhost:3001";

  beforeAll(() => {
    console.log("Running integration tests against server at", baseURL);
  });

  describe("GET /api/tollgates", () => {
    it("should return all toll gates", async () => {
      const response = await fetch(`${baseURL}/api/tollgates`);
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("should return toll gates with correct structure", async () => {
      const response = await fetch(`${baseURL}/api/tollgates`);
      const result = (await response.json()) as any;
      const firstGate = result.data[0];

      expect(firstGate).toHaveProperty("id");
      expect(firstGate).toHaveProperty("name");
      expect(firstGate).toHaveProperty("route");
      expect(firstGate).toHaveProperty("location");
      expect(firstGate).toHaveProperty("class1_fee");
      expect(firstGate).toHaveProperty("class2_fee");
      expect(firstGate).toHaveProperty("class3_fee");
      expect(firstGate).toHaveProperty("class4_fee");
    });

    it("should have CORS headers", async () => {
      const response = await fetch(`${baseURL}/api/tollgates`);

      expect(response.headers.get("access-control-allow-origin")).toBeTruthy();
    });
  });

  describe("POST /api/calculate-route", () => {
    it("should calculate route cost successfully", async () => {
      const response = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tollGateIds: [1, 2],
          vehicleClass: 1,
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("count");
      expect(result.data).toHaveProperty("totalCost");
      expect(result.data).toHaveProperty("tollgates");
      expect(result.data.count).toBeGreaterThan(0);
      expect(result.data.totalCost).toBeGreaterThan(0);
    });

    it("should handle empty toll gate list", async () => {
      const response = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tollGateIds: [],
          vehicleClass: 1,
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.data.count).toBe(0);
      expect(result.data.totalCost).toBe(0);
    });

    it("should calculate different costs for different vehicle classes", async () => {
      const response1 = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tollGateIds: [1], vehicleClass: 1 }),
      });
      const result1 = (await response1.json()) as any;

      const response2 = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tollGateIds: [1], vehicleClass: 4 }),
      });
      const result2 = (await response2.json()) as any;

      expect(result2.data.totalCost).toBeGreaterThan(result1.data.totalCost);
    });

    it("should reject invalid vehicle class", async () => {
      const response = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tollGateIds: [1],
          vehicleClass: 5, // Invalid class
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should reject missing required fields", async () => {
      const response = await fetch(`${baseURL}/api/calculate-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tollGateIds: [1],
          // Missing vehicleClass
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("Trip Management", () => {
    let testUserId = "test-user-" + Date.now();
    let createdTripId: number;

    it("should create a new trip", async () => {
      const response = await fetch(`${baseURL}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: testUserId,
          start_location: "Johannesburg",
          end_location: "Durban",
          route_name: "Test Route",
          vehicle_class: 1,
          total_cost: 125.5,
          toll_gates_passed: [
            {
              id: 1,
              name: "Grasmere",
              route: "N1",
              location: "JHB",
              fee: 25.5,
            },
          ],
          date: "2026-01-15",
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id");
      createdTripId = result.data.id;
    });

    it("should retrieve user trips", async () => {
      const response = await fetch(`${baseURL}/api/trips/${testUserId}`);
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("should get trip statistics", async () => {
      const response = await fetch(`${baseURL}/api/trips/${testUserId}/stats`);
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("overall");
      expect(result.data.overall).toHaveProperty("total_trips");
      expect(result.data.overall).toHaveProperty("total_spent");
    });

    it("should delete a trip", async () => {
      if (!createdTripId) return;

      const response = await fetch(`${baseURL}/api/trips/${createdTripId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);
    });
  });

  describe("Saved Routes Management", () => {
    let testUserId = "test-saved-" + Date.now();
    let savedRouteId: number;

    it("should create a saved route", async () => {
      const response = await fetch(`${baseURL}/api/saved-routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: testUserId,
          name: "Test Saved Route",
          start_location: "Cape Town",
          end_location: "Port Elizabeth",
          toll_gates: [1, 2, 3],
        }),
      });
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id");
      savedRouteId = result.data.id;
    });

    it("should retrieve saved routes", async () => {
      const response = await fetch(`${baseURL}/api/saved-routes/${testUserId}`);
      const result = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should delete a saved route", async () => {
      if (!savedRouteId) return;

      const response = await fetch(
        `${baseURL}/api/saved-routes/${savedRouteId}`,
        {
          method: "DELETE",
        },
      );

      expect(response.status).toBe(200);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await fetch(`${baseURL}/api/nonexistent`);
      expect(response.status).toBe(404);
    });

    it("should handle malformed JSON", async () => {
      const response = await fetch(`${baseURL}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it("should handle DELETE for non-existent trip", async () => {
      const response = await fetch(`${baseURL}/api/trips/999999`, {
        method: "DELETE",
      });

      // Should either return 404 or 200 (depending on implementation)
      expect([200, 404]).toContain(response.status);
    });
  });
});
