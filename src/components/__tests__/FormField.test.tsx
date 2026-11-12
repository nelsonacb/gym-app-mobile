import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import * as ReactNative from 'react-native';
import { FormField } from '../FormField';

interface TestFormProps {
  defaultValues?: { email: string };
  onFocus?: () => void;
  onBlur?: () => void;
}

function TestForm({
  defaultValues = { email: '' },
  onFocus,
  onBlur,
}: TestFormProps) {
  const { control } = useForm({ defaultValues });
  return (
    <FormField
      control={control}
      name='email'
      label='Email'
      placeholder='test@example.com'
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

function TestFormWithError() {
  const { control, setError } = useForm({ defaultValues: { email: '' } });

  if (control._formState.errors.email === undefined) {
    setError('email', { type: 'required', message: 'Email is required' });
  }

  return (
    <FormField
      control={control}
      name='email'
      label='Email'
      placeholder='test@example.com'
    />
  );
}

describe('FormField', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  });

  it('renders the label correctly', async () => {
    await render(<TestForm />);

    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('renders the TextInput with the placeholder', async () => {
    await render(<TestForm />);

    expect(screen.getByPlaceholderText('test@example.com')).toBeTruthy();
  });

  it('displays the initial value of the form', async () => {
    await render(<TestForm defaultValues={{ email: 'hello@test.com' }} />);

    const input = screen.getByPlaceholderText('test@example.com');
    expect(input.props.value).toBe('hello@test.com');
  });

  it('displays an empty string when the value is undefined', async () => {
    await render(<TestForm />);

    const input = screen.getByPlaceholderText('test@example.com');
    expect(input.props.value).toBe('');
  });

  it('updates the form value as you type', async () => {
    await render(<TestForm />);

    const input = screen.getByPlaceholderText('test@example.com');
    await fireEvent.changeText(input, 'new@test.com');

    await waitFor(() => {
      expect(input.props.value).toBe('new@test.com');
    });
  });

  it('calls onFocus when the input receives focus', async () => {
    const onFocus = jest.fn();
    await render(<TestForm onFocus={onFocus} />);

    const input = screen.getByPlaceholderText('test@example.com');
    await fireEvent(input, 'focus', { nativeEvent: {} });

    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when the input loses focus', async () => {
    const onBlur = jest.fn();
    await render(<TestForm onBlur={onBlur} />);

    const input = screen.getByPlaceholderText('test@example.com');
    await fireEvent(input, 'blur', { nativeEvent: {} });

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('displays the error message when an error occurs', async () => {
    await render(<TestFormWithError />);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
  });

  it('apply a red border when there is an error', async () => {
    await render(<TestFormWithError />);

    await waitFor(() => {
      const input = screen.getByPlaceholderText('test@example.com');
      expect(input.props.className).toContain('border-red-500');
    });
  });

  it('use a gray placeholder color in light mode', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    await render(<TestForm />);

    const input = screen.getByPlaceholderText('test@example.com');
    expect(input.props.placeholderTextColor).toBe('#9CA3AF');
  });

  it('use a darker placeholder color in dark mode', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    await render(<TestForm />);

    const input = screen.getByPlaceholderText('test@example.com');
    expect(input.props.placeholderTextColor).toBe('#6B7280');
  });
});
