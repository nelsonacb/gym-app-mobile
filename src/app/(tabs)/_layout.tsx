import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabBarBg = isDark ? '#111827' : '#FFFFFF';
  const tabBarBorder = isDark ? '#374151' : '#E5E7EB';
  const activeTint = '#2563EB';
  const inactiveTint = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='home-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='routines'
        options={{
          title: 'Routines',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='barbell-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='time-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
