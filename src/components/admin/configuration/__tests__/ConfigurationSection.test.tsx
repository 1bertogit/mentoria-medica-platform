import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfigurationSection } from '../ConfigurationSection';

describe('ConfigurationSection', () => {
  it('renders with title and children', () => {
    render(
      <ConfigurationSection title="Test Section">
        <div>Test content</div>
      </ConfigurationSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    render(
      <ConfigurationSection title="Test Section" description="Test description">
        <div>Test content</div>
      </ConfigurationSection>
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders header actions when provided', () => {
    render(
      <ConfigurationSection
        title="Test Section"
        headerActions={<button>Action</button>}
      >
        <div>Test content</div>
      </ConfigurationSection>
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ConfigurationSection title="Test Section" className="custom-class">
        <div>Test content</div>
      </ConfigurationSection>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper glass-morphism styling', () => {
    const { container } = render(
      <ConfigurationSection title="Test Section">
        <div>Test content</div>
      </ConfigurationSection>
    );

    expect(container.firstChild).toHaveClass(
      'backdrop-blur-sm',
      'bg-white/10',
      'border-white/20'
    );
  });
});
