"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { format, differenceInDays, parseISO } from "date-fns";
import {
  X,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Globe,
  Clock,
  ExternalLink,
  Building2,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";
import { TYPE_COLOR, TYPE_LABEL } from "@/lib/constants";
import { applyLink } from "@/lib/projects";

const TYPE_LABELS = TYPE_LABEL;

function DeadlineBar({ deadline }: { deadline: string }) {
  const days = differenceInDays(parseISO(deadline), new Date());
  const isUrgent = days <= 7;
  const isSoon = days <= 14;
  const tone = isUrgent ? "text-red-500" : isSoon ? "text-amber-500" : "text-slate-500";

  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className={tone} />
      <span className={`text-sm font-medium ${tone}`}>
        {days <= 0 ? "Expired" : days === 1 ? "1 day left" : `${days} days left`}
      </span>
      <span className="text-slate-400 text-xs">
        • {format(parseISO(deadline), "dd MMM yyyy")}
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const accent = TYPE_COLOR[project.type];

  const apply = applyLink(project);
  const isFacebook = /facebook\.com|instagram\.com/i.test(apply.href);
  const verified = project.verified;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-4 top-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-30 overflow-hidden"
      >
        <div className="h-full rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-2xl shadow-slate-300/40">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 relative">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: accent }}
            />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  {TYPE_LABELS[project.type]}
                </span>
                {verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <BadgeCheck size={12} />
                    Verified
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">
              {project.titleEn}
            </h2>
            {project.title !== project.titleEn && (
              <p className="text-sm text-slate-400">{project.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoChip icon={<MapPin size={13} />} label="Location">
                {project.city}, {project.country}
              </InfoChip>
              <InfoChip icon={<Building2 size={13} />} label="Organization">
                {project.organization}
              </InfoChip>
              <InfoChip icon={<Users size={13} />} label="Age Range">
                {project.ageMin}–{project.ageMax} years
              </InfoChip>
              <InfoChip icon={<DollarSign size={13} />} label="Cost">
                {project.cost === "free" ? (
                  <span className="text-emerald-600 font-semibold">Free</span>
                ) : (
                  <span>
                    {project.cost} {project.currency || "EUR"}
                  </span>
                )}
              </InfoChip>
              <InfoChip icon={<Calendar size={13} />} label="Duration">
                {format(parseISO(project.startDate), "dd MMM")} –{" "}
                {format(parseISO(project.endDate), "dd MMM yyyy")}
              </InfoChip>
              <InfoChip icon={<Globe size={13} />} label="Languages">
                {project.languages.join(", ")}
              </InfoChip>
            </div>

            {/* Deadline */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 font-medium">
                Deadline
              </div>
              <DeadlineBar deadline={project.deadline} />
            </div>

            {/* Grant */}
            {project.grantCovered && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-sm text-emerald-700 font-medium">
                  {project.grantAmount
                    ? `Grant covered — ${project.grantAmount} EUR participant contribution`
                    : "Fully funded by Erasmus+ / ESC grant"}
                </span>
              </div>
            )}

            {/* Spots */}
            {project.spots && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Users size={14} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{project.spots}</span> spots available from Georgia
                </span>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">About</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {project.descriptionGe || project.description}
              </p>
            </div>

            {/* Requirements */}
            {project.requirements.length > 0 && (
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Requirements</div>
                <ul className="space-y-1.5">
                  {project.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <a
              href={apply.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors"
            >
              {apply.label}
              <ExternalLink size={14} />
            </a>
            <p className={`text-center text-[11px] leading-snug px-2 ${verified ? "text-emerald-600" : "text-slate-400"}`}>
              {verified
                ? "✓ Direct link — opens this project's official registration page."
                : isFacebook
                ? "Opens the organiser's Facebook — the call & form are posted there."
                : "Opens the organiser's official page with full details & the form."}
            </p>
            <Link
              href={`/org/${project.sourceOrg}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-violet-200 text-violet-700 font-medium text-sm hover:bg-violet-50 transition-colors"
            >
              <Building2 size={14} />
              More from {project.organization}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoChip({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm text-slate-800 font-medium">{children}</div>
    </div>
  );
}
