import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ColorPicker } from '../ColorPicker';

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with label and initial value', () => {
    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    expect(screen.getByText('Test Color')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument();
  });

  it('displays preview with custom text', () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#ff0000"
        onChange={mockOnChange}
        previewText="Custom Preview"
      />
    );

    expect(screen.getByText('Custom Preview')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();

    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    const input = screen.getByDisplayValue('#ff0000');

    // Simulate changing the input value
    fireEvent.change(input, { target: { value: '#00ff00' } });

    expect(mockOnChange).toHaveBeenCalledWith('#00ff00');
  });

  it('handles input without # prefix', async () => {
    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    const input = screen.getByDisplayValue('#ff0000');

    // Simulate changing the input value without # prefix
    fireEvent.change(input, { target: { value: '00ff00' } });

    expect(mockOnChange).toHaveBeenCalledWith('#00ff00');
  });

  it('opens popover when color button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    const colorButton = screen.getByLabelText('Select color for Test Color');
    await user.click(colorButton);

    await waitFor(() => {
      expect(screen.getByText('Custom Color')).toBeInTheDocument();
      expect(screen.getByText('Preset Colors')).toBeInTheDocument();
    });
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#ff0000"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const input = screen.getByDisplayValue('#ff0000');
    const colorButton = screen.getByLabelText('Select color for Test Color');

    expect(input).toBeDisabled();
    expect(colorButton).toBeDisabled();
  });

  it('validates hex color format', async () => {
    const user = userEvent.setup();

    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    const input = screen.getByDisplayValue('#ff0000');
    await user.clear(input);
    await user.type(input, '#invalid');

    // Should not call onChange for invalid hex color
    expect(mockOnChange).not.toHaveBeenCalledWith('#invalid');
  });

  it('applies color to preview element', () => {
    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={mockOnChange} />
    );

    const preview = screen.getByText('Preview');
    expect(preview).toHaveStyle({ color: '#ff0000' });
  });
});
