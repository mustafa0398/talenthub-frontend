import { useEffect, useState } from "react";
import BackgroundDecor from "../components/BackgroundDecor";
import { fetchStats, type CandidateStatsResponse } from "../services/stats";

export default function ReportsPage() {
  const [stats, setStats] = useState<CandidateStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchStats();
      setStats(res);
    } catch (e: any) {
      setError(e?.message || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Berichte</h1>

          <div className="flex gap-3">
            <button
              onClick={load}
              className="btn-outline hover:bg-white/80"
            >
              Neu laden
            </button>
          </div>
        </div>

        {loading && <div className="text-gray-500">Lade Daten…</div>}
        {error && <div className="text-red-600">Fehler: {error}</div>}

        {!loading && !error && stats && (
          <>
            {/* KPIs */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard title="Kandidaten gesamt" value={stats.total} />
              <KpiCard
                title="Ø Erfahrung (Jahre)"
                value={stats.avgExperience.toFixed(1)}
              />
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <KpiCard key={status} title={status} value={count} />
              ))}
            </div>

            {/* Top Skills */}
            <section className="mt-6 rounded-2xl border bg-white/70 p-4 shadow-card">
              <h2 className="mb-3 text-lg font-semibold">Top Skills</h2>
              <div className="flex flex-wrap gap-2">
                {stats.topSkills.map((s) => (
                  <span
                    key={s.skill}
                    className="px-2 py-1 rounded-full text-xs border bg-sky-50 text-sky-700 border-sky-200"
                  >
                    {s.skill} • {s.count}
                  </span>
                ))}
                {stats.topSkills.length === 0 && (
                  <div className="text-sm text-gray-500">Keine Daten</div>
                )}
              </div>
            </section>

            {/* Orte */}
            <section className="mt-6 rounded-2xl border bg-white/70 p-4 shadow-card">
              <h2 className="mb-3 text-lg font-semibold">Orte</h2>
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-3">Ort</th>
                      <th className="py-2 pr-3">Anzahl</th>
                      <th className="py-2 pr-3">Ø Erfahrung</th>
                      <th className="py-2 pr-3">Min</th>
                      <th className="py-2 pr-3">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byLocation.map((loc) => (
                      <tr key={loc.location} className="border-t">
                        <td className="py-2 pr-3">{loc.location}</td>
                        <td className="py-2 pr-3 font-medium">{loc.count}</td>
                        <td className="py-2 pr-3">{loc.avgExp.toFixed(1)}</td>
                        <td className="py-2 pr-3">{loc.minExp}</td>
                        <td className="py-2 pr-3">{loc.maxExp}</td>
                      </tr>
                    ))}
                    {stats.byLocation.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                          Keine Daten
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-card">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
