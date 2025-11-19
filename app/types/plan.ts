export interface WorkoutItem {
  exercise: string;
  sets: string;
  reps: string;
  rest: string;
  tempo: string;
  image_prompt: string;
}

export interface DietItem {
  meal: string;
  food: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  image_prompt: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  duration: string;
  warmup: string[];
  workout: WorkoutItem[];
  cooldown: string[];
  notes: string;
}

export interface NutritionSummary {
  total_daily_calories: number;
  protein_target: string;
  carb_target: string;
  fat_target: string;
  hydration_goal: string;
  foods_to_avoid: string[];
  recommended_foods: string[];
}

export interface LifestyleTips {
  sleep_goal: string;
  steps_goal: string;
  stress_management: string[];
  weekly_progression: string;
}

export interface FitnessPlan {
  motivation: string;
  daily_workout: WorkoutItem[];
  weekly_plan: DayPlan[];
  diet: DietItem[];
  nutrition_summary: NutritionSummary;
  lifestyle: LifestyleTips;
}
