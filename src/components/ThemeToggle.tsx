import { useColorScheme } from 'nativewind';
import { Switch, Text, View } from 'react-native';
import { useUIStore } from '../lib/stores/ui.store';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { theme, setTheme } = useUIStore();

  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <View className='flex-row items-center justify-between rounded-2xl bg-white p-4 dark:bg-gray-800'>
      <Text className='text-base font-medium text-gray-900 dark:text-white'>
        Modo Oscuro
      </Text>
      <Switch
        value={colorScheme === 'dark'}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#2563EB' }}
        thumbColor='#f4f3f4'
      />
    </View>
  );
}
