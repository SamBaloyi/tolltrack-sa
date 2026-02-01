import { describe, it, expect, beforeEach } from "bun:test";
import { Window } from "happy-dom";
import { getUserId, getSavedTheme, saveTheme } from "../storage";

// Set up DOM environment for tests
const window = new Window();
global.localStorage = window.localStorage;

describe("Storage Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getUserId", () => {
    it("should return existing user ID from localStorage", () => {
      const testId = "test-user-123";
      localStorage.setItem("tollgate_user_id", testId);

      const userId = getUserId();
      expect(userId).toBe(testId);
    });

    it("should generate and save new user ID if not exists", () => {
      const userId = getUserId();

      expect(userId).toBeTruthy();
      expect(typeof userId).toBe("string");
      expect(userId.length).toBeGreaterThan(0);
      expect(localStorage.getItem("tollgate_user_id")).toBe(userId);
    });

    it("should always return the same user ID on subsequent calls", () => {
      const userId1 = getUserId();
      const userId2 = getUserId();
      const userId3 = getUserId();

      expect(userId1).toBe(userId2);
      expect(userId2).toBe(userId3);
    });

    it("should generate unique IDs for different instances", () => {
      localStorage.clear();
      const userId1 = getUserId();

      localStorage.clear();
      const userId2 = getUserId();

      expect(userId1).not.toBe(userId2);
    });
  });

  describe("Theme Management", () => {
    it("should return saved theme from localStorage", () => {
      localStorage.setItem("tollgate_theme", "dark");
      expect(getSavedTheme()).toBe("dark");
    });

    it("should return null if no theme is saved", () => {
      expect(getSavedTheme()).toBeNull();
    });

    it("should return null after clearing storage", () => {
      localStorage.setItem("tollgate_theme", "dark");
      localStorage.clear();
      expect(getSavedTheme()).toBeNull();
    });

    it("should save dark theme to localStorage", () => {
      saveTheme(true);
      expect(localStorage.getItem("tollgate_theme")).toBe("dark");
    });

    it("should save light theme to localStorage", () => {
      saveTheme(false);
      expect(localStorage.getItem("tollgate_theme")).toBe("light");
    });

    it("should overwrite existing theme", () => {
      saveTheme(true);
      expect(localStorage.getItem("tollgate_theme")).toBe("dark");

      saveTheme(false);
      expect(localStorage.getItem("tollgate_theme")).toBe("light");
    });

    it("should handle rapid theme changes", () => {
      for (let i = 0; i < 10; i++) {
        saveTheme(i % 2 === 0);
      }
      expect(localStorage.getItem("tollgate_theme")).toBe("light");
    });
  });
});
