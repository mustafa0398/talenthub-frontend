import { useCallback, useEffect, useMemo, useState } from "react";
import type { Candidate } from "../types";
import { fetchCandidates } from "../services/candidates";

type State = {
  data: Candidate[];
  loading: boolean;
  error: string | null;
};

export function useCandidates(initialCount = 100) {
  const [state, setState] = useState<State>({
    data: [],
    loading: true,
    error: null,
  });

  const load = useCallback(
    async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const fresh = await fetchCandidates(initialCount);
        setState({ data: fresh, loading: false, error: null });
      } catch (e: any) {
        setState((s) => ({
          ...s,
          loading: false,
          error: e?.message || "Fehler beim Laden",
        }));
      }
    },
    [initialCount]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const refetch = useCallback(
    async (_count?: number) => {
      await load();
    },
    [load]
  );

  const regenerate = refetch;

  const clearCache = useCallback(() => {
    setState((s) => ({ ...s, data: [] }));
  }, []);

  const helpers = useMemo(() => {
    const byName = (q: string) =>
      state.data.filter((c) =>
        (c.name + " " + c.role + " " + c.skills.join(" "))
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    const byLocation = (loc: string) =>
      loc === "Alle Orte"
        ? state.data
        : state.data.filter((c) => c.location === loc);
    const sortBy = (key: "name" | "experience") =>
      [...state.data].sort((a, b) =>
        key === "name"
          ? a.name.localeCompare(b.name)
          : b.experienceYears - a.experienceYears
      );
    return { byName, byLocation, sortBy };
  }, [state.data]);

  return {
    ...state,
    ...helpers,
    refetch,
    regenerate,
    clearCache,
  };
}
