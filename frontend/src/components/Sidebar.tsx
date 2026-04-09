import { Brain, ClipboardList, FileText, History, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/evaluate", label: "Evaluate", icon: Brain },
  { to: "/rubrics", label: "Rubrics", icon: ClipboardList },
  { to: "/history", label: "History", icon: History }
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col p-5 md:flex">
      <div className="card-glass flex-1 p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 shadow-lg shadow-fuchsia-950/40">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold gradient-text">RubricIQ</p>
            <p className="text-xs text-white/60">Academic AI Evaluator</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? "border border-violet-300/20 bg-gradient-to-r from-violet-500/25 to-rose-500/20 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
