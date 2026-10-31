import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WorkoutPlanCard } from '../../components/WorkoutPlanCard';
import { useWorkoutPlans } from '../../lib/hooks/use-workout-plans';

export default function RoutinesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: plans, isLoading, isError, error, refetch } = useWorkoutPlans();

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

  if (isError) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-gray-900'>
        <Text className='text-center text-red-500'>
          Error al cargar rutinas: {String(error)}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      data={plans ?? []}
      keyExtractor={(p) => p.id}
      refreshing={isLoading}
      onRefresh={refetch}
      ListHeaderComponent={
        <View className='mb-4'>
          <Text className='text-2xl font-bold text-gray-900 dark:text-white'>
            Rutinas
          </Text>
          <Text className='text-sm text-gray-500 dark:text-gray-400'>
            {plans?.length ?? 0} planes disponibles
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text className='mt-10 text-center text-gray-500 dark:text-gray-400'>
          No hay rutinas disponibles.
        </Text>
      }
      renderItem={({ item }) => (
        <WorkoutPlanCard
          plan={item}
          onPress={() =>
            router.push({
              pathname: '/routines/[id]',
              params: { id: item.id },
            })
          }
        />
      )}
    />
  );
}
