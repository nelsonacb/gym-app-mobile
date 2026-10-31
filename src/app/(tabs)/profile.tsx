import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useCurrentUser, useLogout } from '../../lib/hooks/use-auth';
import { usePreferences } from '../../lib/hooks/use-preferences';
import { useOverallProgress } from '../../lib/hooks/use-progress';

export default function ProfileScreen() {
  const router = useRouter();
  const me = useCurrentUser();
  const prefs = usePreferences();
  const progress = useOverallProgress();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
    // La protección de rutas en _layout.tsx redirige a /(auth)/login automáticamente
  };

  return (
    <ScrollView
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      contentContainerClassName='p-4'
    >
      <Text className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
        Perfil
      </Text>

      {/* --- Datos del usuario --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
          Datos personales
        </Text>
        {me.isLoading ? (
          <ActivityIndicator />
        ) : me.data ? (
          <>
            <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
              {me.data.name}
            </Text>
            <Text className='mt-1 text-sm text-gray-900 dark:text-white'>
              {me.data.email}
            </Text>
            <Text className='mt-2 text-xs text-gray-900 dark:text-white'>
              Unidad de peso: {me.data.weightUnit}
            </Text>
          </>
        ) : (
          <Text className='text-sm text-red-600'>Error al cargar usuario</Text>
        )}
      </View>

      {/* --- Preferencias --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
          Preferencias
        </Text>
        <ThemeToggle />
        {prefs.isLoading ? (
          <ActivityIndicator />
        ) : prefs.data ? (
          <>
            <View className='flex-row items-center justify-between py-2'>
              <Text className='text-gray-700'>Objetivo semanal</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {prefs.data.weeklyGoal ?? 'Sin definir'}
                {prefs.data.weeklyGoal ? ' sesiones' : ''}
              </Text>
            </View>
            <View className='flex-row items-center justify-between py-2'>
              <Text className='text-gray-700'>Unidad de peso</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {prefs.data.weightUnit}
              </Text>
            </View>
          </>
        ) : (
          <Text className='text-sm text-red-600'>
            Error al cargar preferencias
          </Text>
        )}
      </View>

      {/* --- Estadísticas --- */}
      <View className='mb-4 rounded-2xl bg-white dark:bg-gray-800 p-4'>
        <Text className='mb-3 text-sm font-medium text-gray-500'>
          Estadísticas globales
        </Text>
        {progress.isLoading ? (
          <ActivityIndicator />
        ) : progress.data ? (
          <>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Sesiones completadas</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {progress.data.totalSessions}
              </Text>
            </View>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Volumen total</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {progress.data.totalVolume.toLocaleString()} kg
              </Text>
            </View>
            <View className='flex-row justify-between py-2'>
              <Text className='text-gray-700'>Tiempo total</Text>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {Math.round(progress.data.totalDurationSeconds / 60)} min
              </Text>
            </View>
          </>
        ) : (
          <Text className='text-sm text-red-600'>
            Error al cargar estadísticas
          </Text>
        )}
      </View>

      {/* --- Logout --- */}
      <Pressable
        className='mt-2 items-center rounded-lg border border-red-200 bg-red-50 p-4 active:bg-red-100'
        onPress={handleLogout}
      >
        <Text className='font-semibold text-red-600'>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
