import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { FormField } from '../../components/FormField';
import { LoginFormData, loginSchema } from '../../schemas/auth.schema';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Datos del formulario:', data);
  };

  return (
    <View className='flex-1 justify-center bg-gray-50 px-6'>
      <Text className='mb-8 text-center text-3xl font-bold text-gray-900'>
        ForgeFit
      </Text>

      <FormField
        control={control}
        name='email'
        label='Correo electrónico'
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

      <Pressable
        className='mt-4 items-center rounded-lg bg-blue-600 p-4 active:bg-blue-700'
        onPress={handleSubmit(onSubmit)}
      >
        <Text className='text-base font-semibold text-white'>
          Iniciar Sesión
        </Text>
      </Pressable>
    </View>
  );
}
