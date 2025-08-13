import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ImageUploader } from '../ImageUploader';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('ImageUploader', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();
    (global.URL.revokeObjectURL as jest.Mock).mockClear();
  });

  it('renders with label and upload area', () => {
    render(<ImageUploader label="Test Image" onChange={mockOnChange} />);

    expect(screen.getByText('Test Image')).toBeInTheDocument();
    expect(
      screen.getByText('Drop your image here, or click to browse')
    ).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        description="Upload your image here"
      />
    );

    expect(screen.getByText('Upload your image here')).toBeInTheDocument();
  });

  it('displays file size limit in description', () => {
    render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        maxSize={2 * 1024 * 1024} // 2MB
      />
    );

    expect(screen.getByText(/Max 2 MB/)).toBeInTheDocument();
  });

  it('displays dimension limits when provided', () => {
    render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        maxWidth={1024}
        maxHeight={768}
      />
    );

    expect(screen.getByText(/Max 1024x768px/)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(<ImageUploader label="Test Image" onChange={mockOnChange} />);

    // Get the hidden file input by type
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.upload(input, file);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(file);
    });
  });

  it('validates file type', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        accept="image/jpeg,image/png"
      />
    );

    const dropZone = screen
      .getByText('Drop your image here, or click to browse')
      .closest('div');

    // Simulate file drop
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/File type not supported/)).toBeInTheDocument();
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('validates file size', async () => {
    const file = new File(['x'.repeat(2 * 1024 * 1024)], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        maxSize={1024 * 1024} // 1MB
      />
    );

    const dropZone = screen
      .getByText('Drop your image here, or click to browse')
      .closest('div');

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/File size too large/)).toBeInTheDocument();
    });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('shows preview when file is selected', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <ImageUploader label="Test Image" onChange={mockOnChange} value={file} />
    );

    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
      expect(screen.getByText(/test.jpg/)).toBeInTheDocument();
    });
  });

  it('handles drag and drop events', async () => {
    const { container } = render(
      <ImageUploader label="Test Image" onChange={mockOnChange} />
    );

    // Find the drop zone by its styling classes
    const dropZone = container.querySelector('.border-dashed');

    // Test drag enter
    fireEvent.dragEnter(dropZone!);
    expect(dropZone).toHaveClass('border-blue-400');

    // Test drag leave
    fireEvent.dragLeave(dropZone!);
    expect(dropZone).not.toHaveClass('border-blue-400');
  });

  it('removes file when remove button is clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    render(
      <ImageUploader label="Test Image" onChange={mockOnChange} value={file} />
    );

    await waitFor(() => {
      const removeButton = screen.getByRole('button');
      expect(removeButton).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(
      <ImageUploader
        label="Test Image"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    // Find the drop zone by its styling classes
    const dropZone = container.querySelector('.border-dashed');
    expect(dropZone).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('formats file size correctly', async () => {
    const file = new File(['x'.repeat(1536)], 'test.jpg', {
      type: 'image/jpeg',
    }); // 1.5KB

    render(
      <ImageUploader label="Test Image" onChange={mockOnChange} value={file} />
    );

    await waitFor(() => {
      expect(screen.getByText(/1.5 KB/)).toBeInTheDocument();
    });
  });
});
