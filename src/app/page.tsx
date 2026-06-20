"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project, FilterState } from "@/types";
import { MOCK_PROJECTS } from "@/data/mockProjects";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectListPanel } from "@/components/cards/ProjectList";
import { Legend } from "@/components/globe/Legend";
import { filterExpiredProjects } from "@/lib/scraper";
import { motion, AnimatePresence } from "framer-motion";

const EarthGlobe = dynamic(() => import("@/components/globe/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading Earth...</p>
      </div>
    </div>
  ),
});

const DEFAULT_FILTERS: FilterState = {
  types: [],
  countries: [],
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
    if (p.ageMax < filters.ageRange[0] || p.ageMin > filters.ageRange[1])
      return false;
    if (filters.grantOnly && !p.grantCovered) return false;
    if (filters.maxCost !== null) {
      if (p.cost !== "free" && typeof p.cost === "number" && p.cost > filters.maxCost)
        return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });
}

export default function HomePage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      const active = await filterExpiredProjects(MOCK_PROJECTS);
      setAllProjects(active);
      setFilteredProjects(active);
      setLastUpdated(new Date());
      setLoading(false);
    }
    loadProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(applyFilters(allProjects, filters));
    setSelectedProject(null);
  }, [filters, allProjects]);

  const handleSelectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,_#f5f3ff_0%,_#ffffff_62%)] pointer-events-none" />

      {/* Header branding */}
      <div className="absolute top-4 left-6 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
            IH
          </div>
          <div>
            <div className="text-slate-900 font-bold text-sm leading-none">InnovatorsHUB</div>
            <div className="text-slate-400 text-xs leading-tight">Youth Opportunities</div>
          </div>
        </div>
      </div>

      {/* Top-right nav */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 transition-colors shadow-sm"
        >
          All projects
          <ArrowRight size={13} />
        </Link>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-violet-100 shadow-sm text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated {lastUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel filters={filters} onChange={setFilters} totalCount={filteredProjects.length} />

      {/* Globe — fills entire screen behind UI layers */}
      <div className="absolute inset-0">
        {!loading && (
          <EarthGlobe
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            selectedProject={selectedProject}
          />
        )}
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
                <div className="text-slate-400 text-sm">Scanning 20+ sources for Georgian youth</div>
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
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
          className="absolute bottom-6 right-6 z-20"
        >
          <div className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-slate-200 text-xs text-slate-500">
            Click a pin to view project details
          </div>
        </motion.div>
      )}
    </main>
  );
}
