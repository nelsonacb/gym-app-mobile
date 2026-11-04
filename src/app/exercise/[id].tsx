import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExerciseDetail } from '../../lib/hooks/use-exercises';
import { useExerciseProgress } from '../../lib/hooks/use-progress';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: exercise, isLoading: loadingExercise } = useExerciseDetail(id);
  const { data: progress, isLoading: loadingProgress } =
    useExerciseProgress(id);

  const textPrimary = isDark ? '#F9FAFB' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? '#1F2937' : '#FFFFFF';

  if (loadingExercise || loadingProgress) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <ActivityIndicator
          size='large'
          color='#2563EB'
        />
      </View>
    );
  }

  if (!exercise || !progress) {
    return (
      <View
        className='flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-gray-900'
        style={{ paddingTop: insets.top }}
      >
        <Text className='text-center text-red-500'>
          The exercise could not be loaded.
        </Text>
        <Pressable
          className='mt-4 rounded-lg bg-blue-600 px-6 py-3'
          onPress={() => router.back()}
        >
          <Text className='font-semibold text-white'>Come Back</Text>
        </Pressable>
      </View>
    );
  }

  const sortedHistory = [...progress.history].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  );
  const lineData = sortedHistory.map((h) => ({
    value: h.weight,
    label: new Date(h.startedAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    dataPointText: `${h.weight}kg`,
  }));

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
          {exercise.name}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {/* Info card */}
        <View
          className='mb-4 rounded-2xl p-4'
          style={{ backgroundColor: cardBg }}
        >
          <Text
            className='text-sm'
            style={{ color: textSecondary }}
          >
            {exercise.muscleGroup} · {exercise.equipment}
          </Text>
          <Text
            className='mt-1 text-xs'
            style={{ color: textSecondary }}
          >
            {progress.totalSets} total number of registered sets
          </Text>
        </View>

        {/* PRs */}
        <View className='mb-4 flex-row'>
          <View
            className='mr-3 flex-1 rounded-2xl p-4'
            style={{ backgroundColor: cardBg }}
          >
            <Text
              className='text-[10px] uppercase'
              style={{ color: textSecondary }}
            >
              Maximum weight
            </Text>
            <Text
              className='mt-1 text-2xl font-bold'
              style={{ color: textPrimary }}
            >
              {progress.personalRecords.maxWeight ?? '—'}
              <Text className='text-sm font-normal'> kg</Text>
            </Text>
          </View>
          <View
            className='flex-1 rounded-2xl p-4'
            style={{ backgroundColor: cardBg }}
          >
            <Text
              className='text-[10px] uppercase'
              style={{ color: textSecondary }}
            >
              Maximum volume (1 set)
            </Text>
            <Text
              className='mt-1 text-2xl font-bold'
              style={{ color: textPrimary }}
            >
              {progress.personalRecords.maxSingleSetVolume ?? '—'}
              <Text className='text-sm font-normal'> kg</Text>
            </Text>
          </View>
        </View>

        {/* Gráfico de evolución */}
        {lineData.length >= 2 ? (
          <View
            className='mb-4 rounded-2xl p-4'
            style={{ backgroundColor: cardBg }}
          >
            <Text
              className='mb-3 text-base font-bold'
              style={{ color: textPrimary }}
            >
              Weight trend
            </Text>
            <LineChart
              data={lineData}
              width={280}
              height={180}
              thickness={3}
              color='#2563EB'
              dataPointsColor='#2563EB'
              dataPointsRadius={5}
              textColor={textSecondary}
              textFontSize={10}
              xAxisColor={isDark ? '#374151' : '#E5E7EB'}
              yAxisColor={isDark ? '#374151' : '#E5E7EB'}
              yAxisTextStyle={{ color: textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: textSecondary, fontSize: 10 }}
              rulesColor={
                isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
              }
              curved
              isAnimated
            />
          </View>
        ) : (
          <View
            className='mb-4 rounded-2xl p-4'
            style={{ backgroundColor: cardBg }}
          >
            <Text
              className='text-center text-sm'
              style={{ color: textSecondary }}
            >
              Log at least 2 sessions with this exercise to see your progress.
            </Text>
          </View>
        )}

        {/* Historial de sesiones */}
        <Text
          className='mb-2 text-sm font-semibold'
          style={{ color: textSecondary }}
        >
          HISTORY
        </Text>
        {sortedHistory
          .slice(-10)
          .reverse()
          .map((h) => (
            <View
              key={h.sessionId}
              className='mb-2 flex-row items-center justify-between rounded-xl p-3'
              style={{ backgroundColor: cardBg }}
            >
              <Text
                className='text-sm'
                style={{ color: textPrimary }}
              >
                {new Date(h.startedAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
              <Text
                className='text-sm font-semibold'
                style={{ color: textPrimary }}
              >
                {h.weight} kg × {h.reps}
              </Text>
              <Text
                className='text-xs'
                style={{ color: textSecondary }}
              >
                {h.volume} kg vol.
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
