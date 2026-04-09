import { useEffect, useState } from "react";

import SectionTitle from "../components/SectionTitle";
import { createRubric, getRubrics } from "../lib/api";
import type { Rubric } from "../types/rubric";

type DraftCriterion = {
  name: string;
  description: string;
  max_score: number;
  weight: number;
  order_index: number;
};

export default function RubricBuilderPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [title, setTitle] = useState("Short Essay Academic Rubric");
  const [subject, setSubject] = useState("English");
  const [description, setDescription] = useState("Rubric for evaluating short academic essays.");
  const [criteria, setCriteria] = useState<DraftCriterion[]>([
    { name: "Structure", description: "Essay organization and flow", max_score: 20, weight: 0.2, order_index: 1 },
    { name: "Clarity", description: "Clarity of expression", max_score: 20, weight: 0.2, order_index: 2 },
    { name: "Content Quality", description: "Depth and quality of ideas", max_score: 20, weight: 0.25, order_index: 3 }
  ]);

  async function refresh() {
    const data = await getRubrics();
    setRubrics(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreateRubric() {
    await createRubric({ title, subject, description, criteria });
    await refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="card-glass p-5">
        <SectionTitle title="Rubric Builder" subtitle="Faculty-side rubric management page." />
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Rubric title"
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
          />
          <textarea
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Rubric description"
          />

          <div className="space-y-3">
            {criteria.map((criterion, index) => (
              <div key={`${criterion.name}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={criterion.name}
                    onChange={(event) => {
                      const next = [...criteria];
                      next[index].name = event.target.value;
                      setCriteria(next);
                    }}
                  />
                  <input
                    className="rounded-2xl border border-white/10 bg-neutral-900 px-3 py-2"
                    value={criterion.description}
                    onChange={(event) => {
                      const next = [...criteria];
                      next[index].description = event.target.value;
                      setCriteria(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateRubric}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-rose-500 px-5 py-3 text-sm font-semibold"
          >
            Save Rubric
          </button>
        </div>
      </div>

      <div className="card-glass p-5">
        <SectionTitle title="Existing Rubrics" subtitle="Stored in the backend DB." />
        <div className="space-y-3">
          {rubrics.map((rubric) => (
            <div key={rubric.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{rubric.title}</p>
                  <p className="text-sm text-white/55">{rubric.subject}</p>
                </div>
                <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-100">
                  {rubric.criteria.length} criteria
                </span>
              </div>
              <p className="mt-2 text-sm text-white/60">{rubric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
