import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useColorScheme } from 'nativewind';
import { useUIStore } from '../../lib/stores/ui.store';
import { ThemeToggle } from '../ThemeToggle';

jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('../../lib/stores/ui.store', () => ({
  useUIStore: jest.fn(),
}));

describe('ThemeToggle', () => {
  const mockSetColorScheme = jest.fn();
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useColorScheme as jest.Mock).mockReturnValue({
      colorScheme: 'light',
      setColorScheme: mockSetColorScheme,
    });
    (useUIStore as unknown as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  it('displays the text "Dark Mode" and the switch turned off in light mode', async () => {
    await render(<ThemeToggle />);
    expect(screen.getByText('Dark Mode')).toBeTruthy();
    const switchComponent = screen.getByRole('switch');
    expect(switchComponent.props.value).toBe(false);
  });

  it('shows the Switch turned on in dark mode', async () => {
    (useColorScheme as jest.Mock).mockReturnValue({
      colorScheme: 'dark',
      setColorScheme: mockSetColorScheme,
    });
    await render(<ThemeToggle />);
    const switchComponent = screen.getByRole('switch');
    expect(switchComponent.props.value).toBe(true);
  });

  it('switches from light to dark when the switch is operated', async () => {
    await render(<ThemeToggle />);
    const switchComponent = screen.getByRole('switch');
    await fireEvent(switchComponent, 'valueChange', true);
    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('Changes from dark to light when the switch is operated.', async () => {
    (useColorScheme as jest.Mock).mockReturnValue({
      colorScheme: 'dark',
      setColorScheme: mockSetColorScheme,
    });
    await render(<ThemeToggle />);
    const switchComponent = screen.getByRole('switch');
    await fireEvent(switchComponent, 'valueChange', false);
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
