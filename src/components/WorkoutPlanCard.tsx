import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, Text, View } from 'react-native';
import type { WorkoutPlan } from '../lib/api/types';

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

  return (
    <Pressable
      onPress={onPress}
      className='mb-3 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:active:bg-gray-750'
    >
      <View className='flex-row items-center'>
        <View className='h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30'>
          <Ionicons
            name='barbell-outline'
            size={24}
            color='#2563EB'
          />
        </View>
        <View className='ml-3 flex-1'>
          <Text
            className='text-base font-bold text-gray-900 dark:text-white'
            numberOfLines={1}
          >
            {plan.name}
          </Text>
          <Text className='text-xs text-gray-500 dark:text-gray-400'>
            {exerciseCount} ejercicios · {totalSets} series
          </Text>
        </View>
        <Ionicons
          name='chevron-forward'
          size={20}
          color='#9CA3AF'
        />
      </View>

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
