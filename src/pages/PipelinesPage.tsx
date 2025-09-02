import { useEffect, useState } from "react";
import BackgroundDecor from "../components/BackgroundDecor";
import CandidateChip from "../components/CandidateChip";
import { useCandidates } from "../hooks/useCandidates";
import type { Candidate, PipelineStage } from "../types";
import { patchCandidate } from "../services/candidates";

const STAGES: PipelineStage[] = [
  "SOURCED",
  "APPLIED",
  "INTERVIEWED",
  "OFFERED",
  "HIRED",
  "REJECTED",
];

type Board = Record<PipelineStage, Candidate[]>;

function emptyBoard(): Board {
  return {
    SOURCED: [],
    APPLIED: [],
    INTERVIEWED: [],
    OFFERED: [],
    HIRED: [],
    REJECTED: [],
  };
}

function boardFromData(data: Candidate[]): Board {
  const b = emptyBoard();
  for (const c of data) b[c.pipelineStage].push(c);
  return b;
}

function label(s: PipelineStage) {
  switch (s) {
    case "SOURCED": return "Sourced";
    case "APPLIED": return "Applied";
    case "INTERVIEWED": return "Interviewed";
    case "OFFERED": return "Offered";
    case "HIRED": return "Hired";
    case "REJECTED": return "Rejected";
  }
}

export default function PipelinesPage() {
  const { data, loading, error } = useCandidates(80);
  const [board, setBoard] = useState<Board>(emptyBoard());

  useEffect(() => {
    setBoard(boardFromData(data));
  }, [data]);

  async function onDrop(to: PipelineStage, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isFinite(id)) return;

    setBoard((prev) => {
      let from: PipelineStage | null = null;
      let cand: Candidate | undefined;

      for (const s of STAGES) {
        const idx = prev[s].findIndex((x) => x.id === id);
        if (idx >= 0) {
          cand = { ...prev[s][idx], pipelineStage: to };
          from = s;
          break;
        }
      }
      if (!cand || !from || from === to) return prev;

      const next: Board = STAGES.reduce(
        (acc, s) => ({ ...acc, [s]: [...prev[s]] }),
        emptyBoard()
      );
      next[from] = next[from].filter((x) => x.id !== id);
      next[to] = [cand, ...next[to]];

      patchCandidate(cand.id, { pipelineStage: to }).catch((err) => {
        console.error("Fehler beim Aktualisieren:", err);
      });

      return next;
    });
  }

  return (
    <div className="min-h-dvh">
      <BackgroundDecor />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Pipelines</h1>

        {loading && <div className="text-gray-500">Lade…</div>}
        {error && <div className="text-red-600">Fehler: {error}</div>}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {STAGES.map((s) => (
              <Column
                key={s}
                title={label(s)}
                onDrop={(e) => onDrop(s, e)}
                onDragOver={(e) => e.preventDefault()}
              >
                {board[s].map((c) => (
                  <CandidateChip key={c.id} c={c} />
                ))}
              </Column>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Column({
  title,
  children,
  onDrop,
  onDragOver,
}: {
  title: string;
  children: React.ReactNode;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-3 shadow-card min-h-[60vh] flex flex-col gap-3"
    >
      <div className="mb-1 text-sm font-semibold text-slate-700">{title}</div>
      {children}
    </div>
  );
}
