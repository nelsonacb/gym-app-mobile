import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFieldArray, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { useExercises } from '../lib/hooks/use-exercises';
import {
  useCreateWorkoutPlan,
  useUpdateWorkoutPlan,
  useWorkoutPlan,
} from '../lib/hooks/use-workout-plans';
import {
  PlanFormOutput,
  planSchema,
  type PlanFormInput,
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

  const { control, handleSubmit, reset } = useForm<
    PlanFormInput,
    unknown,
    PlanFormOutput
  >({
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

  return (
    <View
      className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
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
          onPress={handleSubmit(onSubmit)}
          className='p-2'
        >
          <Text className='font-semibold text-blue-600'>
            {createPlan.isPending || updatePlan.isPending ? '...' : 'Save'}
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

        <Text className='mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400'>
          EXERCICES
        </Text>

        {fields.map((field, index) => (
          <View
            key={field.id}
            className='mb-3 rounded-2xl bg-white p-3 dark:bg-gray-800'
          >
            <View className='flex-row items-center justify-between'>
              <Text className='font-semibold text-gray-900 dark:text-white'>
                {exercises?.find((e) => e.id === field.exerciseId)?.name ??
                  'Select an exercise'}
              </Text>
              <Pressable onPress={() => remove(index)}>
                <Ionicons
                  name='trash-outline'
                  size={20}
                  color='#EF4444'
                />
              </Pressable>
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
            + Add exercice
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
