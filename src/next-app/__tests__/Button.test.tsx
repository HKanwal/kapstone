import Button from '../components/Button';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button title="Click Me!" />);
    expect(screen.getByText('Click Me!')).toBeInTheDocument();
  });

  it('renders with correct width', () => {
    const width = '50%';
    render(<Button title="Click Me!" width={width} />);
    expect(screen.getByText('Click Me!')).toHaveStyle(`width: ${width}`);
  });
});
