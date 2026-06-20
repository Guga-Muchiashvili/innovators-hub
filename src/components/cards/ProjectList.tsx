"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { differenceInDays, parseISO } from "date-fns";
import { MapPin, Users, Clock, List, ArrowRight } from "lucide-react";
import { TYPE_COLOR, TYPE_LABEL } from "@/lib/constants";

const TYPE_LABELS = TYPE_LABEL;

function ProjectRow({
  project,
  onClick,
  isSelected,
}: {
  project: Project;
  onClick: () => void;
  isSelected: boolean;
}) {
  const days = differenceInDays(parseISO(project.deadline), new Date());
  const color = TYPE_COLOR[project.type];

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        isSelected
          ? "bg-slate-50 border-slate-300"
          : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
          style={{ background: color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ background: `${color}15`, color }}
            >
              {TYPE_LABELS[project.type]}
            </span>
          </div>
          <div className="text-sm font-medium text-slate-900 truncate leading-tight">
            {project.titleEn}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={10} />
              {project.city}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={10} />
              {project.ageMin}–{project.ageMax}
            </span>
            <span
              className={`flex items-center gap-1 text-xs ml-auto ${
                days <= 7 ? "text-red-500" : days <= 14 ? "text-amber-500" : "text-slate-400"
              }`}
            >
              <Clock size={10} />
              {days}d
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ProjectListPanel({
  projects,
  selectedProject,
  onSelectProject,
  isOpen,
  onToggle,
}: ProjectListProps) {
  return (
    <div
      className="absolute left-4 top-32 sm:top-24 bottom-4 z-20 flex flex-col"
      style={{ width: "min(300px, calc(100vw - 2rem))" }}
    >
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all mb-2 ${
          isOpen
            ? "bg-violet-600 border-violet-600 text-white"
            : "bg-white/90 border-violet-100 text-slate-600 hover:text-violet-700 hover:border-violet-300 shadow-sm"
        } backdrop-blur-xl`}
      >
        <List size={14} />
        All Projects
        <span className="ml-auto text-xs opacity-60">{projects.length}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -16, scaleX: 0.95 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            exit={{ opacity: 0, x: -16, scaleX: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden rounded-2xl border border-violet-100 bg-white/95 backdrop-blur-xl shadow-lg shadow-violet-200/40 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onClick={() =>
                      onSelectProject(
                        selectedProject?.id === project.id ? null : project
                      )
                    }
                    isSelected={selectedProject?.id === project.id}
                  />
                ))}
              </AnimatePresence>
              {projects.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-slate-300 text-sm">
                  No projects
                </div>
              )}
            </div>
            <Link
              href="/projects"
              className="flex items-center justify-center gap-1.5 m-2 py-2.5 rounded-xl bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 transition-colors"
            >
              Browse all on one page
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
