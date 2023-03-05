import Button from '../components/Button';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button title="Click Me!" />);
    expect(screen.getByText('Click Me!')).toBeInTheDocument();
  });
});
