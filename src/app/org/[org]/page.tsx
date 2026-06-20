import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe2, MapPin, Layers } from "lucide-react";
import { getOrgSummary, getProjectsByOrg, getOrganizations } from "@/lib/projects";
import { ProjectGridCard } from "@/components/cards/ProjectGridCard";

export function generateStaticParams() {
  return getOrganizations().map((o) => ({ org: o.id }));
}

export default async function OrgPage({
  params,
}: {
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  const summary = getOrgSummary(org);
  const projects = getProjectsByOrg(org);

  if (!summary) notFound();

  return (
    <main className="min-h-screen bg-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_#f5f3ff_0%,_#ffffff_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-700 transition-colors"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50 transition-colors"
          >
            <Globe2 size={15} />
            Globe view
          </Link>
        </div>

        {/* Org header */}
        <div className="flex items-start gap-4 sm:gap-5 mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0">
            {summary.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{summary.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-violet-400" />
                {summary.count} active {summary.count === 1 ? "project" : "projects"}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-violet-400" />
                {summary.countries.join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Opportunities from this organization
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectGridCard key={p.id} project={p} showOrgLink={false} />
          ))}
        </div>
      </div>
    </main>
  );
}
