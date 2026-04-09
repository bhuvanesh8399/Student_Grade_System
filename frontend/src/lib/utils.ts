export function formatScore(score: number) {
  return `${score}%`;
}

export function scoreTone(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Needs Improvement";
  return "Poor";
}

export function truncate(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
