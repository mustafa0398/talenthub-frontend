import type { Candidate, PipelineStage } from "../types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function CandidateCard({
  c,
  onEdit,
  onDelete,
}: {
  c: Candidate;
  onEdit?: (c: Candidate) => void;
  onDelete?: (c: Candidate) => void;
}) {
  return (
    <article className="relative rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-card hover:shadow-2xl hover:border-slate-300 transition">
      {/* bunte linke Linie */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-sky-500 via-cyan-400 to-emerald-500" />

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(c)}
            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600"
            title="Bearbeiten"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(c)}
            className="p-1.5 rounded-md hover:bg-red-50 text-red-600"
            title="Löschen"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="size-14 rounded-full ring-2 ring-white shadow"
            style={{
              background:
                "linear-gradient(135deg,#38bdf8 0%,#22d3ee 50%,#10b981 100%)",
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {c.name}
              </h3>
              <StatusBadge stage={c.pipelineStage} />
            </div>
            <div className="text-sm text-gray-600 truncate">{c.role}</div>
            <div className="text-xs text-gray-500">
              {c.location} • {c.experienceYears} Jahre Erfahrung
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {c.skills.map((s, i) => (
            <span key={`${c.id}-${i}-${s}`} className={skillClass(s)}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ stage }: { stage?: PipelineStage | null }) {
  if (!stage) {
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] border bg-gray-100 text-gray-500 border-gray-200">
        unknown
      </span>
    );
  }

  const map: Record<PipelineStage, string> = {
    SOURCED: "bg-slate-100 text-slate-700 border-slate-200",
    APPLIED: "bg-sky-100 text-sky-700 border-sky-200",
    INTERVIEWED: "bg-yellow-100 text-yellow-700 border-yellow-200",
    OFFERED: "bg-indigo-100 text-indigo-700 border-indigo-200",
    HIRED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] border ${map[stage]}`}>
      {stage.toLowerCase()}
    </span>
  );
}


function skillClass(skill: string) {
  const k = skill.toLowerCase();

  if (k.includes("react")) return chip("sky");
  if (k.includes("javascript")) return chip("indigo");
  if (k.includes("typescript")) return chip("blue");
  if (k.includes("java")) return chip("cyan");
  if (k.includes("vue")) return chip("emerald");
  if (k.includes("node")) return chip("lime");
  if (k.includes("c#")) return chip("violet");
  if (k.includes("angular")) return chip("red");
  if (k.includes("php")) return chip("yellow");
  if (k.includes("python")) return chip("yellow");
  if (k.includes("rust")) return chip("teal");
  if (k.includes("ruby")) return chip("purple");

  return "px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200";
}

function chip(
  color:
    | "sky"
    | "indigo"
    | "cyan"
    | "emerald"
    | "violet"
    | "red"
    | "blue"
    | "lime"
    | "yellow"
    | "teal"
    | "purple"
) {
  const map = {
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    lime: "bg-lime-50 text-lime-700 border-lime-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  } as const;

  return `px-2 py-1 rounded-full text-xs border ${map[color]}`;
}
