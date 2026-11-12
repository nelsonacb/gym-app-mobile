import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { useExercises } from '../lib/hooks/use-exercises';
import {
  useCreateWorkoutPlan,
  useUpdateWorkoutPlan,
  useWorkoutPlan,
} from '../lib/hooks/use-workout-plans';
import {
  PlanFormInput,
  PlanFormOutput,
  planSchema,
} from '../schemas/plan.schema';

export default function PlanFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: exercises } = useExercises();
  const { data: existingPlan } = useWorkoutPlan(id ?? '');
  const createPlan = useCreateWorkoutPlan();
  const updatePlan = useUpdateWorkoutPlan(id ?? '');

  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PlanFormInput, unknown, PlanFormOutput>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      description: '',
      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  useEffect(() => {
    if (existingPlan) {
      reset({
        name: existingPlan.name,
        description: existingPlan.description ?? '',
        exercises: existingPlan.planExercises.map((pe) => ({
          exerciseId: pe.exerciseId,
          targetSets: pe.targetSets,
          targetReps: pe.targetReps,
          restSeconds: pe.restSeconds,
        })),
      });
    }
  }, [existingPlan, reset]);

  const onSubmit = (data: PlanFormOutput) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      exercises: data.exercises.map((e, idx) => ({
        ...e,
        position: idx,
      })),
    };

    if (isEditing) {
      updatePlan.mutate(payload, {
        onSuccess: () => router.back(),
      });
    } else {
      createPlan.mutate(payload, {
        onSuccess: () => router.back(),
      });
    }
  };

  const isSaving = createPlan.isPending || updatePlan.isPending;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <View
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ paddingTop: insets.top }}
    >
      <View className='flex-row items-center justify-between px-4 py-3'>
        <Pressable
          onPress={() => router.back()}
          className='p-2'
        >
          <Ionicons
            name='close'
            size={24}
            color='#6B7280'
          />
        </Pressable>
        <Text className='text-base font-bold text-gray-900 dark:text-white'>
          {isEditing ? 'Edit routine' : 'New routine'}
        </Text>
        <Pressable
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSaving}
          className='p-2'
        >
          <Text className='font-semibold text-blue-600'>
            {isSaving ? '...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <FormField
          control={control}
          name='name'
          label='Name'
          placeholder='E.g., Personalized Push Day'
        />
        <FormField
          control={control}
          name='description'
          label='Description (optional)'
          placeholder='Describe the routine...'
          multiline
        />

        <Text className='mb-2 mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400'>
          EXERCISES
        </Text>

        {hasErrors && (
          <Text className='mb-2 text-sm text-red-500'>
            Please fix the highlighted fields before saving.
          </Text>
        )}

        {fields.map((field, index) => (
          <View
            key={field.id}
            className='mb-3 rounded-2xl bg-white p-3 dark:bg-gray-800'
          >
            <View className='flex-row items-center justify-between'>
              <Controller
                control={control}
                name={`exercises.${index}.exerciseId`}
                render={({ field: { value } }) => {
                  const selected = exercises?.find((e) => e.id === value);
                  return (
                    <Pressable
                      onPress={() => setPickerIndex(index)}
                      className='flex-1 flex-row items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:active:bg-gray-600'
                    >
                      <View className='flex-1 pr-2'>
                        <Text className='font-semibold text-gray-900 dark:text-white'>
                          {selected?.name ?? 'Select an exercise'}
                        </Text>
                        <Text className='text-xs text-gray-500 dark:text-gray-400'>
                          {value ? 'Tap to change' : 'Tap to choose'}
                        </Text>
                      </View>
                      <Ionicons
                        name='chevron-down'
                        size={20}
                        color='#6B7280'
                      />
                    </Pressable>
                  );
                }}
              />
              <Pressable onPress={() => remove(index)}>
                <Ionicons
                  name='trash-outline'
                  size={20}
                  color='#EF4444'
                />
              </Pressable>
            </View>

            <View className='mt-3 flex-row gap-2'>
              <Controller
                control={control}
                name={`exercises.${index}.targetSets`}
                render={({ field: { value, onChange } }) => (
                  <View className='flex-1'>
                    <Text className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
                      Sets
                    </Text>
                    <TextInput
                      className='rounded-lg border border-gray-200 p-2 text-gray-900 dark:border-gray-600 dark:text-white'
                      keyboardType='numeric'
                      value={
                        value === undefined || value === null
                          ? ''
                          : String(value)
                      }
                      onChangeText={(t) => onChange(t === '' ? 0 : Number(t))}
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name={`exercises.${index}.targetReps`}
                render={({ field: { value, onChange } }) => (
                  <View className='flex-1'>
                    <Text className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
                      Reps
                    </Text>
                    <TextInput
                      className='rounded-lg border border-gray-200 p-2 text-gray-900 dark:border-gray-600 dark:text-white'
                      keyboardType='numeric'
                      value={
                        value === undefined || value === null
                          ? ''
                          : String(value)
                      }
                      onChangeText={(t) => onChange(t === '' ? 0 : Number(t))}
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name={`exercises.${index}.restSeconds`}
                render={({ field: { value, onChange } }) => (
                  <View className='flex-1'>
                    <Text className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
                      Rest (s)
                    </Text>
                    <TextInput
                      className='rounded-lg border border-gray-200 p-2 text-gray-900 dark:border-gray-600 dark:text-white'
                      keyboardType='numeric'
                      value={
                        value === undefined || value === null
                          ? ''
                          : String(value)
                      }
                      onChangeText={(t) => onChange(t === '' ? 0 : Number(t))}
                    />
                  </View>
                )}
              />
            </View>
          </View>
        ))}

        <Pressable
          onPress={() =>
            append({
              exerciseId: '',
              targetSets: 3,
              targetReps: 10,
              restSeconds: 60,
            })
          }
          className='mt-2 items-center rounded-lg border border-dashed border-blue-400 p-4'
        >
          <Text className='text-sm font-medium text-blue-600'>
            + Add exercise
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={pickerIndex !== null}
        transparent
        animationType='fade'
        onRequestClose={() => setPickerIndex(null)}
      >
        <View className='flex-1 justify-end bg-black/50'>
          <View className='max-h-[70%] rounded-t-2xl bg-white dark:bg-gray-900'>
            <View className='flex-row items-center justify-between border-b border-gray-100 p-4 dark:border-gray-700'>
              <Text className='text-lg font-bold text-gray-900 dark:text-white'>
                Choose exercise
              </Text>
              <Pressable onPress={() => setPickerIndex(null)}>
                <Ionicons
                  name='close'
                  size={22}
                  color='#6B7280'
                />
              </Pressable>
            </View>
            <ScrollView>
              {exercises?.map((ex) => (
                <Pressable
                  key={ex.id}
                  className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'
                  onPress={() => {
                    if (pickerIndex !== null) {
                      setValue(`exercises.${pickerIndex}.exerciseId`, ex.id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                    setPickerIndex(null);
                  }}
                >
                  <Text className='text-gray-900 dark:text-white'>
                    {ex.name}
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400'>
                    {ex.muscleGroup} · {ex.equipment}
                  </Text>
                </Pressable>
              ))}
              {(!exercises || exercises.length === 0) && (
                <Text className='p-4 text-center text-gray-500 dark:text-gray-400'>
                  No exercises available.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
