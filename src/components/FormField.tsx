import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  useColorScheme,
} from 'react-native';

interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  onFocus,
  onBlur,
  ...textInputProps
}: FormFieldProps<T>) {
  const [focused, setFocused] = useState(false);
  const isDark = useColorScheme() === 'dark';

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur: rhfOnBlur, value },
        fieldState: { error },
      }) => (
        <View className='mb-4'>
          <Text className='mb-2 text-base font-medium text-gray-700 dark:text-gray-300'>
            {label}
          </Text>
          <TextInput
            className={`rounded-lg border p-3 text-base text-gray-900 dark:text-white ${
              error
                ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-gray-800'
                : focused
                  ? 'border-blue-500 bg-white dark:border-blue-400 dark:bg-gray-800'
                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
            }`}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rhfOnBlur();
              onBlur?.(e);
            }}
            onChangeText={onChange}
            value={value ?? ''}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            selectionColor={isDark ? '#60A5FA' : '#2563EB'}
            {...textInputProps}
          />
          {error && (
            <Text className='mt-1 text-sm text-red-500 dark:text-red-400'>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}
