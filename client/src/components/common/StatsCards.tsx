import { Calendar, DollarSign, TrendingUp, MapPin } from "lucide-react";
import type { TripStats } from "@/types";

interface StatsCardsProps {
  stats: TripStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total Trips",
      value: stats.overall.total_trips,
      icon: Calendar,
      color: "amber" as const,
    },
    {
      label: "Total Spent",
      value: `R${stats.overall.total_spent?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "green" as const,
    },
    {
      label: "Avg Cost",
      value: `R${stats.overall.avg_cost?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      color: "blue" as const,
    },
    {
      label: "Max Trip",
      value: `R${stats.overall.max_cost?.toFixed(2) || "0.00"}`,
      icon: MapPin,
      color: "purple" as const,
    },
  ];

  const colorClasses: Record<string, string> = {
    amber: "text-amber-500",
    green: "text-green-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
  };

  const valueClasses: Record<string, string> = {
    amber: "text-slate-800 dark:text-white",
    green: "text-green-600 dark:text-green-500",
    blue: "text-blue-600 dark:text-blue-500",
    purple: "text-purple-600 dark:text-purple-500",
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">
                {card.label}
              </p>
              <p
                className={`text-3xl font-black mt-2 ${valueClasses[card.color]}`}
              >
                {card.value}
              </p>
            </div>
            <card.icon className={colorClasses[card.color]} size={32} />
          </div>
        </div>
      ))}
    </div>
  );
}
