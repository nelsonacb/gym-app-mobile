export type WeightUnit = 'KG' | 'LB';
export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'SHOULDERS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'LEGS'
  | 'GLUTES'
  | 'CORE'
  | 'CARDIO'
  | 'OTHER';
export type Equipment =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'MACHINE'
  | 'CABLE'
  | 'BODYWEIGHT'
  | 'KETTLEBELL'
  | 'OTHER';
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type SetStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';

export interface User {
  id: string;
  name: string;
  email: string;
  weightUnit: WeightUnit;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id?: string;
  userId: string;
  weeklyGoal: number | null;
  weightUnit: WeightUnit;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  instructions: string | null;
  createdAt: string;
}

export interface PlanExercise {
  id: string;
  workoutPlanId: string;
  exerciseId: string;
  position: number;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  exercise: Exercise;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  planExercises: PlanExercise[];
}

export interface WorkoutSet {
  id: string;
  sessionExerciseId?: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  status: SetStatus;
  completedAt: string | null;
}

export interface SessionExercise {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  exerciseName: string;
  position: number;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string | null;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  totalVolume: number | null;
  sessionExercises: SessionExercise[];
}

export interface WorkoutSessionSummary {
  id: string;
  userId: string;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  totalVolume: number | null;
  workoutPlan: { id: string; name: string } | null;
  _count: { sessionExercises: number };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
