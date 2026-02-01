// Toll Gate Types
export interface TollGate {
  id: number;
  name: string;
  route: string;
  location: string;
  latitude?: number;
  longitude?: number;
  class1_fee: number;
  class2_fee: number;
  class3_fee: number;
  class4_fee: number;
  direction?: string;
  [key: `class${number}_fee`]: number;
}

// Trip Types
export interface TollGatePassed {
  id: number;
  name: string;
  route: string;
  location: string;
  fee: number;
}

export interface Trip {
  id: number;
  user_id: string;
  start_location: string;
  end_location: string;
  route_name?: string;
  vehicle_class: number;
  total_cost: number;
  toll_gates_passed: TollGatePassed[];
  date: string;
  notes?: string;
}

export interface TripStats {
  overall: {
    total_trips: number;
    total_spent: number;
    avg_cost: number;
    max_cost: number;
  };
}

// Saved Route Types
export interface SavedRoute {
  id: number;
  user_id: string;
  name: string;
  start_location: string;
  end_location: string;
  toll_gates: number[];
  created_at: string;
}

// Route Calculation Types
export interface RouteCalculation {
  tollgates: TollGatePassed[];
  totalCost: number;
  count: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Vehicle Class Types
export interface VehicleClass {
  id: number;
  name: string;
  desc: string;
  icon: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

// Month Types
export interface Month {
  value: string;
  label: string;
}
