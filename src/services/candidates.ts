import type { Candidate } from "../types";

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim() ||
  "http://localhost:8080/api"; 

export async function fetchCandidates(count?: number): Promise<Candidate[]> {
  const url = count
    ? `${API_BASE}/candidates?count=${count}` 
    : `${API_BASE}/candidates`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);

  return (await res.json()) as Candidate[];
}

export async function createCandidate(
  candidate: Omit<Candidate, "id" | "createdAt" | "updatedAt">
) {
  const url = `${API_BASE}/candidates`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });

  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return (await res.json()) as Candidate;
}

export async function updateCandidate(id: number, candidate: Partial<Candidate>) {
  const url = `${API_BASE}/candidates/${id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidate),
  });

  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return (await res.json()) as Candidate;
}

export async function deleteCandidate(id: number) {
  const url = `${API_BASE}/candidates/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
}

export async function importCandidates(candidates: Candidate[]) {
  const res = await fetch(`${API_BASE}/candidates/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidates),
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return (await res.json()) as Candidate[];
}

export async function clearCandidates() {
  const res = await fetch(`${API_BASE}/candidates/all`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
}

export async function patchCandidate(id: number, updates: Partial<Candidate>) {
  const url = `${API_BASE}/candidates/${id}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return (await res.json()) as Candidate;
}

