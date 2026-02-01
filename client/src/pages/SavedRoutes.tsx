import { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { savedRoutesApi } from "@/services/api";
import { getUserId } from "@/utils/storage";
import EmptyState from "@/components/common/EmptyState";
import type { TollGate, SavedRoute } from "@/types";

interface SavedRoutesProps {
  tollGates?: TollGate[];
}

export default function SavedRoutes({
  tollGates: _tollGates,
}: SavedRoutesProps) {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  const fetchSavedRoutes = async (): Promise<void> => {
    try {
      const data = await savedRoutesApi.getAll(getUserId());
      setSavedRoutes(data);
    } catch (error) {
      console.error("Error fetching saved routes:", error);
    }
  };

  const deleteRoute = async (id: number): Promise<void> => {
    if (!confirm("Delete this saved route?")) return;
    try {
      await savedRoutesApi.delete(id);
      fetchSavedRoutes();
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center mb-2">
          <Star className="mr-3 text-amber-500" size={28} />
          Saved Routes
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Quick access to your frequently traveled routes
        </p>
      </div>

      {savedRoutes.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No saved routes yet"
          description="Save your frequently used routes from the trip calculator"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {savedRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                <h3 className="text-xl font-black text-white">{route.name}</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-slate-400" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        From
                      </p>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {route.start_location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-slate-400" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        To
                      </p>
                      <p className="font-bold text-slate-800 dark:text-white">
                        {route.end_location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  {route.toll_gates.length} toll gates • Saved{" "}
                  {new Date(route.created_at).toLocaleDateString()}
                </div>

                <button
                  onClick={() => deleteRoute(route.id)}
                  className="w-full py-2 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  Delete Route
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
