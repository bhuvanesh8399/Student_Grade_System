export type RubricCriterion = {
  id: number;
  name: string;
  description: string;
  max_score: number;
  weight: number;
  order_index: number;
};

export type Rubric = {
  id: number;
  title: string;
  subject: string;
  description: string;
  is_active: boolean;
  criteria: RubricCriterion[];
};
