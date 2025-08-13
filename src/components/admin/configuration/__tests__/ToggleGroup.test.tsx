import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ToggleGroup, useToggleGroup } from '../ToggleGroup';
import { renderHook, act } from '@testing-library/react';

describe('ToggleGroup', () => {
  const mockOnChange = jest.fn();
  const mockOptions = [
    {
      id: 'option1',
      label: 'Option 1',
      description: 'First option',
      value: true,
    },
    {
      id: 'option2',
      label: 'Option 2',
      description: 'Second option',
      value: false,
    },
    {
      id: 'option3',
      label: 'Option 3',
      value: false,
      disabled: true,
    },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with label and options', () => {
    render(
      <ToggleGroup
        label="Test Group"
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    render(<ToggleGroup options={mockOptions} onChange={mockOnChange} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Group')).not.toBeInTheDocument();
  });

  it('displays option descriptions', () => {
    render(<ToggleGroup options={mockOptions} onChange={mockOnChange} />);

    expect(screen.getByText('First option')).toBeInTheDocument();
    expect(screen.getByText('Second option')).toBeInTheDocument();
  });

  it('calls onChange when toggle is clicked', async () => {
    const user = userEvent.setup();

    render(<ToggleGroup options={mockOptions} onChange={mockOnChange} />);

    const toggle = screen.getByRole('switch', { name: 'Option 2' });
    await user.click(toggle);

    expect(mockOnChange).toHaveBeenCalledWith('option2', true);
  });

  it('reflects initial toggle states', () => {
    render(<ToggleGroup options={mockOptions} onChange={mockOnChange} />);

    const toggle1 = screen.getByRole('switch', { name: 'Option 1' });
    const toggle2 = screen.getByRole('switch', { name: 'Option 2' });

    expect(toggle1).toBeChecked();
    expect(toggle2).not.toBeChecked();
  });

  it('disables individual options when disabled prop is set', () => {
    render(<ToggleGroup options={mockOptions} onChange={mockOnChange} />);

    const toggle3 = screen.getByRole('switch', { name: 'Option 3' });
    expect(toggle3).toBeDisabled();
  });

  it('disables all options when disabled prop is true', () => {
    render(
      <ToggleGroup
        options={mockOptions}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const toggles = screen.getAllByRole('switch');
    toggles.forEach(toggle => {
      expect(toggle).toBeDisabled();
    });
  });

  it('renders in horizontal orientation', () => {
    const { container } = render(
      <ToggleGroup
        options={mockOptions}
        onChange={mockOnChange}
        orientation="horizontal"
      />
    );

    const optionsContainer = container.querySelector('.flex.flex-wrap.gap-6');
    expect(optionsContainer).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ToggleGroup
        options={mockOptions}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup
        options={mockOptions}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const toggle = screen.getByRole('switch', { name: 'Option 2' });
    await user.click(toggle);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});

describe('useToggleGroup', () => {
  const initialOptions = [
    { id: 'opt1', label: 'Option 1', value: true },
    { id: 'opt2', label: 'Option 2', value: false },
  ];

  it('initializes with provided options', () => {
    const { result } = renderHook(() => useToggleGroup(initialOptions));

    expect(result.current.options).toEqual(initialOptions);
  });

  it('updates option value', () => {
    const { result } = renderHook(() => useToggleGroup(initialOptions));

    act(() => {
      result.current.updateOption('opt2', true);
    });

    expect(result.current.getOptionValue('opt2')).toBe(true);
  });

  it('gets option value correctly', () => {
    const { result } = renderHook(() => useToggleGroup(initialOptions));

    expect(result.current.getOptionValue('opt1')).toBe(true);
    expect(result.current.getOptionValue('opt2')).toBe(false);
    expect(result.current.getOptionValue('nonexistent')).toBe(false);
  });

  it('sets option value', () => {
    const { result } = renderHook(() => useToggleGroup(initialOptions));

    act(() => {
      result.current.setOptionValue('opt1', false);
    });

    expect(result.current.getOptionValue('opt1')).toBe(false);
  });

  it('resets options to initial state', () => {
    const { result } = renderHook(() => useToggleGroup(initialOptions));

    act(() => {
      result.current.updateOption('opt2', true);
    });

    expect(result.current.getOptionValue('opt2')).toBe(true);

    act(() => {
      result.current.resetOptions();
    });

    expect(result.current.getOptionValue('opt2')).toBe(false);
  });
});
