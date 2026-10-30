// import { Link } from 'expo-router';
// import { Pressable, Text, View } from 'react-native';

// export default function HomeScreen() {
//   return (
//     <View className='flex-1 items-center justify-center bg-white'>
//       <Text>Abrir Formulario</Text>

//       <Link
//         href={'/(auth)/login'}
//         asChild
//       >
//         <Pressable className='mt-4 rounded-lg bg-blue-600 px-6 py-3'>
//           <Text className='text-white font-semibold'>Abrir Formulario</Text>
//         </Pressable>
//       </Link>
//     </View>
//   );
// }

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { ApiError } from '../../lib/api/errors';
import { useCurrentUser } from '../../lib/hooks/use-auth';
import { useHealth } from '../../lib/hooks/use-health';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function DashboardScreen() {
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

  return (
    <ScrollView
      className='flex-1 bg-gray-50'
      contentContainerClassName='p-4'
      refreshControl={
        <RefreshControl
          refreshing={
            health.isRefetching || me.isRefetching || progress.isRefetching
          }
          onRefresh={onRefresh}
        />
      }
    >
      <Text className='mb-4 text-2xl font-bold text-gray-900'>Dashboard</Text>

      {/* --- Backend --- */}
      <View className='mb-4 rounded-2xl bg-white p-4'>
        <Text className='mb-1 text-sm text-gray-500'>Backend</Text>
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

      {/* --- Usuario --- */}
      <View className='mb-4 rounded-2xl bg-white p-4'>
        <Text className='mb-1 text-sm text-gray-500'>Usuario</Text>
        {me.isLoading ? (
          <ActivityIndicator />
        ) : me.data ? (
          <>
            <Text className='text-base font-semibold text-gray-900'>
              {me.data.name}
            </Text>
            <Text className='text-sm text-gray-500'>{me.data.email}</Text>
          </>
        ) : isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            No has iniciado sesión. Ve a la pestaña de login o usa el
            formulario.
          </Text>
        ) : (
          <Text className='text-sm text-red-600'>Error al cargar usuario</Text>
        )}
      </View>

      {/* --- Progreso --- */}
      <View className='mb-4 rounded-2xl bg-white p-4'>
        <Text className='mb-2 text-sm text-gray-500'>Progreso general</Text>
        {isUnauthenticated ? (
          <Text className='text-sm text-amber-600'>
            Inicia sesión para ver tu progreso.
          </Text>
        ) : progress.isLoading ? (
          <ActivityIndicator />
        ) : progress.data ? (
          <>
            <Text className='mt-1 text-gray-800'>
              Sesiones completadas: {progress.data.totalSessions}
            </Text>
            <Text className='mt-1 text-gray-800'>
              Volumen total: {progress.data.totalVolume} kg
            </Text>
            <Text className='mt-1 text-gray-800'>
              Duración total:{' '}
              {Math.round(progress.data.totalDurationSeconds / 60)} min
            </Text>
            <Text className='mt-2 text-xs text-gray-400'>
              Frecuencia semanal: {progress.data.weeklyFrequency.length} semanas
              registradas
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
