import ShopResult from '../components/ShopResult';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('ShopResult', () => {
  it('renders with correct shop name', () => {
    render(<ShopResult name="My Shop" distance="5 km" />);
    expect(screen.getByText('My Shop')).toBeInTheDocument();
  });

  it('renders with correct distance', () => {
    render(<ShopResult name="My Shop" distance="5 km" />);
    expect(screen.getByText('5 km')).toBeInTheDocument();
  });
});
