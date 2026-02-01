import { useState, useEffect } from "react";
import { Calculator, MapPin, Search } from "lucide-react";
import { routeApi, tripsApi } from "@/services/api";
import { getUserId } from "@/utils/storage";
import { formatCurrency } from "@/utils/currency";
import { VEHICLE_CLASSES } from "@/config/constants";
import { filterTollGatesBySearch } from "@/utils/filters";
import type { TollGate, RouteCalculation } from "@/types";

interface TripCalculatorProps {
  tollGates: TollGate[];
}

export default function TripCalculator({ tollGates }: TripCalculatorProps) {
  const [selectedTollGates, setSelectedTollGates] = useState<number[]>([]);
  const [vehicleClass, setVehicleClass] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calculatedRoute, setCalculatedRoute] =
    useState<RouteCalculation | null>(null);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [routeName, setRouteName] = useState<string>("");

  const filteredTollGates = filterTollGatesBySearch(tollGates, searchQuery);

  const toggleTollGate = (id: number): void => {
    setSelectedTollGates((prev) =>
      prev.includes(id) ? prev.filter((tgId) => tgId !== id) : [...prev, id],
    );
  };

  const calculateRoute = async (): Promise<void> => {
    if (selectedTollGates.length === 0) return;

    try {
      const data = await routeApi.calculate(selectedTollGates, vehicleClass);
      setCalculatedRoute(data);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  const saveTrip = async (): Promise<void> => {
    if (!calculatedRoute || !startLocation || !endLocation) return;

    try {
      await tripsApi.create({
        user_id: getUserId(),
        start_location: startLocation,
        end_location: endLocation,
        route_name: routeName,
        vehicle_class: vehicleClass,
        total_cost: calculatedRoute.totalCost,
        toll_gates_passed: calculatedRoute.tollgates,
        date: new Date().toISOString().split("T")[0] || "",
      });
      alert("Trip saved successfully!");
      resetCalculator();
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip");
    }
  };

  const resetCalculator = (): void => {
    setSelectedTollGates([]);
    setCalculatedRoute(null);
    setStartLocation("");
    setEndLocation("");
    setRouteName("");
  };

  useEffect(() => {
    if (selectedTollGates.length > 0) {
      calculateRoute();
    } else {
      setCalculatedRoute(null);
    }
  }, [selectedTollGates, vehicleClass]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Panel - Route Builder */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
            <h2 className="text-2xl font-black text-white flex items-center">
              <Calculator className="mr-3" size={28} />
              Build Your Route
            </h2>
            <p className="text-amber-50 mt-1 font-medium">
              Select toll gates along your journey
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Trip Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Starting Point
                </label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g., Johannesburg"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  placeholder="e.g., Durban"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Route Name (Optional)
              </label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g., Weekend Trip"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors font-medium"
              />
            </div>

            {/* Vehicle Class Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Vehicle Class
              </label>
              <div className="grid grid-cols-2 gap-3">
                {VEHICLE_CLASSES.map((vc) => (
                  <button
                    key={vc.id}
                    onClick={() => setVehicleClass(vc.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      vehicleClass === vc.id
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-700"
                    }`}
                  >
                    <div className="font-bold text-slate-800 dark:text-white">
                      {vc.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {vc.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toll Gate Search */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Search Toll Gates
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, route, or location..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors font-medium"
                />
              </div>
            </div>

            {/* Toll Gates List */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Available Toll Gates ({selectedTollGates.length} selected)
              </label>
              <div className="max-h-96 overflow-y-auto space-y-2 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-4">
                {filteredTollGates.map((tg) => (
                  <button
                    key={tg.id}
                    onClick={() => toggleTollGate(tg.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTollGates.includes(tg.id)
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 dark:text-white">
                          {tg.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {tg.route} • {tg.location}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-black text-orange-600">
                          R{formatCurrency(tg[`class${vehicleClass}_fee`])}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Summary */}
      <div className="space-y-6">
        {calculatedRoute ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <h3 className="text-xl font-black text-white">Route Summary</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Total Cost */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Total Cost
                </div>
                <div className="text-5xl font-black text-green-600 dark:text-green-500 mt-2">
                  R{calculatedRoute.totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {calculatedRoute.count} toll gate
                  {calculatedRoute.count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Toll Gates Breakdown */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Toll Gates on Route
                </h4>
                <div className="space-y-2">
                  {calculatedRoute.tollgates.map((tg, idx) => (
                    <div
                      key={tg.id}
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
                            {tg.route}
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-orange-600">
                        R{formatCurrency(tg.fee)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={saveTrip}
                  disabled={!startLocation || !endLocation}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Trip
                </button>
                <button
                  onClick={resetCalculator}
                  className="w-full py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-8 text-center">
            <MapPin
              className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
              size={48}
            />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Select toll gates to see your route summary
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
