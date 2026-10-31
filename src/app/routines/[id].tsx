import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '../../lib/api/errors';
import { useWorkoutPlan } from '../../lib/hooks/use-workout-plans';
import { useStartWorkoutSession } from '../../lib/hooks/use-workout-sessions';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: plan, isLoading, isError } = useWorkoutPlan(id);
  const startSession = useStartWorkoutSession();

  const handleStart = () => {
    if (!plan) return;
    startSession.mutate(
      { workoutPlanId: plan.id },
      {
        onSuccess: (data) => {
          router.push({
            pathname: '/session/[id]',
            params: { id: data.session.id },
          });
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) {
            const details = error.details as
              | { sessionId?: string; details?: { sessionId?: string } }
              | undefined;
            const existingId =
              details?.sessionId ?? details?.details?.sessionId;
            if (existingId) {
              router.push({
                pathname: '/session/[id]',
                params: { id: existingId },
              });
            }
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <ActivityIndicator
          size='large'
          color='#2563EB'
        />
      </View>
    );
  }

  if (isError || !plan) {
    return (
      <View
        className='flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-gray-900'
        style={{ paddingTop: insets.top }}
      >
        <Text className='text-center text-red-500'>
          No se pudo cargar el plan.
        </Text>
        <Pressable
          className='mt-4 rounded-lg bg-blue-600 px-6 py-3'
          onPress={() => router.back()}
        >
          <Text className='font-semibold text-white'>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const totalSets = plan.planExercises.reduce((s, pe) => s + pe.targetSets, 0);

  return (
    <View
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className='flex-row items-center px-4 py-3'>
        <Pressable
          onPress={() => router.back()}
          className='p-2'
        >
          <Ionicons
            name='arrow-back'
            size={24}
            color='#6B7280'
          />
        </Pressable>
        <Text
          className='ml-2 flex-1 text-lg font-bold text-gray-900 dark:text-white'
          numberOfLines={1}
        >
          {plan.name}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {/* Info card */}
        <View className='mb-4 rounded-2xl bg-white p-4 dark:bg-gray-800'>
          {plan.description ? (
            <Text className='mb-3 text-sm text-gray-600 dark:text-gray-300'>
              {plan.description}
            </Text>
          ) : null}
          <View className='flex-row'>
            <View className='mr-8'>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                Ejercicios
              </Text>
              <Text className='text-base font-bold text-gray-900 dark:text-white'>
                {plan.planExercises.length}
              </Text>
            </View>
            <View>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                Series totales
              </Text>
              <Text className='text-base font-bold text-gray-900 dark:text-white'>
                {totalSets}
              </Text>
            </View>
          </View>
        </View>

        {/* Exercises */}
        <Text className='mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400'>
          EJERCICIOS
        </Text>
        {plan.planExercises.map((pe, idx) => (
          <View
            key={pe.id}
            className='mb-3 flex-row items-center rounded-2xl bg-white p-3 dark:bg-gray-800'
          >
            <View className='h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30'>
              <Ionicons
                name='barbell-outline'
                size={22}
                color='#2563EB'
              />
            </View>
            <View className='ml-3 flex-1'>
              <Text className='text-xs text-gray-400 dark:text-gray-500'>
                {idx + 1}
              </Text>
              <Text className='text-base font-semibold text-gray-900 dark:text-white'>
                {pe.exercise.name}
              </Text>
              <Text className='text-xs text-gray-500 dark:text-gray-400'>
                {pe.exercise.muscleGroup} · {pe.targetSets}×{pe.targetReps} ·
                descanso {pe.restSeconds}s
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Sticky footer */}
      <View
        className='border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          className={`items-center rounded-lg p-4 ${
            startSession.isPending ? 'bg-blue-300' : 'bg-blue-600'
          }`}
          onPress={handleStart}
          disabled={startSession.isPending}
        >
          <Text className='text-base font-semibold text-white'>
            {startSession.isPending ? 'Iniciando...' : 'Iniciar sesión'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
