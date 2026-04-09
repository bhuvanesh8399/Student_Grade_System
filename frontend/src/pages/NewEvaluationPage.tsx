import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Badge from "../components/Badge";
import SectionTitle from "../components/SectionTitle";
import { createSubmission, getRubrics, runEvaluation } from "../lib/api";
import type { Rubric } from "../types/rubric";

export default function NewEvaluationPage() {
  const navigate = useNavigate();
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Impact of Social Media on Students");
  const [rubricId, setRubricId] = useState<number | "">("");
  const [essayText, setEssayText] = useState(
    "Social media has become an important part of student life. It helps students connect with others, learn new things, and share ideas. However, it can also distract students from study and reduce concentration. Therefore, students should use social media carefully and balance it with academic responsibilities."
  );

  useEffect(() => {
    getRubrics().then((items) => {
      setRubrics(items);
      if (items[0]) setRubricId(items[0].id);
    });
  }, []);

  const selectedRubric = useMemo(
    () => rubrics.find((item) => item.id === rubricId) ?? null,
    [rubrics, rubricId]
  );

  async function handleEvaluate() {
    if (!rubricId || !essayText.trim() || !title.trim()) return;
    setLoading(true);
    try {
      const submission = await createSubmission({
        rubric_id: rubricId,
        title,
        essay_text: essayText,
        student_id: 1
      });
      await runEvaluation(submission.id);
      navigate(`/result/${submission.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="card-glass p-5">
        <SectionTitle title="New Evaluation" subtitle="Paste essay, choose rubric, run grading." />

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Assignment Title</label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-300/30"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Rubric</label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none focus:border-violet-300/30"
              value={rubricId}
              onChange={(event) => setRubricId(Number(event.target.value))}
            >
              {rubrics.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} - {item.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">Essay Text</label>
            <textarea
              rows={14}
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 outline-none focus:border-violet-300/30"
              value={essayText}
              onChange={(event) => setEssayText(event.target.value)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">Word Count</p>
              <p className="mt-2 text-xl font-semibold">{essayText.trim().split(/\s+/).filter(Boolean).length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">Readability</p>
              <p className="mt-2 text-xl font-semibold">Moderate</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">Status</p>
              <p className="mt-2 text-xl font-semibold">{loading ? "Evaluating..." : "Ready"}</p>
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-rose-500 px-5 py-4 text-sm font-semibold shadow-xl shadow-fuchsia-950/30 transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "AI is evaluating..." : "Evaluate Essay"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-glass p-5">
          <SectionTitle title="Rubric Preview" subtitle="What the AI will score against." />
          {selectedRubric ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge text={selectedRubric.subject} />
                <Badge text={selectedRubric.title} />
              </div>
              {selectedRubric.criteria.map((criterion) => (
                <div key={criterion.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{criterion.name}</p>
                    <span className="text-xs text-white/50">Max {criterion.max_score}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{criterion.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50">Loading rubric...</p>
          )}
        </div>

        <div className="card-glass p-5">
          <SectionTitle title="AI Workflow" subtitle="Make the evaluation feel transparent." />
          <div className="space-y-3">
            {["Input received", "Rubric matched", "Content analyzed", "Score generated", "Report built"].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-rose-500 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-white/80">{step}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
