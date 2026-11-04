import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Platform } from 'react-native';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isAndroidExpoGo = Platform.OS === 'android' && isExpoGo;

async function getNotifications() {
  if (isAndroidExpoGo) {
    throw new Error(
      'Local notifications are not available in Expo Go (Android) with SDK 57. Use a development build or test it on iOS.',
    );
  }
  return await import('expo-notifications');
}

export function useWeeklyReminder(weeklyGoal: number | null) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleReminder = async (weekday: number = 1, hour: number = 18) => {
    setLoading(true);
    setError(null);

    try {
      const Notifications = await getNotifications();

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permission denied.');
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      const trigger: Notifications.NotificationTriggerInput =
        Platform.OS === 'ios'
          ? {
              type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
              repeats: true,
              weekday,
              hour,
              minute: 0,
            }
          : {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday,
              hour,
              minute: 0,
            };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'ForgeFit — Weekly goal',
          body: weeklyGoal
            ? `Don't forget to complete your ${weeklyGoal} sessions this week 💪`
            : '¿Have you trained today? Log your session 💪',
        },
        trigger,
      });

      setEnabled(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Error scheduling reminder';
      setError(message);
      setEnabled(false);
      console.warn('[weekly-reminder]', message);
    } finally {
      setLoading(false);
    }
  };

  const cancelReminder = async () => {
    setLoading(true);
    try {
      const Notifications = await getNotifications();
      await Notifications.cancelAllScheduledNotificationsAsync();
      setEnabled(false);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return { enabled, loading, error, scheduleReminder, cancelReminder };
}
