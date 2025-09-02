export type CandidateStatsResponse = {
  total: number;
  avgExperience: number;
  byStatus: Record<string, number>;
  topSkills: { skill: string; count: number }[];
  byLocation: {
    location: string;
    count: number;
    avgExp: number;
    minExp: number;
    maxExp: number;
  }[];
};

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim() ||
  "http://localhost:8080/api"; 

export async function fetchStats(): Promise<CandidateStatsResponse> {
  const res = await fetch(`${API_BASE}/candidates/stats`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  return res.json();
}
