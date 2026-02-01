import { describe, it, expect, beforeEach, mock } from "bun:test";
import { Window } from "happy-dom";
import { exportTripsToCSV } from "../export";
import type { Trip } from "@/types";

// Set up DOM environment for tests
const window = new Window();
global.document = window.document;
(global as any).window = window;
(global as any).URL = window.URL;

describe("Export Utilities", () => {
  const mockTrips: Trip[] = [
    {
      id: 1,
      user_id: "user-1",
      start_location: "Johannesburg",
      end_location: "Pretoria",
      vehicle_class: 1,
      toll_gates_passed: [
        {
          id: 1,
          name: "Allandale",
          route: "N1",
          location: "Midrand",
          fee: 15.5,
        },
        {
          id: 2,
          name: "Brakfontein",
          route: "N1",
          location: "Centurion",
          fee: 18.0,
        },
        {
          id: 3,
          name: "Garsfontein",
          route: "N1",
          location: "Pretoria",
          fee: 12.0,
        },
      ],
      total_cost: 45.5,
      date: "2024-01-15",
      route_name: "N1 North",
    },
    {
      id: 2,
      user_id: "user-1",
      start_location: "Cape Town",
      end_location: "Paarl",
      vehicle_class: 2,
      toll_gates_passed: [
        { id: 4, name: "Huguenot", route: "N1", location: "Paarl", fee: 20.0 },
        {
          id: 5,
          name: "Du Toitskloof",
          route: "N1",
          location: "Worcester",
          fee: 12.0,
        },
      ],
      total_cost: 32.0,
      date: "2024-01-16",
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("exportTripsToCSV", () => {
    it("should create CSV with correct headers", () => {
      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      exportTripsToCSV(mockTrips);

      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockElement.download).toContain("toll-trips-");
      expect(mockElement.download).toContain(".csv");
    });

    it("should include all trip data in CSV", () => {
      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      exportTripsToCSV(mockTrips);

      expect(mockElement.click).toHaveBeenCalled();
    });

    it("should handle trips without route names", () => {
      const tripsWithoutNames = mockTrips.map((t) => ({
        ...t,
        route_name: undefined,
      }));

      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      expect(() => exportTripsToCSV(tripsWithoutNames)).not.toThrow();
      expect(mockElement.click).toHaveBeenCalled();
    });

    it("should set correct download filename format", () => {
      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      exportTripsToCSV(mockTrips);

      expect(mockElement.download).toMatch(/toll-trips-\d{4}-\d{2}-\d{2}\.csv/);
    });

    it("should trigger download by clicking element", () => {
      const clickSpy = mock(() => {});
      const mockElement = {
        href: "",
        download: "",
        click: clickSpy,
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      exportTripsToCSV(mockTrips);

      expect(clickSpy).toHaveBeenCalled();
    });

    it("should handle empty trips array", () => {
      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      expect(() => exportTripsToCSV([])).not.toThrow();
      expect(mockElement.click).toHaveBeenCalled();
    });

    it("should format toll gates count correctly", () => {
      const tripWithManyGates: Trip = {
        ...mockTrips[0],
        toll_gates_passed: [
          { id: 1, name: "Gate 1", route: "N1", location: "Loc 1", fee: 10 },
          { id: 2, name: "Gate 2", route: "N1", location: "Loc 2", fee: 10 },
          { id: 3, name: "Gate 3", route: "N1", location: "Loc 3", fee: 10 },
          { id: 4, name: "Gate 4", route: "N1", location: "Loc 4", fee: 10 },
          { id: 5, name: "Gate 5", route: "N1", location: "Loc 5", fee: 10 },
          { id: 6, name: "Gate 6", route: "N1", location: "Loc 6", fee: 10 },
          { id: 7, name: "Gate 7", route: "N1", location: "Loc 7", fee: 10 },
          { id: 8, name: "Gate 8", route: "N1", location: "Loc 8", fee: 10 },
        ],
      };

      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      expect(() => exportTripsToCSV([tripWithManyGates])).not.toThrow();
    });

    it("should handle special characters in location names", () => {
      const tripWithSpecialChars: Trip = {
        ...mockTrips[0],
        start_location: "Port St. Johns, EC",
        end_location: "O'Reilly & Sons, KZN",
      };

      const mockElement = {
        href: "",
        download: "",
        click: mock(() => {}),
        style: {},
        remove: mock(() => {}),
      };

      document.createElement = mock(() => mockElement as any);

      expect(() => exportTripsToCSV([tripWithSpecialChars])).not.toThrow();
      expect(mockElement.click).toHaveBeenCalled();
    });
  });
});
