import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { FormField } from '../../components/FormField';
import { useLogin } from '../../lib/hooks/use-auth';

export default function LoginScreen() {
  const router = useRouter();
  const login = useLogin();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: () => router.replace('/(tabs)'),
    });
  };

  return (
    <View className='flex-1 justify-center bg-gray-50 px-6'>
      <Text className='mb-8 text-center text-3xl font-bold text-gray-900'>
        ForgeFit
      </Text>

      <FormField
        control={control}
        name='email'
        label='Correo'
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <FormField
        control={control}
        name='password'
        label='Contraseña'
        secureTextEntry
      />

      {login.error ? (
        <Text className='mb-2 text-center text-sm text-red-500'>
          Credenciales inválidas
        </Text>
      ) : null}

      <Pressable
        className={`mt-2 items-center rounded-lg p-4 ${login.isPending ? 'bg-blue-300' : 'bg-blue-600'}`}
        onPress={handleSubmit(onSubmit)}
        disabled={login.isPending}
      >
        <Text className='font-semibold text-white'>
          {login.isPending ? 'Ingresando...' : 'Iniciar Sesión'}
        </Text>
      </Pressable>

      <Pressable
        className='mt-4 items-center'
        onPress={() => router.push('/(auth)/register')}
      >
        <Text className='text-sm text-blue-600'>
          ¿No tienes cuenta? Regístrate
        </Text>
      </Pressable>
    </View>
  );
}
