import { useEffect, useState } from "react";

import MetricCard from "../components/MetricCard";
import SectionTitle from "../components/SectionTitle";
import { getDashboardSummary } from "../lib/api";
import type { DashboardSummary } from "../types/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    getDashboardSummary().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <SectionTitle title="Dashboard" subtitle="Clean overview only, no clutter, just what matters." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Submissions" value={data?.total_submissions ?? "--"} />
        <MetricCard title="Total Evaluations" value={data?.total_evaluations ?? "--"} />
        <MetricCard title="Average Score" value={data?.average_score ?? "--"} hint="Across evaluated essays" />
        <MetricCard
          title="Needs Improvement"
          value={data?.essays_needing_improvement ?? "--"}
          hint="Score below 70"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-glass p-5">
          <SectionTitle title="Why this system works" subtitle="Focused academic AI, not random chatbot noise." />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Rubric-based criterion scoring",
              "Stable backend + DB contracts",
              "Explainable feedback panels",
              "Faculty-friendly review flow"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass p-5">
          <SectionTitle title="Recent Activity" subtitle="Latest stored submissions from the database." />
          <div className="space-y-3">
            {data?.latest_activity?.length ? (
              data.latest_activity.map((item) => (
                <div key={item.submission_id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-white/50">Status: {item.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/50">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
