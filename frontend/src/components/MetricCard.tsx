type Props = {
  title: string;
  value: string | number;
  hint?: string;
};

export default function MetricCard({ title, value, hint }: Props) {
  return (
    <div className="card-glass p-5">
      <p className="text-sm text-white/60">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-2 text-xs text-white/45">{hint}</p> : null}
    </div>
  );
}
