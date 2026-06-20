"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Globe2, X } from "lucide-react";
import { getActiveProjects } from "@/lib/projects";
import { ProjectGridCard } from "@/components/cards/ProjectGridCard";
import { TYPE_LIST } from "@/lib/constants";
import { ProjectType } from "@/types";

const ALL_PROJECTS = getActiveProjects();

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<ProjectType[]>([]);

  const toggleType = (t: ProjectType) =>
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PROJECTS.filter((p) => {
      if (activeTypes.length && !activeTypes.includes(p.type)) return false;
      if (!q) return true;
      return (
        p.titleEn.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeTypes]);

  return (
    <main className="min-h-screen bg-white">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_#f5f3ff_0%,_#ffffff_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-8">
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
        <p className="text-slate-500 mb-6">
          {filtered.length} live opportunities for Georgian youth across Europe.
        </p>

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
