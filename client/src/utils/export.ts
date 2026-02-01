import { Trip } from '@/types';

/**
 * Export trips data to CSV file
 * @param {Trip[]} trips - Array of trip objects
 */
export const exportTripsToCSV = (trips: Trip[]): void => {
  const csv = [
    ['Date', 'From', 'To', 'Route', 'Vehicle Class', 'Cost', 'Toll Gates'].join(','),
    ...trips.map(t =>
      [
        t.date,
        t.start_location,
        t.end_location,
        t.route_name || '',
        t.vehicle_class,
        t.total_cost,
        t.toll_gates_passed.length
      ].join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `toll-trips-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
