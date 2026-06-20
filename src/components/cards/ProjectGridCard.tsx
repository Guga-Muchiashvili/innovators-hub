"use client";

import Link from "next/link";
import { Project } from "@/types";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  MapPin,
  Users,
  Clock,
  Calendar,
  ExternalLink,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { TYPE_COLOR, TYPE_LABEL } from "@/lib/constants";

export function ProjectGridCard({
  project,
  showOrgLink = true,
}: {
  project: Project;
  showOrgLink?: boolean;
}) {
  const color = TYPE_COLOR[project.type];
  const days = differenceInDays(parseISO(project.deadline), new Date());
  const applyHref = /^https?:\/\//i.test(project.sourceUrl)
    ? project.sourceUrl
    : `https://${project.sourceUrl}`;

  return (
    <div className="group flex flex-col rounded-2xl border border-violet-100 bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/40 transition-all overflow-hidden">
      <div className="h-1" style={{ background: color }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: `${color}15`, color }}
          >
            {TYPE_LABEL[project.type]}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              days <= 7 ? "text-red-500" : days <= 14 ? "text-amber-500" : "text-slate-400"
            }`}
          >
            <Clock size={12} />
            {days}d left
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
          {project.titleEn}
        </h3>
        <p className="text-xs text-slate-400 mb-4">{project.organization}</p>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-violet-400" />
            {project.city}, {project.country}
          </div>
          <div className="flex items-center gap-2">
            <Users size={13} className="text-violet-400" />
            {project.ageMin}–{project.ageMax} years
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-violet-400" />
            {format(parseISO(project.startDate), "dd MMM")} –{" "}
            {format(parseISO(project.endDate), "dd MMM yyyy")}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {project.cost === "free" ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
              Free
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {project.cost} {project.currency || "EUR"}
            </span>
          )}
          {project.grantCovered && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-50 text-violet-700">
              Grant covered
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <a
            href={applyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
          >
            Apply
            <ExternalLink size={13} />
          </a>
          {showOrgLink && (
            <Link
              href={`/org/${project.sourceOrg}`}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors"
              title={`More from ${project.organization}`}
            >
              <Building2 size={14} />
              <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
