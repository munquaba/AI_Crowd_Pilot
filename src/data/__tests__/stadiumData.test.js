/**
 * @module stadiumData.test
 * @description Unit tests for the stadium data simulation engine.
 * Verifies data structure integrity, simulation mutation, and snapshot isolation.
 */
import { getCurrentDataSnapshot, stadiumData } from "@/data/stadiumData";

describe("stadiumData", () => {
  describe("data structure", () => {
    it("should have all required top-level keys", () => {
      const data = getCurrentDataSnapshot();
      expect(data).toHaveProperty("gates");
      expect(data).toHaveProperty("stalls");
      expect(data).toHaveProperty("washrooms");
      expect(data).toHaveProperty("sections");
      expect(data).toHaveProperty("routes");
      expect(data).toHaveProperty("alerts");
    });

    it("should have 8 gates", () => {
      const data = getCurrentDataSnapshot();
      expect(data.gates).toHaveLength(8);
    });

    it("should have 6 food stalls", () => {
      const data = getCurrentDataSnapshot();
      expect(data.stalls).toHaveLength(6);
    });

    it("should have 6 washrooms", () => {
      const data = getCurrentDataSnapshot();
      expect(data.washrooms).toHaveLength(6);
    });

    it("should have 12 sections", () => {
      const data = getCurrentDataSnapshot();
      expect(data.sections).toHaveLength(12);
    });

    it("should have routes array", () => {
      const data = getCurrentDataSnapshot();
      expect(Array.isArray(data.routes)).toBe(true);
      expect(data.routes.length).toBeGreaterThan(0);
    });

    it("should have alerts array", () => {
      const data = getCurrentDataSnapshot();
      expect(Array.isArray(data.alerts)).toBe(true);
    });
  });

  describe("gate structure", () => {
    it("should have required gate properties", () => {
      const data = getCurrentDataSnapshot();
      const gate = data.gates[0];
      expect(gate).toHaveProperty("id");
      expect(gate).toHaveProperty("name");
      expect(gate).toHaveProperty("location");
      expect(gate).toHaveProperty("density");
      expect(gate).toHaveProperty("crowd");
      expect(typeof gate.density).toBe("number");
      expect(["low", "medium", "high"]).toContain(gate.crowd);
    });
  });

  describe("food stall structure", () => {
    it("should have required stall properties", () => {
      const data = getCurrentDataSnapshot();
      const stall = data.stalls[0];
      expect(stall).toHaveProperty("id");
      expect(stall).toHaveProperty("name");
      expect(stall).toHaveProperty("location");
      expect(stall).toHaveProperty("waitTime");
      expect(stall).toHaveProperty("menu");
      expect(typeof stall.waitTime).toBe("number");
      expect(Array.isArray(stall.menu)).toBe(true);
    });
  });

  describe("section structure", () => {
    it("should have required section properties", () => {
      const data = getCurrentDataSnapshot();
      const section = data.sections[0];
      expect(section).toHaveProperty("id");
      expect(section).toHaveProperty("name");
      expect(section).toHaveProperty("density");
      expect(section).toHaveProperty("status");
      expect(typeof section.density).toBe("number");
      expect(section.density).toBeGreaterThanOrEqual(0);
      expect(section.density).toBeLessThanOrEqual(100);
    });
  });

  describe("route structure", () => {
    it("should have required route properties", () => {
      const data = getCurrentDataSnapshot();
      const route = data.routes[0];
      expect(route).toHaveProperty("from");
      expect(route).toHaveProperty("to");
      expect(route).toHaveProperty("distance");
      expect(route).toHaveProperty("time");
      expect(route).toHaveProperty("crowd");
      expect(typeof route.distance).toBe("number");
      expect(typeof route.time).toBe("number");
    });
  });

  describe("snapshot isolation", () => {
    it("should return independent snapshots", () => {
      const snapshot1 = getCurrentDataSnapshot();
      const snapshot2 = getCurrentDataSnapshot();

      // Modifying one shouldn't affect the other
      snapshot1.gates[0].density = 999;
      expect(snapshot2.gates[0].density).not.toBe(999);
    });
  });
});
