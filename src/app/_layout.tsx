import { Stack } from 'expo-router';
import { verifyInstallation } from 'nativewind';
import '../global.css';

export default function RootLayout() {
  verifyInstallation();
  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
