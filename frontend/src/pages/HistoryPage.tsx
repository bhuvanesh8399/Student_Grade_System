import { useEffect, useState } from "react";

import SectionTitle from "../components/SectionTitle";
import { getSubmissions } from "../lib/api";
import type { Submission } from "../types/submission";

export default function HistoryPage() {
  const [items, setItems] = useState<Submission[]>([]);

  useEffect(() => {
    getSubmissions().then(setItems);
  }, []);

  return (
    <div className="card-glass p-5">
      <SectionTitle title="Submission History" subtitle="History storage is DB-backed." />

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-white/50">
            <tr>
              <th className="pb-3">ID</th>
              <th className="pb-3">Title</th>
              <th className="pb-3">Rubric</th>
              <th className="pb-3">Word Count</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="py-4">{item.id}</td>
                <td className="py-4">{item.title}</td>
                <td className="py-4">{item.rubric_id}</td>
                <td className="py-4">{item.word_count}</td>
                <td className="py-4">
                  <span className="rounded-full border border-rose-300/20 bg-rose-500/10 px-3 py-1 text-xs">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!items.length && <p className="mt-4 text-sm text-white/50">No submissions yet.</p>}
      </div>
    </div>
  );
}
