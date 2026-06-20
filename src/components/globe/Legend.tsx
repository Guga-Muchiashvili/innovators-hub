"use client";

import { Project } from "@/types";
import { TYPE_LIST } from "@/lib/constants";

export function Legend({ projects }: { projects: Project[] }) {
  const typeCounts = projects.reduce(
    (acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const activeTypes = TYPE_LIST.filter((t) => typeCounts[t.value]);

  return (
    <div className="absolute bottom-6 left-6 z-20">
      <div className="px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-violet-100 shadow-lg shadow-violet-200/40">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2.5 font-medium">
          Project Types
        </div>
        <div className="space-y-1.5">
          {activeTypes.map(({ value, label, color }) => (
            <div key={value} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-xs text-slate-600">{label}</span>
              <span className="text-xs text-slate-300 ml-auto pl-3">{typeCounts[value]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
