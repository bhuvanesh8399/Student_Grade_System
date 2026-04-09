export type DashboardSummary = {
  total_submissions: number;
  total_evaluations: number;
  average_score: number;
  essays_needing_improvement: number;
  latest_activity: {
    submission_id: number;
    title: string;
    status: string;
    created_at: string;
  }[];
};
