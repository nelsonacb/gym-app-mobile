import { Ionicons } from '@react-native-vector-icons/ionicons';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { WeeklyVolumeChart } from './WeeklyVolumeChart';

interface Props {
  userName: string;
  weeklyVolume: Array<{ weekStart: string; volume: number }>;
  totalSessions: number;
  totalVolume: number;
}

export function ShareableSummary({
  userName,
  weeklyVolume,
  totalSessions,
  totalVolume,
}: Props) {
  const viewRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const path = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      const uri = path.startsWith('file://') ? path : `file://${path}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share ForgeFit summary',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View>
      <View
        ref={viewRef}
        collapsable={false}
        className='rounded-2xl bg-white p-4 dark:bg-gray-800'
        // style={{ backgroundColor: '#FFFFFF' }}
      >
        <Text className='text-center text-lg font-bold text-gray-900 dark:text-white'>
          ForgeFit — My week
        </Text>
        <Text className='mb-3 text-center text-sm text-gray-500'>
          {userName}
        </Text>

        <WeeklyVolumeChart weeklyVolume={weeklyVolume} />

        <View className='mt-3 flex-row justify-around'>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-blue-600'>
              {totalSessions}
            </Text>
            <Text className='text-[10px] text-gray-500'>Sessions</Text>
          </View>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-blue-600'>
              {totalVolume.toLocaleString()}
            </Text>
            <Text className='text-[10px] text-gray-500'>kg volume</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleShare}
        disabled={sharing}
        className='mt-3 flex-row items-center justify-center rounded-lg bg-blue-600 p-3'
      >
        {sharing ? (
          <ActivityIndicator
            size='small'
            color='#FFFFFF'
          />
        ) : (
          <>
            <Ionicons
              name='share-outline'
              size={18}
              color='#FFFFFF'
            />
            <Text className='ml-2 font-semibold text-white'>Share summary</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
