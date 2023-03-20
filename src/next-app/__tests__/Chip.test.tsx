import Chip from '../components/Chip';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('Chip', () => {
  it('renders with correct text', () => {
    render(<Chip text="I am a chip" />);
    expect(screen.getByText('I am a chip')).toBeInTheDocument();
  });
});
