import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200/50 dark:border-slate-700/50 p-12 text-center">
      <Icon
        className="mx-auto text-slate-300 dark:text-slate-600 mb-4"
        size={64}
      />
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
