import { useMemo, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import BackgroundDecor from "../components/BackgroundDecor";
import { useCandidates } from "../hooks/useCandidates";
import type { Candidate, PipelineStage } from "../types";
import { deleteCandidate } from "../services/candidates";
import { useNavigate } from "react-router-dom";

export default function CandidatesPage() {
  const { data, loading, error, refetch } = useCandidates(100);
  const navigate = useNavigate();

  const [rawQ, setRawQ] = useState("");
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("Alle Orte");
  const [minYears, setMinYears] = useState<number | "">("");
  const [sort, setSort] = useState<"name" | "experience" | "updated">("name");
  const [stage, setStage] = useState<"" | PipelineStage>("");

  useMemo(() => {
    const t = setTimeout(() => setQ(rawQ), 250);
    return () => clearTimeout(t);
  }, [rawQ]);

  const filtered: Candidate[] = useMemo(() => {
    let list = [...data];

    if (location !== "Alle Orte") {
      list = list.filter((c) => c.location === location);
    }
    if (stage) {
      list = list.filter((c) => c.pipelineStage === stage);
    }
    if (minYears !== "") {
      list = list.filter((c) => (c.experienceYears ?? 0) >= Number(minYears));
    }

    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter((c) => {
        if ((c.name || "").toLowerCase().startsWith(s)) return true;
        const blob = ((c.role || "") + " " + (c.skills ?? []).join(" ")).toLowerCase();
        return blob.includes(s);
      });
    }

    if (sort === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sort === "experience") {
      list.sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
    }

    if (sort === "updated") {
      list.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
    }

    return list;
  }, [data, q, location, minYears, sort, stage]);

  const locations = useMemo(() => {
    const set = new Set<string>(data.map((d) => d.location || ""));
    return ["Alle Orte", ...Array.from(set)];
  }, [data]);

  function resetFilters() {
    setRawQ("");
    setQ("");
    setLocation("Alle Orte");
    setMinYears("");
    setSort("name");
    setStage("");
  }

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">
            Kandidaten <span className="text-sm text-gray-500">(API)</span>
          </h1>
        </div>

        {/* Filter */}
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <input
            value={rawQ}
            onChange={(e) => setRawQ(e.target.value)}
            placeholder="Suche nach Name, Skill, Rolle…"
            className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={stage}
            onChange={(e) => setStage((e.target.value || "") as "" | PipelineStage)}
            className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="">Alle Stati</option>
            <option value="SOURCED">Sourced</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWED">Interviewed</option>
            <option value="OFFERED">Offered</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <input
            type="number"
            min={0}
            value={minYears}
            onChange={(e) =>
              setMinYears(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Min. Jahre"
            className="w-28 rounded-xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="updated">Zuletzt aktualisiert</option>
            <option value="name">Name</option>
            <option value="experience">Erfahrung</option>
          </select>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {!loading && !error ? `${filtered.length} Treffer` : "\u00A0"}
          </div>
          <button className="btn-ghost" onClick={resetFilters}>
            Zurücksetzen
          </button>
        </div>
      </section>

      {/* Candidate Cards */}
<section className="mx-auto max-w-7xl px-4 pb-10">
  {loading && <div className="text-gray-500">Lade Kandidaten…</div>}
  {error && <div className="text-red-600">Fehler: {error}</div>}

  {!loading && !error && filtered.length === 0 && (
    <div className="mx-auto max-w-3xl rounded-xl border bg-white/70 p-6 text-center">
      <div className="text-lg font-semibold">Keine Treffer</div>
      <p className="text-sm text-gray-600 mt-1">
        Passe deine Filter an oder importiere Kandidaten als CSV.
      </p>
    </div>
  )}

  {!loading && !error && filtered.length > 0 && (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((c) => (
        <CandidateCard
          key={c.id}
          c={c}
          onEdit={(cand) => navigate(`/edit/${cand.id}`)}
          onDelete={async (cand) => {
            await deleteCandidate(cand.id);
            await refetch();
          }}
        />
      ))}
    </div>
  )}
</section>
    </div>
  );
}
