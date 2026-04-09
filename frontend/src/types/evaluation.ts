export type CriterionResult = {
  criterion_id: number;
  name: string;
  score: number;
  max_score: number;
  weight: number;
  justification: string;
};

export type EvaluationResponse = {
  submission_id: number;
  title: string;
  overall_score: number;
  score_label: string;
  confidence_score: number;
  criteria: CriterionResult[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improved_version_text: string;
  summary_feedback: string;
  status: string;
};
