import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  exerciseFilterMuscleGroup: string | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setExerciseFilter: (muscleGroup: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      exerciseFilterMuscleGroup: null,
      setTheme: (theme) => set({ theme }),
      setExerciseFilter: (muscleGroup) =>
        set({ exerciseFilterMuscleGroup: muscleGroup }),
    }),
    {
      name: 'forgefit-ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
