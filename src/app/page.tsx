"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import { Project, FilterState, ProjectScope } from "@/types";
import { getActiveProjects, matchesQuery } from "@/lib/projects";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectListPanel } from "@/components/cards/ProjectList";
import { Legend } from "@/components/globe/Legend";
import { motion, AnimatePresence } from "framer-motion";

const EarthGlobe = dynamic(() => import("@/components/globe/EarthGlobe"), {
  ssr: false,
  loading: () => null,
});

const GeorgiaMap = dynamic(() => import("@/components/globe/GeorgiaMap"), {
  ssr: false,
  loading: () => null,
});

const DEFAULT_FILTERS: FilterState = {
  types: [],
  countries: [],
  cities: [],
  ageRange: [16, 99],
  maxCost: null,
  grantOnly: false,
  languages: [],
  dateRange: [null, null],
  searchQuery: "",
};

function applyFilters(projects: Project[], filters: FilterState): Project[] {
  return projects.filter((p) => {
    if (filters.types.length > 0 && !filters.types.includes(p.type))
      return false;
    if (filters.countries.length > 0 && !filters.countries.includes(p.country))
      return false;
    if (filters.cities.length > 0 && !filters.cities.includes(p.city))
      return false;
    if (p.ageMax < filters.ageRange[0] || p.ageMin > filters.ageRange[1])
      return false;
    if (filters.grantOnly && !p.grantCovered) return false;
    if (filters.maxCost !== null) {
      if (p.cost !== "free" && typeof p.cost === "number" && p.cost > filters.maxCost)
        return false;
    }
    if (filters.searchQuery && !matchesQuery(p, filters.searchQuery))
      return false;
    return true;
  });
}

export default function HomePage() {
  const [scope, setScope] = useState<ProjectScope>("world");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [listOpen, setListOpen] = useState(false);

  const allActive = useMemo(() => getActiveProjects(), []);

  useEffect(() => {
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  const scopedProjects = useMemo(
    () => allActive.filter((p) => p.scope === scope),
    [allActive, scope]
  );

  const filteredProjects = useMemo(
    () => applyFilters(scopedProjects, filters),
    [scopedProjects, filters]
  );

  // reset selection when scope or filters change
  useEffect(() => {
    setSelectedProject(null);
  }, [scope, filters]);

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleScopeChange = useCallback((s: ProjectScope) => {
    setScope(s);
    setFilters(DEFAULT_FILTERS);
    setSelectedProject(null);
    setListOpen(false);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_#f5f3ff_0%,_#ffffff_62%)] pointer-events-none" />

      {/* Header branding */}
      <div className="absolute top-4 left-4 sm:left-6 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
            IH
          </div>
          <div>
            <div className="text-slate-900 font-bold text-sm leading-none">InnovatorsHUB</div>
            <div className="hidden sm:block text-slate-400 text-xs leading-tight">Youth Opportunities</div>
          </div>
        </div>
      </div>

      {/* Top-right nav */}
      <div className="absolute top-4 right-4 sm:right-6 z-30 flex items-center gap-2">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors shadow-sm"
        >
          All projects
          <ArrowRight size={13} />
        </Link>
        {lastUpdated && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-violet-100 shadow-sm text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated {lastUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        totalCount={filteredProjects.length}
        scope={scope}
      />

      {/* Map — fills entire screen behind UI layers */}
      <div className="absolute inset-0">
        {!loading &&
          (scope === "world" ? (
            <EarthGlobe
              projects={filteredProjects}
              onSelectProject={handleSelectProject}
              selectedProject={selectedProject}
            />
          ) : (
            <GeorgiaMap
              projects={filteredProjects}
              onSelectProject={handleSelectProject}
              selectedProject={selectedProject}
            />
          ))}
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-violet-100 animate-spin border-t-violet-600" />
              </div>
              <div className="text-center">
                <div className="text-slate-900 font-semibold mb-1">Loading opportunities...</div>
                <div className="text-slate-400 text-sm">Scanning 25+ sources for Georgian youth</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list panel */}
      {!loading && (
        <ProjectListPanel
          projects={filteredProjects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          isOpen={listOpen}
          onToggle={() => setListOpen((v) => !v)}
        />
      )}

      {/* Legend */}
      {!selectedProject && !listOpen && filteredProjects.length > 0 && (
        <Legend projects={filteredProjects} />
      )}

      {/* Project Card */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectCard project={selectedProject} onClose={handleCloseCard} />
        )}
      </AnimatePresence>

      {/* No results */}
      {!loading && filteredProjects.length === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm text-slate-500">
            No projects match your filters.
          </div>
        </div>
      )}

      {/* Hint */}
      {!loading && !selectedProject && filteredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="hidden lg:block absolute bottom-6 right-6 z-20"
        >
          <div className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-slate-200 text-xs text-slate-500">
            Click a pin to view project details
          </div>
        </motion.div>
      )}

      {/* Bottom World / Georgia toggle */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-violet-100 shadow-lg shadow-violet-200/40">
          <ScopeButton
            active={scope === "world"}
            onClick={() => handleScopeChange("world")}
            icon={<Globe2 size={15} />}
            label="World"
          />
          <ScopeButton
            active={scope === "georgia"}
            onClick={() => handleScopeChange("georgia")}
            icon={<MapPin size={15} />}
            label="Georgia"
          />
        </div>
      </div>
    </main>
  );
}

function ScopeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-violet-600 text-white shadow-sm"
          : "text-slate-500 hover:text-violet-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
