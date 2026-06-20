"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState, ProjectType } from "@/types";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { TYPE_LIST } from "@/lib/constants";

const PROJECT_TYPES = TYPE_LIST;

const COUNTRIES = [
  "Spain", "Germany", "France", "Italy", "Poland", "Portugal",
  "Netherlands", "Belgium", "Austria", "Greece", "Estonia", "Czech Republic",
];

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalCount: number;
}

export function FilterPanel({ filters, onChange, totalCount }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 35]);

  const toggleType = (type: ProjectType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types });
  };

  const toggleCountry = (country: string) => {
    const countries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onChange({ ...filters, countries });
  };

  const clearAll = () => {
    onChange({
      types: [],
      countries: [],
      ageRange: [16, 99],
      maxCost: null,
      grantOnly: false,
      languages: [],
      dateRange: [null, null],
      searchQuery: "",
    });
  };

  const activeFiltersCount =
    filters.types.length +
    filters.countries.length +
    (filters.grantOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4">
      {/* Search bar */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search projects, countries, organizations..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="flex-1 bg-transparent text-slate-900 text-sm placeholder-slate-400 outline-none"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {totalCount} projects
            </span>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                expanded || activeFiltersCount > 0 ? "text-slate-900" : "text-slate-500"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50 space-y-4"
            >
              {/* Project Types */}
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2.5 font-medium">
                  Project Type
                </div>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => toggleType(t.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        filters.types.includes(t.value)
                          ? "border-transparent text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                      style={
                        filters.types.includes(t.value)
                          ? { background: t.color, borderColor: t.color }
                          : {}
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Countries */}
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2.5 font-medium">
                  Country
                </div>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      onClick={() => toggleCountry(country)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        filters.countries.includes(country)
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700"
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Other filters */}
              <div className="flex items-center gap-6 flex-wrap">
                {/* Grant only */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => onChange({ ...filters, grantOnly: !filters.grantOnly })}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      filters.grantOnly ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                        filters.grantOnly ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    Grant covered only
                  </span>
                </label>

                {/* Age */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Age:</span>
                  <input
                    type="number"
                    min={14}
                    max={99}
                    value={ageRange[0]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 14;
                      setAgeRange([v, ageRange[1]]);
                      onChange({ ...filters, ageRange: [v, ageRange[1]] });
                    }}
                    className="w-14 text-center text-sm bg-slate-50 border border-slate-200 rounded-lg py-1 text-slate-900 outline-none focus:border-slate-400"
                  />
                  <span className="text-slate-300">–</span>
                  <input
                    type="number"
                    min={14}
                    max={99}
                    value={ageRange[1]}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 99;
                      setAgeRange([ageRange[0], v]);
                      onChange({ ...filters, ageRange: [ageRange[0], v] });
                    }}
                    className="w-14 text-center text-sm bg-slate-50 border border-slate-200 rounded-lg py-1 text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active filter chips */}
      {activeFiltersCount > 0 && !expanded && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex flex-wrap gap-2"
        >
          {filters.types.map((t) => {
            const cfg = PROJECT_TYPES.find((pt) => pt.value === t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white hover:opacity-90 transition-opacity"
                style={{ background: cfg?.color }}
              >
                {cfg?.label}
                <X size={10} />
              </button>
            );
          })}
          {filters.countries.map((c) => (
            <button
              key={c}
              onClick={() => toggleCountry(c)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              {c}
              <X size={10} />
            </button>
          ))}
          {filters.grantOnly && (
            <button
              onClick={() => onChange({ ...filters, grantOnly: false })}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Grant only
              <X size={10} />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
