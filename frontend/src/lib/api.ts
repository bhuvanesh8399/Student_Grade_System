import axios from "axios";

import type { DashboardSummary } from "../types/dashboard";
import type { EvaluationResponse } from "../types/evaluation";
import type { Rubric } from "../types/rubric";
import type { Submission } from "../types/submission";

const api = axios.create({
  baseURL: "/api"
});

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get("/dashboard/summary");
  return data;
}

export async function getRubrics(): Promise<Rubric[]> {
  const { data } = await api.get("/rubrics");
  return data;
}

export async function createRubric(payload: {
  title: string;
  subject: string;
  description: string;
  criteria: { name: string; description: string; max_score: number; weight: number; order_index: number }[];
}): Promise<Rubric> {
  const { data } = await api.post("/rubrics", payload);
  return data;
}

export async function createSubmission(payload: {
  rubric_id: number;
  title: string;
  essay_text: string;
  student_id?: number | null;
}): Promise<Submission> {
  const { data } = await api.post("/submissions", payload);
  return data;
}

export async function getSubmissions(): Promise<Submission[]> {
  const { data } = await api.get("/submissions");
  return data;
}

export async function runEvaluation(submissionId: number): Promise<EvaluationResponse> {
  const { data } = await api.post(`/evaluations/run/${submissionId}`);
  return data;
}

export async function getEvaluation(submissionId: number): Promise<EvaluationResponse> {
  const { data } = await api.get(`/evaluations/${submissionId}`);
  return data;
}
