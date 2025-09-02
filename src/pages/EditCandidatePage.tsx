import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackgroundDecor from "../components/BackgroundDecor";
import { fetchCandidates, updateCandidate } from "../services/candidates";
import type { Candidate, PipelineStage } from "../types";

export default function EditCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchCandidates();
        const found = all.find(c => c.id === Number(id));
        if (!found) {
          setError("Kandidat nicht gefunden.");
        } else {
          setCandidate(found);
        }
      } catch (e: any) {
        setError(e?.message || "Fehler beim Laden.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!candidate) return;

    try {
      await updateCandidate(candidate.id, candidate);
      navigate("/"); 
    } catch (e: any) {
      setError(e?.message || "Fehler beim Speichern.");
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setCandidate(c => (c ? { ...c, [name]: value } : c));
  }

  if (loading) return <div>Lade…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!candidate) return null;

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />
      <section className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Kandidat bearbeiten</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            value={candidate.name}
            onChange={onChange}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="role"
            value={candidate.role}
            onChange={onChange}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="location"
            value={candidate.location}
            onChange={onChange}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="experienceYears"
            type="number"
            value={candidate.experienceYears}
            onChange={onChange}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="skills"
            value={candidate.skills.join(", ")}
            onChange={e =>
              setCandidate(c =>
                c ? { ...c, skills: e.target.value.split(",").map(s => s.trim()) } : c
              )
            }
            className="w-full rounded border px-3 py-2"
          />
          <select
            name="pipelineStage"
            value={candidate.pipelineStage}
            onChange={onChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="SOURCED">Sourced</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWED">Interviewed</option>
            <option value="OFFERED">Offered</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate(-1)}
            >
              Abbrechen
            </button>
            <button type="submit" className="btn-primary">
              Speichern
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
