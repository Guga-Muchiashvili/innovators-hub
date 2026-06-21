"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Globe2, X, MapPin } from "lucide-react";
import { getActiveProjects, matchesQuery } from "@/lib/projects";
import { ProjectGridCard } from "@/components/cards/ProjectGridCard";
import { TYPE_LIST } from "@/lib/constants";
import { ProjectType, ProjectScope } from "@/types";

const ALL_PROJECTS = getActiveProjects();

type ScopeTab = "all" | ProjectScope;

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<ProjectType[]>([]);
  const [scopeTab, setScopeTab] = useState<ScopeTab>("all");

  const toggleType = (t: ProjectType) =>
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const filtered = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      if (scopeTab !== "all" && p.scope !== scopeTab) return false;
      if (activeTypes.length && !activeTypes.includes(p.type)) return false;
      return matchesQuery(p, query);
    });
  }, [query, activeTypes, scopeTab]);

  const counts = useMemo(
    () => ({
      all: ALL_PROJECTS.length,
      world: ALL_PROJECTS.filter((p) => p.scope === "world").length,
      georgia: ALL_PROJECTS.filter((p) => p.scope === "georgia").length,
    }),
    []
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_#f5f3ff_0%,_#ffffff_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
              IH
            </div>
            <div>
              <div className="text-slate-900 font-bold text-sm leading-none">InnovatorsHUB</div>
              <div className="text-slate-400 text-xs">All Opportunities</div>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors"
          >
            <Globe2 size={15} />
            Globe view
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-1">All Projects</h1>
        <p className="text-slate-500 mb-5">
          {filtered.length} live opportunities for Georgian youth — abroad and at home.
        </p>

        {/* Scope tabs */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-violet-50 border border-violet-100 mb-5">
          {([
            { id: "all", label: "All", icon: null },
            { id: "world", label: "World", icon: <Globe2 size={14} /> },
            { id: "georgia", label: "Georgia", icon: <MapPin size={14} /> },
          ] as { id: ScopeTab; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setScopeTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                scopeTab === t.id
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-violet-700"
              }`}
            >
              {t.icon}
              {t.label}
              <span className={scopeTab === t.id ? "text-white/70" : "text-slate-400"}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-violet-100 shadow-sm mb-4 max-w-xl">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, city, organization, tag..."
            className="flex-1 bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-900">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPE_LIST.map((t) => {
            const on = activeTypes.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() => toggleType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  on ? "border-transparent text-white" : "border-slate-200 text-slate-600 hover:border-violet-300"
                }`}
                style={on ? { background: t.color, borderColor: t.color } : {}}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProjectGridCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            No projects match your search.
          </div>
        )}
      </div>
    </main>
  );
}
