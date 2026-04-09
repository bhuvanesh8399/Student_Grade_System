import type { PropsWithChildren } from "react";

import Sidebar from "./Sidebar";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <header className="mb-6 card-glass p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl gradient-text">
                  Student Assignment Grader Agent
                </h1>
                <p className="text-sm text-white/65">
                  AI-powered rubric-based essay evaluation with transparent scoring and actionable feedback
                </p>
              </div>
              <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
                Violet + Rose Review Theme
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
