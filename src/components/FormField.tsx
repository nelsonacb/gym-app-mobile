import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  ...textInputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className='mb-4'>
          <Text className='mb-2 text-base font-medium text-gray-700'>
            {label}
          </Text>
          <TextInput
            className={`rounded-lg border p-3 text-base dark:bg-gray-800 dark:text-white dark:border-gray-60 ${
              error
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-white focus:border-blue-500'
            }`}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor='#9CA3AF'
            {...textInputProps}
          />
          {error && (
            <Text className='mt-1 text-sm text-red-500'>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
