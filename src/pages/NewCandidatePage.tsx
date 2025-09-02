import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundDecor from "../components/BackgroundDecor";
import { createCandidate } from "../services/candidates";
import type { PipelineStage } from "../types";

type FormState = {
  name: string;
  role: string;
  location: string;
  experienceYears: string;
  skills: string;
  pipelineStage: PipelineStage;
};

export default function NewCandidatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    role: "",
    location: "",
    experienceYears: "",
    skills: "",
    pipelineStage: "APPLIED",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);

    if (!form.name.trim() || !form.role.trim()) {
      setError("Bitte mindestens Name und Rolle ausfüllen.");
      return;
    }

    const years = Number(form.experienceYears);
    if (form.experienceYears !== "" && (!Number.isFinite(years) || years < 0)) {
      setError("Erfahrung (Jahre) muss eine Zahl ≥ 0 sein.");
      return;
    }

    const candidateInput = {
      name: form.name.trim(),
      role: form.role.trim(),
      location: form.location.trim() || "Remote",
      experienceYears: Number.isFinite(years) ? years : 0,
      skills: normalizeSkills(form.skills),
      pipelineStage: form.pipelineStage,
    };

    setSaving(true);
    try {
      await createCandidate(candidateInput);
      setOk("Kandidat gespeichert.");
    } catch (err: any) {
      setError(err?.message || "Konnte nicht speichern.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />

      <section className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Neuer Kandidat</h1>
          <div className="hidden sm:block">
            <div className="btn-group">
              <button className="hover:bg-white/80" onClick={() => navigate(-1)}>
                Zurück
              </button>
              <button
                className="btn-primary"
                onClick={onSubmit as any}
                disabled={saving}
              >
                {saving ? "Speichere…" : "Speichern"}
              </button>
            </div>
          </div>
        </div>

        <div className="sm:hidden mb-3 flex gap-2">
          <button className="btn-outline w-full" onClick={() => navigate(-1)}>
            Zurück
          </button>
          <button
            className="btn-primary w-full"
            onClick={onSubmit as any}
            disabled={saving}
          >
            {saving ? "Speichere…" : "Speichern"}
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            {ok}{" "}
            <button className="ml-2 underline" onClick={() => navigate("/")}>
              Zu Kandidaten
            </button>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-card space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Name*"
              name="name"
              value={form.name}
              onChange={onChange}
            />
            <TextField
              label="Rolle*"
              name="role"
              value={form.role}
              onChange={onChange}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Ort"
              name="location"
              placeholder="z. B. Berlin, Remote…"
              value={form.location}
              onChange={onChange}
            />
            <TextField
              label="Erfahrung (Jahre)"
              name="experienceYears"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={onChange}
            />
            <SelectField
              label="Pipeline Stage"
              name="pipelineStage"
              value={form.pipelineStage}
              onChange={onChange}
              options={[
                ["SOURCED", "Sourced"],
                ["APPLIED", "Applied"],
                ["INTERVIEWED", "Interviewed"],
                ["OFFERED", "Offered"],
                ["HIRED", "Hired"],
                ["REJECTED", "Rejected"],
              ]}
            />
          </div>

          <TextField
            label="Skills"
            name="skills"
            placeholder="React, TypeScript | Node"
            help="Skills mit Komma ODER Pipe trennen. Beispiele: 'React, TypeScript' oder 'React|TypeScript|Node'."
            value={form.skills}
            onChange={onChange}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate(-1)}
            >
              Abbrechen
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Speichere…" : "Speichern"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function TextField(props: {
  label: string;
  name: string;
  value: string;
  type?: string;
  min?: string;
  placeholder?: string;
  help?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { label, help, ...rest } = props;
  return (
    <label className="block">
      <span className="block text-sm text-gray-600 mb-1">{label}</span>
      <input
        {...rest}
        className="w-full rounded-md border bg-white/70 backdrop-blur px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      {help && <div className="mt-1 text-xs text-gray-500">{help}</div>}
    </label>
  );
}

function SelectField(props: {
  label: string;
  name: string;
  value: string;
  options: [string, string][];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const { label, options, ...rest } = props;
  return (
    <label className="block">
      <span className="block text-sm text-gray-600 mb-1">{label}</span>
      <select
        {...rest}
        className="w-full rounded-md border bg-white/70 backdrop-blur px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        {options.map(([val, lab]) => (
          <option key={val} value={val}>
            {lab}
          </option>
        ))}
      </select>
    </label>
  );
}

function normalizeSkills(input: string): string[] {
  if (!input.trim()) return [];
  return input
    .split(/[,\|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}
