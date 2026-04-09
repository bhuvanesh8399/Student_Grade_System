type Props = {
  score: number;
  label?: string;
};

export default function ScoreRing({ score, label = "Overall Score" }: Props) {
  const normalized = Math.max(0, Math.min(100, score));
  const angle = (normalized / 100) * 360;

  return (
    <div className="card-glass flex flex-col items-center justify-center p-6">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(rgb(168,85,247) 0deg, rgb(244,114,182) ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`
        }}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-neutral-950">
          <div className="text-3xl font-bold">{normalized}</div>
          <div className="text-xs text-white/55">/100</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/65">{label}</p>
    </div>
  );
}
