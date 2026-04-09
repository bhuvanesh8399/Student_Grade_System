type Props = {
  text: string;
};

export default function Badge({ text }: Props) {
  return (
    <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-100">
      {text}
    </span>
  );
}
