import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, Text, View } from 'react-native';
import type { WorkoutSessionSummary } from '../lib/api/types';

interface Props {
  session: WorkoutSessionSummary;
  onPress?: () => void;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatVolume(volume: number | null): string {
  if (volume === null) return '—';
  return `${volume.toLocaleString()} kg`;
}

export function WorkoutSessionCard({ session, onPress }: Props) {
  const planName = session.workoutPlan?.name ?? 'Open session';
  const exerciseCount = session._count.sessionExercises;
  const isCompleted = session.status === 'COMPLETED';
  const isCancelled = session.status === 'CANCELLED';

  const statusLabel = isCompleted
    ? 'Completed'
    : isCancelled
      ? 'Cancelled'
      : 'In progress';

  const iconBg = isCompleted
    ? 'bg-green-50 dark:bg-green-900/30'
    : isCancelled
      ? 'bg-red-50 dark:bg-red-900/30'
      : 'bg-blue-50 dark:bg-blue-900/30';

  const iconName = isCompleted
    ? ('checkmark-circle' as const)
    : isCancelled
      ? ('close-circle' as const)
      : ('time' as const);

  const iconColor = isCompleted
    ? '#10B981'
    : isCancelled
      ? '#EF4444'
      : '#2563EB';

  return (
    <Pressable
      onPress={onPress}
      className='mb-3 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
    >
      <View className='flex-row items-center'>
        <View
          className={`h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={iconColor}
          />
        </View>
        <View className='ml-3 flex-1'>
          <Text
            className='text-base font-bold text-gray-900 dark:text-white'
            numberOfLines={1}
          >
            {planName}
          </Text>
          <Text className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            {formatDate(session.startedAt)} · {statusLabel}
          </Text>
        </View>
        <Ionicons
          name='chevron-forward'
          size={20}
          color='#9CA3AF'
        />
      </View>

      <View className='mt-3 flex-row border-t border-gray-100 pt-3 dark:border-gray-700'>
        <View className='flex-1'>
          <Text className='text-[10px] uppercase text-gray-400 dark:text-gray-500'>
            Duration
          </Text>
          <Text className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
            {formatDuration(session.durationSeconds)}
          </Text>
        </View>
        <View className='flex-1'>
          <Text className='text-[10px] uppercase text-gray-400 dark:text-gray-500'>
            Volume
          </Text>
          <Text className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
            {formatVolume(session.totalVolume)}
          </Text>
        </View>
        <View className='flex-1'>
          <Text className='text-[10px] uppercase text-gray-400 dark:text-gray-500'>
            Exercises
          </Text>
          <Text className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
            {exerciseCount}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
