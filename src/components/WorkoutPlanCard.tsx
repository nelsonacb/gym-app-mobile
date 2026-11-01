import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, Text, View } from 'react-native';
import { exerciseToSlug } from '../../lib/slug';
import type { WorkoutPlan } from '../lib/api/types';
import { ExerciseIllustration } from './ExerciseIllustration';

interface Props {
  plan: WorkoutPlan;
  onPress?: () => void;
}

export function WorkoutPlanCard({ plan, onPress }: Props) {
  const exerciseCount = plan.planExercises.length;
  const totalSets = plan.planExercises.reduce((s, pe) => s + pe.targetSets, 0);
  const muscleGroups = Array.from(
    new Set(plan.planExercises.map((pe) => pe.exercise.muscleGroup)),
  );
  const previewExercises = plan.planExercises.slice(0, 3);

  return (
    <Pressable
      onPress={onPress}
      className='mb-3 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
    >
      <View className='flex-row items-center'>
        <View className='flex-1'>
          <Text
            className='text-base font-bold text-gray-900 dark:text-white'
            numberOfLines={1}
          >
            {plan.name}
          </Text>
          <Text className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            {exerciseCount} ejercicios · {totalSets} series
          </Text>
        </View>
        <Ionicons
          name='chevron-forward'
          size={20}
          color='#9CA3AF'
        />
      </View>

      {/* Preview de ejercicios */}
      {previewExercises.length > 0 ? (
        <View className='mt-3 flex-row'>
          {previewExercises.map((pe) => (
            <View
              key={pe.id}
              className='mr-2'
            >
              <ExerciseIllustration
                slug={exerciseToSlug(pe.exercise.name)}
                size={52}
              />
            </View>
          ))}
          {exerciseCount > 3 ? (
            <View className='h-[52px] w-[52px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700'>
              <Text className='text-xs font-semibold text-gray-600 dark:text-gray-300'>
                +{exerciseCount - 3}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {plan.description ? (
        <Text
          className='mt-3 text-sm text-gray-600 dark:text-gray-300'
          numberOfLines={2}
        >
          {plan.description}
        </Text>
      ) : null}

      {muscleGroups.length > 0 ? (
        <View className='mt-3 flex-row flex-wrap'>
          {muscleGroups.slice(0, 4).map((mg) => (
            <View
              key={mg}
              className='mb-1 mr-2 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700'
            >
              <Text className='text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                {mg}
              </Text>
            </View>
          ))}
          {muscleGroups.length > 4 ? (
            <View className='mb-1 mr-2 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700'>
              <Text className='text-[10px] font-medium text-gray-700 dark:text-gray-300'>
                +{muscleGroups.length - 4}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
