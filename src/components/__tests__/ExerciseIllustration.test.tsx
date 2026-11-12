import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { getExerciseSvg } from '../../../lib/exercise-assets';
import { ExerciseIllustration } from '../ExerciseIllustration';

jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('../../../lib/exercise-assets', () => ({
  getExerciseSvg: jest.fn(),
}));

jest.mock('@react-native-vector-icons/ionicons');

const MockSvg = (props: { width: number; height: number }) => (
  <View
    testID='exercise-svg'
    {...props}
  />
);

describe('ExerciseIllustration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useColorScheme as jest.Mock).mockReturnValue({ colorScheme: 'light' });
  });

  it('renders the SVG when one exists for the slug', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(MockSvg);

    await render(<ExerciseIllustration slug='bench-press' />);

    expect(screen.getByTestId('exercise-svg')).toBeTruthy();
    expect(screen.queryByTestId('ionicons')).toBeNull();
  });

  it('renders the Ionicons fallback when NO SVG exists', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(undefined);

    await render(<ExerciseIllustration slug='unknown-exercise' />);

    expect(screen.getByTestId('ionicons')).toBeTruthy();
    expect(screen.queryByTestId('exercise-svg')).toBeNull();
  });

  it('applies the default size (96) to the SVG', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(MockSvg);

    await render(<ExerciseIllustration slug='bench-press' />);

    const svg = screen.getByTestId('exercise-svg');
    expect(svg.props.width).toBe(96);
    expect(svg.props.height).toBe(96);
  });

  it('applies a custom size to the SVG', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(MockSvg);

    await render(
      <ExerciseIllustration
        slug='bench-press'
        size={128}
      />,
    );

    const svg = screen.getByTestId('exercise-svg');
    expect(svg.props.width).toBe(128);
    expect(svg.props.height).toBe(128);
  });

  it('uses the light color for the fallback icon in light mode', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(undefined);

    await render(<ExerciseIllustration slug='unknown' />);

    const icon = screen.getByTestId('ionicons');
    expect(icon.props.color).toBe('#6B7280');
  });

  it('uses the dark color for the fallback icon in dark mode', async () => {
    (useColorScheme as jest.Mock).mockReturnValue({ colorScheme: 'dark' });
    (getExerciseSvg as jest.Mock).mockReturnValue(undefined);

    await render(<ExerciseIllustration slug='unknown' />);

    const icon = screen.getByTestId('ionicons');
    expect(icon.props.color).toBe('#9CA3AF');
  });

  it('calls getExerciseSvg with the received slug', async () => {
    (getExerciseSvg as jest.Mock).mockReturnValue(MockSvg);

    await render(<ExerciseIllustration slug='squat' />);

    expect(getExerciseSvg).toHaveBeenCalledWith('squat');
  });
});
