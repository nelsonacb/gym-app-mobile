import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { exerciseToSlug } from '../../../lib/slug';
import { ExerciseIllustration } from '../../components/ExerciseIllustration';
import type { SessionExercise, WorkoutSet } from '../../lib/api/types';
import {
  useCancelWorkoutSession,
  useCompleteWorkoutSession,
  useUpdateSet,
  useWorkoutSession,
} from '../../lib/hooks/use-workout-sessions';

export default function ActiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: session, isLoading, isError } = useWorkoutSession(id);
  const completeSession = useCompleteWorkoutSession();
  const cancelSession = useCancelWorkoutSession();

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

  if (isError || !session) {
    return (
      <View
        className='flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-gray-900'
        style={{ paddingTop: insets.top }}
      >
        <Text className='text-center text-red-500'>
          No se pudo cargar la sesión.
        </Text>
      </View>
    );
  }

  const isActive = session.status === 'IN_PROGRESS';
  const allSets = session.sessionExercises.flatMap((se) => se.sets);
  const completedSets = allSets.filter((s) => s.status === 'COMPLETED').length;
  const totalSets = allSets.length;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const handleComplete = () => {
    completeSession.mutate(id, {
      onSuccess: () => router.replace('/(tabs)'),
    });
  };

  const handleCancel = () => {
    cancelSession.mutate(id, {
      onSuccess: () => router.replace('/(tabs)'),
    });
  };

  return (
    <View
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className='flex-row items-center border-b border-gray-200 px-4 py-3 dark:border-gray-700'>
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
        <View className='ml-2 flex-1'>
          <Text className='text-base font-bold text-gray-900 dark:text-white'>
            Entrenamiento
          </Text>
          <Text className='text-xs text-gray-500 dark:text-gray-400'>
            {completedSets}/{totalSets} series completadas
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className='h-1 bg-gray-200 dark:bg-gray-700'>
        <View
          className='h-1 bg-blue-600'
          style={{ width: `${progressPct}%` }}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        {session.sessionExercises.map((se) => (
          <ExerciseBlock
            key={se.id}
            sessionExercise={se}
            sessionId={session.id}
            isActive={isActive}
          />
        ))}
      </ScrollView>

      {isActive ? (
        <View
          className='border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <Pressable
            className={`items-center rounded-lg p-4 ${
              completeSession.isPending ? 'bg-green-300' : 'bg-green-600'
            }`}
            onPress={handleComplete}
            disabled={completeSession.isPending}
          >
            <Text className='text-base font-semibold text-white'>
              {completeSession.isPending
                ? 'Finalizando...'
                : 'Finalizar entrenamiento'}
            </Text>
          </Pressable>
          <Pressable
            className='mt-2 items-center rounded-lg border border-red-200 p-3 dark:border-red-800'
            onPress={handleCancel}
            disabled={cancelSession.isPending}
          >
            <Text className='text-sm font-medium text-red-600 dark:text-red-400'>
              {cancelSession.isPending ? 'Cancelando...' : 'Cancelar sesión'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function ExerciseBlock({
  sessionExercise,
  sessionId,
  isActive,
}: {
  sessionExercise: SessionExercise;
  sessionId: string;
  isActive: boolean;
}) {
  return (
    <View className='mb-4 rounded-2xl bg-white p-4 dark:bg-gray-800'>
      <View className='mb-3 flex-row items-center'>
        <ExerciseIllustration
          slug={exerciseToSlug(sessionExercise.exerciseName)}
          size={56}
        />
        <View className='ml-3 flex-1'>
          <Text className='text-base font-bold text-gray-900 dark:text-white'>
            {sessionExercise.exerciseName}
          </Text>
          <Text className='text-xs text-gray-500 dark:text-gray-400'>
            {sessionExercise.targetSets}×{sessionExercise.targetReps} · descanso{' '}
            {sessionExercise.restSeconds}s
          </Text>
        </View>
      </View>

      {sessionExercise.sets.map((set) => (
        <SetRow
          key={set.id}
          set={set}
          sessionId={sessionId}
          sessionExerciseId={sessionExercise.id}
          isActive={isActive}
        />
      ))}
    </View>
  );
}

function SetRow({
  set,
  sessionId,
  sessionExerciseId,
  isActive,
}: {
  set: WorkoutSet;
  sessionId: string;
  sessionExerciseId: string;
  isActive: boolean;
}) {
  const [weight, setWeight] = useState(set.weight?.toString() ?? '');
  const [reps, setReps] = useState(set.reps?.toString() ?? '');
  const updateSet = useUpdateSet();

  const isCompleted = set.status === 'COMPLETED';
  const isSkipped = set.status === 'SKIPPED';
  const isEditable = isActive && !isCompleted && !isSkipped;

  const canSave =
    weight.trim().length > 0 &&
    reps.trim().length > 0 &&
    Number(weight) >= 0 &&
    Number(reps) > 0;

  const handleSave = () => {
    if (!canSave) return;
    updateSet.mutate({
      sessionId,
      sessionExerciseId,
      setNumber: set.setNumber,
      input: {
        weight: Number(weight),
        reps: Number(reps),
        status: 'COMPLETED',
      },
    });
  };

  const handleSkip = () => {
    updateSet.mutate({
      sessionId,
      sessionExerciseId,
      setNumber: set.setNumber,
      input: { weight: null, reps: null, status: 'SKIPPED' },
    });
  };

  return (
    <View className='mb-2 flex-row items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-700'>
      <View className='w-8'>
        <Text className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
          #{set.setNumber}
        </Text>
      </View>

      {isEditable ? (
        <>
          <TextInput
            className='mr-2 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            value={weight}
            onChangeText={setWeight}
            placeholder='kg'
            placeholderTextColor='#9CA3AF'
            keyboardType='numeric'
          />
          <TextInput
            className='mr-2 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
            value={reps}
            onChangeText={setReps}
            placeholder='reps'
            placeholderTextColor='#9CA3AF'
            keyboardType='numeric'
          />
          <Pressable
            className={`rounded-md p-2 ${
              canSave && !updateSet.isPending
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onPress={handleSave}
            disabled={!canSave || updateSet.isPending}
          >
            {updateSet.isPending ? (
              <ActivityIndicator
                size='small'
                color='#FFFFFF'
              />
            ) : (
              <Ionicons
                name='checkmark'
                size={20}
                color='#FFFFFF'
              />
            )}
          </Pressable>
          <Pressable
            className='ml-1 rounded-md p-2'
            onPress={handleSkip}
            disabled={updateSet.isPending}
          >
            <Ionicons
              name='close'
              size={20}
              color='#9CA3AF'
            />
          </Pressable>
        </>
      ) : (
        <>
          <Text className='flex-1 text-sm text-gray-700 dark:text-gray-300'>
            {isSkipped
              ? '— omitida —'
              : `${set.weight ?? '-'} kg × ${set.reps ?? '-'}`}
          </Text>
          {isCompleted ? (
            <Ionicons
              name='checkmark-circle'
              size={20}
              color='#10B981'
            />
          ) : null}
        </>
      )}
    </View>
  );
}
