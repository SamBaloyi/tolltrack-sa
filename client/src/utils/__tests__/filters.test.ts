import { describe, it, expect } from "bun:test";
import {
  filterTollGatesBySearch,
  filterTollGatesByRoute,
  getUniqueRoutes,
} from "../filters";
import type { TollGate } from "@/types";

const mockTollGates: TollGate[] = [
  {
    id: 1,
    name: "Grasmere Toll Plaza",
    route: "N1",
    location: "Johannesburg",
    class1_fee: 25,
    class2_fee: 50,
    class3_fee: 75,
    class4_fee: 100,
  },
  {
    id: 2,
    name: "Heidelberg Toll Plaza",
    route: "N3",
    location: "Heidelberg",
    class1_fee: 20,
    class2_fee: 40,
    class3_fee: 60,
    class4_fee: 80,
  },
  {
    id: 3,
    name: "Maraisburg Toll Plaza",
    route: "N1",
    location: "Johannesburg",
    class1_fee: 30,
    class2_fee: 60,
    class3_fee: 90,
    class4_fee: 120,
  },
];

describe("Filter Utilities", () => {
  describe("filterTollGatesBySearch", () => {
    it("should return all toll gates when search is empty", () => {
      const result = filterTollGatesBySearch(mockTollGates, "");
      expect(result).toEqual(mockTollGates);
    });

    it("should filter by name (case insensitive)", () => {
      const result = filterTollGatesBySearch(mockTollGates, "grasmere");
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("Grasmere Toll Plaza");
    });

    it("should filter by name with uppercase", () => {
      const result = filterTollGatesBySearch(mockTollGates, "GRASMERE");
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("Grasmere Toll Plaza");
    });

    it("should filter by partial name match", () => {
      const result = filterTollGatesBySearch(mockTollGates, "heid");
      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("Heidelberg Toll Plaza");
    });

    it("should filter by route", () => {
      const result = filterTollGatesBySearch(mockTollGates, "N3");
      expect(result).toHaveLength(1);
      expect(result[0]?.route).toBe("N3");
    });

    it("should filter by location", () => {
      const result = filterTollGatesBySearch(mockTollGates, "johannesburg");
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no matches found", () => {
      const result = filterTollGatesBySearch(mockTollGates, "nonexistent");
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should handle whitespace in search query", () => {
      const result = filterTollGatesBySearch(mockTollGates, "  grasmere  ");
      expect(result).toHaveLength(1);
    });

    it("should match multiple toll gates with common terms", () => {
      const result = filterTollGatesBySearch(mockTollGates, "toll plaza");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("filterTollGatesByRoute", () => {
    it("should return all toll gates when route is empty", () => {
      const result = filterTollGatesByRoute(mockTollGates, "");
      expect(result).toEqual(mockTollGates);
    });

    it("should filter by specific route", () => {
      const result = filterTollGatesByRoute(mockTollGates, "N1");
      expect(result).toHaveLength(2);
      expect(result.every((tg) => tg.route === "N1")).toBe(true);
    });
  });

  describe("getUniqueRoutes", () => {
    it("should return unique routes in sorted order", () => {
      const result = getUniqueRoutes(mockTollGates);
      expect(result).toEqual(["N1", "N3"]);
    });

    it("should handle empty array", () => {
      const result = getUniqueRoutes([]);
      expect(result).toEqual([]);
    });

    it("should remove duplicate routes", () => {
      const duplicateRoutes: TollGate[] = [
        { ...mockTollGates[0], id: 10, route: "N1" },
        { ...mockTollGates[1], id: 11, route: "N3" },
        { ...mockTollGates[2], id: 12, route: "N1" },
        { ...mockTollGates[0], id: 13, route: "N3" },
      ];

      const result = getUniqueRoutes(duplicateRoutes);
      expect(result).toEqual(["N1", "N3"]);
      expect(result).toHaveLength(2);
    });

    it("should sort routes alphabetically", () => {
      const unsortedGates: TollGate[] = [
        { ...mockTollGates[0], route: "N7" },
        { ...mockTollGates[1], route: "N2" },
        { ...mockTollGates[2], route: "N4" },
      ];

      const result = getUniqueRoutes(unsortedGates);
      expect(result).toEqual(["N2", "N4", "N7"]);
    });

    it("should handle single route", () => {
      const singleRoute = [mockTollGates[0]];
      const result = getUniqueRoutes(singleRoute);
      expect(result).toEqual(["N1"]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle toll gates with missing optional fields", () => {
      const incompleteGate: TollGate = {
        id: 99,
        name: "Test Gate",
        route: "N9",
        location: "Test Location",
        class1_fee: 10,
        class2_fee: 20,
        class3_fee: 30,
        class4_fee: 40,
      };

      const result = filterTollGatesBySearch([incompleteGate], "test");
      expect(result).toHaveLength(1);
    });

    it("should handle search with special characters", () => {
      const result = filterTollGatesBySearch(mockTollGates, "N1/N3");
      expect(result).toHaveLength(0);
    });

    it("should be case insensitive for all search types", () => {
      const lowerResult = filterTollGatesBySearch(
        mockTollGates,
        "johannesburg",
      );
      const upperResult = filterTollGatesBySearch(
        mockTollGates,
        "JOHANNESBURG",
      );
      const mixedResult = filterTollGatesBySearch(
        mockTollGates,
        "JoHaNnEsBuRg",
      );

      expect(lowerResult).toEqual(upperResult);
      expect(upperResult).toEqual(mixedResult);
    });
  });
});
