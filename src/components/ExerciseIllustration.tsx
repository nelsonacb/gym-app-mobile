import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { getExerciseSvg } from '../../lib/exercise-assets';

interface Props {
  slug: string;
  size?: number;
}

export function ExerciseIllustration({ slug, size = 96 }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const SvgComponent = getExerciseSvg(slug);

  if (!SvgComponent) {
    return (
      <View
        className='items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700'
        style={{ width: size, height: size }}
      >
        <Ionicons
          name='barbell-outline'
          size={size * 0.5}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>
    );
  }

  return (
    <View
      className='items-center justify-center overflow-hidden rounded-xl bg-slate-800'
      style={{ width: size, height: size }}
    >
      <SvgComponent
        width={size}
        height={size}
      />
    </View>
  );
}
