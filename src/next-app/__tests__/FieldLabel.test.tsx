import FieldLabel from '../components/FieldLabel';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('FieldLabel', () => {
  it('renders with correct text', () => {
    render(<FieldLabel label="My Field" />);
    expect(screen.getByText('My Field')).toBeInTheDocument();
  });

  it('renders with asterisk when required', () => {
    render(<FieldLabel label="My Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
