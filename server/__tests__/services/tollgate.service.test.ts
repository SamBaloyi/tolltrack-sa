import { describe, it, expect } from 'bun:test';
import { listTollGates } from '../../services/tollgate.service';

describe('Tollgate Service', () => {
  describe('listTollGates', () => {
    it('should return an array of toll gates', () => {
      const result = listTollGates();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return toll gates with all required fields', () => {
      const result = listTollGates();
      const firstGate = result[0];
      
      expect(firstGate).toBeDefined();
      expect(firstGate?.id).toBeDefined();
      expect(firstGate?.name).toBeDefined();
      expect(firstGate?.route).toBeDefined();
      expect(firstGate?.location).toBeDefined();
      expect(firstGate?.class1_fee).toBeDefined();
      expect(firstGate?.class2_fee).toBeDefined();
      expect(firstGate?.class3_fee).toBeDefined();
      expect(firstGate?.class4_fee).toBeDefined();
    });

    it('should return toll gates with valid fee values', () => {
      const result = listTollGates();
      
      result.forEach(gate => {
        expect(gate.class1_fee).toBeGreaterThanOrEqual(0);
        expect(gate.class2_fee).toBeGreaterThanOrEqual(gate.class1_fee);
        expect(gate.class3_fee).toBeGreaterThanOrEqual(gate.class2_fee);
        expect(gate.class4_fee).toBeGreaterThanOrEqual(gate.class3_fee);
      });
    });

    it('should return toll gates with unique IDs', () => {
      const result = listTollGates();
      const ids = result.map(gate => gate.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should return toll gates with non-empty names', () => {
      const result = listTollGates();
      
      result.forEach(gate => {
        expect(gate.name).toBeTruthy();
        expect(gate.name.length).toBeGreaterThan(0);
      });
    });

    it('should return toll gates with valid route identifiers', () => {
      const result = listTollGates();
      
      result.forEach(gate => {
        expect(gate.route).toBeTruthy();
        expect(typeof gate.route).toBe('string');
      });
    });

    it('should return toll gates with consistent ordering', () => {
      const result = listTollGates();
      
      // Verify that multiple calls return the same order
      const result2 = listTollGates();
      expect(result).toEqual(result2);
      
      // Check that all IDs are present
      const ids = result.map(tg => tg.id);
      expect(ids.length).toBe(new Set(ids).size); // All unique
    });

    it('should include major South African toll gates', () => {
      const result = listTollGates();
      const routes = result.map(gate => gate.route);
      
      // Check for presence of major routes
      const hasN1 = routes.some(route => route.includes('N1'));
      const hasN3 = routes.some(route => route.includes('N3'));
      
      expect(hasN1 || hasN3).toBe(true);
    });

    it('should return consistent results on multiple calls', () => {
      const result1 = listTollGates();
      const result2 = listTollGates();
      
      expect(result1.length).toBe(result2.length);
      expect(result1[0]?.id).toBe(result2[0]?.id);
    });

    it('should return toll gates with valid latitude/longitude if present', () => {
      const result = listTollGates();
      
      result.forEach(gate => {
        if (gate.latitude !== undefined && gate.longitude !== undefined) {
          expect(gate.latitude).toBeGreaterThanOrEqual(-90);
          expect(gate.latitude).toBeLessThanOrEqual(90);
          expect(gate.longitude).toBeGreaterThanOrEqual(-180);
          expect(gate.longitude).toBeLessThanOrEqual(180);
        }
      });
    });
  });
});
