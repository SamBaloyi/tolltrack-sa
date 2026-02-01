import { useState, useEffect } from "react";
import { History } from "lucide-react";
import { tripsApi } from "@/services/api";
import { getUserId } from "@/utils/storage";
import { formatCurrency } from "@/utils/currency";
import { exportTripsToCSV } from "@/utils/export";
import { MONTHS } from "@/config/constants";
import StatsCards from "@/components/common/StatsCards";
import EmptyState from "@/components/common/EmptyState";
import type { Trip, TripStats } from "@/types";

export default function TripHistory() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchTrips();
    fetchStats();
  }, [selectedYear, selectedMonth]);

  const fetchTrips = async (): Promise<void> => {
    try {
      const data = await tripsApi.getAll(getUserId());
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const params: Record<string, string> = {};
      if (selectedYear) params.year = selectedYear;
      if (selectedMonth) params.month = selectedMonth;

      const data = await tripsApi.getStats(getUserId(), params);
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const deleteTrip = async (id: number): Promise<void> => {
    if (!confirm("Delete this trip?")) return;
    try {
      await tripsApi.delete(id);
      fetchTrips();
      fetchStats();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleExport = (): void => {
    exportTripsToCSV(trips);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-semibold focus:border-orange-500 outline-none"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-semibold focus:border-orange-500 outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={trips.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.length === 0 ? (
          <EmptyState
            icon={History}
            title="No trips recorded yet"
            description="Start calculating routes to build your trip history"
          />
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-black text-slate-800 dark:text-white">
                        {trip.start_location} → {trip.end_location}
                      </h3>
                      {trip.route_name && (
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full">
                          {trip.route_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">
                        {new Date(trip.date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Class {trip.vehicle_class}</span>
                      <span>•</span>
                      <span>{trip.toll_gates_passed.length} toll gates</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-3xl font-black text-green-600 dark:text-green-500">
                      R{trip.total_cost.toFixed(2)}
                    </div>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Toll Gates Details */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
                    View toll gates passed
                  </summary>
                  <div className="mt-3 space-y-2">
                    {trip.toll_gates_passed.map((tg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-white text-sm">
                              {tg.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {tg.route} • {tg.location}
                            </div>
                          </div>
                        </div>
                        <div className="font-black text-orange-600">
                          R{formatCurrency(tg.fee)}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
