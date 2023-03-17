import ButtonLink from '../components/ButtonLink';
import '@testing-library/jest-dom';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';

describe('ButtonLink', () => {
  it('renders with correct text', () => {
    render(<ButtonLink title="This is a link" href="/dashboard" />);
    expect(screen.getByText('This is a link')).toBeInTheDocument();
  });

  it('has correct href', () => {
    render(<ButtonLink title="This is a link" href="/dashboard" />);
    expect(screen.getByText('This is a link').closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
