import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text>Abrir Formulario</Text>

      <Link
        href={'/(auth)/login'}
        asChild
      >
        <Pressable className='mt-4 rounded-lg bg-blue-600 px-6 py-3'>
          <Text className='text-white font-semibold'>Abrir Formulario</Text>
        </Pressable>
      </Link>
    </View>
  );
}
