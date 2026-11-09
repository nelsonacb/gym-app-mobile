import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FILTERS } from '../../../lib/utils';
import { WorkoutSessionCard } from '../../components/WorkoutSessionCard';
import type { SessionStatus } from '../../lib/api/types';
import { useInfiniteWorkoutSessions } from '../../lib/hooks/use-workout-sessions';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<SessionStatus>('COMPLETED');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWorkoutSessions({ status: filter });

  const sessions = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ paddingTop: insets.top }}
    >
      <View className='px-4 pt-4'>
        <Text className='text-2xl font-bold text-gray-900 dark:text-white'>
          History
        </Text>
        <Text className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          {total} {total === 1 ? 'session' : 'sessions'}
        </Text>
      </View>

      <View className='mt-3 flex-row px-4'>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={`mr-2 rounded-full px-4 py-2 ${
                isActive ? 'bg-blue-600' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator
            size='large'
            color='#2563EB'
          />
        </View>
      ) : isError ? (
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-center text-red-500'>
            Error loading history: {String(error)}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(s) => s.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                void refetch();
              }}
            />
          }
          renderItem={({ item }) => (
            <WorkoutSessionCard
              session={item}
              onPress={() =>
                router.push({
                  pathname: '/session/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text className='mt-10 text-center text-gray-500 dark:text-gray-400'>
              There are no sessions{' '}
              {filter === 'COMPLETED'
                ? 'completed'
                : filter === 'IN_PROGRESS'
                  ? 'in progress'
                  : 'cancelled'}{' '}
              yet.
            </Text>
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className='py-4'>
                <ActivityIndicator
                  size='small'
                  color='#2563EB'
                />
              </View>
            ) : undefined
          }
        />
      )}
    </View>
  );
}
