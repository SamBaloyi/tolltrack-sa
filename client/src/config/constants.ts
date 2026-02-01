import { VehicleClass, Month } from '@/types';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Vehicle Classes
export const VEHICLE_CLASSES: VehicleClass[] = [
  { id: 1, name: 'Class 1', desc: 'Motorcycles & Light Vehicles', icon: '🏍️' },
  { id: 2, name: 'Class 2', desc: 'Light Vehicles with Trailer', icon: '🚙' },
  { id: 3, name: 'Class 3', desc: 'Medium Commercial', icon: '🚐' },
  { id: 4, name: 'Class 4', desc: 'Heavy Commercial', icon: '🚛' },
];

// Months
export const MONTHS: Month[] = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Theme
export const THEME_KEY = 'tollgate_theme' as const;
export const USER_ID_KEY = 'tollgate_user_id' as const;
