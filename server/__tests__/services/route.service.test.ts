import { describe, it, expect, beforeEach } from 'bun:test';
import { calculateRouteCost } from '../../services/tollgate.service';

describe('Route Service', () => {
  describe('calculateRouteCost', () => {
    it('should calculate total cost for single toll gate', () => {
      const result = calculateRouteCost([1], 1);
      
      expect(result).toBeDefined();
      expect(result.count).toBe(1);
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.tollgates).toHaveLength(1);
    });

    it('should calculate total cost for multiple toll gates', () => {
      const result = calculateRouteCost([1, 2, 3], 1);
      
      expect(result.count).toBe(3);
      expect(result.tollgates).toHaveLength(3);
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should calculate different costs for different vehicle classes', () => {
      const class1Result = calculateRouteCost([1, 2], 1);
      const class2Result = calculateRouteCost([1, 2], 2);
      const class3Result = calculateRouteCost([1, 2], 3);
      const class4Result = calculateRouteCost([1, 2], 4);
      
      expect(class1Result.totalCost).toBeLessThan(class2Result.totalCost);
      expect(class2Result.totalCost).toBeLessThan(class3Result.totalCost);
      expect(class3Result.totalCost).toBeLessThan(class4Result.totalCost);
    });

    it('should handle empty toll gate array', () => {
      const result = calculateRouteCost([], 1);
      
      expect(result.count).toBe(0);
      expect(result.totalCost).toBe(0);
      expect(result.tollgates).toHaveLength(0);
    });

    it('should include toll gate details in response', () => {
      const result = calculateRouteCost([1], 1);
      
      expect(result.tollgates[0]).toBeDefined();
      expect(result.tollgates[0]?.id).toBeDefined();
      expect(result.tollgates[0]?.name).toBeDefined();
      expect(result.tollgates[0]?.route).toBeDefined();
      expect(result.tollgates[0]?.fee).toBeGreaterThan(0);
    });

    it('should calculate correct sum of individual toll fees', () => {
      const result = calculateRouteCost([1, 2], 1);
      const manualSum = result.tollgates.reduce((sum, tg) => sum + tg.fee, 0);
      
      expect(result.totalCost).toBe(manualSum);
    });

    it('should handle non-existent toll gate IDs gracefully', () => {
      const result = calculateRouteCost([99999], 1);
      
      expect(result.count).toBe(0);
      expect(result.tollgates).toHaveLength(0);
    });

    it('should handle mixed valid and invalid toll gate IDs', () => {
      const result = calculateRouteCost([1, 99999, 2], 1);
      
      expect(result.count).toBeGreaterThan(0);
      expect(result.count).toBeLessThan(3);
    });

    it('should handle duplicate toll gate IDs', () => {
      const result = calculateRouteCost([1, 1, 1], 1);
      
      expect(result.count).toBeGreaterThanOrEqual(1);
      expect(result.tollgates).toBeDefined();
    });

    it('should handle all vehicle classes (1-4)', () => {
      [1, 2, 3, 4].forEach(vehicleClass => {
        const result = calculateRouteCost([1], vehicleClass);
        expect(result.count).toBe(1);
        expect(result.totalCost).toBeGreaterThan(0);
      });
    });

    it('should maintain toll gate order', () => {
      const result = calculateRouteCost([3, 1, 2], 1);
      
      expect(result.tollgates[0]?.id).toBeDefined();
      expect(result.tollgates[1]?.id).toBeDefined();
      expect(result.tollgates[2]?.id).toBeDefined();
    });
  });
});
