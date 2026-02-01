import { useState } from "react";
import { Calculator, History, Star, Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTollGates } from "@/hooks/useTollGates";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TripCalculator from "@/pages/TripCalculator";
import TripHistory from "@/pages/TripHistory";
import SavedRoutes from "@/pages/SavedRoutes";
import TollLookup from "@/pages/TollLookup";
import type { NavigationItem } from "@/types";

function App() {
  const [currentView, setCurrentView] = useState<string>("calculator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { darkMode, toggleTheme } = useTheme();
  const { tollGates, loading } = useTollGates();

  const navigation: NavigationItem[] = [
    { id: "calculator", label: "Trip Calculator", icon: Calculator },
    { id: "history", label: "Trip History", icon: History },
    { id: "saved", label: "Saved Routes", icon: Star },
    { id: "lookup", label: "Toll Lookup", icon: Search },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Header
          navigation={navigation}
          currentView={currentView}
          onViewChange={setCurrentView}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {currentView === "calculator" && (
                <TripCalculator tollGates={tollGates} />
              )}
              {currentView === "history" && <TripHistory />}
              {currentView === "saved" && <SavedRoutes tollGates={tollGates} />}
              {currentView === "lookup" && <TollLookup tollGates={tollGates} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
