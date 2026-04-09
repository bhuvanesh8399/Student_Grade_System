import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Badge from "../components/Badge";
import ScoreRing from "../components/ScoreRing";
import SectionTitle from "../components/SectionTitle";
import { getEvaluation } from "../lib/api";
import type { EvaluationResponse } from "../types/evaluation";

export default function EvaluationResultPage() {
  const { submissionId } = useParams();
  const [data, setData] = useState<EvaluationResponse | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    getEvaluation(Number(submissionId)).then(setData);
  }, [submissionId]);

  if (!data) {
    return <div className="card-glass p-6">Loading evaluation...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Evaluation Report" subtitle="A polished report-style result page." />

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <ScoreRing score={data.overall_score} />

        <div className="card-glass p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">{data.title}</h3>
              <p className="mt-1 text-sm text-white/55">{data.summary_feedback}</p>
            </div>
            <div className="flex gap-2">
              <Badge text={data.score_label} />
              <Badge text={`Confidence ${Math.round(data.confidence_score * 100)}%`} />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {data.criteria.map((criterion) => {
              const percent = Math.round((criterion.score / criterion.max_score) * 100);
              return (
                <div key={criterion.criterion_id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{criterion.name}</p>
                    <p className="text-sm text-white/60">
                      {criterion.score}/{criterion.max_score}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-rose-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-white/60">{criterion.justification}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-glass p-5">
          <SectionTitle title="Strengths" />
          <ul className="space-y-2 text-sm text-white/75">
            {data.strengths.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="card-glass p-5">
          <SectionTitle title="Weaknesses" />
          <ul className="space-y-2 text-sm text-white/75">
            {data.weaknesses.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="card-glass p-5">
          <SectionTitle title="Suggestions" />
          <ul className="space-y-2 text-sm text-white/75">
            {data.suggestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-glass p-5">
        <SectionTitle title="Improvement Studio" subtitle="Original-to-improved writing guidance." />
        <div className="rounded-2xl border border-rose-300/15 bg-rose-500/8 p-4">
          <p className="text-sm text-white/80">{data.improved_version_text}</p>
        </div>
      </div>
    </div>
  );
}
