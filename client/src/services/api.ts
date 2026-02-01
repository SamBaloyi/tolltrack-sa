import { API_URL } from '@/config/constants';
import type { TollGate, RouteCalculation, Trip, TripStats, SavedRoute, ApiResponse } from '@/types';

/**
 * Base fetch wrapper with error handling
 */
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json() as ApiResponse<T>;
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Toll Gates API
export const tollGatesApi = {
  getAll: async (): Promise<TollGate[]> => {
    const data = await apiFetch<TollGate[]>('/tollgates');
    return data.success && data.data ? data.data : [];
  },

  search: async (query: string): Promise<TollGate[]> => {
    const data = await apiFetch<TollGate[]>(`/tollgates/search?q=${encodeURIComponent(query)}`);
    return data.success && data.data ? data.data : [];
  },
};

// Route Calculation API
export const routeApi = {
  calculate: async (tollGateIds: number[], vehicleClass: number): Promise<RouteCalculation | null> => {
    const data = await apiFetch<RouteCalculation>('/calculate-route', {
      method: 'POST',
      body: JSON.stringify({ tollGateIds, vehicleClass }),
    });
    return data.success && data.data ? data.data : null;
  },
};

// Trips API
export const tripsApi = {
  getAll: async (userId: string): Promise<Trip[]> => {
    const data = await apiFetch<Trip[]>(`/trips/${userId}`);
    return data.success && data.data ? data.data : [];
  },

  getStats: async (userId: string, params: Record<string, string> = {}): Promise<TripStats | null> => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/trips/${userId}/stats${queryString ? `?${queryString}` : ''}`;
    const data = await apiFetch<TripStats>(endpoint);
    return data.success && data.data ? data.data : null;
  },

  create: async (tripData: Omit<Trip, 'id'>): Promise<Trip | null> => {
    const data = await apiFetch<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
    return data.success && data.data ? data.data : null;
  },

  delete: async (tripId: number): Promise<boolean> => {
    const data = await apiFetch<void>(`/trips/${tripId}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};

// Saved Routes API
export const savedRoutesApi = {
  getAll: async (userId: string): Promise<SavedRoute[]> => {
    const data = await apiFetch<SavedRoute[]>(`/saved-routes/${userId}`);
    return data.success && data.data ? data.data : [];
  },

  create: async (routeData: Omit<SavedRoute, 'id' | 'created_at'>): Promise<SavedRoute | null> => {
    const data = await apiFetch<SavedRoute>('/saved-routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
    return data.success && data.data ? data.data : null;
  },

  delete: async (routeId: number): Promise<boolean> => {
    const data = await apiFetch<void>(`/saved-routes/${routeId}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};
