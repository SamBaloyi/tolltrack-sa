import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { VEHICLE_CLASSES } from "@/config/constants";
import {
  filterTollGatesBySearch,
  filterTollGatesByRoute,
  getUniqueRoutes,
} from "@/utils/filters";
import EmptyState from "@/components/common/EmptyState";
import type { TollGate } from "@/types";

interface TollLookupProps {
  tollGates: TollGate[];
}

export default function TollLookup({ tollGates }: TollLookupProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [vehicleClass, setVehicleClass] = useState<number>(1);

  const routes = getUniqueRoutes(tollGates);

  const filteredTollGates = filterTollGatesByRoute(
    filterTollGatesBySearch(tollGates, searchQuery),
    selectedRoute,
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center mb-6">
          <Search className="mr-3 text-blue-500" size={28} />
          Quick Toll Lookup
        </h2>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search toll gates..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors font-medium text-lg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Route Filter */}
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-semibold focus:border-orange-500 outline-none"
            >
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>

            {/* Vehicle Class Tabs */}
            <div className="flex space-x-2">
              {VEHICLE_CLASSES.map((vc) => (
                <button
                  key={vc.id}
                  onClick={() => setVehicleClass(vc.id)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    vehicleClass === vc.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <div className="text-2xl">{vc.icon}</div>
                  <div className="text-xs mt-1">{vc.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTollGates.map((tg) => (
          <div
            key={tg.id}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all group"
          >
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                  {tg.name}
                </h3>
                <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
                  {tg.route}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center">
                <MapPin size={14} className="mr-1" />
                {tg.location}
              </p>
            </div>

            <div className="p-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Class {vehicleClass} Fee
                </div>
                <div className="text-4xl font-black text-green-600 dark:text-green-500 mt-2">
                  R{tg[`class${vehicleClass}_fee`]}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    Class 1:
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    R{tg.class1_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    Class 2:
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    R{tg.class2_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    Class 3:
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    R{tg.class3_fee}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">
                    Class 4:
                  </span>
                  <span className="font-black text-slate-800 dark:text-white">
                    R{tg.class4_fee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTollGates.length === 0 && (
        <EmptyState
          icon={Search}
          title="No toll gates found"
          description="Try adjusting your search or filters"
        />
      )}
    </div>
  );
}
