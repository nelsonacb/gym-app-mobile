import { RegisterFormData, registerSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { FormField } from '../../components/FormField';
import { ApiError } from '../../lib/api/errors';
import { useRegister } from '../../lib/hooks/use-auth';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    register.mutate(data, {
      onSuccess: () => router.replace('/(tabs)'),
    });
  };

  const errorMessage =
    register.error instanceof ApiError
      ? register.error.status === 409
        ? 'Este correo ya está registrado'
        : register.error.message
      : null;

  return (
    <View className='flex-1 justify-center bg-gray-50 px-6'>
      <Text className='mb-2 text-center text-3xl font-bold text-gray-900'>
        Crear cuenta
      </Text>
      <Text className='mb-8 text-center text-sm text-gray-500'>
        Empieza a registrar tus entrenamientos
      </Text>

      <FormField
        control={control}
        name='name'
        label='Nombre'
        placeholder='Tu nombre'
        autoCapitalize='words'
      />

      <FormField
        control={control}
        name='email'
        label='Correo'
        placeholder='tu@email.com'
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <FormField
        control={control}
        name='password'
        label='Contraseña'
        placeholder='********'
        secureTextEntry
      />

      {errorMessage ? (
        <Text className='mb-2 text-center text-sm text-red-500'>
          {errorMessage}
        </Text>
      ) : null}

      <Pressable
        className={`mt-2 items-center rounded-lg p-4 ${
          register.isPending ? 'bg-blue-300' : 'bg-blue-600'
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={register.isPending}
      >
        <Text className='font-semibold text-white'>
          {register.isPending ? 'Creando cuenta...' : 'Registrarse'}
        </Text>
      </Pressable>

      <Pressable
        className='mt-4 items-center'
        onPress={() => router.back()}
      >
        <Text className='text-sm text-blue-600'>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </Pressable>
    </View>
  );
}
