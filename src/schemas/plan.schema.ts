import { z } from 'zod';

export const planExerciseSchema = z.object({
  exerciseId: z.uuid('Invalid exercise'),
  targetSets: z.coerce.number().int().min(1).max(20),
  targetReps: z.coerce.number().int().min(1).max(100),
  restSeconds: z.coerce.number().int().min(0).max(1800),
});

export const planSchema = z.object({
  name: z.string().min(2, 'Minimum 2 characters').max(120),
  description: z.string().max(1000).optional().or(z.literal('')),
  exercises: z.array(planExerciseSchema).min(1, 'Add at least one exercise'),
});

export type PlanFormData = z.infer<typeof planSchema>;
