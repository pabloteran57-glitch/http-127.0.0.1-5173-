export interface PerformanceRun {
  id: string;
  policy: "demand" | "always";
  workload: "idle" | "orbit";
  duration_ms: number;
}
export interface PerformanceResult extends PerformanceRun {
  elapsed_ms: number;
  frames: number;
  median_interval_ms: number | null;
  p95_interval_ms: number | null;
  intervals_over_33ms: number;
  status: "completed" | "interrupted";
}
export function summarizeFrames(run: PerformanceRun, intervals: number[], elapsed: number, status: PerformanceResult["status"], frames=intervals.length+1): PerformanceResult {
  const valid = intervals.filter(n => Number.isFinite(n) && n > 0).sort((a,b) => a-b);
  const quantile = (p: number) => valid.length ? valid[Math.ceil(valid.length*p)-1] : null;
  return {...run, elapsed_ms: Math.round(elapsed), frames, median_interval_ms: quantile(.5), p95_interval_ms: quantile(.95), intervals_over_33ms: valid.filter(n=>n>1000/30).length, status};
}
