import { useMemo, useState } from "react";
import BackgroundDecor from "../components/BackgroundDecor";
import type { Candidate, PipelineStage } from "../types";
import { createCandidate } from "../services/candidates";

const TEMPLATE_CSV = [
  ["name", "role", "location", "experienceYears", "skills", "pipelineStage", "updatedAt"],
  ["Mira Albrecht", "Frontend Engineer", "Berlin", "5", "React|TypeScript|Tailwind", "APPLIED", "2025-06-01"],
  ["Jonas Weber", "Full-Stack Dev", "Remote", "7", "Node.js|React|TypeScript", "INTERVIEWED", "2025-05-12"],
  ["Aylin Kaya", "UX Engineer", "Hamburg", "3", "React|Tailwind", "SOURCED", "2025-04-20"],
].map((r) => r.join(",")).join("\n");

function parseCsv(text: string): string[][] {
  return text
    .split("\n")
    .map((line) => line.split(",").map((c) => c.trim()))
    .filter((row) => row.some((x) => x !== ""));
}

function normalizeSkills(v: string): string[] {
  return v.split(/[|,]/).map((s) => s.trim()).filter(Boolean);
}

export default function ImportPage() {
  const [, setRawCsv] = useState<string>("");
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  function onFile(f: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setRawCsv(text);
      const parsed = parseCsv(text);
      if (!parsed.length) return;
      setHeaders(parsed[0]);
      setRows(parsed.slice(1));
    };
    reader.readAsText(f);
  }

  const candidates: Omit<Candidate, "id">[] = useMemo(() => {
    if (!headers.length || !rows.length) return [];
    const idx = (name: string) => headers.indexOf(name);

    return rows.map((r) => ({
      name: r[idx("name")] || "",
      role: r[idx("role")] || "",
      location: r[idx("location")] || "",
      experienceYears: Number(r[idx("experienceYears")] || 0),
      skills: normalizeSkills(r[idx("skills")] || ""),
      pipelineStage: (r[idx("pipelineStage")] || "SOURCED") as PipelineStage,
      updatedAt: new Date(r[idx("updatedAt")] || Date.now()).toISOString(),
    }));
  }, [headers, rows]);

  async function uploadAll() {
    try {
      for (const c of candidates) {
        await createCandidate(c);
      }
      setMessage(`✓ ${candidates.length} Kandidaten ins Backend gespeichert`);
    } catch (e: any) {
      setMessage(`Fehler: ${e.message}`);
    }
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">CSV importieren</h1>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          className="rounded-2xl border border-dashed bg-white/60 backdrop-blur p-6 text-center shadow-card"
        >
          <label className="inline-block cursor-pointer rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 shadow hover:bg-sky-100">
            Datei auswählen
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={downloadTemplate} className="btn-outline">
            Vorlage herunterladen
          </button>
          <button
            onClick={uploadAll}
            className="btn-primary"
            disabled={!candidates.length}
          >
            Speichern
          </button>
        </div>

        {message && <div className="mt-3 text-sm text-emerald-700">{message}</div>}

        {candidates.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[880px] w-full text-sm border">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Rolle</th>
                  <th className="py-2 pr-3">Ort</th>
                  <th className="py-2 pr-3">Jahre</th>
                  <th className="py-2 pr-3">Skills</th>
                  <th className="py-2 pr-3">Stage</th>
                  <th className="py-2 pr-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 10).map((c, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-3">{c.name}</td>
                    <td className="py-2 pr-3">{c.role}</td>
                    <td className="py-2 pr-3">{c.location}</td>
                    <td className="py-2 pr-3">{c.experienceYears}</td>
                    <td className="py-2 pr-3">{c.skills.join(", ")}</td>
                    <td className="py-2 pr-3">{c.pipelineStage}</td>
                    <td className="py-2 pr-3">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
