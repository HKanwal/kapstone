import Dropdown from '../components/Dropdown';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('Dropdown', () => {
  it('renders all items', () => {
    render(<Dropdown items={['Item A', 'Item B', 'Item C']} />);
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });
});
