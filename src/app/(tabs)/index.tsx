import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeeklyVolumeChart } from '../../components/WeeklyVolumeChart';
import { ApiError } from '../../lib/api/errors';
import { useCurrentUser } from '../../lib/hooks/use-auth';
import { useHealth } from '../../lib/hooks/use-health';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const health = useHealth();
  const me = useCurrentUser();
  const progress = useOverallProgress();

  const isUnauthenticated =
    (me.error instanceof ApiError && me.error.status === 401) ||
    (progress.error instanceof ApiError && progress.error.status === 401);

  const onRefresh = () => {
    health.refetch();
    me.refetch();
    progress.refetch();
  };

  const firstName = me.data?.name?.split(' ')[0];
  const hasWeeklyData = !!progress.data?.weeklyFrequency?.length;

  return (
    <ScrollView
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      contentContainerClassName='p-4'
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={
            health.isRefetching || me.isRefetching || progress.isRefetching
          }
          onRefresh={onRefresh}
        />
      }
    >
      {/* --- Saludo --- */}
      <View className='mb-4 bg-white dark:bg-gray-800'>
        <Text className='text-2xl font-bold text-gray-900'>
          {firstName ? `Hola, ${firstName}` : 'Dashboard'}
        </Text>
        <Text className='text-sm text-gray-900 dark:text-white'>
          {isUnauthenticated
            ? 'Inicia sesión para ver tu progreso'
            : 'Tu resumen de entrenamiento'}
        </Text>
      </View>

      {/* --- Backend --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-1 text-sm text-gray-900 dark:text-white'>
          Backend
        </Text>
        {health.isLoading ? (
          <ActivityIndicator />
        ) : health.data ? (
          <Text className='text-base font-semibold text-green-600'>
            ✅ Conectado ({health.data.status})
          </Text>
        ) : (
          <Text className='text-base font-semibold text-red-600'>
            ❌ Sin conexión
          </Text>
        )}
        {health.error ? (
          <Text className='mt-1 text-xs text-red-500'>
            {health.error instanceof Error
              ? health.error.message
              : String(health.error)}
          </Text>
        ) : null}
      </View>

      {/* --- Gráfico semanal --- */}
      {hasWeeklyData ? (
        <WeeklyVolumeChart weeklyVolume={progress.data!.weeklyVolume} />
      ) : null}

      {/* --- Usuario --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-1 text-sm text-gray-900 dark:text-white'>
          Usuario
        </Text>
        {me.isLoading ? (
          <ActivityIndicator />
        ) : me.data ? (
          <>
            <Text className='text-base font-semibold text-gray-500 dark:text-gray-400'>
              {me.data.name}
            </Text>
            <Text className='text-sm text-gray-500 dark:text-gray-400'>
              {me.data.email}
            </Text>
          </>
        ) : isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            No has iniciado sesión. Ve a la pantalla de login.
          </Text>
        ) : (
          <Text className='text-sm text-red-600'>Error al cargar usuario</Text>
        )}
      </View>

      {/* --- Progreso --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-2 text-sm text-gray-500'>Progreso general</Text>
        {isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            Inicia sesión para ver tu progreso.
          </Text>
        ) : progress.isLoading ? (
          <ActivityIndicator />
        ) : progress.data ? (
          <>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Sesiones completadas: {progress.data.totalSessions}
            </Text>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Volumen total: {progress.data.totalVolume} kg
            </Text>
            <Text className='mt-1 text-gray-900 dark:text-white'>
              Duración total:{' '}
              {Math.round(progress.data.totalDurationSeconds / 60)} min
            </Text>
          </>
        ) : (
          <Text className='text-sm text-red-600'>
            No se pudo cargar el progreso
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
